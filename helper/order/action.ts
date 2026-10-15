// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { paginate } from "@/lib/pagination";
import { and, or, sql, eq, desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { cart, cartItem, contactUs, couponTransaction, orderAction, orderActionImage, paymentGatewayPlans, paymentGatewaySubscription, product, productVariant, review, rewardCoinsHistory, subscriptions } from "@/db/schema";
import { order, orderItem, payment, users } from "@/db/schema";
import { requireUserWithRefresh } from "../user/action";
import { calculateCheckoutPricingForUser } from "../checkout/action";
import { ORDER_STATUS, ORDER_STATUS_ITEMS } from "@/const/globalconst";
import { getImageKey } from "@/lib/imageUrl";
import { calculateMixBoxPricing, formatMixBoxRecipe, type MixBoxRecipe } from "@/lib/mixYourBox";
import { formatYatraKitSummary } from "@/lib/yatraKit";
import {
  sendDeliveryConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendShippingConfirmationEmail,
  sendUserExperienceEmail,
} from "../emailTemplates/action";
import { reverseCancelledOrderRewards } from "@/lib/rewards";

const cancelRequest = orderAction;
const returnRequest = orderAction;
const returnRequestImage = orderActionImage;
const VALID_ORDER_STATUSES = ORDER_STATUS_ITEMS.map((item) => item.value);

export const fetchOrders = async ({
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
} = {}) => {
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const limit = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
  const offset = (currentPage - 1) * limit;

  const filters = [];

  if (search && search.trim() !== "") {
    const text = search.trim();
    filters.push(
      or(
        sql`${order.id}::text ILIKE ${`%${text}%`}`,
        sql`${users.name} ILIKE ${`%${text}%`}`,
        sql`${users.email} ILIKE ${`%${text}%`}`,
        sql`${users.phone} ILIKE ${`%${text}%`}`,
      ),
    );
  }

  if (status && status.trim() !== "") {
    filters.push(eq(order.status, status as any));
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  const [ordersData, countResult] = await Promise.all([
    db
      .select({
        id: order.id,
        userId: order.userId,
        status: order.status,
        totalAmount: order.totalAmount,
        addressLine1: order.addressLine1,
        addressLine2: order.addressLine2,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        customerName: users.name,
        customerEmail: users.email,
        customerPhone: users.phone,
      })
      .from(order)
      .leftJoin(users, eq(order.userId, users.id))
      .where(whereClause)
      .orderBy(desc(order.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(order)
      .leftJoin(users, eq(order.userId, users.id))
      .where(whereClause),
  ]);

  const [{ count }] = countResult;
  const total = Number(count);
  const totalPages = Math.ceil(total / limit);

  const orderIds = ordersData.map((o) => o.id);
  const itemsMap = new Map<string, any[]>();

  if (orderIds.length > 0) {
    const rawItems = await db
      .select({
        id: orderItem.id,
        orderId: orderItem.orderId,
        productVariantId: orderItem.productVariantId,
        quantity: orderItem.quantity,
        mixBoxRecipe: orderItem.mixBoxRecipe,
        totalPads: orderItem.totalPads,
        boxCount: orderItem.boxCount,
        freeLiners: orderItem.freeLiners,
        productVarientName: orderItem.productVarientName,
        productVarientSlug: orderItem.productVarientSlug,
        productVarientImage: orderItem.productVarientImage,
        productVarientPrice: orderItem.productVarientPrice,
        productVarientSKU: orderItem.productVarientSKU,
      })
      .from(orderItem)
      .where(inArray(orderItem.orderId, orderIds));

    for (const item of rawItems) {
      if (!item.orderId) continue;
      const current = itemsMap.get(item.orderId) || [];
      current.push(item);
      itemsMap.set(item.orderId, current);
    }
  }

  const actionsMap = new Map<string, any[]>();
  if (orderIds.length > 0) {
    const actions = await db
      .select({
        id: orderAction.id,
        orderId: orderAction.orderId,
        requestType: orderAction.requestType,
        userReason: orderAction.userReason,
        status: orderAction.status,
      })
      .from(orderAction)
      .where(inArray(orderAction.orderId, orderIds));

    for (const a of actions) {
      if (!a.orderId) continue;
      const list = actionsMap.get(a.orderId) || [];
      list.push(a);
      actionsMap.set(a.orderId, list);
    }
  }

  const data = ordersData.map((orderRow) => {
    const actions = actionsMap.get(orderRow.id) || [];
    const returnReq = actions.find((a) => a.requestType === "return_order");
    const cancelReq = actions.find((a) => a.requestType === "cance_order");

    return {
      ...orderRow,
      items: itemsMap.get(orderRow.id) || [],
      returnRequest: returnReq ?? null,
      cancelRequest: cancelReq ?? null,
    };
  });

  return {
    data,
    meta: {
      total,
      totalPages,
      page: currentPage,
      pageSize: limit,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  };
};

export const fetchOrderDetails = async (orderId: string) => {
  try {
    const orderInfo = await db
      .select({
        order,
        users,
        payment,
      })
      .from(order)
      .leftJoin(users, eq(order.userId, users.id))
      .leftJoin(payment, eq(payment.orderId, order.id))
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderInfo.length) return null;

    const rawItems = await db
      .select({
        item: orderItem,
        variant: productVariant,
        product: product,
      })
      .from(orderItem)
      .leftJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
      .leftJoin(product, eq(productVariant.productId, product.id))
      .where(eq(orderItem.orderId, orderId));

    const items = rawItems.map((row) => ({
      ...row.item,
      productName: row.item.productVarientName,
      productSlug: row.item.productVarientSlug,
      productImage: row.item.productVarientImage,
      productSKU: row.item.productVarientSKU,
      productPrice: row.item.productVarientPrice,
      variant: row.variant,
      product: row.product,
    }));

    const returnRequests = await db
      .select()
      .from(orderAction)
      .where(
        and(
          eq(orderAction.orderId, orderId),
          eq(orderAction.requestType, "return_order"),
        ),
      );

    return {
      ...orderInfo[0],
      items,
      returnRequests,
      returnRequest: returnRequests[0] ?? null,
    };
  } catch (error) {
    console.error("fetchOrderDetails error:", error);
    throw new Error("Failed to fetch order details");
  }
};

const CANCELABLE_ORDER_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PAID,
  ORDER_STATUS.PROCESSING,
];

async function sendOrderStatusMail(orderId: string, status: string) {
  const [row] = await db
    .select({
      email: users.email,
      name: users.name,
    })
    .from(order)
    .leftJoin(users, eq(order.userId, users.id))
    .where(eq(order.id, orderId))
    .limit(1);

  if (!row?.email) return;

  const firstName = row.name ?? "there";
  const currentDate = new Date().toLocaleDateString("en-IN");
  const orderLink = "https://www.potenthygiene.com/dashboard/orders";

  if (status === ORDER_STATUS.SHIPPED) {
    await sendShippingConfirmationEmail(row.email, orderId, firstName, orderLink, "FedEx");
    return;
  }

  if (status === ORDER_STATUS.DELIVERED) {
    await sendDeliveryConfirmationEmail(row.email, firstName, orderId, currentDate, orderLink);
    await sendUserExperienceEmail(row.email, firstName, "https://www.potenthygiene.com/dashboard/reviews");
    return;
  }

  const prettyStatus = status.replace(/_/g, " ");
  await sendOrderStatusUpdateEmail(
    row.email,
    firstName,
    orderId,
    prettyStatus,
    `Your order status has been updated to ${prettyStatus}.`,
  );
}

export const changeOrderStatus = async (id: string, status: string) => {
  if (!VALID_ORDER_STATUSES.includes(status as any)) {
    throw new Error("Invalid order status");
  }

  if (status === ORDER_STATUS.PAID) {
    throw new Error("Paid status is controlled by the payment webhook");
  }

  const result = await db
    .update(order)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(order.id, id))
    .returning();

  if (result[0]) {
    if (status === ORDER_STATUS.CANCELED || status === ORDER_STATUS.RETURNED) {
      await reverseCancelledOrderRewards(id);
    }

    if (status === ORDER_STATUS.CANCELED || status === "cancelled" || status === "canceled") {
      try {
        const [existingReq] = await db
          .select({ id: cancelRequest.id })
          .from(cancelRequest)
          .where(and(eq(cancelRequest.orderId, id), eq(cancelRequest.requestType, "cance_order")))
          .limit(1);

        if (!existingReq && result[0].userId) {
          await db.insert(cancelRequest).values({
            orderId: id,
            userId: result[0].userId,
            requestType: "cance_order",
            userReason: "Order cancelled",
            status: "approved",
          });
        }
      } catch (cancelErr) {
        console.error("Error creating cancelRequest entry on status update:", cancelErr);
      }
    }

    sendOrderStatusMail(id, status).catch((mailError) => {
      console.warn("sendOrderStatusMail background:", mailError?.message || mailError);
    });
  }

  return result[0];
};

export async function updateOrderStatus(id: string, status: string | any) {
  const updated = await changeOrderStatus(id, status);
  revalidatePath("/admin/order");
  revalidatePath(`/admin/order/${id}`);
  revalidatePath("/admin/cancel-requests");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/security");
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);
  return updated;
}

export async function createCancelRequest(orderId: string, userReason: string) {
  try {
    const { userId } = await requireUserWithRefresh();
    const [orderRow] = await db
      .select()
      .from(order)
      .where(and(eq(order.id, orderId), eq(order.userId, userId)))
      .limit(1);

    if (!orderRow) return { success: false, message: "Order not found" };
    if (!orderRow.status || !CANCELABLE_ORDER_STATUSES.includes(orderRow.status as any)) {
      return { success: false, message: "This order can no longer be cancelled" };
    }

    let refundStatus = "approved";

    // Trigger Razorpay refund if payment exists and was successful
    const [paymentRow] = await db
      .select()
      .from(payment)
      .where(eq(payment.orderId, orderId))
      .limit(1);

    if (paymentRow?.gatewayPaymentId && paymentRow.paymentStatus === "success") {
      try {
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (keyId && keySecret) {
          const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
          const refundRes = await fetch(
            `https://api.razorpay.com/v1/payments/${paymentRow.gatewayPaymentId}/refund`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: Math.round(Number(paymentRow.amount || orderRow.totalAmount) * 100),
                notes: {
                  orderId,
                  reason: userReason || "Customer cancellation",
                },
              }),
            },
          );

          const refundData = await refundRes.json();
          if (refundRes.ok && refundData.id) {
            refundStatus = "refunded";
            await db
              .update(payment)
              .set({
                paymentStatus: "refunded",
                paymentMeta: {
                  ...(typeof paymentRow.paymentMeta === "object" ? paymentRow.paymentMeta : {}),
                  refundId: refundData.id,
                  refundedAt: new Date().toISOString(),
                  refundAmount: refundData.amount,
                },
              })
              .where(eq(payment.id, paymentRow.id));
          } else {
            console.warn("Razorpay refund response:", refundData);
          }
        }
      } catch (refundErr) {
        console.warn("Razorpay refund exception:", refundErr);
      }
    }

    if (!existing) {
      await db.insert(cancelRequest).values({
        orderId,
        userId,
        requestType: "cance_order",
        userReason,
        status: refundStatus as any,
      });
    } else {
      await db
        .update(cancelRequest)
        .set({
          status: refundStatus as any,
          userReason,
          updatedAt: new Date(),
        })
        .where(eq(cancelRequest.id, existing.id));
    }

    await changeOrderStatus(orderId, ORDER_STATUS.CANCELED);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/security");
    revalidatePath("/dashboard/orders");
    revalidatePath("/admin/cancel-requests");
    return {
      success: true,
      message: "Order cancelled and reward credits updated",
    };
  } catch (error) {
    console.error("createCancelRequest error:", error);
    return { success: false, message: "Failed to cancel order" };
  }
}

