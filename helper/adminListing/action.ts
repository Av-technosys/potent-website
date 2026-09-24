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
import { desc, eq, ilike, inArray, notInArray, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

  const whereClause = text
    ? or(
        sql`${cancelRequest.orderId}::text ILIKE ${`%${text}%`}`,
        ilike(users.name, `%${text}%`),
        ilike(users.email, `%${text}%`),
        ilike(cancelRequest.status, `%${text}%`),
      )
    : undefined;

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
    .leftJoin(users, eq(cancelRequest.userId, users.id))
    .where(whereClause)
    .orderBy(desc(cancelRequest.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cancelRequest)
    .leftJoin(order, eq(cancelRequest.orderId, order.id))
    .leftJoin(users, eq(cancelRequest.userId, users.id))
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

  const whereClause = text
    ? or(
        sql`${returnRequest.id}::text ILIKE ${`%${text}%`}`,
        sql`${returnRequest.orderId}::text ILIKE ${`%${text}%`}`,
        ilike(users.name, `%${text}%`),
        ilike(users.email, `%${text}%`),
        ilike(returnRequest.status, `%${text}%`),
      )
    : undefined;

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
      productName: sql<string | null>`null`,
      productSku: sql<string | null>`null`,
      productImage: sql<string | null>`null`,
      productPrice: sql<number | null>`null`,
      quantity: sql<number | null>`null`,
      customerName: users.name,
      customerEmail: users.email,
      customerPhone: users.phone,
    })
    .from(returnRequest)
    .leftJoin(order, eq(returnRequest.orderId, order.id))
    .leftJoin(users, eq(returnRequest.userId, users.id))
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

  const data = requests.map((request) => ({
    ...request,
    images: imageMap.get(request.id) ?? [],
  }));

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(returnRequest)
    .leftJoin(order, eq(returnRequest.orderId, order.id))
    .leftJoin(users, eq(returnRequest.userId, users.id))
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
    totalOrders: Number(totalOrders),
    totalProducts: Number(totalProducts),
    activeProducts: Number(activeProducts),
    totalUsers: Number(totalUsers),
    verifiedUsers: Number(verifiedUsers),
    totalRevenue: Number(totalRevenue),
    successfulPayments: Number(successfulPayments),
    pendingOrders: Number(pendingOrders),
  };
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
