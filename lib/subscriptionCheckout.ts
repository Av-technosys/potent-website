// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { asc, and, eq } from "drizzle-orm";
import { db } from "@/src/db";
import { product, productVariant } from "@/src/db/schema";
import {
  calculateMixBoxPricing,
  formatMixBoxRecipe,
  type MixBoxRecipe,
  type SubscriptionType,
} from "@/lib/mixYourBox";
import {
  getCleanProductTitle,
  getCartItemVariantBadge,
} from "@/lib/cartItemDisplay";
import { calculateCycleSyncSchedule, clampCycleLength } from "@/lib/cycleSync";
import {
  PDP_SUBSCRIPTION_PLANS,
  getPdpSubscriptionDiscount,
  isPdpSubscriptionTypeAllowed,
} from "@/lib/pdpSubscriptionRules";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE as SHIPPING_FEE,
  calculateShippingFee,
} from "@/lib/shippingConfig";

const RECURRING_TYPES = PDP_SUBSCRIPTION_PLANS.map(
  (plan) => plan.subscriptionType,
);

const DEFAULT_SUBSCRIPTION_DISCOUNTS = Object.fromEntries(
  PDP_SUBSCRIPTION_PLANS.map((plan) => [
    plan.subscriptionType,
    plan.discountPercentage,
  ]),
);

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getProductDiscount(
  productInfo: any,
  subscriptionType: SubscriptionType,
) {
  return (
    Number(
      getPdpSubscriptionDiscount(subscriptionType, productInfo) ||
        DEFAULT_SUBSCRIPTION_DISCOUNTS[subscriptionType] ||
        0,
    ) / 100
  );
}

export function normalizeSubscriptionCheckoutItem(input: any) {
  const nestedItem =
    input?.item && typeof input.item === "object" ? input.item : {};
  const selectedPlan =
    input?.selectedPlan ??
    input?.plan ??
    nestedItem.selectedPlan ??
    nestedItem.plan;

  return {
    ...nestedItem,
    productId: input?.productId ?? nestedItem.productId,
    productVariantId: input?.productVariantId ?? nestedItem.productVariantId,
    quantity: input?.quantity ?? nestedItem.quantity,
    subscriptionType:
      input?.subscriptionType ??
      nestedItem.subscriptionType ??
      selectedPlan?.subscriptionType,
    selectedPlan,
    cycleSync: input?.cycleSync ?? nestedItem.cycleSync,
    mixBoxRecipe: input?.mixBoxRecipe ?? nestedItem.mixBoxRecipe,
  };
}

function getBilling(subscriptionType: SubscriptionType, cycleSync: any) {
  if (subscriptionType === "every_2_months") {
    return {
      period: "monthly",
      interval: 2,
      frequencyInDays: 60,
      label: "Every 2 Months",
    };
  }

  if (subscriptionType === "cycle_sync") {
    const cycleLength = clampCycleLength(cycleSync?.cycleLength ?? 28);
    return {
      period: "daily",
      interval: cycleLength,
      frequencyInDays: cycleLength,
      label: `Every ${cycleLength} Days`,
    };
  }

  return {
    period: "monthly",
    interval: 1,
    frequencyInDays: 30,
    label: "Monthly",
  };
}

