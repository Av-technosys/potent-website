import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { product, review, users } from "@/src/db/schema";
import { getCurrentUser } from "@/helper/user/action";
import { syncAndGetUserRewards, REVIEW_REWARD_RUPEES } from "@/lib/rewards";
import { and, desc, eq, ilike } from "drizzle-orm";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET REVIEWS
export async function GET() {
  try {
    const data = await db
      .select()
      .from(review)
      .orderBy(desc(review.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// CREATE REVIEW
export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser?.userId) {
      return NextResponse.json(
        {
          error:
            "Please log in to submit a review and earn ₹50 cash credit.",
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const rawProductId = String(body.productId || "").trim();
    const rawProductName = String(body.productName || "").trim();
    const message = String(body.message || "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

    if (!message) {
      return NextResponse.json(
        { error: "Please write a review message." },
        { status: 400 },
      );
    }

    const [dbUser] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.id, sessionUser.userId))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let resolvedProductId: string | null = null;
    if (UUID_REGEX.test(rawProductId)) {
      const [foundById] = await db
        .select({ id: product.id })
        .from(product)
        .where(eq(product.id, rawProductId))
        .limit(1);
      resolvedProductId = foundById?.id ?? null;
    }

    if (!resolvedProductId && rawProductId && rawProductId !== "general") {
      const [foundBySlug] = await db
        .select({ id: product.id })
        .from(product)
        .where(eq(product.slug, rawProductId))
        .limit(1);
      resolvedProductId = foundBySlug?.id ?? null;
    }

    if (!resolvedProductId && rawProductName && rawProductName !== "Product") {
      const [foundByName] = await db
        .select({ id: product.id })
        .from(product)
        .where(ilike(product.name, `%${rawProductName}%`))
        .limit(1);
      resolvedProductId = foundByName?.id ?? null;
    }

    if (!resolvedProductId) {
      const [firstProduct] = await db
        .select({ id: product.id })
        .from(product)
        .limit(1);
      resolvedProductId = firstProduct?.id ?? null;
    }

    if (resolvedProductId) {
      const [existing] = await db
        .select({ id: review.id })
        .from(review)
        .where(
          and(
            eq(review.userId, dbUser.id),
            eq(review.productId, resolvedProductId),
          ),
        )
        .limit(1);

      if (existing) {
        return NextResponse.json(
          { error: "You have already reviewed this product." },
          { status: 400 },
        );
      }
    }

    const reviewerName =
      String(body.name || "").trim() || dbUser.name || "Verified Buyer";

    const [created] = await db
      .insert(review)
      .values({
        userId: dbUser.id,
        name: reviewerName,
        productId: resolvedProductId,
        rating,
        message,
        isAdminApproved: true,
      })
      .returning();

    const synced = await syncAndGetUserRewards(dbUser.id);

    return NextResponse.json({
      success: true,
      review: created,
      rewardAdded: REVIEW_REWARD_RUPEES,
      balance: synced.balance,
    });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}