export async function cancelUnpaidOrder(orderId: string) {
  try {
    const { userId } = await requireUserWithRefresh();
    const [orderRow] = await db
      .select()
      .from(order)
      .where(and(eq(order.id, orderId), eq(order.userId, userId)))
      .limit(1);

    if (!orderRow) return { success: false, message: "Order not found" };
    if (orderRow.status !== ORDER_STATUS.PENDING) {
      return { success: false, message: "Only unpaid orders can be cancelled directly" };
    }

    const [existingReq] = await db
      .select({ id: cancelRequest.id })
      .from(cancelRequest)
      .where(and(eq(cancelRequest.orderId, orderId), eq(cancelRequest.requestType, "cance_order")))
      .limit(1);

    if (!existingReq) {
      await db.insert(cancelRequest).values({
        orderId,
        userId,
        requestType: "cance_order",
        userReason: "Cancelled by customer (unpaid order)",
        status: "approved",
      });
    }

    await changeOrderStatus(orderId, ORDER_STATUS.CANCELED);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    revalidatePath("/admin/cancel-requests");
    revalidatePath("/admin/order");
    return { success: true, message: "Unpaid order cancelled" };
  } catch (error) {
    console.error("cancelUnpaidOrder error:", error);
    return { success: false, message: "Failed to cancel unpaid order" };
  }
}