export async function getSubscriptionCheckoutQuote(item: any) {
  item = normalizeSubscriptionCheckoutItem(item);

  if (!item?.productId || typeof item.productId !== "string") {
    return { success: false, error: "Product is required" };
  }

  if (item.productVariantId && typeof item.productVariantId !== "string") {
    return { success: false, error: "Invalid product variant" };
  }

  const subscriptionType = item?.subscriptionType as SubscriptionType;

  if (!RECURRING_TYPES.includes(subscriptionType as string)) {
    return { success: false, error: "Invalid subscription type" };
  }

  const [row] = item?.productVariantId
    ? await db
        .select({ productInfo: product, variant: productVariant })
        .from(productVariant)
        .innerJoin(product, eq(productVariant.productId, product.id))
        .where(
          and(
            eq(productVariant.id, item.productVariantId),
            eq(product.id, item.productId),
          ),
        )
        .limit(1)
    : await db
        .select({ productInfo: product, variant: productVariant })
        .from(product)
        .innerJoin(productVariant, eq(productVariant.productId, product.id))
        .where(eq(product.id, item?.productId))
        .orderBy(asc(productVariant.priority), asc(productVariant.name))
        .limit(1);

  if (!row?.productInfo || !row?.variant) {
    return { success: false, error: "Product or variant not found" };
  }

  if (row.variant.isInStock === false || row.productInfo.isInStock === false) {
    return {
      success: false,
      error: "This item is currently out of stock.",
    };
  }

  if (
    String(row.variant.sku || "").toUpperCase() === "OVY-TEEN-FPB" ||
    /first period box/i.test(String(row.variant.name || ""))
  ) {
    return {
      success: false,
      error: "This item is coming soon and not available for purchase yet.",
    };
  }

  if (!isPdpSubscriptionTypeAllowed(row.productInfo, subscriptionType)) {
    return {
      success: false,
      error: "Subscription is not available for this product",
    };
  }

  if (subscriptionType === "cycle_sync") {
    if (item?.cycleSync?.lastPeriodDate || item?.cycleSync?.nextPeriodDate) {
      const schedule = calculateCycleSyncSchedule(item.cycleSync);
      if (!schedule.valid) {
        return { success: false, error: schedule.message };
      }
    } else {
      return {
        success: false,
        error: "Please complete your Cycle Sync details before checkout.",
      };
    }
  }

  const quantity = row.productInfo.isMixBox
    ? 1
    : Math.max(
        1,
        Math.min(
          Number(item?.quantity || 1),
          Number(row.productInfo.maxQuantityPurchase || 6),
        ),
      );
  const baseVariantPrice = Number(row.variant.price || 0);
  const discount = Math.min(
    Math.max(getProductDiscount(row.productInfo, subscriptionType), 0),
    1,
  );
  let subtotal = baseVariantPrice * quantity;
  let mixPricing = null;

  if (row.productInfo.isMixBox && item?.mixBoxRecipe) {
    mixPricing = calculateMixBoxPricing({
      recipe: item.mixBoxRecipe as MixBoxRecipe,
      setPrice: baseVariantPrice,
      purchaseType: "one_time",
      subscriptionType: null,
    });

    if (!mixPricing.valid) {
      return { success: false, error: mixPricing.message };
    }

    subtotal = mixPricing.price;
  }

  const discountedUnitPrice = mixPricing
    ? Math.round(subtotal * (1 - discount))
    : Math.round(baseVariantPrice * (1 - discount));
  const discountedSubtotal = mixPricing
    ? discountedUnitPrice
    : discountedUnitPrice * quantity;
  const shipping = calculateShippingFee(discountedSubtotal);
  const final = discountedSubtotal + shipping;
  const billing = getBilling(subscriptionType, item?.cycleSync);
  const now = new Date();
  const cycleSchedule =
    subscriptionType === "cycle_sync" &&
    (item?.cycleSync?.lastPeriodDate || item?.cycleSync?.nextPeriodDate)
      ? calculateCycleSyncSchedule(item.cycleSync)
      : null;

  const cleanTitle = getCleanProductTitle({
    title: row.productInfo.name,
    slug: row.productInfo.slug,
  });
  const variantLabel =
    mixPricing && item?.mixBoxRecipe
      ? `Mix Box (${formatMixBoxRecipe(item.mixBoxRecipe as MixBoxRecipe)})`
      : getCartItemVariantBadge({
          title: row.productInfo.name,
          slug: row.productInfo.slug,
          sku: row.variant.sku,
          variantName: row.variant.name || row.variant.size,
        }) ||
        row.variant.name ||
        row.variant.size ||
        "";

  const firstDeliveryDate = cycleSchedule?.valid
    ? cycleSchedule.arrivalDate
    : addDays(now, 5);
  const nextOrderDate = cycleSchedule?.valid
    ? cycleSchedule.upcomingDeliveries[0].deliveryDate
    : addDays(now, billing.frequencyInDays);
  const nextChargeDate = cycleSchedule?.valid
    ? cycleSchedule.upcomingDeliveries[1]?.chargeDate ??
      addDays(
        cycleSchedule.upcomingDeliveries[0].deliveryDate,
        billing.frequencyInDays - 5,
      )
    : subscriptionType === "cycle_sync"
      ? addDays(nextOrderDate, billing.frequencyInDays - 5)
      : addDays(now, billing.frequencyInDays);

  const planLabel =
    subscriptionType === "cycle_sync"
      ? `Cycle Sync (${billing.label})`
      : `${billing.label} Subscription`;

  return {
    success: true,
    product: row.productInfo,
    variant: row.variant,
    variantLabel,
    quantity,
    subscriptionType,
    billing,
    subtotal,
    discountedSubtotal,
    discount: subtotal - discountedSubtotal,
    discountPercentage: Number((discount * 100).toFixed(2)),
    final,
    shipping,
    amountPaise: Math.round(final * 100),
    label: variantLabel
      ? `${cleanTitle} (${variantLabel}) - ${planLabel}`
      : `${cleanTitle} - ${planLabel}`,
    firstDeliveryDate,
    nextOrderDate,
    nextChargeDate,
    mixBoxRecipe: mixPricing ? item.mixBoxRecipe : null,
    totalPads: mixPricing?.totalPads ?? null,
    boxCount: mixPricing?.boxCount ?? null,
    freeLiners: mixPricing?.freeLiners ?? null,
  };
}
