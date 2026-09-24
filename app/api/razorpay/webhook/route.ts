// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { NextResponse } from "next/server";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "@/src/db";
import {
  couponTransaction,
  order,
  orderItem,
  payment,
  paymentGatewayPlans,
  paymentGatewaySubscription,
  product,
  productVariant,
  razorpayWebhookEvent,
  rewardCoinsHistory,
  subscriptions,
  users,
} from "@/src/db/schema";
import { ORDER_STATUS } from "@/const/globalconst";
import { RAZORPAY_WEBHOOK_SECRET } from "@/env";
import {
  sendFirstPurchaseEmail,
  sendOrderConfirmationEmail,
} from "@/helper/emailTemplates/action";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HANDLED_EVENTS = new Set([
  "payment.captured",
  "payment.failed",
  "subscription.charged",
]);

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received || "");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

function verifyWebhookSignature(rawBody: string, signature: string | null) {
  if (!RAZORPAY_WEBHOOK_SECRET || !signature) return false;

  const expected = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return signaturesMatch(expected, signature);
}

function rupeesFromPaise(value?: number | null) {
  return Math.round(Number(value || 0) / 100);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getNextDueDate(currentDueDate: Date | null, frequencyInDays: number) {
  const now = new Date();
  let nextDueDate = currentDueDate ? new Date(currentDueDate) : now;

  do {
    nextDueDate = addDays(nextDueDate, frequencyInDays);
  } while (nextDueDate <= now);

  return nextDueDate;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function webhookEventAlreadyProcessed(eventId: string | null) {
  if (!eventId) return false;

  const [existing] = await db
    .select({ id: razorpayWebhookEvent.id })
    .from(razorpayWebhookEvent)
    .where(eq(razorpayWebhookEvent.eventId, eventId))
    .limit(1);

  return Boolean(existing);
}

async function rememberWebhookEvent({
  eventId,
  eventName,
  paymentId,
}: {
  eventId: string | null;
  eventName: string;
  paymentId?: string | null;
}) {
  if (!eventId) return;

  await db
    .insert(razorpayWebhookEvent)
    .values({
      eventId,
      eventName,
      paymentId: paymentId ?? null,
    })
    .onConflictDoNothing();
}

async function userHasPaidOrder(userId: string, excludeOrderId?: string | null) {
  const paidStatuses = [
    ORDER_STATUS.PAID,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.COMPLETED,
  ];
  const conditions = [
    eq(order.userId, userId),
    inArray(order.status, paidStatuses),
  ];

  if (excludeOrderId) {
    conditions.push(sql`${order.id} <> ${excludeOrderId}`);
  }

  const rows = await db
    .select({ id: order.id })
    .from(order)
    .where(and(...conditions))
    .limit(1);

  return rows.length > 0;
}

async function sendSuccessEmails({
  email,
  name,
  orderId,
  amount,
  isFirstPaidOrder,
}: {
  email?: string | null;
  name?: string | null;
  orderId: string;
  amount: number;
  isFirstPaidOrder: boolean;
}) {
  if (!email) return;

  const firstName = name ?? "there";
  const orderDate = new Date().toLocaleDateString("en-IN");

  if (isFirstPaidOrder) {
    await sendFirstPurchaseEmail(email, firstName);
  }

  await sendOrderConfirmationEmail(email, firstName, orderId, orderDate, amount);
}

async function sendFailureEmail({
  email,
  name,
  orderId,
  amount,
  paymentId,
  reason,
}: {
  email?: string | null;
  name?: string | null;
  orderId?: string | null;
  amount: number;
  paymentId?: string | null;
  reason?: string | null;
}) {
  if (!email) return;

  const safeName = escapeHtml(name ?? "there");
  const safeOrder = orderId ? `Order: ${escapeHtml(orderId)}` : "";
  const safeReason = reason ? `<p>Reason: ${escapeHtml(reason)}</p>` : "";
  const safePaymentId = paymentId ? escapeHtml(paymentId) : "Not available";

  await sendEmail({
    to: email,
    subject: "Payment failed for your POTENT HYGIENE order",
    html: `
      <p>Hi ${safeName},</p>
      <p>We could not complete your payment of Rs. ${amount.toFixed(2)}.</p>
      <p>${safeOrder}</p>
      <p>Payment ID: ${safePaymentId}</p>
      ${safeReason}
      <p>Your order is still pending. Please try the payment again from checkout.</p>
    `,
  });
}

async function findPaymentIntent(gatewayPayment: any) {
  const conditions = [];

  if (gatewayPayment.id) {
    conditions.push(eq(payment.gatewayPaymentId, gatewayPayment.id));
  }

  if (gatewayPayment.order_id) {
    conditions.push(eq(payment.gatewayOrderId, gatewayPayment.order_id));
  }

  if (!conditions.length) return null;

  const [row] = await db
    .select({
      payment,
      order,
      user: users,
    })
    .from(payment)
    .leftJoin(order, eq(payment.orderId, order.id))
    .leftJoin(users, eq(payment.userId, users.id))
    .where(or(...conditions))
    .orderBy(desc(payment.createdAt))
    .limit(1);

  return row ?? null;
}

async function handlePaymentCaptured(gatewayPayment: any) {
  if (!gatewayPayment?.id) {
    return { action: "ignored_missing_payment" };
  }

  if (gatewayPayment.invoice_id) {
    return { action: "ignored_subscription_capture" };
  }

  const intent = await findPaymentIntent(gatewayPayment);
  const amount = rupeesFromPaise(gatewayPayment.amount);

  if (!intent?.payment) {
    await db
      .insert(payment)
      .values({
        gatewayOrderId: gatewayPayment.order_id ?? null,
        gatewayPaymentId: gatewayPayment.id,
        paymentStatus: "success",
        modeOfPayment: "razorpay",
        amount,
        paymentMeta: {
          status: "success",
          gatewayPayment,
          capturedAt: new Date().toISOString(),
          unlinked: true,
        },
      })
      .onConflictDoNothing();

    await sendSuccessEmails({
      email: gatewayPayment.email,
      name: gatewayPayment.email,
      orderId: gatewayPayment.order_id ?? gatewayPayment.id,
      amount,
      isFirstPaidOrder: false,
    });

    return { action: "stored_unlinked_payment", paymentId: gatewayPayment.id };
  }

  const alreadySuccess =
    intent.payment.paymentStatus === "success" &&
    intent.payment.gatewayPaymentId === gatewayPayment.id;
  const shouldMarkPaid =
    intent.order?.id && intent.order.status === ORDER_STATUS.PENDING;
  const isFirstPaidOrder = intent.user?.id
    ? !(await userHasPaidOrder(intent.user.id, intent.order?.id))
    : false;

  await db.transaction(async (tx) => {
    await tx
      .update(payment)
      .set({
        gatewayPaymentId: gatewayPayment.id,
        gatewayOrderId: gatewayPayment.order_id ?? intent.payment.gatewayOrderId,
        paymentStatus: "success",
        amount,
        paymentMeta: {
          ...((intent.payment.paymentMeta as any) || {}),
          status: "success",
          gatewayPayment,
          capturedAt: new Date().toISOString(),
        },
      })
      .where(eq(payment.id, intent.payment.id));

    if (shouldMarkPaid) {
      await tx
        .update(order)
        .set({
          status: ORDER_STATUS.PAID,
          updatedAt: new Date(),
        })
        .where(eq(order.id, intent.order.id));

      await tx.insert(rewardCoinsHistory).values({
        orderId: intent.order.id,
        userId: intent.order.userId,
        coins: amount,
        type: "order_payment",
      });

      await tx
        .update(users)
        .set({
          rewardOrderCoins: sql`${users.rewardOrderCoins} + ${amount}`,
        })
        .where(eq(users.id, intent.order.userId));

      const coupon = (intent.payment.paymentMeta as any)?.coupon;
      if (coupon?.id) {
        await tx.insert(couponTransaction).values({
          userId: intent.order.userId,
          couponId: coupon.id,
          code: coupon.code,
          discountedAmount: Number((intent.payment.paymentMeta as any)?.discount || 0),
        });
      }
    }
  });

  if (!alreadySuccess && intent.order?.id) {
    await sendSuccessEmails({
      email: intent.user?.email ?? gatewayPayment.email,
      name: intent.user?.name,
      orderId: intent.order.id,
      amount,
      isFirstPaidOrder,
    });
  }

  return {
    action: alreadySuccess ? "already_processed" : "captured",
    orderId: intent.order?.id,
    paymentId: gatewayPayment.id,
  };
}

async function handlePaymentFailed(gatewayPayment: any) {
  if (!gatewayPayment?.id) {
    return { action: "ignored_missing_payment" };
  }

  const intent = await findPaymentIntent(gatewayPayment);
  const amount = rupeesFromPaise(gatewayPayment.amount);
  const alreadyFailed =
    intent?.payment?.paymentStatus === "failed" &&
    intent.payment.gatewayPaymentId === gatewayPayment.id;

  if (intent?.payment) {
    await db
      .update(payment)
      .set({
        gatewayPaymentId: gatewayPayment.id,
        gatewayOrderId: gatewayPayment.order_id ?? intent.payment.gatewayOrderId,
        paymentStatus: "failed",
        amount,
        paymentMeta: {
          ...((intent.payment.paymentMeta as any) || {}),
          status: "failed",
          gatewayPayment,
          failedAt: new Date().toISOString(),
        },
      })
      .where(eq(payment.id, intent.payment.id));
  } else {
    await db
      .insert(payment)
      .values({
        gatewayOrderId: gatewayPayment.order_id ?? null,
        gatewayPaymentId: gatewayPayment.id,
        paymentStatus: "failed",
        modeOfPayment: "razorpay",
        amount,
        paymentMeta: {
          status: "failed",
          gatewayPayment,
          failedAt: new Date().toISOString(),
          unlinked: true,
        },
      })
      .onConflictDoNothing();
  }

  if (!alreadyFailed) {
    await sendFailureEmail({
      email: intent?.user?.email ?? gatewayPayment.email,
      name: intent?.user?.name,
      orderId: intent?.order?.id,
      amount,
      paymentId: gatewayPayment.id,
      reason: gatewayPayment.error_description,
    });
  }

  return {
    action: alreadyFailed ? "already_processed" : "failed",
    orderId: intent?.order?.id,
    paymentId: gatewayPayment.id,
  };
}

async function getSourceOrder(subscription: any) {
  if (!subscription.orderId) return null;

  const rows = await db
    .select({
      order,
      item: orderItem,
      variant: productVariant,
      product,
    })
    .from(order)
    .leftJoin(orderItem, eq(orderItem.orderId, order.id))
    .leftJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
    .leftJoin(product, eq(productVariant.productId, product.id))
    .where(eq(order.id, subscription.orderId));

  if (!rows.length) return null;

  return {
    order: rows[0].order,
    items: rows.filter((row) => row.item),
  };
}

async function getFallbackItems(subscription: any) {
  if (!subscription.productVariantId) return [];

  return db
    .select({
      variant: productVariant,
      product,
    })
    .from(productVariant)
    .leftJoin(product, eq(productVariant.productId, product.id))
    .where(eq(productVariant.id, subscription.productVariantId));
}

async function handleSubscriptionCharged(eventPayload: any) {
  const gatewaySubscription = eventPayload.payload?.subscription?.entity;
  const gatewayPayment = eventPayload.payload?.payment?.entity;

  if (!gatewaySubscription?.id || !gatewayPayment?.id) {
    return { action: "ignored_missing_subscription_payment" };
  }

  const [existingSuccess] = await db
    .select({ id: payment.id, orderId: payment.orderId })
    .from(payment)
    .where(
      and(
        eq(payment.gatewayPaymentId, gatewayPayment.id),
        eq(payment.paymentStatus, "success"),
      ),
    )
    .limit(1);

  if (existingSuccess?.orderId) {
    return {
      action: "already_processed",
      orderId: existingSuccess.orderId,
      paymentId: gatewayPayment.id,
    };
  }

  const [subscriptionRow] = await db
    .select({
      subscription: subscriptions,
      gatewaySubscription: paymentGatewaySubscription,
      plan: paymentGatewayPlans,
      user: users,
    })
    .from(paymentGatewaySubscription)
    .innerJoin(
      subscriptions,
      eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
    )
    .leftJoin(
      paymentGatewayPlans,
      eq(paymentGatewaySubscription.planId, paymentGatewayPlans.gatewayPlanId),
    )
    .leftJoin(users, eq(paymentGatewaySubscription.userId, users.id))
    .where(
      eq(
        paymentGatewaySubscription.gatewaySubscriptionId,
        gatewaySubscription.id,
      ),
    )
    .limit(1);

  if (!subscriptionRow?.subscription) {
    return {
      action: "subscription_not_found",
      paymentId: gatewayPayment.id,
      gatewaySubscriptionId: gatewaySubscription.id,
    };
  }

  const amount =
    rupeesFromPaise(gatewayPayment.amount) ||
    Math.round(Number(subscriptionRow.plan?.price || 0) / 100);
  const sourceOrder = await getSourceOrder(subscriptionRow.subscription);
  const existingPendingOrder =
    sourceOrder?.order?.status === ORDER_STATUS.PENDING ? sourceOrder : null;
  const fallbackItems = sourceOrder ? [] : await getFallbackItems(subscriptionRow.subscription);
  const pendingPaymentRows = await db
    .select()
    .from(payment)
    .where(
      and(
        eq(payment.gatewayTransactionId, gatewaySubscription.id),
        eq(payment.paymentStatus, "pending"),
      ),
    )
    .orderBy(desc(payment.createdAt))
    .limit(1);
  const pendingPayment = pendingPaymentRows[0] ?? null;
  const frequencyInDays = Number(subscriptionRow.subscription.frequencyInDays || 30);
  const nextOrderDate = getNextDueDate(
    subscriptionRow.subscription.nextOrderDate,
    frequencyInDays,
  );
  const isFirstPaidOrder = subscriptionRow.user?.id
    ? !(await userHasPaidOrder(subscriptionRow.user.id, existingPendingOrder?.order?.id))
    : false;

  const result = await db.transaction(async (tx) => {
    let paidOrderId = existingPendingOrder?.order?.id ?? null;

    if (paidOrderId) {
      await tx
        .update(order)
        .set({
          status: ORDER_STATUS.PAID,
          updatedAt: new Date(),
          totalAmount: amount,
        })
        .where(eq(order.id, paidOrderId));
    } else {
      const [createdOrder] = await tx
        .insert(order)
        .values({
          userId: subscriptionRow.subscription.userId,
          status: ORDER_STATUS.PAID,
          totalAmount: amount,
          addressLine1: sourceOrder?.order?.addressLine1 ?? null,
          addressLine2: sourceOrder?.order?.addressLine2 ?? null,
          city: sourceOrder?.order?.city ?? null,
          state: sourceOrder?.order?.state ?? null,
          pincode: sourceOrder?.order?.pincode ?? null,
        })
        .returning({ id: order.id });

      paidOrderId = createdOrder.id;

      if (sourceOrder?.items?.length) {
        await tx.insert(orderItem).values(
          sourceOrder.items.map((row: any) => ({
            orderId: paidOrderId,
            productVariantId: row.item.productVariantId,
            quantity: row.item.quantity,
            mixBoxRecipe: row.item.mixBoxRecipe,
            totalPads: row.item.totalPads,
            boxCount: row.item.boxCount,
            freeLiners: row.item.freeLiners,
            productVarientName: row.item.productVarientName,
            productVarientSlug: row.item.productVarientSlug,
            productVarientImage: row.item.productVarientImage,
            productVarientPrice: row.item.productVarientPrice,
            productVarientSKU: row.item.productVarientSKU,
          })),
        );
      } else if (fallbackItems.length) {
        const fallback = fallbackItems[0];
        await tx.insert(orderItem).values({
          orderId: paidOrderId,
          productVariantId: fallback.variant.id,
          quantity: subscriptionRow.gatewaySubscription.quantity ?? 1,
          productVarientName: fallback.variant.name ?? fallback.product?.name,
          productVarientSlug: fallback.product?.slug ?? null,
          productVarientImage:
            fallback.variant.bannerImage ?? fallback.product?.bannerImage ?? null,
          productVarientPrice: amount,
          productVarientSKU: fallback.variant.sku ?? null,
        });
      }
    }

    const paymentMeta = {
      status: "success",
      gatewayPayment,
      gatewaySubscription,
      subscriptionId: subscriptionRow.subscription.id,
      gatewaySubscriptionId: gatewaySubscription.id,
      chargedAt: new Date().toISOString(),
    };

    if (pendingPayment) {
      await tx
        .update(payment)
        .set({
          orderId: paidOrderId,
          userId: subscriptionRow.subscription.userId,
          gatewayOrderId: gatewayPayment.order_id ?? null,
          gatewayPaymentId: gatewayPayment.id,
          gatewayTransactionId: gatewaySubscription.id,
          paymentStatus: "success",
          modeOfPayment: "razorpay_subscription",
          amount,
          paymentMeta: {
            ...((pendingPayment.paymentMeta as any) || {}),
            ...paymentMeta,
          },
        })
        .where(eq(payment.id, pendingPayment.id));
    } else {
      await tx.insert(payment).values({
        userId: subscriptionRow.subscription.userId,
        orderId: paidOrderId,
        gatewayOrderId: gatewayPayment.order_id ?? null,
        gatewayPaymentId: gatewayPayment.id,
        gatewayTransactionId: gatewaySubscription.id,
        paymentStatus: "success",
        modeOfPayment: "razorpay_subscription",
        amount,
        paymentMeta,
      });
    }

    await tx.insert(rewardCoinsHistory).values({
      orderId: paidOrderId,
      userId: subscriptionRow.subscription.userId,
      coins: amount,
      type: "subscription_charge",
    });

    await tx
      .update(users)
      .set({
        rewardOrderCoins: sql`${users.rewardOrderCoins} + ${amount}`,
      })
      .where(eq(users.id, subscriptionRow.subscription.userId));

    await tx
      .update(subscriptions)
      .set({
        orderId: paidOrderId,
        chargeDate: new Date(),
        nextOrderDate,
        isActive: true,
      })
      .where(eq(subscriptions.id, subscriptionRow.subscription.id));

    await tx
      .update(paymentGatewaySubscription)
      .set({
        remainingCount:
          gatewaySubscription.remaining_count ??
          subscriptionRow.gatewaySubscription.remainingCount,
        totalCount:
          gatewaySubscription.total_count ??
          subscriptionRow.gatewaySubscription.totalCount,
      })
      .where(eq(paymentGatewaySubscription.id, subscriptionRow.gatewaySubscription.id));

    return { orderId: paidOrderId };
  });

  await sendSuccessEmails({
    email: subscriptionRow.user?.email ?? gatewayPayment.email,
    name: subscriptionRow.user?.name,
    orderId: result.orderId,
    amount,
    isFirstPaidOrder,
  });

  return {
    action: "subscription_charged",
    orderId: result.orderId,
    paymentId: gatewayPayment.id,
  };
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const eventId = req.headers.get("x-razorpay-event-id");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { success: false, message: "Invalid Razorpay webhook signature" },
      { status: 400 },
    );
  }

  if (await webhookEventAlreadyProcessed(eventId)) {
    return NextResponse.json({ success: true, duplicate: true });
  }

  const eventPayload = JSON.parse(rawBody);
  const eventName = eventPayload.event;

  if (!HANDLED_EVENTS.has(eventName)) {
    await rememberWebhookEvent({ eventId, eventName });
    return NextResponse.json({ success: true, ignored: true });
  }

  let result;
  let paymentId = eventPayload.payload?.payment?.entity?.id ?? null;

  if (eventName === "payment.captured") {
    result = await handlePaymentCaptured(eventPayload.payload?.payment?.entity);
  } else if (eventName === "payment.failed") {
    result = await handlePaymentFailed(eventPayload.payload?.payment?.entity);
  } else {
    result = await handleSubscriptionCharged(eventPayload);
    paymentId = result?.paymentId ?? paymentId;
  }

  await rememberWebhookEvent({ eventId, eventName, paymentId });

  return NextResponse.json({
    success: true,
    event: eventName,
    result,
  });
}
