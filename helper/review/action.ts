// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { db } from "@/db";
import { order, orderItem, review, users, product, productVariant } from "@/db/schema";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUserWithRefresh } from "../user/action";
import { ORDER_STATUS } from "@/const/globalconst";

import { syncAndGetUserRewards, REVIEW_REWARD_RUPEES } from "@/lib/rewards";
import { getImageUrl } from "@/lib/imageUrl";

export async function createReview(reviewData: any) {
  try {
    const { userId } = await requireUserWithRefresh();
    const { productVarientId, orderItemId, rating, message } = reviewData;

    if (!orderItemId && !productVarientId) {
      throw new Error("Product or order item ID is required for review submission");
    }

    await db.transaction(async (tx) => {
      let resolvedProductId: string | null = null;

      if (orderItemId) {
        const [itemRow] = await tx
          .select({
            orderId: order.id,
            orderStatus: order.status,
            productId: productVariant.productId,
            slug: orderItem.productVarientSlug,
          })
          .from(orderItem)
          .innerJoin(order, eq(orderItem.orderId, order.id))
          .leftJoin(
            productVariant,
            eq(orderItem.productVariantId, productVariant.id),
          )
          .where(and(eq(orderItem.id, orderItemId), eq(order.userId, userId)))
          .limit(1);

        if (!itemRow || itemRow.orderStatus === ORDER_STATUS.CANCELED) {
          throw new Error("Order item not found or order was cancelled");
        }

        resolvedProductId = itemRow.productId ?? null;
        if (!resolvedProductId && itemRow.slug) {
          const [prodBySlug] = await tx
            .select({ id: product.id })
            .from(product)
            .where(eq(product.slug, itemRow.slug))
            .limit(1);
          resolvedProductId = prodBySlug?.id ?? null;
        }
      }

      if (!resolvedProductId && productVarientId) {
        const [variantRow] = await tx
          .select({ productId: productVariant.productId })
          .from(productVariant)
          .where(eq(productVariant.id, productVarientId))
          .limit(1);
        resolvedProductId = variantRow?.productId ?? productVarientId;
      }

      if (!resolvedProductId) {
        throw new Error("Could not resolve product for this review");
      }

      const [existingReview] = await tx
        .select({ id: review.id })
        .from(review)
        .where(
          and(
            eq(review.userId, userId),
            eq(review.productId, resolvedProductId),
          ),
        )
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

      const rawMediaList = Array.isArray(reviewData.media)
        ? reviewData.media
        : reviewData.imageUrl
          ? [reviewData.imageUrl]
          : reviewData.fileKey
            ? [reviewData.fileKey]
            : reviewData.varient
              ? [reviewData.varient]
              : [];

      const normalizedMedia = rawMediaList
        .filter(Boolean)
        .map((m: any) => {
          const raw = typeof m === "string" ? m : m?.mediaURL ? m.mediaURL : String(m);
          return getImageUrl(raw);
        });

      const primaryImageUrl = normalizedMedia[0] || null;
      if (!primaryImageUrl) {
        throw new Error("Please attach at least 1 photo of the product to earn ₹50");
      }

      const mediaJson = normalizedMedia.length > 0 ? JSON.stringify(normalizedMedia) : null;

      await tx.insert(review).values({
        userId,
        productId: resolvedProductId,
        name: userInfo?.name || "Verified Buyer",
        rating: Number(rating),
        message,
        varient: mediaJson,
        imageUrl: primaryImageUrl,
        isAdminApproved: false,
      });
    });

    const synced = await syncAndGetUserRewards(userId);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/reviews");
    revalidatePath("/dashboard/security");
    revalidatePath("/admin/reviews");

    return {
      success: true,
      pendingApproval: true,
      rewardAdded: 0,
      balance: synced.balance,
      message:
        "Review submitted! ₹50 will be credited to your Rewards balance once approved by our team.",
    };
  } catch (error) {
    console.error("Failed to create review:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create review",
    };
  }
}

