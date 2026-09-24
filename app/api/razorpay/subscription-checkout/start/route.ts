// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";
import { db } from "@/src/db";
import {
  address,
  order,
  orderItem,
  payment,
  paymentGatewayPlans,
  paymentGatewaySubscription,
  subscriptions,
} from "@/src/db/schema";
import { requireUserWithRefresh } from "@/helper/user/action";
import { getSubscriptionCheckoutQuote } from "@/lib/subscriptionCheckout";
import { ORDER_STATUS } from "@/const/globalconst";

function fromUnix(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000) : null;
}

export async function POST(req: Request) {
  try {
    const { userId } = await requireUserWithRefresh();
    const { item, addressId } = await req.json();

    const [shippingAddress] = await db
      .select()
      .from(address)
      .where(and(eq(address.id, Number(addressId)), eq(address.userId, userId)))
      .limit(1);

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Please select a valid address" },
        { status: 400 },
      );
    }

    const quote = await getSubscriptionCheckoutQuote(item);
    if (!quote.success) {
      return NextResponse.json(quote, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID!,
      key_secret: RAZORPAY_KEY_SECRET!,
    });

    const plan = await razorpay.plans.create({
      period: quote.billing.period,
      interval: quote.billing.interval,
      item: {
        name: quote.label,
        amount: quote.amountPaise,
        currency: "INR",
        description: quote.variant.name,
      },
      notes: {
        productId: quote.product.id,
        productVariantId: quote.variant.id,
        subscriptionType: quote.subscriptionType,
      },
    });

    const gatewaySubscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notes: {
        productId: quote.product.id,
        productVariantId: quote.variant.id,
        subscriptionType: quote.subscriptionType,
      },
    });

    const localOrder = await db.transaction(async (tx) => {
      const [localSubscription] = await tx
        .insert(subscriptions)
        .values({
          userId,
          productId: quote.product.id,
          productVariantId: quote.variant.id,
          startDate: new Date(),
          frequencyInDays: quote.billing.frequencyInDays,
          nextOrderDate: quote.nextOrderDate,
          subscriptionType: quote.subscriptionType,
          chargeDate: null,
          isActive: false,
        })
        .returning({ id: subscriptions.id });

      const [pendingOrder] = await tx
        .insert(order)
        .values({
          userId,
          status: ORDER_STATUS.PENDING,
          totalAmount: quote.final,
          addressLine1: shippingAddress.streetAddress1,
          addressLine2: shippingAddress.streetAddress2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
        })
        .returning({ id: order.id });

      await tx.insert(orderItem).values({
        orderId: pendingOrder.id,
        productVariantId: quote.variant.id,
        quantity: quote.quantity,
        mixBoxRecipe: quote.mixBoxRecipe,
        totalPads: quote.totalPads,
        boxCount: quote.boxCount,
        freeLiners: quote.freeLiners,
        productVarientName: quote.mixBoxRecipe
          ? `${quote.product.name} Mix Box`
          : quote.variant.name ?? quote.product.name,
        productVarientSlug: quote.product.slug,
        productVarientImage: quote.variant.bannerImage ?? quote.product.bannerImage,
        productVarientPrice: Math.round(quote.final / quote.quantity),
        productVarientSKU: quote.mixBoxRecipe ? "MIX-BOX" : quote.variant.sku,
      });

      await tx.insert(paymentGatewayPlans).values({
        name: plan.item.name,
        price: plan.item.amount,
        descirption: plan.item.description,
        billingFrequency: String(plan.interval),
        gatewayPlanId: plan.id,
        frequencyType: quote.subscriptionType,
      });

      await tx.insert(paymentGatewaySubscription).values({
        userId,
        subscriptionId: localSubscription.id,
        gatewaySubscriptionId: gatewaySubscription.id,
        planId: plan.id,
        totalCount: gatewaySubscription.total_count,
        remainingCount: gatewaySubscription.remaining_count,
        quantity: quote.quantity,
        customerNotify: Boolean(gatewaySubscription.customer_notify),
        startAt: fromUnix(gatewaySubscription.start_at),
        expireBy: fromUnix(gatewaySubscription.expire_by),
      });

      await tx
        .update(subscriptions)
        .set({ orderId: pendingOrder.id })
        .where(eq(subscriptions.id, localSubscription.id));

      await tx.insert(payment).values({
        userId,
        orderId: pendingOrder.id,
        gatewayTransactionId: gatewaySubscription.id,
        paymentStatus: "pending",
        modeOfPayment: "razorpay_subscription",
        amount: quote.final,
        paymentMeta: {
          status: "pending",
          subscriptionId: localSubscription.id,
          gatewaySubscriptionId: gatewaySubscription.id,
          planId: plan.id,
          subscriptionType: quote.subscriptionType,
          mixBoxRecipe: quote.mixBoxRecipe,
          totalPads: quote.totalPads,
          boxCount: quote.boxCount,
          freeLiners: quote.freeLiners,
          addressId: shippingAddress.id,
        },
      });

      return {
        orderId: pendingOrder.id,
        subscriptionId: localSubscription.id,
      };
    });

    return NextResponse.json({
      success: true,
      subscriptionId: gatewaySubscription.id,
      localOrderId: localOrder.orderId,
      amount: quote.final,
      label: quote.label,
    });
  } catch (error: any) {
    console.error("Subscription checkout start failed:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.error?.description ??
          "Failed to start subscription checkout",
      },
      { status: error?.statusCode ?? 500 },
    );
  }
}
