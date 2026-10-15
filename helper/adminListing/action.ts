// @ts-nocheck
"use server";

import { db } from "@/lib/db";
import {
  category,
  contactUs,
  order,
  orderAction,
  orderActionImage,
  orderItem,
  payment,
  product,
  productVariant,
  users,
} from "@/db/schema";
import { and, desc, eq, ilike, inArray, notInArray, or, sql } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";

const cancelRequest = orderAction;
const returnRequest = orderAction;
const returnRequestImage = orderActionImage;

type ListingOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
};

function normalizePage(value = 1) {
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function normalizePageSize(value = 10) {
  return Number.isFinite(value) && value > 0 ? value : 10;
}

export async function fetchAdminUsers({
  page = 1,
  pageSize = 10,
  search = "",
}: ListingOptions) {
  const currentPage = normalizePage(page);
  const limit = normalizePageSize(pageSize);
  const offset = (currentPage - 1) * limit;
  const text = search.trim();

  const whereClause = text
    ? or(
        ilike(users.name, `%${text}%`),
        ilike(users.email, `%${text}%`),
        ilike(users.phone, `%${text}%`),
      )
    : undefined;

  const data = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      emailVerified: users.isEmailVerified,
      rewardOrderCoins: users.rewardOrderCoins,
      referralCoins: users.referralCoins,
      referralCode: users.referralCode,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(whereClause);

  const total = Number(count);

  return {
    data,
    meta: {
      page: currentPage,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function fetchAdminContactMessages({
  page = 1,
  pageSize = 10,
  search = "",
}: ListingOptions) {
  const currentPage = normalizePage(page);
  const limit = normalizePageSize(pageSize);
  const offset = (currentPage - 1) * limit;
  const text = search.trim();

  const whereClause = text
    ? or(
        ilike(contactUs.name, `%${text}%`),
        ilike(contactUs.email, `%${text}%`),
        ilike(contactUs.phone, `%${text}%`),
        ilike(contactUs.message, `%${text}%`),
      )
    : undefined;

  const data = await db
    .select({
      id: contactUs.id,
      name: contactUs.name,
      email: contactUs.email,
      number: contactUs.phone,
      message: contactUs.message,
      createdAt: contactUs.createdAt,
    })
    .from(contactUs)
    .where(whereClause)
    .orderBy(desc(contactUs.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(contactUs)
    .where(whereClause);

  const total = Number(count);

  return {
    data,
    meta: {
      page: currentPage,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function fetchAdminPayments({
  page = 1,
  pageSize = 10,
  search = "",
}: ListingOptions) {
  const currentPage = normalizePage(page);
  const limit = normalizePageSize(pageSize);
  const offset = (currentPage - 1) * limit;
  const text = search.trim();

  const whereClause = text
    ? or(
        ilike(payment.gatewayPaymentId, `%${text}%`),
        ilike(payment.gatewayOrderId, `%${text}%`),
        sql`${payment.orderId}::text ILIKE ${`%${text}%`}`,
        ilike(users.name, `%${text}%`),
        ilike(users.email, `%${text}%`),
      )
    : undefined;

  const data = await db
    .select({
      id: payment.id,
      orderId: payment.orderId,
      paymentId: payment.gatewayPaymentId,
      paymentStatus: payment.paymentStatus,
      paymentMethod: payment.modeOfPayment,
      paymentAmount: payment.amount,
      paymentOrderId: payment.gatewayOrderId,
      createdAt: payment.createdAt,
      orderStatus: order.status,
      customerName: users.name,
      customerEmail: users.email,
    })
    .from(payment)
    .leftJoin(order, eq(payment.orderId, order.id))
    .leftJoin(users, eq(order.userId, users.id))
    .where(whereClause)
    .orderBy(desc(payment.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(payment)
    .leftJoin(order, eq(payment.orderId, order.id))
    .leftJoin(users, eq(order.userId, users.id))
    .where(whereClause);

  const total = Number(count);

  return {
    data,
    meta: {
      page: currentPage,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function fetchAdminFeaturedProducts({
  page = 1,
  pageSize = 10,
  search = "",
}: ListingOptions) {
  return {
    data: [],
    meta: {
      page: normalizePage(page),
      pageSize: normalizePageSize(pageSize),
      total: 0,
      totalPages: 0,
    },
  };
}

export async function fetchAdminFeaturedCategories({
  page = 1,
  pageSize = 10,
  search = "",
}: ListingOptions) {
  return {
    data: [],
    meta: {
      page: normalizePage(page),
      pageSize: normalizePageSize(pageSize),
      total: 0,
      totalPages: 0,
    },
  };
}

export async function fetchAdminCancelRequests({
  page = 1,
  pageSize = 10,
  search = "",
}: ListingOptions) {
  const currentPage = normalizePage(page);
  const limit = normalizePageSize(pageSize);
  const offset = (currentPage - 1) * limit;
  const text = search.trim();

  const filters = [eq(cancelRequest.requestType, "cance_order")];

  if (text) {
    filters.push(
      or(
        sql`${cancelRequest.orderId}::text ILIKE ${`%${text}%`}`,
        ilike(users.name, `%${text}%`),
        ilike(users.email, `%${text}%`),
        sql`${cancelRequest.status}::text ILIKE ${`%${text}%`}`,
        sql`${cancelRequest.userReason}::text ILIKE ${`%${text}%`}`,
      ),
    );
  }

  const whereClause = and(...filters);

  const data = await db
    .select({
      id: cancelRequest.id,
      orderId: cancelRequest.orderId,
      userId: cancelRequest.userId,
      userReason: cancelRequest.userReason,
      adminReason: cancelRequest.adminReason,
      status: cancelRequest.status,
      createdAt: cancelRequest.createdAt,
      orderStatus: order.status,
      totalAmount: order.totalAmount,
      customerName: users.name,
      customerEmail: users.email,
      customerPhone: users.phone,
    })
    .from(cancelRequest)
    .leftJoin(order, eq(cancelRequest.orderId, order.id))
    .leftJoin(users, eq(sql`COALESCE(${cancelRequest.userId}, ${order.userId})`, users.id))
    .where(whereClause)
    .orderBy(desc(cancelRequest.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cancelRequest)
    .leftJoin(order, eq(cancelRequest.orderId, order.id))
    .leftJoin(users, eq(sql`COALESCE(${cancelRequest.userId}, ${order.userId})`, users.id))
    .where(whereClause);

  const total = Number(count);

  return {
    data,
    meta: {
      page: currentPage,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function fetchAdminReturnRequests({
  page = 1,
  pageSize = 10,
  search = "",
}: ListingOptions) {
  const currentPage = normalizePage(page);
  const limit = normalizePageSize(pageSize);
  const offset = (currentPage - 1) * limit;
  const text = search.trim();

  const filters = [eq(returnRequest.requestType, "return_order")];

  if (text) {
    filters.push(
      or(
        sql`${returnRequest.id}::text ILIKE ${`%${text}%`}`,
        sql`${returnRequest.orderId}::text ILIKE ${`%${text}%`}`,
        ilike(users.name, `%${text}%`),
        ilike(users.email, `%${text}%`),
        sql`${returnRequest.status}::text ILIKE ${`%${text}%`}`,
        sql`${returnRequest.userReason}::text ILIKE ${`%${text}%`}`,
      ),
    );
  }

  const whereClause = and(...filters);

  const requests = await db
    .select({
      id: returnRequest.id,
      orderItemId: sql<string | null>`null`,
      orderId: returnRequest.orderId,
      userId: returnRequest.userId,
      reason: returnRequest.userReason,
      adminReason: returnRequest.adminReason,
      status: returnRequest.status,
      createdAt: returnRequest.createdAt,
      orderStatus: order.status,
      totalAmount: order.totalAmount,
      customerName: users.name,
      customerEmail: users.email,
      customerPhone: users.phone,
    })
    .from(returnRequest)
    .leftJoin(order, eq(returnRequest.orderId, order.id))
    .leftJoin(users, eq(sql`COALESCE(${returnRequest.userId}, ${order.userId})`, users.id))
    .where(whereClause)
    .orderBy(desc(returnRequest.createdAt))
    .limit(limit)
    .offset(offset);

  const requestIds = requests.map((request) => request.id);
  const images = requestIds.length
    ? await db
        .select({
          id: returnRequestImage.id,
          returnRequestId: returnRequestImage.orderActionId,
          imageUrl: returnRequestImage.imageUrl,
        })
        .from(returnRequestImage)
        .where(inArray(returnRequestImage.orderActionId, requestIds))
    : [];

  const imageMap = new Map<string, { id: string; imageUrl: string }[]>();

  images.forEach((image) => {
    const list = imageMap.get(image.returnRequestId) ?? [];
    list.push({ id: image.id, imageUrl: image.imageUrl });
    imageMap.set(image.returnRequestId, list);
  });

  // Fetch product items associated with these orders
  const orderIds = Array.from(
    new Set(requests.map((r) => r.orderId).filter(Boolean)),
  ) as string[];

  const orderItemsList = orderIds.length
    ? await db
        .select({
          id: orderItem.id,
          orderId: orderItem.orderId,
          name: orderItem.productVarientName,
          sku: orderItem.productVarientSKU,
          image: orderItem.productVarientImage,
          price: orderItem.productVarientPrice,
          quantity: orderItem.quantity,
        })
        .from(orderItem)
        .where(inArray(orderItem.orderId, orderIds))
    : [];

  const orderItemMap = new Map<string, typeof orderItemsList>();
  orderItemsList.forEach((it) => {
    if (!it.orderId) return;
    const list = orderItemMap.get(it.orderId) ?? [];
    list.push(it);
    orderItemMap.set(it.orderId, list);
  });

  const data = requests.map((request) => {
    const itemsForOrder = orderItemMap.get(request.orderId || "") || [];
    const firstItem = itemsForOrder[0];

    // Extract product name from userReason tag like "[Product: XYZ]: ..." if present
    let extractedProductName: string | null = null;
    const match = request.reason ? request.reason.match(/^\[Product:\s*([^\]]+)\]/i) : null;
    if (match && match[1]) {
      extractedProductName = match[1].trim();
    }

    const matchedItem = extractedProductName
      ? itemsForOrder.find(
          (it) => it.name && it.name.toLowerCase().includes(extractedProductName!.toLowerCase()),
        )
      : null;

    const displayItem = matchedItem || firstItem;
    const allProductNames = itemsForOrder.map((it) => it.name).filter(Boolean).join(", ");

    return {
      ...request,
      productName: extractedProductName || (itemsForOrder.length > 1 ? allProductNames : displayItem?.name) || "Order Products",
      productSku: displayItem?.sku || (itemsForOrder.length > 1 ? `${itemsForOrder.length} products` : "-"),
      productImage: displayItem?.image || null,
      productPrice: displayItem?.price || request.totalAmount || null,
      quantity: itemsForOrder.reduce((sum, it) => sum + (it.quantity || 1), 0) || 1,
      images: imageMap.get(request.id) ?? [],
    };
  });

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(returnRequest)
    .leftJoin(order, eq(returnRequest.orderId, order.id))
    .leftJoin(users, eq(sql`COALESCE(${returnRequest.userId}, ${order.userId})`, users.id))
    .where(whereClause);

  const total = Number(count);

  return {
    data,
    meta: {
      page: currentPage,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function fetchAdminDashboardStats() {
  try {
    const [
      [{ totalOrders }],
      [{ totalProducts }],
      [{ activeProducts }],
      [{ totalUsers }],
      [{ verifiedUsers }],
      [{ totalRevenue }],
      [{ successfulPayments }],
      [{ pendingOrders }],
    ] = await Promise.all([
      db.select({ totalOrders: sql<number>`count(*)` }).from(order),
      db.select({ totalProducts: sql<number>`count(*)` }).from(product),
      db
        .select({ activeProducts: sql<number>`count(*)` })
        .from(productVariant)
        .where(eq(productVariant.isInStock, true)),
      db.select({ totalUsers: sql<number>`count(*)` }).from(users),
      db
        .select({ verifiedUsers: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.isEmailVerified, true)),
      db
        .select({
          totalRevenue: sql<number>`coalesce(sum(${payment.amount}), 0)`,
        })
        .from(payment)
        .where(eq(payment.paymentStatus, "success")),
      db
        .select({ successfulPayments: sql<number>`count(*)` })
        .from(payment)
        .where(eq(payment.paymentStatus, "success")),
      db
        .select({ pendingOrders: sql<number>`count(*)` })
        .from(order)
        .where(eq(order.status, "pending")),
    ]);

    return {
      totalOrders: Number(totalOrders || 0),
      totalProducts: Number(totalProducts || 0),
      activeProducts: Number(activeProducts || 0),
      totalUsers: Number(totalUsers || 0),
      verifiedUsers: Number(verifiedUsers || 0),
      totalRevenue: Number(totalRevenue || 0),
      successfulPayments: Number(successfulPayments || 0),
      pendingOrders: Number(pendingOrders || 0),
    };
  } catch (error) {
    console.error("fetchAdminDashboardStats error:", error);
    return {
      totalOrders: 0,
      totalProducts: 0,
      activeProducts: 0,
      totalUsers: 0,
      verifiedUsers: 0,
      totalRevenue: 0,
      successfulPayments: 0,
      pendingOrders: 0,
    };
  }
}

export async function fetchFeaturedProductOptions() {
  return db
    .select({
      value: product.id,
      label: product.name,
      sku: sql<string>`coalesce(${productVariant.sku}, '')`,
    })
    .from(product)
    .leftJoin(productVariant, eq(product.id, productVariant.productId))
    .orderBy(product.name);
}

export async function fetchFeaturedCategoryOptions() {
  return db
    .select({
      value: category.id,
      label: category.name,
      slug: category.slug,
    })
    .from(category)
    .orderBy(category.name);
}

export async function addFeaturedProduct(productId: string) {
  return { success: false, message: "Featured products are not available in the current schema" };
}

export async function removeFeaturedProduct(id: string) {
  return { success: false, message: "Featured products are not available in the current schema" };
}

export async function addFeaturedCategory(categoryId: string) {
  return { success: false, message: "Featured categories are not available in the current schema" };
}

export async function removeFeaturedCategory(id: string) {
  return { success: false, message: "Featured categories are not available in the current schema" };
}
