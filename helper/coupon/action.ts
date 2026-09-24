/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { coupon, couponTransaction } from "@/db/schema";
import { db } from "@/lib/db";
import { paginate } from "@/lib/pagination";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface GetCouponsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

function normalizeCouponData(couponData: any) {
  const isDiscountPercentage = Boolean(couponData.isDiscountPercentage);

  return {
    name: String(couponData.name ?? "").trim(),
    description: couponData.description
      ? String(couponData.description).trim()
      : null,
    code: String(couponData.code ?? "")
      .trim()
      .toUpperCase(),
    isDiscountPercentage,
    discountPercentage: isDiscountPercentage
      ? Number(couponData.discountPercentage || 0)
      : null,
    discountFixedAmount: isDiscountPercentage
      ? null
      : Number(couponData.discountFixedAmount || 0),
    minimumOrderValue: Number(couponData.minimumOrderValue || 0),
    maximumDiscountAmount: Number(couponData.maximumDiscountAmount || 0),
    useOnce: Boolean(couponData.useOnce),
  };
}

function validateCouponData(data: ReturnType<typeof normalizeCouponData>) {
  if (!data.name) return "Coupon name is required";
  if (!data.code) return "Coupon code is required";

  if (data.isDiscountPercentage) {
    if (!data.discountPercentage || data.discountPercentage < 1) {
      return "Discount percentage must be at least 1";
    }

    if (data.discountPercentage > 100) {
      return "Discount percentage cannot be more than 100";
    }
  }

  if (!data.isDiscountPercentage) {
    if (!data.discountFixedAmount || data.discountFixedAmount < 1) {
      return "Fixed discount amount must be at least 1";
    }
  }

  if (data.minimumOrderValue < 0 || data.maximumDiscountAmount < 0) {
    return "Order and discount limits cannot be negative";
  }

  return null;
}

export async function createCoupon(couponData: any) {
  try {
    const data = normalizeCouponData(couponData);
    const validationError = validateCouponData(data);

    if (validationError) {
      return { success: false, message: validationError };
    }

    await db.insert(coupon).values(data);

    revalidatePath("/admin/coupon");
    return { success: true, message: "Coupon created successfully" };
  } catch (error: any) {
    console.error("Create coupon failed:", error);

    if (error?.code === "23505") {
      return { success: false, message: "Coupon code already exists" };
    }

    return { success: false, message: "Failed to create coupon" };
  }
}

export async function updateCoupon(couponData: any) {
  try {
    const data = normalizeCouponData(couponData);
    const validationError = validateCouponData(data);

    if (validationError) {
      return { success: false, message: validationError };
    }

    await db.update(coupon).set(data).where(eq(coupon.id, couponData.id));

    revalidatePath("/admin/coupon");
    revalidatePath(`/admin/coupon/${couponData.id}`);
    return { success: true, message: "Coupon updated successfully" };
  } catch (error: any) {
    console.error("Update coupon failed:", error);

    if (error?.code === "23505") {
      return { success: false, message: "Coupon code already exists" };
    }

    return { success: false, message: "Failed to update coupon" };
  }
}

export async function getCouponsPagination({
  page = 1,
  pageSize = 10,
  search = "",
}: GetCouponsOptions) {
  const filters = [];

  if (search.trim() !== "") {
    filters.push(
      or(ilike(coupon.name, `%${search}%`), ilike(coupon.code, `%${search}%`)),
    );
  }

  const result = await paginate({
    table: coupon,
    page,
    pageSize,
    where: filters.length ? and(...filters) : undefined,
    orderBy: desc(coupon.createdAt),
  });

  return {
    items: result.data,
    totalPages: result.meta.totalPages,
    page: result.meta.page,
  };
}

export async function getCouponById(id: string) {
  const result = await db.select().from(coupon).where(eq(coupon.id, id));
  return result[0] ?? null;
}

export async function deleteCoupon(id: string) {
  try {
    const usage = await db
      .select({ count: sql<number>`count(*)` })
      .from(couponTransaction)
      .where(eq(couponTransaction.couponId, id));

    if (Number(usage[0]?.count ?? 0) > 0) {
      return {
        success: false,
        message: "Cannot delete: this coupon has already been used",
      };
    }

    await db.delete(coupon).where(eq(coupon.id, id));

    revalidatePath("/admin/coupon");
    return { success: true, message: "Coupon deleted successfully" };
  } catch (error) {
    console.error("Delete coupon failed:", error);
    return {
      success: false,
      message: "Something went wrong while deleting coupon",
    };
  }
}