export async function submitOrderIssue(
  payload:
    | {
        orderId: string;
        issueText: string;
        productName?: string;
        imageUrls?: string[];
      }
    | string,
  maybeIssueText?: string,
  maybeProductName?: string,
  maybeImageUrls?: string[],
) {
  try {
    const { userId } = await requireUserWithRefresh();

    let orderId = "";
    let issueText = "";
    let productName = "";
    let imageUrls: string[] = [];

    if (typeof payload === "object" && payload !== null) {
      orderId = payload.orderId;
      issueText = payload.issueText;
      productName = payload.productName || "";
      imageUrls = payload.imageUrls || [];
    } else {
      orderId = String(payload || "");
      issueText = String(maybeIssueText || "");
      productName = String(maybeProductName || "");
      imageUrls = Array.isArray(maybeImageUrls) ? maybeImageUrls : [];
    }

    if (!orderId) {
      return { success: false, message: "Order ID is missing." };
    }

    if (!issueText || !issueText.trim()) {
      return { success: false, message: "Please describe your issue." };
    }

    // Verify order exists
    const [orderRow] = await db
      .select({ id: order.id, userId: order.userId })
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderRow) {
      return { success: false, message: "Order not found." };
    }

    // Verify ownership or admin privileges
    if (orderRow.userId && orderRow.userId !== userId) {
      const [adminUser] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (adminUser?.role !== "admin") {
        return { success: false, message: "Unauthorized: This order belongs to another account." };
      }
    }

    const trimmedProduct = productName?.trim() || "";
    const isEntireOrder =
      !trimmedProduct ||
      trimmedProduct.toLowerCase().includes("all products") ||
      trimmedProduct.toLowerCase().includes("entire order");

    // Check duplicate issue: only 1 issue can be raised per product (or per order)
    const existingIssues = await db
      .select({
        id: orderAction.id,
        userReason: orderAction.userReason,
        status: orderAction.status,
      })
      .from(orderAction)
      .where(
        and(
          eq(orderAction.orderId, orderId),
          eq(orderAction.requestType, "return_order"),
          notInArray(orderAction.status, ["cancelled"]),
        ),
      );

    if (existingIssues.length > 0) {
      if (isEntireOrder) {
        return {
          success: false,
          message: "An issue has already been submitted for this order. Our team is currently reviewing it.",
        };
      } else {
        const productTag = `[Product: ${trimmedProduct}]`;
        const alreadySubmittedForProduct = existingIssues.some((issue) =>
          issue.userReason ? issue.userReason.includes(productTag) : false,
        );
        if (alreadySubmittedForProduct) {
          return {
            success: false,
            message: `An issue has already been raised for ${trimmedProduct}. Our team is reviewing it.`,
          };
        }
      }
    }

    const fullReason = !isEntireOrder
      ? `[Product: ${trimmedProduct}]: ${issueText.trim()}`
      : issueText.trim();

    // 1. Insert into orderAction table (Raised issues / returns)
    const [created] = await db
      .insert(orderAction)
      .values({
        orderId,
        userId: orderRow.userId || userId,
        requestType: "return_order",
        userReason: fullReason,
        status: "pending",
      })
      .returning({ id: orderAction.id });

    // 2. Insert uploaded photo URLs into orderActionImage table if provided
    const cleanImages = (imageUrls || []).filter(Boolean);
    if (cleanImages.length > 0) {
      await db.insert(orderActionImage).values(
        cleanImages.map((imageUrl) => ({
          orderActionId: created.id,
          imageUrl,
        })),
      );
    }

    // 3. Backup notification in contactUs
    try {
      const [user] = await db
        .select({ name: users.name, email: users.email, phone: users.phone })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      await db.insert(contactUs).values({
        name: user?.name || "Customer",
        email: user?.email || "customer@potenthygiene.com",
        phone: user?.phone || null,
        message: `[Order Issue Raised #${orderId}]: ${fullReason}`,
      });
    } catch (contactErr) {
      console.warn("contactUs backup log error:", contactErr);
    }

    revalidatePath("/admin/return-requests");
    revalidatePath("/admin/return-requests", "page");
    revalidatePath("/admin/cancel-requests");
    revalidatePath("/admin/order");
    revalidatePath("/admin/order", "page");
    revalidatePath("/admin/order/[id]", "page");
    revalidatePath("/admin/contact-us");
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);

    return {
      success: true,
      message: "We've got your message! Our care team will review your issue shortly.",
    };
  } catch (error) {
    console.error("submitOrderIssue error:", error);
    return { success: false, message: "Failed to submit issue. Please try again." };
  }
}

export async function createReturnRequest(orderItemId: string, reason: string, imageUrls: string[] = []) {
  try {
    const { userId } = await requireUserWithRefresh();
    const [row] = await db
      .select({
        item: orderItem,
        order: order,
      })
      .from(orderItem)
      .leftJoin(order, eq(orderItem.orderId, order.id))
      .where(eq(orderItem.id, orderItemId))
      .limit(1);

    if (!row?.item || !row.order || row.order.userId !== userId) {
      return { success: false, message: "Order item not found" };
    }

    if (row.order.status !== ORDER_STATUS.DELIVERED) {
      return { success: false, message: "Return is available after delivery" };
    }

    const [existing] = await db
      .select()
      .from(returnRequest)
      .where(and(eq(returnRequest.orderId, row.order.id), eq(returnRequest.userId, userId), eq(returnRequest.requestType, "return_order")))
      .limit(1);

    if (existing) return { success: false, message: "Return request already submitted" };

    const [created] = await db
      .insert(returnRequest)
      .values({
        orderId: row.order.id,
        userId,
        requestType: "return_order",
        userReason: reason,
      })
      .returning({ id: returnRequest.id });

    const cleanImages = imageUrls.filter(Boolean);
    if (cleanImages.length > 0) {
      await db.insert(returnRequestImage).values(
        cleanImages.map((imageUrl) => ({
          orderActionId: created.id,
          imageUrl,
        })),
      );
    }

    revalidatePath("/dashboard/orders");
    revalidatePath("/admin/return-requests");
    return { success: true, message: "Return request submitted" };
  } catch (error) {
    console.error("createReturnRequest error:", error);
    return { success: false, message: "Failed to submit return request" };
  }
}

