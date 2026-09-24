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
      price: productVariant.price,
      image: product.bannerImage,
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

  const seen = new Set();
  return result.filter((item: any) => {
    if (seen.has(item.productId)) return false;
    seen.add(item.productId);
    return true;
  });
}