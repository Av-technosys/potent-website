// @ts-nocheck
"use server";

import { cart, cartItem, coupon, couponTransaction, product, productVariant } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";
import { requireUserWithRefresh } from "../user/action";
import { calculateMixBoxPricing, type MixBoxRecipe } from "@/lib/mixYourBox";

const roundMoney = (amount: number) => Number(amount.toFixed(2));

async function getUserCartItems(userId: string) {
  const userCart = await db
    .select()
    .from(cart)
    .where(eq(cart.userId, userId))
    .then((rows) => rows[0]);

  if (!userCart) return [];

  const items = await db
    .select({
      productId: cartItem.productId,
      productVariantId: cartItem.productVariantId,
      mixBoxRecipe: cartItem.mixBoxRecipe,
      totalPads: cartItem.totalPads,
      boxCount: cartItem.boxCount,
      freeLiners: sql<number>`COALESCE(${cartItem.boxCount}, 0) * 4`,
      quantity: cartItem.quantity,
      title: product.name,
      image: sql<string>`COALESCE(${productVariant.bannerImage}, ${product.bannerImage})`,
      price: sql<number>`COALESCE(${productVariant.price}, 0)`,
      originalPrice: productVariant.strikethroughPrice,
      slug: product.slug,
      sku: productVariant.sku,
    })
    .from(cartItem)
    .leftJoin(product, eq(cartItem.productId, product.id))
    .leftJoin(productVariant, eq(cartItem.productVariantId, productVariant.id))
    .where(eq(cartItem.cartId, userCart.id));

  return items.map((item) => ({
    ...item,
    quantity: item.quantity ?? 1,
    price: item.price ?? 0,
  }));
}

async function getValidCoupon({
  code,
  userId,
  subtotal,
}: {
  code?: string | null;
  userId: string;
  subtotal: number;
}) {
  const normalizedCode = code?.trim().toUpperCase();
  if (!normalizedCode) return { couponInfo: null, error: null };

  const couponRows = await db
    .select()
    .from(coupon)
    .where(eq(coupon.code, normalizedCode));

  const couponInfo = couponRows[0];
  if (!couponInfo) {
    return { couponInfo: null, error: "Invalid coupon code" };
  }

  if (subtotal < couponInfo.minimumOrderValue) {
    return {
      couponInfo: null,
      error: `Minimum order value for this coupon is ₹${couponInfo.minimumOrderValue}`,
    };
  }

  if (couponInfo.useOnce) {
    const existingUsage = await db
      .select({ id: couponTransaction.id })
      .from(couponTransaction)
      .where(
        and(
          eq(couponTransaction.userId, userId),
          eq(couponTransaction.couponId, couponInfo.id),
        ),
      )
      .limit(1);

    if (existingUsage.length > 0) {
      return {
        couponInfo: null,
        error: "This coupon can only be used once",
      };
    }
  }

  return { couponInfo, error: null };
}

export async function calculateCheckoutPricingForUser({
  userId,
  couponCode,
}: {
  userId: string;
  couponCode?: string | null;
}) {
  const items = await getUserCartItems(userId);

  for (const item of items) {
    if (!item.mixBoxRecipe) continue;

    const pricing = calculateMixBoxPricing({
      recipe: item.mixBoxRecipe as MixBoxRecipe,
      setPrice: Number(item.price || 0),
      purchaseType: "one_time",
      subscriptionType: null,
    });

    if (!pricing.valid) {
      return {
        success: false,
        message: pricing.message,
        items,
        subtotal: 0,
        discount: 0,
        discountedSubtotal: 0,
        gst: 0,
        shipping: 0,
        final: 0,
        coupon: null,
      };
    }
  }

  const subtotal = roundMoney(
    items.reduce((sum, item) => {
      const price = Number(item.price || 0);

      if (item.mixBoxRecipe) {
        const pricing = calculateMixBoxPricing({
          recipe: item.mixBoxRecipe as MixBoxRecipe,
          setPrice: price,
          purchaseType: "one_time",
          subscriptionType: null,
        });

        if (!pricing.valid) return sum;

        return sum + pricing.price * Number(item.quantity || 1);
      }

      return sum + price * Number(item.quantity || 1);
    }, 0),
  );

  const shipping = subtotal > 0 ? 50 : 0;

  const { couponInfo, error } = await getValidCoupon({
    code: couponCode,
    userId,
    subtotal,
  });

  if (error) {
    const gst = roundMoney(subtotal * 0.18);
    return {
      success: false,
      message: error,
      items,
      subtotal,
      discount: 0,
      discountedSubtotal: subtotal,
      gst,
      shipping,
      final: roundMoney(subtotal + gst + shipping),
      coupon: null,
    };
  }

  let discount = 0;

  if (couponInfo) {
    discount = couponInfo.isDiscountPercentage
      ? subtotal * ((couponInfo.discountPercentage ?? 0) / 100)
      : couponInfo.discountFixedAmount ?? 0;

    if (couponInfo.maximumDiscountAmount > 0) {
      discount = Math.min(discount, couponInfo.maximumDiscountAmount);
    }

    discount = Math.min(discount, subtotal);
  }

  const safeDiscount = roundMoney(discount);
  const discountedSubtotal = roundMoney(Math.max(subtotal - safeDiscount, 0));
  const gst = roundMoney(discountedSubtotal * 0.18);
  const final = roundMoney(discountedSubtotal + gst + shipping);

  return {
    success: true,
    items,
    subtotal,
    discount: safeDiscount,
    discountedSubtotal,
    gst,
    shipping,
    final,
    coupon: couponInfo
      ? {
          id: couponInfo.id,
          name: couponInfo.name,
          code: couponInfo.code,
          description: couponInfo.description,
          isDiscountPercentage: couponInfo.isDiscountPercentage,
          discountPercentage: couponInfo.discountPercentage,
          discountFixedAmount: couponInfo.discountFixedAmount,
          minimumOrderValue: couponInfo.minimumOrderValue,
          maximumDiscountAmount: couponInfo.maximumDiscountAmount,
          useOnce: couponInfo.useOnce,
        }
      : null,
  };
}

export async function getCheckoutPricing(couponCode?: string | null) {
  try {
    const { userId } = await requireUserWithRefresh();
    return calculateCheckoutPricingForUser({ userId, couponCode });
  } catch (error) {
    console.error("Checkout pricing failed:", error);
    return {
      success: false,
      message: "Failed to calculate checkout total",
      items: [],
      subtotal: 0,
      discount: 0,
      discountedSubtotal: 0,
      gst: 0,
      shipping: 0,
      final: 0,
      coupon: null,
    };
  }
}