export async function getProductReviews(slug: string | any) {
  try {
    if (!slug) return [];

    let targetSlug = typeof slug === "string" ? slug.trim() : slug;
    if (targetSlug === "menstrual-cup") {
      targetSlug = "ovy-cup";
    }

    const v = await db.query.product.findFirst({
      where: or(eq(product.slug, targetSlug), eq(product.id, slug)),
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
        varient: review.varient,
        imageUrl: review.imageUrl,
        productId: review.productId,
        createdAt: review.createdAt,
      })
      .from(review)
      .leftJoin(users, eq(review.userId, users.id))
      .where(
        and(
          eq(review.productId, v.id),
          eq(review.isAdminApproved, true),
        ),
      )
      .orderBy(desc(review.createdAt));

    return reviews.map((r) => {
      let media: any[] = [];
      if (r.imageUrl) {
        media.push({ mediaURL: getImageUrl(r.imageUrl) });
      }
      if (r.varient) {
        try {
          const parsed = JSON.parse(r.varient);
          if (Array.isArray(parsed)) {
            parsed.forEach((m) => {
              const url = typeof m === "string" ? getImageUrl(m) : m?.mediaURL ? getImageUrl(m.mediaURL) : null;
              if (url && !media.some((item) => item.mediaURL === url)) {
                media.push({ mediaURL: url });
              }
            });
          } else if (typeof parsed === "string") {
            const url = getImageUrl(parsed);
            if (!media.some((item) => item.mediaURL === url)) {
              media.push({ mediaURL: url });
            }
          }
        } catch {
          const url = getImageUrl(r.varient);
          if (!media.some((item) => item.mediaURL === url)) {
            media.push({ mediaURL: url });
          }
        }
      }
      return { ...r, media };
    });
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
        userId: review.userId,
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

    if (existingReview.userId) {
      await syncAndGetUserRewards(existingReview.userId);
    }

    revalidatePath("/admin/reviews");
    revalidatePath("/menstrual-cup");
    revalidatePath("/looway-toilet-seat-covers");
    revalidatePath("/dashboard/reviews");
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
        userId: review.userId,
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

    if (existingReview.userId) {
      await syncAndGetUserRewards(existingReview.userId);
    }

    revalidatePath("/admin/reviews");
    revalidatePath("/menstrual-cup");
    revalidatePath("/looway-toilet-seat-covers");
    revalidatePath("/dashboard/reviews");
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

    const reviews = await db
      .select({
        id: review.id,
        rating: review.rating,
        userId: review.userId,
        name: review.name,
        email: users.email,
        message: review.message,
        varient: review.varient,
        imageUrl: review.imageUrl,
        productId: review.productId,
        productName: product.name,
        isAdminApproved: review.isAdminApproved,
        createdAt: review.createdAt,
      })
      .from(review)
      .innerJoin(users, eq(review.userId, users.id))
      .leftJoin(product, eq(review.productId, product.id))
      .where(eq(review.userId, userId));

    return reviews.map((r) => {
      let media: any[] = [];
      if (r.imageUrl) {
        media.push({ mediaURL: getImageUrl(r.imageUrl) });
      }
      if (r.varient) {
        try {
          const parsed = JSON.parse(r.varient);
          if (Array.isArray(parsed)) {
            parsed.forEach((m) => {
              const url = typeof m === "string" ? getImageUrl(m) : m?.mediaURL ? getImageUrl(m.mediaURL) : null;
              if (url && !media.some((item) => item.mediaURL === url)) {
                media.push({ mediaURL: url });
              }
            });
          } else if (typeof parsed === "string") {
            const url = getImageUrl(parsed);
            if (!media.some((item) => item.mediaURL === url)) {
              media.push({ mediaURL: url });
            }
          }
        } catch {
          const url = getImageUrl(r.varient);
          if (!media.some((item) => item.mediaURL === url)) {
            media.push({ mediaURL: url });
          }
        }
      }
      return { ...r, media };
    });
  } catch (error) {
    return [];
  }
}

export async function getReviewableProducts() {
  try {
    const { userId } = await requireUserWithRefresh();

    const existingReviews = await db
      .select({ productId: review.productId })
      .from(review)
      .where(eq(review.userId, userId));

    const reviewedProductIds = new Set(
      existingReviews.map((r) => r.productId).filter(Boolean),
    );

    const orderedItems = await db
      .select({
        orderId: order.id,
        orderStatus: order.status,
        orderCreatedAt: order.createdAt,
        orderItemId: orderItem.id,
        productName: orderItem.productName,
        productVariantId: orderItem.productVariantId,
        slug: orderItem.productVarientSlug,
        resolvedProductId: productVariant.productId,
      })
      .from(orderItem)
      .innerJoin(order, eq(orderItem.orderId, order.id))
      .leftJoin(
        productVariant,
        eq(orderItem.productVariantId, productVariant.id),
      )
      .where(eq(order.userId, userId));

    const seenProducts = new Set<string>();
    const results: Array<{
      id: string;
      productId: string;
      name: string;
      slug?: string;
      orderId: string;
      deliveredDate: string;
    }> = [];

    for (const item of orderedItems) {
      if (
        item.orderStatus !== ORDER_STATUS.DELIVERED &&
        item.orderStatus !== ORDER_STATUS.COMPLETED
      ) {
        continue;
      }

      let prodId = item.resolvedProductId ?? null;
      if (!prodId && item.slug) {
        const [prodBySlug] = await db
          .select({ id: product.id })
          .from(product)
          .where(eq(product.slug, item.slug))
          .limit(1);
        prodId = prodBySlug?.id ?? null;
      }

      const key = prodId || item.slug || item.productName;
      if (!key || seenProducts.has(key)) continue;
      if (prodId && reviewedProductIds.has(prodId)) continue;

      seenProducts.add(key);
      results.push({
        id: prodId || item.productVariantId || item.orderItemId,
        productId: prodId || "",
        name: item.productName,
        slug: item.slug || undefined,
        orderId: `#${String(item.orderId).slice(0, 8).toUpperCase()}`,
        deliveredDate: item.orderCreatedAt
          ? new Date(item.orderCreatedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
      });
    }

    return results;
  } catch (error) {
    return [];
  }
}

