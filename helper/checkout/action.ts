// @ts-nocheck
"use server";

import {
  cart,
  cartItem,
  coupon,
  couponTransaction,
  product,
  productVariant,
} from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";
import { requireUserWithRefresh } from "../user/action";
import { calculateMixBoxPricing, type MixBoxRecipe } from "@/lib/mixYourBox";
import { getProductMaxQuantity } from "@/lib/productQuantityLimits";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE as SHIPPING_FEE,
  calculateShippingFee as calculateShipping,
} from "@/lib/shippingConfig";
import {
  MAX_REWARD_REDEEM_PERCENT,
  MAX_REWARD_REDEEM_PER_ORDER,
  syncAndGetUserRewards,
} from "@/lib/rewards";
import { ensureDefaultCoupons } from "@/helper/coupon/action";

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
      variantName: productVariant.name,
      image: sql<string>`COALESCE(${productVariant.bannerImage}, ${product.bannerImage})`,
      price: sql<number>`COALESCE(${productVariant.price}, 0)`,
      originalPrice: productVariant.strikethroughPrice,
      slug: product.slug,
      sku: productVariant.sku,
      isInStock: productVariant.isInStock,
      maxQuantityPurchase: product.maxQuantityPurchase,
    })
    .from(cartItem)
    .leftJoin(product, eq(cartItem.productId, product.id))
    .leftJoin(productVariant, eq(cartItem.productVariantId, productVariant.id))
    .where(eq(cartItem.cartId, userCart.id));

  return items.map((item) => {
    const isYatra = Boolean(
      item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit",
    );
    const yatraData = isYatra ? (item.mixBoxRecipe as any) : null;
    const yatraPrice =
      yatraData?.items?.reduce(
        (sum: number, it: any) => sum + Number(it.price || 0) * Number(it.qty || 0),
        0,
      ) || Number(item.price || 0);

    return {
      ...item,
      quantity: item.quantity ?? 1,
      price: isYatra ? yatraPrice : (item.price ?? 0),
      title: isYatra ? "Looway Yatra Kit" : item.title,
      variantName: isYatra ? yatraData.kitName : item.variantName,
      image: isYatra ? "/looway/yatra-kit-thumb-v2.png" : item.image,
      yatraKit: yatraData,
      mixBoxRecipe: isYatra ? undefined : item.mixBoxRecipe,
    };
  });
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

  await ensureDefaultCoupons();

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
  customItems,
}: {
  userId: string;
  couponCode?: string | null;
  customItems?: any[];
}) {
  const rawItems =
    customItems && customItems.length > 0
      ? customItems
      : await getUserCartItems(userId);

  const items = rawItems.map((item) => {
    const isYatra = Boolean(
      item.yatraKit || (item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit"),
    );
    if (!isYatra) return item;
    const yatraData = item.yatraKit || (item.mixBoxRecipe as any);
    const yatraPrice =
      yatraData?.items?.reduce(
        (sum: number, it: any) => sum + Number(it.price || 0) * Number(it.qty || 0),
        0,
      ) || Number(item.price || 0);

    return {
      ...item,
      quantity: item.quantity ?? 1,
      price: yatraPrice,
      title: "Looway Yatra Kit",
      variantName: yatraData.kitName || item.variantName,
      image: item.image || "/looway/yatra-kit-thumb-v2.png",
      yatraKit: yatraData,
      mixBoxRecipe: undefined,
    };
  });

  for (const item of items) {
    if (!item.mixBoxRecipe || (item.mixBoxRecipe as any).type === "yatraKit") continue;

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

  for (const item of items) {
    let itemOutOfStock = item.isInStock === false;
    if (!itemOutOfStock && !item.productVariantId && item.productId) {
      const pVariants = await db
        .select({ isInStock: productVariant.isInStock })
        .from(productVariant)
        .where(eq(productVariant.productId, item.productId));
      if (pVariants.length > 0 && pVariants.every((pv) => pv.isInStock === false)) {
        itemOutOfStock = true;
      }
    }
    if (itemOutOfStock) {
      return {
        success: false,
        message: `${item.title || "An item in your cart"} is currently out of stock. Please remove it from your cart to proceed to checkout.`,
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

    const maxQty = getProductMaxQuantity(item);
    if (Number(item.quantity || 1) > maxQty) {
      return {
        success: false,
        message: `Maximum ${maxQty} per order allowed for ${item.title || "an item"}. Please adjust your bag quantity.`,
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

      const isYatra = Boolean(
        item.yatraKit || (item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit"),
      );

      if (item.mixBoxRecipe && !isYatra) {
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

  const rewardState = userId
    ? await syncAndGetUserRewards(userId)
    : { balance: 0 };
  const rewardBalance = Math.max(0, Math.round(Number(rewardState.balance || 0)));

  // Specification:
  // - Credits are applied automatically at checkout. No code to type.
  // - She can use credits for up to 20% of the product total, and at most ₹150 per order, whichever is lower.
  // - Credits do not pay for delivery.
  // - Credits and a coupon code cannot be used together. If she has both, use the one that saves her more and show which one was used.
  const maxCreditsByPercent = Math.floor(subtotal * MAX_REWARD_REDEEM_PERCENT);
  const maxPossibleCredits =
    subtotal > 0
      ? Math.max(
          0,
          Math.min(rewardBalance, maxCreditsByPercent, MAX_REWARD_REDEEM_PER_ORDER),
        )
      : 0;

  const { couponInfo, error: couponError } = await getValidCoupon({
    code: couponCode,
    userId,
    subtotal,
  });

  if (couponError && couponCode) {
    // If entered coupon is invalid / not meeting min order value:
    // Credits remain applied automatically.
    const rewardsUsed = maxPossibleCredits;
    const discountedSubtotal = roundMoney(Math.max(subtotal - rewardsUsed, 0));
    const shipping = calculateShipping(subtotal);
    const final = roundMoney(discountedSubtotal + shipping);

    return {
      success: false,
      message: couponError,
      items,
      subtotal,
      discount: 0,
      discountedSubtotal,
      gst: 0,
      shipping,
      rewardBalance,
      rewardsUsed,
      remainingRewardBalance: Math.max(0, rewardBalance - rewardsUsed),
      final,
      coupon: null,
      savingsChoiceNotice: null,
    };
  }

  let couponDiscount = 0;
  if (couponInfo) {
    couponDiscount = couponInfo.isDiscountPercentage
      ? subtotal * ((couponInfo.discountPercentage ?? 0) / 100)
      : (couponInfo.discountFixedAmount ?? 0);

    if (couponInfo.maximumDiscountAmount > 0) {
      couponDiscount = Math.min(couponDiscount, couponInfo.maximumDiscountAmount);
    }

    couponDiscount = roundMoney(Math.min(couponDiscount, subtotal));
  }

  let safeDiscount = 0;
  let rewardsUsed = 0;
  let activeCoupon = null;
  let savingsChoiceNotice: string | null = null;

  if (couponInfo && couponDiscount > 0) {
    // Both coupon and credits are eligible: compare which saves more
    if (couponDiscount > maxPossibleCredits) {
      // Coupon saves more
      safeDiscount = couponDiscount;
      rewardsUsed = 0;
      activeCoupon = couponInfo;
      if (maxPossibleCredits > 0) {
        savingsChoiceNotice = `Coupon ${couponInfo.code} saved you ₹${couponDiscount.toFixed(2)}, which is more than your ₹${maxPossibleCredits} rewards credit. Credits and coupons cannot be combined, so coupon was used and your credits stay in your wallet.`;
      }
    } else if (maxPossibleCredits > 0) {
      // Credits save more or equal
      safeDiscount = 0;
      rewardsUsed = maxPossibleCredits;
      activeCoupon = null;
      savingsChoiceNotice = `₹${maxPossibleCredits} rewards credit applied automatically because it saves you more than coupon ${couponInfo.code} (₹${couponDiscount.toFixed(2)}). Credits and coupons cannot be combined.`;
    } else {
      safeDiscount = couponDiscount;
      rewardsUsed = 0;
      activeCoupon = couponInfo;
    }
  } else {
    // No coupon code entered: auto-apply credits
    safeDiscount = 0;
    rewardsUsed = maxPossibleCredits;
    activeCoupon = null;
  }

  // Delivery charge is separate; credits do NOT pay for delivery
  const productAfterCoupon = roundMoney(Math.max(subtotal - safeDiscount, 0));
  const shipping = calculateShipping(productAfterCoupon);
  const discountedSubtotal = roundMoney(Math.max(productAfterCoupon - rewardsUsed, 0));
  const gst = 0;
  const final = roundMoney(discountedSubtotal + shipping);

  return {
    success: true,
    items,
    subtotal,
    discount: safeDiscount,
    discountedSubtotal,
    gst,
    shipping,
    rewardBalance,
    rewardsUsed,
    remainingRewardBalance: Math.max(0, rewardBalance - rewardsUsed),
    final,
    savingsChoiceNotice,
    coupon: activeCoupon
      ? {
          id: activeCoupon.id,
          name: activeCoupon.name,
          code: activeCoupon.code,
          description: activeCoupon.description,
          isDiscountPercentage: activeCoupon.isDiscountPercentage,
          discountPercentage: activeCoupon.discountPercentage,
          discountFixedAmount: activeCoupon.discountFixedAmount,
          minimumOrderValue: activeCoupon.minimumOrderValue,
          maximumDiscountAmount: activeCoupon.maximumDiscountAmount,
          useOnce: activeCoupon.useOnce,
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
      rewardBalance: 0,
      rewardsUsed: 0,
      remainingRewardBalance: 0,
      final: 0,
      coupon: null,
    };
  }
}

export async function getDirectCheckoutPricing(
  item: any,
  couponCode?: string | null,
) {
  try {
    const { userId } = await requireUserWithRefresh();
    return calculateCheckoutPricingForUser({
      userId,
      couponCode,
      customItems: item ? [item] : [],
    });
  } catch (error) {
    console.error("Direct checkout pricing failed:", error);
    return {
      success: false,
      message: "Failed to calculate direct checkout total",
      items: item ? [item] : [],
      subtotal: 0,
      discount: 0,
      discountedSubtotal: 0,
      gst: 0,
      shipping: 0,
      rewardBalance: 0,
      rewardsUsed: 0,
      remainingRewardBalance: 0,
      final: 0,
      coupon: null,
    };
  }
}

export async function validateCartCoupon({
  code,
  items,
}: {
  code: string;
  items: any[];
}) {
  try {
    await ensureDefaultCoupons();

    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!normalizedCode) {
      return { success: false, message: "Please enter a coupon code" };
    }

    let userId = "";
    try {
      const auth = await requireUserWithRefresh();
      userId = auth.userId || "";
    } catch {
      // Guest user is permitted to validate cart coupon
    }

    const subtotal = roundMoney(
      items.reduce((sum, item) => {
        const price = Number(item.price || 0);
        return sum + price * Number(item.quantity || 1);
      }, 0),
    );

    const { couponInfo, error } = await getValidCoupon({
      code: normalizedCode,
      userId,
      subtotal,
    });

    if (error || !couponInfo) {
      return {
        success: false,
        message: error || "Invalid coupon code",
      };
    }

    let discount = couponInfo.isDiscountPercentage
      ? subtotal * ((couponInfo.discountPercentage ?? 0) / 100)
      : (couponInfo.discountFixedAmount ?? 0);

    if (couponInfo.maximumDiscountAmount > 0) {
      discount = Math.min(discount, couponInfo.maximumDiscountAmount);
    }
    discount = roundMoney(Math.min(discount, subtotal));

    return {
      success: true,
      coupon: {
        id: couponInfo.id,
        name: couponInfo.name,
        code: couponInfo.code,
        description: couponInfo.description,
        isDiscountPercentage: couponInfo.isDiscountPercentage,
        discountPercentage: couponInfo.discountPercentage,
        discountFixedAmount: couponInfo.discountFixedAmount,
        minimumOrderValue: couponInfo.minimumOrderValue,
        maximumDiscountAmount: couponInfo.maximumDiscountAmount,
      },
      discount,
      message: `Coupon ${couponInfo.code} applied! Saved ₹${discount.toFixed(2)}`,
    };
  } catch (err: any) {
    console.error("validateCartCoupon error:", err);
    return { success: false, message: "Failed to validate coupon" };
  }
}
