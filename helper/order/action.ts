// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { paginate } from "@/lib/pagination";
import { and, or, sql, eq, desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { cart, cartItem, couponTransaction, orderAction, orderActionImage, paymentGatewayPlans, paymentGatewaySubscription, product, productVariant, review, rewardCoinsHistory, subscriptions } from "@/db/schema";
import { order, orderItem, payment, users } from "@/db/schema";
import { requireUserWithRefresh } from "../user/action";
import { calculateCheckoutPricingForUser } from "../checkout/action";
import { ORDER_STATUS, ORDER_STATUS_ITEMS } from "@/const/globalconst";
import { getImageKey } from "@/lib/imageUrl";
import { calculateMixBoxPricing, type MixBoxRecipe } from "@/lib/mixYourBox";
import {
  sendDeliveryConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendShippingConfirmationEmail,
  sendUserExperienceEmail,
} from "../emailTemplates/action";

const cancelRequest = orderAction;
const returnRequest = orderAction;
const returnRequestImage = orderActionImage;
const VALID_ORDER_STATUSES = ORDER_STATUS_ITEMS.map((item) => item.value);

export const fetchOrders = async ({
  page = 1,
  pageSize = 3,
  search = "",
  status = "",
}) => {
  const filters = [];

  if (search && search.trim() !== "") {
    filters.push(or(sql`${order.id}::text ILIKE ${`%${search}%`}`));
  }

  if (status && status.trim() !== "") {
    filters.push(eq(order.status, status));
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  return paginate({
    table: order,
    page,
    pageSize,
    where: whereClause,
    orderBy: desc(order.createdAt),
  });
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

    return {
      ...orderInfo[0],
      items,
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
    await sendOrderStatusMail(id, status);
  }

  return result[0];
};

export async function updateOrderStatus(id: string, status: string | any) {
  const updated = await changeOrderStatus(id, status);
  revalidatePath("/admin/order");
  revalidatePath(`/admin/order/${id}`);
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

    const [existing] = await db
      .select()
      .from(cancelRequest)
      .where(and(eq(cancelRequest.orderId, orderId), eq(cancelRequest.userId, userId), eq(cancelRequest.requestType, "cance_order")))
      .limit(1);

    if (existing) return { success: false, message: "Cancel request already submitted" };

    await db.insert(cancelRequest).values({
      orderId,
      userId,
      requestType: "cance_order",
      userReason,
    });

    revalidatePath("/dashboard/orders");
    revalidatePath("/admin/cancel-requests");
    return { success: true, message: "Cancel request submitted" };
  } catch (error) {
    console.error("createCancelRequest error:", error);
    return { success: false, message: "Failed to submit cancel request" };
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

    const cleanImages = imageUrls.map((imageUrl) => getImageKey(imageUrl)).filter(Boolean);
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
    const [updated] = await db
      .update(cancelRequest)
      .set({
        status,
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
    const [updated] = await db
      .update(returnRequest)
      .set({
        status,
        adminReason,
        updatedAt: new Date(),
      })
      .where(eq(returnRequest.id, requestId))
      .returning();

    if (!updated) return { success: false, message: "Return request not found" };

    if (status === "approved") {
      await changeOrderStatus(updated.orderId, ORDER_STATUS.RETURNED);
    }

    revalidatePath("/admin/return-requests");
    revalidatePath("/admin/order");
    revalidatePath("/dashboard/orders");
    return { success: true, message: `Return request ${status}` };
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
}: {
  userId: any;
  couponCode?: string;
  address: any;
  razorpayOrderId: string;
}) {
  try {
    const pricing = await calculateCheckoutPricingForUser({ userId, couponCode });

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
    const variants = uniqueVariantIds.length
      ? await db.select().from(productVariant).where(inArray(productVariant.id, uniqueVariantIds))
      : [];
    const variantMap = new Map(variants.map((v) => [v.id, v]));
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
        const mixPricing = item.mixBoxRecipe
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

        return {
          orderId,
          productVariantId: v?.id ?? null,
          quantity: item.quantity,
          mixBoxRecipe: item.mixBoxRecipe,
          totalPads: item.totalPads ?? mixPricing?.totalPads ?? null,
          boxCount: item.boxCount ?? mixPricing?.boxCount ?? null,
          freeLiners: item.freeLiners ?? mixPricing?.freeLiners ?? null,
          productVarientName: item.mixBoxRecipe ? `${p.name} Mix Box` : v?.name ?? p.name,
          productVarientSlug: p.slug,
          productVarientImage: v?.bannerImage ?? p.bannerImage ?? null,
          productVarientSKU: item.mixBoxRecipe ? "MIX-BOX" : v?.sku ?? null,
          productVarientPrice:
            item.mixBoxRecipe && mixPricing?.valid
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
          razorpayOrderId,
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
              .select({ id: productVariant.id, productId: productVariant.productId })
              .from(productVariant)
              .where(inArray(productVariant.id, variantIds))
          : [];
        const productIds = variants.map((variant) => variant.productId);
        const variantProductMap = new Map(
          variants.map((variant) => [variant.id, variant.productId]),
        );

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

        return {
          ...orderRow,
          cancelRequest: cancelRequests[0] ?? null,
          order_items: items.map((item) => ({
            ...item,
            productId: item.productVariantId
              ? variantProductMap.get(item.productVariantId) ?? null
              : null,
            productName: item.productVarientName,
            productSlug: item.productVarientSlug,
            productImage: item.productVarientImage,
            productSKU: item.productVarientSKU,
            productPrice: item.productVarientPrice,
            returnRequest: returnRequestRow,
            review: item.productVariantId
              ? reviewMap.get(variantProductMap.get(item.productVariantId) ?? "") ?? null
              : null,
          })),
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

  const items = rows
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

  const paymentData = rows[0].payment ?? null;

  return {
    ...orderData,
    items,
    payment: paymentData,
  };
}

export async function getOrderConfirmationById(orderId: string) {
  const { userId } = await requireUserWithRefresh();

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
  let gatewayConfirmation = {
    confirmed: paymentData?.paymentStatus === "success",
    gatewayPayment: null,
    gatewaySubscription: null,
    message: paymentData ? "Payment already recorded" : "No payment found",
  };

  const items = rows
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

  return {
    ...orderData,
    status: orderData.status,
    items,
    payment: paymentData,
    gatewayConfirmation,
  };
}