export async function updateCancelRequestStatus(
  requestId: string,
  status: "approved" | "rejected",
  adminReason?: string,
) {
  try {
    // In database order_request_status enum: values are 'pending', 'cancelled', 'approved', 'refunded'
    const dbStatus = status === "rejected" ? "cancelled" : status;
    const [updated] = await db
      .update(cancelRequest)
      .set({
        status: dbStatus as any,
        adminReason,
        updatedAt: new Date(),
      })
      .where(eq(cancelRequest.id, requestId))
      .returning();

    if (!updated) return { success: false, message: "Cancel request not found" };

    if (status === "approved") {
      await changeOrderStatus(updated.orderId, ORDER_STATUS.CANCELED);
    }

    revalidatePath("/admin/cancel-requests");
    revalidatePath("/admin/order");
    revalidatePath("/dashboard/orders");
    return { success: true, message: `Cancel request ${status}` };
  } catch (error) {
    console.error("updateCancelRequestStatus error:", error);
    return { success: false, message: "Failed to update cancel request" };
  }
}

export async function updateReturnRequestStatus(
  requestId: string,
  status: "approved" | "rejected",
  adminReason?: string,
) {
  try {
    const dbStatus = status === "rejected" ? "cancelled" : status;
    const [updated] = await db
      .update(returnRequest)
      .set({
        status: dbStatus as any,
        adminReason,
        updatedAt: new Date(),
      })
      .where(eq(returnRequest.id, requestId))
      .returning();

    if (!updated) return { success: false, message: "Issue request not found" };

    if (status === "approved") {
      await changeOrderStatus(updated.orderId, ORDER_STATUS.RETURNED);
    }

    revalidatePath("/admin/return-requests");
    revalidatePath("/admin/order");
    revalidatePath("/dashboard/orders");
    return { success: true, message: `Request marked as ${status}` };
  } catch (error) {
    console.error("updateReturnRequestStatus error:", error);
    return { success: false, message: "Failed to update return request" };
  }
}
// export async function createOrder({
//   items,
//   userId,
//   fixedAmount,
//   address,
//   razorpayPaymentId,
//   razorpayOrderId,
// }: {
//   items: { productId: string; quantity: number }[];
//   userId: string;
//   fixedAmount: number;
//   address: any;
//   razorpayPaymentId: string;
//   razorpayOrderId: string;
// }) {
//   try {
//     if (!items || items.length === 0) {
//       throw new Error("Order items are required");
//     }

//     const productIds = items.map((i) => (i as any).productId || (i as any).productId);

//     const products = await db
//       .select()
//       .from(product)
//       .where(inArray(product.id, productIds));

//     if (products.length !== items.length) {
//       throw new Error("Some products not found");
//     }

//     const productMap = new Map(products.map((p) => [p.id, p]));

//     const safeAmount = Math.round(fixedAmount);

//     const result = await db.transaction(async (tx) => {
//       const insertedOrder = await tx
//         .insert(order)
//         .values({
//           userId,
//           status: "paid",
//           totalAmountPaid: safeAmount,
//           addressLine1: address.addressLine1,
//           addressLine2: address.addressLine2,
//           city: address.city,
//           state: address.state,
//           pincode: address.pincode,
//         })
//         .returning({ id: order.id });

//       const orderId = insertedOrder[0].id;

//       const orderItemsToInsert = items.map((item) => {
//         const Id = (item as any).productId || (item as any).productId;
//         const p = productMap.get(Id);

//         if (!p || !p.name || !p.slug || p.basePrice == null) {
//           throw new Error("Invalid product data");
//         }

//         return {
//           orderId,
//           productId: p.id,
//           quantity: item.quantity,
//           productName: p.name,
//           productSlug: p.slug,
//           productImage: p.bannerImage ?? null,
//           productSKU: p.sku ?? null,
//           productPrice: p.basePrice,
//         };
//       });

//       await Promise.all([
//         tx.insert(orderItem).values(orderItemsToInsert),
//         tx.insert(payment).values({
//           orderId,
//           paymentId: razorpayPaymentId,
//           paymentStatus: "success",
//           paymentMethod: "razorpay",
//           paymentAmount: safeAmount,
//           paymentCurrency: "INR",
//         }),
//       ]);

//       return { orderId };
//     });
//     const cartRes = await db
//       .select()
//       .from(cart)
//       .where(eq(cart.userId, userId))
//       .limit(1);

//     if (cartRes.length > 0) {
//       await db.delete(cartItem)
//         .where(eq(cartItem.cartId, cartRes[0].id));

//       await db.delete(cart)
//         .where(eq(cart.id, cartRes[0].id));
//     }
//     return {
//       success: true,
//       orderId: result.orderId,
//     };

//   } catch (error) {
//     console.error("Order creation failed:", error);
//     return {
//       success: false,
//       message: "Failed to create order",
//     };
//   }
// }

export async function createOrder() {
  return {
    success: false,
    message: "Orders are marked paid only by the Razorpay webhook",
  };
}

