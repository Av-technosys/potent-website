// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { db } from "@/db";
import { order, orderItem, review, users, product, productVariant } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUserWithRefresh } from "../user/action";
import { ORDER_STATUS } from "@/const/globalconst";

export async function createReview(reviewData: any) {
  try {
    const { userId } = await requireUserWithRefresh();
    const { productVarientId, orderItemId, rating, message } = reviewData;


    if (!productVarientId) {
      throw new Error("Product  ID is required for review submission");
    }
    if (!orderItemId) {
      throw new Error("Order item ID is required for review submission");
    }

    await db.transaction(async (tx) => {
      const [deliveredItem] = await tx
        .select({
          orderId: order.id,
          orderStatus: order.status,
          productId: productVariant.productId,
        })
        .from(orderItem)
        .innerJoin(order, eq(orderItem.orderId, order.id))
        .innerJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
        .where(
          and(
            eq(orderItem.id, orderItemId),
            eq(orderItem.productVariantId, productVarientId),
            eq(order.userId, userId),
          ),
        )
        .limit(1);

      if (!deliveredItem || deliveredItem.orderStatus !== ORDER_STATUS.DELIVERED) {
        throw new Error("Review is allowed only after delivery");
      }

      const [existingReview] = await tx
        .select({ id: review.id })
        .from(review)
        .where(and(eq(review.userId, userId), eq(review.productId, deliveredItem.productId)))
        .limit(1);

      if (existingReview) {
        throw new Error("Review already submitted for this product");
      }

      const userInfo = await tx.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          name: true,
          email: true,
        },
      });

      const reviewId = await tx
        .insert(review)
        .values({
          userId,
          productId: deliveredItem.productId,
          name: userInfo?.name || "Guest User",
          rating: Number(rating),
          message,
        })
        .returning({ id: review.id });
    });

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/reviews");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Failed to create review:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create review",
    };
  }
}

export async function getProductReviews(slug: string | any) {
  try {
    const v = await db.query.product.findFirst({
      where: eq(product.slug, slug),
    });
    if (!v || !v.id) return [];
    const reviews = await db
      .select({
        id: review.id,
        rating: review.rating,
        userId: review.userId,
        name: review.name,
        email: users.email,
        message: review.message,
        productId: review.productId,
        createdAt: review.createdAt,
      })
      .from(review)
      .innerJoin(users, eq(review.userId, users.id))
      .where(
        and(
          eq(review.productId, v.id),
          eq(review.isAdminApproved, true),
        ),
      );

    return reviews.map((r) => ({ ...r, media: [] }));
  } catch (error) {
    return [];
  }
}

export async function toggleApproveReview(id: string) {
  try {
    if (!id) throw new Error("Review id missing");

    const [existingReview] = await db
      .select({
        id: review.id,
        rating: review.rating,
        productId: review.productId,
        isAdminApproved: review.isAdminApproved,
        productSlug: product.slug,
      })
      .from(review)
      .leftJoin(product, eq(review.productId, product.id))
      .where(eq(review.id, id))
      .limit(1);

    if (!existingReview) throw new Error("Review not found");

    await db.transaction(async (tx) => {
      await tx
        .update(review)
        .set({ isAdminApproved: true })
        .where(eq(review.id, id));

    });

    revalidatePath("/admin/reviews");
    if (existingReview.productSlug) {
      revalidatePath(`/product-detail/${existingReview.productSlug}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Toggle approve failed:", error);
    return { success: false, message: "Failed to update review status" };
  }
}

export async function rejectReview(id: string) {
  return deleteReview(id);
}

export async function deleteReview(id: string) {
  try {
    if (!id) throw new Error("Review id missing");

    const [existingReview] = await db
      .select({
        id: review.id,
        rating: review.rating,
        productId: review.productId,
        isAdminApproved: review.isAdminApproved,
        productSlug: product.slug,
      })
      .from(review)
      .leftJoin(product, eq(review.productId, product.id))
      .where(eq(review.id, id))
      .limit(1);

    if (!existingReview) throw new Error("Review not found");

    await db.transaction(async (tx) => {
      await tx.delete(review).where(eq(review.id, id));
    });

    revalidatePath("/admin/reviews");
    if (existingReview.productSlug) {
      revalidatePath(`/product-detail/${existingReview.productSlug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Delete review failed:", error);
    return { success: false, message: "Failed to delete review" };
  }
}

export async function getReviewStats() {
  try {
    const [data] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${review.isAdminApproved} = false)::int`,
      })
      .from(review);

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch review stats:", error);
    return { success: false };
  }
}

export async function getUserAllReviews() {
  try {
    const { userId } = await requireUserWithRefresh();

    //if (!userId) return [];
    const reviews = await db
      .select({
        id: review.id,
        rating: review.rating,
        userId: review.userId,
        name: review.name,
        email: users.email,
        message: review.message,
        productId: review.productId,
        isAdminApproved: review.isAdminApproved,
        createdAt: review.createdAt,
      })
      .from(review)
      .innerJoin(users, eq(review.userId, users.id))
      .where(eq(review.userId, userId));

    return reviews.map((r) => ({ ...r, media: [] }));
  } catch (error) { }
}
