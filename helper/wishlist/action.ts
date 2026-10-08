"use server";
import { db } from "@/db";
import {
  wishlist,
  wishlistItem,
  product,
  productVariant,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireUserWithRefresh } from "../user/action";

export async function addToWishlistDB(productId: string) {
  const { userId } = await requireUserWithRefresh();

  const userWishlist = await db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId))
    .limit(1);

  let wishlistId: string;

  if (userWishlist.length === 0) {
    const newWishlist = await db
      .insert(wishlist)
      .values({ userId })
      .returning({ id: wishlist.id });

    wishlistId = newWishlist[0].id;
  } else {
    wishlistId = userWishlist[0].id;
  }

  const existing = await db
    .select()
    .from(wishlistItem)
    .where(
      and(
        eq(wishlistItem.wishlistId, wishlistId),
        eq(wishlistItem.productId, productId)
      )
    );

  if (existing.length > 0) return;

  await db.insert(wishlistItem).values({
    wishlistId,
    productId,
  });
}

export async function removeFromWishlistDB(productId: string) {
  const { userId } = await requireUserWithRefresh();

  const userWishlist = await db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId))
    .limit(1);

  if (!userWishlist.length) return;

  await db
    .delete(wishlistItem)
    .where(
      and(
        eq(wishlistItem.wishlistId, userWishlist[0].id),
        eq(wishlistItem.productId, productId)
      )
    );
}

export async function getWishlistDB() {
  const { userId } = await requireUserWithRefresh();

  const result = await db
    .select({
      productId: wishlistItem.productId,
      name: product.name,
      slug: product.slug,
      basePrice: product.startingPrice,
      image: product.bannerImage,
      productVariantId: productVariant.id,
      sku: productVariant.sku,
      variantName: productVariant.name,
      variantPrice: productVariant.price,
      variantOriginalPrice: productVariant.strikethroughPrice,
      variantImage: productVariant.bannerImage,
      variantFlowType: productVariant.flowType,
    })
    .from(wishlistItem)
    .innerJoin(
      product,
      eq(product.id, wishlistItem.productId)
    )
    .leftJoin(
      productVariant,
      eq(product.id, productVariant.productId)
    )
    .innerJoin(
      wishlist,
      eq(wishlist.id, wishlistItem.wishlistId)
    )
    .where(eq(wishlist.userId, userId));

  type SyncedWishlistItem = {
    productId: string;
    name: string | null;
    slug: string;
    basePrice: string | null;
    image: string | null;
    variants: Array<{
      productVariantId: string;
      sku: string | null;
      name: string | null;
      price: number | null;
      strikethroughPrice: number | null;
      bannerImage: string | null;
      flowType: string | null;
    }>;
  };
  const grouped = new Map<string, SyncedWishlistItem>();
  for (const row of result) {
    if (!row.productId) continue;
    const existing = grouped.get(row.productId) || {
      productId: row.productId,
      name: row.name,
      slug: row.slug,
      basePrice: row.basePrice,
      image: row.image,
      variants: [],
    };

    if (row.productVariantId) {
      existing.variants.push({
        productVariantId: row.productVariantId,
        sku: row.sku,
        name: row.variantName,
        price: row.variantPrice,
        strikethroughPrice: row.variantOriginalPrice,
        bannerImage: row.variantImage || row.image,
        flowType: row.variantFlowType,
      });
    }
    grouped.set(row.productId, existing);
  }

  return Array.from(grouped.values());
}