export async function createPendingCheckoutOrder({
  couponCode,
  address,
  userId,
  razorpayOrderId,
  customItems,
  isGift,
  giftNote,
}: {
  userId: any;
  couponCode?: string;
  address: any;
  razorpayOrderId: string;
  customItems?: any[];
  isGift?: boolean;
  giftNote?: string;
}) {
  try {
    const pricing = await calculateCheckoutPricingForUser({
      userId,
      couponCode,
      customItems,
    });

    if (!pricing.success || pricing.items.length === 0) {
      throw new Error(pricing.message ?? "Invalid checkout total");
    }

    const checkoutItems = pricing.items;
    const productIds = checkoutItems
      .map((i: any) => i.productId)
      .filter((id: any): id is string => typeof id === "string");
    const uniqueProductIds: any = [...new Set(productIds)];
    const uniqueVariantIds = [
      ...new Set(checkoutItems.map((item: any) => item.productVariantId).filter(Boolean)),
    ] as string[];

    if (uniqueProductIds.length === 0) {
      throw new Error("No product IDs provided");
    }

    const products = await db
      .select()
      .from(product)
      .where(inArray(product.id, uniqueProductIds));

    if (products.length !== uniqueProductIds.length) {
      throw new Error("Some products not found");
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    const allProductVariants = await db
      .select()
      .from(productVariant)
      .where(inArray(productVariant.productId, uniqueProductIds));
    const variantMap = new Map(allProductVariants.map((v) => [v.id, v]));

    for (const item of checkoutItems) {
      const p = productMap.get(item.productId);
      let isItemOutOfStock = false;
      if (item.productVariantId) {
        const v = variantMap.get(item.productVariantId);
        if (v && v.isInStock === false) {
          isItemOutOfStock = true;
        }
      } else {
        const prodVariants = allProductVariants.filter((v) => v.productId === item.productId);
        if (prodVariants.length > 0 && prodVariants.every((v) => v.isInStock === false)) {
          isItemOutOfStock = true;
        }
      }
      if (isItemOutOfStock) {
        throw new Error(`${item.title || p?.name || "An item in your cart"} is currently out of stock.`);
      }
    }

    const safeAmount = Math.round(pricing.final);

    const result = await db.transaction(async (tx) => {
      const insertedOrder = await tx
        .insert(order)
        .values({
          userId,
          status: ORDER_STATUS.PENDING,
          totalAmount: safeAmount,
          addressLine1: address.street ?? address.streetAddress1,
          addressLine2: address.locality ?? address.streetAddress2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        })
        .returning({ id: order.id });

      const orderId = insertedOrder[0].id;
      const orderItemsToInsert = checkoutItems.map((item: any) => {
        const p = productMap.get(item.productId);
        const v = item.productVariantId ? variantMap.get(item.productVariantId) : null;
        const itemPrice = v?.price ?? 0;
        const isYatraKit = Boolean(
          item.yatraKit || (item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit"),
        );
        const yatraKitData = isYatraKit ? (item.yatraKit || item.mixBoxRecipe) : null;
        const mixPricing = item.mixBoxRecipe && !isYatraKit
          ? calculateMixBoxPricing({
              recipe: item.mixBoxRecipe as MixBoxRecipe,
              setPrice: itemPrice,
              purchaseType: "one_time",
              subscriptionType: null,
            })
          : null;

        if (!p || !p.name || !p.slug) {
          throw new Error("Invalid product data");
        }

        const yatraSummary = isYatraKit ? formatYatraKitSummary(yatraKitData) : null;
        const yatraPrice = Number(item.price || itemPrice);

        return {
          orderId,
          productVariantId: v?.id ?? null,
          quantity: item.quantity,
          mixBoxRecipe: isYatraKit ? { type: "yatraKit", ...yatraKitData } : item.mixBoxRecipe,
          totalPads: item.totalPads ?? mixPricing?.totalPads ?? null,
          boxCount: item.boxCount ?? mixPricing?.boxCount ?? null,
          freeLiners: item.freeLiners ?? mixPricing?.freeLiners ?? null,
          productVarientName: isYatraKit
            ? yatraSummary
            : item.mixBoxRecipe
              ? formatMixBoxRecipe(item.mixBoxRecipe, (item.boxCount || item.quantity || 1) * 4)
              : v?.name
                ? `${p.name} - ${v.name}`
                : p.name,
          productVarientSlug: isYatraKit ? "looway-yatra-kit" : p.slug,
          productVarientImage: isYatraKit ? "/looway/yatra-kit-thumb-v2.png" : v?.bannerImage ?? p.bannerImage ?? null,
          productVarientSKU: isYatraKit
            ? `YATRA-KIT-${(yatraKitData?.kitId || "CUSTOM").toUpperCase()}`
            : item.mixBoxRecipe
              ? "MIX-BOX"
              : v?.sku ?? null,
          productVarientPrice: isYatraKit
            ? yatraPrice
            : item.mixBoxRecipe && mixPricing?.valid
              ? mixPricing.price
              : itemPrice,
        };
      });

      await tx.insert(orderItem).values(orderItemsToInsert);
      await tx.insert(payment).values({
        orderId,
        userId,
        gatewayOrderId: razorpayOrderId,
        paymentStatus: "pending",
        modeOfPayment: "razorpay",
        amount: safeAmount,
        paymentMeta: {
          status: "pending",
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          discountedSubtotal: pricing.discountedSubtotal,
          gst: pricing.gst,
          shipping: pricing.shipping,
          coupon: pricing.coupon,
          rewardsUsed: pricing.rewardsUsed ?? 0,
          rewardBalance: pricing.rewardBalance ?? 0,
          razorpayOrderId,
          isGift: Boolean(isGift),
          giftNote:
            isGift && giftNote ? String(giftNote).trim().slice(0, 200) : null,
          shippingAddress: {
            fullName: address?.fullName ?? address?.name ?? null,
            phone: address?.phone ?? null,
            email: address?.email ?? null,
          },
        },
      });

      return { orderId, totalAmount: safeAmount };
    });

    return {
      success: true,
      orderId: result.orderId,
      totalAmount: result.totalAmount,
    };
  } catch (error) {
    console.error("Pending order creation failed:", error);
    return {
      success: false,
      message: "Failed to create pending order",
    };
  }
}

export async function checkUserFirstOrder(userId: string) {
  try {
    const existingOrder = await db.select().from(order).where(eq(order.userId, userId)).limit(1);
    return existingOrder;
  } catch (error) {
    console.error("Error checking user's first order:", error);
    return [];
  }
}

export async function getOrdersByUserId() {
  try {
    const { email } = await requireUserWithRefresh();
    const [currentUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!currentUser?.id) {
      throw new Error("USER_NOT_FOUND");
    }

    const userId = currentUser.id;
    const orders = await db
      .select()
      .from(order)
      .where(eq(order.userId, userId))
      .orderBy(desc(order.createdAt));

    const orderIds = orders.map((o) => o.id);
    const paymentRows = orderIds.length
      ? await db
          .select()
          .from(payment)
          .where(inArray(payment.orderId, orderIds))
          .orderBy(desc(payment.createdAt))
      : [];

    const paymentMap = new Map<string, (typeof paymentRows)[0]>();
    for (const p of paymentRows) {
      if (p.orderId && !paymentMap.has(p.orderId)) {
        paymentMap.set(p.orderId, p);
      }
    }

    const orderData = await Promise.all(
      orders.map(async (orderRow) => {
        const [items, cancelRequests] = await Promise.all([
          db
            .select()
            .from(orderItem)
            .where(eq(orderItem.orderId, orderRow.id)),
          db
            .select()
            .from(cancelRequest)
            .where(and(eq(cancelRequest.orderId, orderRow.id), eq(cancelRequest.requestType, "cance_order"))),
        ]);

        const variantIds = items
          .map((item) => item.productVariantId)
          .filter((variantId): variantId is string => Boolean(variantId));

        const variants = variantIds.length
          ? await db
              .select({
                id: productVariant.id,
                productId: productVariant.productId,
                name: productVariant.name,
                image: productVariant.bannerImage,
                price: productVariant.price,
                sku: productVariant.sku,
              })
              .from(productVariant)
              .where(inArray(productVariant.id, variantIds))
          : [];
        const productIds = variants.map((variant) => variant.productId);
        const variantProductMap = new Map(
          variants.map((variant) => [variant.id, variant.productId]),
        );
        const variantMap = new Map(variants.map((v) => [v.id, v]));

        const productsList = productIds.length
          ? await db
              .select({
                id: product.id,
                name: product.name,
                slug: product.slug,
                bannerImage: product.bannerImage,
              })
              .from(product)
              .where(inArray(product.id, productIds))
          : [];
        const productMap = new Map(productsList.map((p) => [p.id, p]));

        const [returnRequests, reviews] = items.length
          ? await Promise.all([
            db
              .select()
              .from(returnRequest)
              .where(eq(returnRequest.orderId, orderRow.id)),
            productIds.length
              ? db
                  .select()
                  .from(review)
                  .where(and(eq(review.userId, userId), inArray(review.productId, productIds)))
              : Promise.resolve([]),
          ])
        : [[], []];

        const returnRequestRow = returnRequests[0] ?? null;
        const reviewMap = new Map(reviews.map((review) => [review.productId, review]));

        const linkedPayment = paymentMap.get(orderRow.id);
        const isUnpaid =
          orderRow.status === "pending" &&
          linkedPayment?.paymentStatus !== "success";

        const mappedItems =
          items.length > 0
            ? items.map((item) => {
                const v = item.productVariantId ? variantMap.get(item.productVariantId) : null;
                const prod = v?.productId ? productMap.get(v.productId) : null;

                const isYatraKit = Boolean(
                  item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit",
                );
                const fallbackName = isYatraKit
                  ? "Looway Yatra Kit"
                  : item.mixBoxRecipe
                    ? "Mix Your Box"
                    : prod?.name
                      ? (v?.name && v.name !== prod.name ? `${prod.name} (${v.name})` : prod.name)
                      : v?.name || "Ovy Organic Cotton Sanitary Pads";
                const fallbackImage = isYatraKit
                  ? "/looway/yatra-kit-thumb-v2.png"
                  : v?.image || prod?.bannerImage || "/product.png";

                return {
                  ...item,
                  productId: v?.productId ?? null,
                  productName: item.productVarientName || prod?.name || fallbackName,
                  productSlug: item.productVarientSlug || prod?.slug || "",
                  productImage: item.productVarientImage || prod?.bannerImage || fallbackImage,
                  productSKU: item.productVarientSKU || v?.sku || "",
                  productPrice: item.productVarientPrice || v?.price || 0,
                  variant: v ?? null,
                  product: prod ?? null,
                  returnRequest:
                    returnRequests.find(
                      (r) =>
                        r.userReason &&
                        r.userReason.includes(`[Product: ${item.productName || prod?.name || fallbackName}]`),
                    ) || returnRequestRow,
                  review: item.productVariantId
                    ? reviewMap.get(variantProductMap.get(item.productVariantId) ?? "") ?? null
                    : null,
                };
              })
            : [
                {
                  id: `fallback-${orderRow.id}`,
                  quantity: 1,
                  productName: "Ovy Organic Cotton Sanitary Pads",
                  productSlug: "",
                  productImage: "/product.png",
                  productSKU: "OVY-PADS",
                  productPrice: orderRow.totalAmount || 0,
                  returnRequest: null,
                  review: null,
                },
              ];

        return {
          ...orderRow,
          isUnpaid,
          payment: linkedPayment ?? null,
          paymentStatus:
            linkedPayment?.paymentStatus ??
            (orderRow.status === "paid" ? "success" : "pending"),
          cancelRequest: cancelRequests[0] ?? null,
          returnRequest: returnRequestRow,
          returnRequests: returnRequests ?? [],
          order_items: mappedItems,
          items: mappedItems,
        };
      }),
    );

    const subscriptionRows = await db
      .select({
        subscription: subscriptions,
        gatewaySubscription: paymentGatewaySubscription,
        plan: paymentGatewayPlans,
        product: product,
        variant: productVariant,
      })
      .from(subscriptions)
      .leftJoin(
        paymentGatewaySubscription,
        eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
      )
      .leftJoin(
        paymentGatewayPlans,
        eq(paymentGatewaySubscription.planId, paymentGatewayPlans.gatewayPlanId),
      )
      .leftJoin(product, eq(subscriptions.productId, product.id))
      .leftJoin(productVariant, eq(subscriptions.productVariantId, productVariant.id))
      .where(eq(subscriptions.userId, userId));

    const existingOrderIds = new Set(orderData.map((item) => item.id));
    const subscriptionOnlyOrders = subscriptionRows
      .filter(
        (row) =>
          (row.subscription.isActive || row.subscription.orderId) &&
          (!row.subscription.orderId ||
            !existingOrderIds.has(row.subscription.orderId)),
      )
      .map((row) => {
        const amount =
          row.plan?.price != null
            ? Math.round(Number(row.plan.price) / 100)
            : Number(row.variant?.price ?? 0);
        const quantity = row.gatewaySubscription?.quantity ?? 1;

        return {
          id: row.subscription.orderId ?? `subscription-${row.subscription.id}`,
          userId,
          status: row.subscription.isActive ? ORDER_STATUS.PAID : ORDER_STATUS.CANCELED,
          addressLine1: null,
          addressLine2: null,
          city: null,
          state: null,
          pincode: null,
          totalAmount: amount,
          createdAt: row.subscription.chargeDate ?? row.subscription.startDate,
          updatedAt: row.subscription.chargeDate ?? row.subscription.startDate,
          isSubscriptionOnly: true,
          subscriptionId: row.subscription.id,
          cancelRequest: null,
          order_items: [
            {
              id: `subscription-item-${row.subscription.id}`,
              orderId: row.subscription.orderId,
              productVariantId: row.subscription.productVariantId,
              quantity,
              productName: row.variant?.name ?? row.product?.name ?? "Subscription",
              productSlug: row.product?.slug ?? null,
              productImage: row.variant?.bannerImage ?? row.product?.bannerImage ?? null,
              productSKU: row.variant?.sku ?? null,
              productPrice: quantity > 0 ? Math.round(amount / quantity) : amount,
              returnRequest: null,
              review: null,
            },
          ],
        };
      });

    return [...orderData, ...subscriptionOnlyOrders].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    );
  } catch (error) {
    if ((error as Error)?.message === "UNAUTHORIZED") {
      throw error;
    }

    console.error(error);
    return [];
  }
}

const SIZE_ONLY_SET = new Set(["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XL+"]);

function enrichOrderItems(rawItems: any[], orderTotal: number, linkedSubs: any[] = []) {
  let items = rawItems;

  if (items.length === 0 && linkedSubs.length > 0) {
    items = linkedSubs.map((s, idx) => ({
      id: `sub-item-${s.subscription.id}-${idx}`,
      productVariantId: s.subscription.productVariantId,
      quantity: 1,
      productName: s.product?.name ?? s.variant?.name ?? "Subscription",
      productVarientName: s.variant?.name ?? "Subscription",
      productSlug: s.product?.slug ?? null,
      productImage: s.variant?.bannerImage ?? s.product?.bannerImage ?? "/product.png",
      productSKU: s.variant?.sku ?? null,
      productPrice: orderTotal,
      variant: s.variant ?? null,
      product: s.product ?? null,
    }));
  }

  if (items.length === 0) {
    items = [
      {
        id: `fallback-item`,
        productVariantId: null,
        quantity: 1,
        productName: "Potent Hygiene Essentials",
        productVarientName: null,
        productSlug: null,
        productImage: "/product.png",
        productSKU: null,
        productPrice: orderTotal,
        variant: null,
        product: null,
      },
    ];
  }

  return items.map((it) => {
    const rawVar = (it.productVarientName || it.variant?.name || "").trim();
    const isSize = SIZE_ONLY_SET.has(rawVar.toUpperCase());

    let resolvedProductName = it.product?.name || it.productName;
    if (!resolvedProductName || SIZE_ONLY_SET.has(resolvedProductName.trim().toUpperCase())) {
      if (isSize) {
        resolvedProductName = "Ovy Organic Cotton Sanitary Pads";
      } else if (rawVar) {
        resolvedProductName = rawVar;
      } else {
        resolvedProductName = "Potent Hygiene Essentials";
      }
    }

    let resolvedVariantName = null;
    if (isSize) {
      resolvedVariantName = rawVar.toUpperCase();
    } else if (it.variant?.name && it.variant.name !== resolvedProductName) {
      resolvedVariantName = it.variant.name;
    } else if (
      rawVar &&
      rawVar !== resolvedProductName &&
      !rawVar.toLowerCase().includes("box") &&
      !rawVar.toLowerCase().includes("yatra")
    ) {
      resolvedVariantName = rawVar;
    }

    return {
      ...it,
      productName: resolvedProductName,
      variantName: resolvedVariantName,
      productImage:
        it.productImage ||
        it.productVarientImage ||
        it.variant?.bannerImage ||
        it.product?.bannerImage ||
        "/product.png",
    };
  });
}

export async function getOrderById(orderId: string) {
  const rows = await db
    .select({
      order: order,
      item: orderItem,
      variant: productVariant,
      product: product,
      payment: payment,
    })
    .from(order)
    .leftJoin(orderItem, eq(order.id, orderItem.orderId))
    .leftJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
    .leftJoin(product, eq(productVariant.productId, product.id))
    .leftJoin(payment, eq(order.id, payment.orderId))
    .where(eq(order.id, orderId));

  if (!rows.length) return null;

  const orderData = rows[0].order;
  const paymentData = rows[0].payment ?? null;

  const rawItems = rows
    .filter((r) => r.item)
    .map((r) => ({
      ...r.item,
      productName: r.item.productVarientName,
      productSlug: r.item.productVarientSlug,
      productImage: r.item.productVarientImage,
      productSKU: r.item.productVarientSKU,
      productPrice: r.item.productVarientPrice,
      variant: r.variant ?? null,
      product: r.product ?? null,
    }));

  const linkedSubs = await db
    .select({
      subscription: subscriptions,
      product: product,
      variant: productVariant,
    })
    .from(subscriptions)
    .leftJoin(product, eq(subscriptions.productId, product.id))
    .leftJoin(productVariant, eq(subscriptions.productVariantId, productVariant.id))
    .where(eq(subscriptions.orderId, orderId));

  const items = enrichOrderItems(rawItems, orderData.totalAmount || 0, linkedSubs);

  const [userRecord] = orderData.userId
    ? await db
        .select({ name: users.name, phone: users.phone, email: users.email })
        .from(users)
        .where(eq(users.id, orderData.userId))
        .limit(1)
    : [null];

  const [cancelAction, returnRequests] = await Promise.all([
    db
      .select()
      .from(orderAction)
      .where(
        and(
          eq(orderAction.orderId, orderId),
          eq(orderAction.requestType, "cance_order"),
        ),
      )
      .limit(1)
      .then((rows) => rows[0] ?? null),
    db
      .select()
      .from(orderAction)
      .where(
        and(
          eq(orderAction.orderId, orderId),
          eq(orderAction.requestType, "return_order"),
        ),
      ),
  ]);

  const meta = (typeof paymentData?.paymentMeta === "object" ? paymentData.paymentMeta : {}) as any;
  const subtotal = Number(
    meta?.subtotal ??
      items.reduce(
        (acc, it) => acc + Number(it.productPrice || 0) * Number(it.quantity || 1),
        0,
      ) ??
      orderData.totalAmount,
  );
  const shipping = Number(
    meta?.shipping ?? (orderData.totalAmount > subtotal ? orderData.totalAmount - subtotal : 0),
  );
  const discount = Number(
    meta?.discount ??
      (subtotal + shipping > orderData.totalAmount
        ? subtotal + shipping - orderData.totalAmount
        : 0),
  );

  return {
    ...orderData,
    items,
    payment: paymentData,
    customerName: meta?.shippingAddress?.fullName ?? userRecord?.name ?? "Customer",
    customerPhone: meta?.shippingAddress?.phone ?? userRecord?.phone ?? null,
    customerEmail: meta?.shippingAddress?.email ?? userRecord?.email ?? null,
    cancelRequest: cancelAction ?? null,
    returnRequest: returnRequests[0] ?? null,
    returnRequests: returnRequests ?? [],
    pricingBreakdown: {
      subtotal,
      shipping,
      discount,
      coupon: meta?.coupon ?? null,
      rewardsUsed: Number(meta?.rewardsUsed ?? 0),
      total: orderData.totalAmount,
    },
  };
}

export async function getOrderConfirmationById(orderId: string) {
  const { userId } = await requireUserWithRefresh();

  // Support for subscription-only orders
  if (String(orderId).startsWith("subscription-")) {
    const rawSubId = String(orderId).replace("subscription-", "");
    const subRows = await db
      .select({
        subscription: subscriptions,
        gatewaySubscription: paymentGatewaySubscription,
        plan: paymentGatewayPlans,
        product: product,
        variant: productVariant,
        user: users,
      })
      .from(subscriptions)
      .leftJoin(
        paymentGatewaySubscription,
        eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
      )
      .leftJoin(
        paymentGatewayPlans,
        eq(paymentGatewaySubscription.planId, paymentGatewayPlans.gatewayPlanId),
      )
      .leftJoin(product, eq(subscriptions.productId, product.id))
      .leftJoin(productVariant, eq(subscriptions.productVariantId, productVariant.id))
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(and(eq(subscriptions.id, rawSubId), eq(subscriptions.userId, userId)));

    if (!subRows.length) return null;

    const row = subRows[0];
    const amount =
      row.plan?.price != null
        ? Math.round(Number(row.plan.price) / 100)
        : Number(row.variant?.price ?? 0);
    const quantity = row.gatewaySubscription?.quantity ?? 1;

    const item = {
      id: `subscription-item-${row.subscription.id}`,
      productVariantId: row.subscription.productVariantId,
      quantity,
      productName: row.product?.name ?? "Subscription",
      variantName: row.variant?.name ?? null,
      productSlug: row.product?.slug ?? null,
      productImage: row.variant?.bannerImage ?? row.product?.bannerImage ?? "/product.png",
      productSKU: row.variant?.sku ?? null,
      productPrice: quantity > 0 ? Math.round(amount / quantity) : amount,
    };

    return {
      id: orderId,
      userId,
      status: row.subscription.isActive ? ORDER_STATUS.PAID : ORDER_STATUS.CANCELED,
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      pincode: null,
      totalAmount: amount,
      createdAt: row.subscription.chargeDate ?? row.subscription.startDate,
      updatedAt: row.subscription.chargeDate ?? row.subscription.startDate,
      isSubscriptionOnly: true,
      subscriptionId: row.subscription.id,
      items: [item],
      payment: {
        gatewayPaymentId: row.gatewaySubscription?.gatewaySubscriptionId ?? "Subscription",
        modeOfPayment: "Subscription",
        paymentStatus: row.subscription.isActive ? "success" : "cancelled",
        amount,
      },
      customerName: row.user?.name ?? "Customer",
      customerPhone: row.user?.phone ?? null,
      customerEmail: row.user?.email ?? null,
      cancelRequest: null,
      pricingBreakdown: {
        subtotal: amount,
        shipping: 0,
        discount: 0,
        coupon: null,
        total: amount,
      },
      gatewayConfirmation: {
        confirmed: Boolean(row.subscription.isActive),
        gatewayPayment: null,
        gatewaySubscription: row.gatewaySubscription,
        message: row.subscription.isActive ? "Subscription active" : "Subscription cancelled",
      },
    };
  }

  const rows = await db
    .select({
      order: order,
      item: orderItem,
      variant: productVariant,
      product: product,
      payment: payment,
    })
    .from(order)
    .leftJoin(orderItem, eq(order.id, orderItem.orderId))
    .leftJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
    .leftJoin(product, eq(productVariant.productId, product.id))
    .leftJoin(payment, eq(order.id, payment.orderId))
    .where(and(eq(order.id, orderId), eq(order.userId, userId)));

  if (!rows.length) return null;

  const orderData = rows[0].order;
  const paymentData = rows[0].payment ?? null;

  const rawItems = rows
    .filter((r) => r.item)
    .map((r) => ({
      ...r.item,
      productName: r.item.productVarientName,
      productSlug: r.item.productVarientSlug,
      productImage: r.item.productVarientImage,
      productSKU: r.item.productVarientSKU,
      productPrice: r.item.productVarientPrice,
      variant: r.variant ?? null,
      product: r.product ?? null,
    }));

  const linkedSubs = await db
    .select({
      subscription: subscriptions,
      product: product,
      variant: productVariant,
    })
    .from(subscriptions)
    .leftJoin(product, eq(subscriptions.productId, product.id))
    .leftJoin(productVariant, eq(subscriptions.productVariantId, productVariant.id))
    .where(eq(subscriptions.orderId, orderId));

  const items = enrichOrderItems(rawItems, orderData.totalAmount || 0, linkedSubs);

  const [currentUser] = await db
    .select({ name: users.name, phone: users.phone, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const [cancelAction, returnAction] = await Promise.all([
    db
      .select()
      .from(orderAction)
      .where(
        and(
          eq(orderAction.orderId, orderId),
          eq(orderAction.requestType, "cance_order"),
        ),
      )
      .limit(1)
      .then((rows) => rows[0] ?? null),
    db
      .select()
      .from(orderAction)
      .where(
        and(
          eq(orderAction.orderId, orderId),
          eq(orderAction.requestType, "return_order"),
        ),
      )
      .limit(1)
      .then((rows) => rows[0] ?? null),
  ]);

  const meta = (typeof paymentData?.paymentMeta === "object" ? paymentData.paymentMeta : {}) as any;
  const subtotal = Number(
    meta?.subtotal ??
      items.reduce(
        (acc, it) => acc + Number(it.productPrice || 0) * Number(it.quantity || 1),
        0,
      ) ??
      orderData.totalAmount,
  );
  const shipping = Number(
    meta?.shipping ?? (orderData.totalAmount > subtotal ? orderData.totalAmount - subtotal : 0),
  );
  const discount = Number(
    meta?.discount ??
      (subtotal + shipping > orderData.totalAmount
        ? subtotal + shipping - orderData.totalAmount
        : 0),
  );

  const isPaid =
    orderData.status === "paid" ||
    orderData.status === "processing" ||
    orderData.status === "packed" ||
    orderData.status === "shipped" ||
    orderData.status === "delivered" ||
    orderData.status === "completed" ||
    paymentData?.paymentStatus === "success";

  const gatewayConfirmation = {
    confirmed: isPaid,
    gatewayPayment: null,
    gatewaySubscription: null,
    message: isPaid ? "Payment confirmed" : "Payment pending",
  };

  return {
    ...orderData,
    status: orderData.status,
    items,
    payment: paymentData,
    customerName: meta?.shippingAddress?.fullName ?? currentUser?.name ?? "Customer",
    customerPhone: meta?.shippingAddress?.phone ?? currentUser?.phone ?? null,
    customerEmail: meta?.shippingAddress?.email ?? currentUser?.email ?? null,
    cancelRequest: cancelAction ?? null,
    returnRequest: returnAction ?? null,
    pricingBreakdown: {
      subtotal,
      shipping,
      discount,
      coupon: meta?.coupon ?? null,
      rewardsUsed: Number(meta?.rewardsUsed ?? 0),
      total: orderData.totalAmount,
    },
    gatewayConfirmation,
  };
}
