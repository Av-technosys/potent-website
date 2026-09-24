// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { asc, and, eq } from "drizzle-orm";
import { db } from "@/src/db";
import { product, productVariant } from "@/src/db/schema";
import {
  calculateMixBoxPricing,
  type MixBoxRecipe,
  type SubscriptionType,
} from "@/lib/mixYourBox";
import {
  calculateCycleSyncSchedule,
  clampCycleLength,
} from "@/lib/cycleSync";

const RECURRING_TYPES = ["monthly", "every_2_months", "cycle_sync"];

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getProductDiscount(productInfo: any, subscriptionType: SubscriptionType) {
  if (subscriptionType === "monthly") {
    return Number(productInfo.subscribeMonthlyDiscount || 0) / 100;
  }

  if (subscriptionType === "every_2_months") {
    return Number(productInfo.subscribeBiMontlyDiscount || 0) / 100;
  }

  if (subscriptionType === "cycle_sync") {
    return Number(productInfo.cycleSyncDiscount || 0) / 100;
  }

  return 0;
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

  if (subscriptionType === "cycle_sync") {
    if (!row.productInfo.allowCycleSync) {
      return { success: false, error: "Cycle Sync is not available for this product" };
    }

    if (item?.cycleSync?.nextPeriodDate) {
      const schedule = calculateCycleSyncSchedule(item.cycleSync);
      if (!schedule.valid) {
        return { success: false, error: schedule.message };
      }
    }
  } else if (!row.productInfo.allowSubscription) {
    return { success: false, error: "Subscription is not available for this product" };
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
  const discount = Math.min(Math.max(getProductDiscount(row.productInfo, subscriptionType), 0), 1);
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

  const final = Math.round(subtotal * (1 - discount));
  const billing = getBilling(subscriptionType, item?.cycleSync);
  const now = new Date();
  const cycleSchedule =
    subscriptionType === "cycle_sync" && item?.cycleSync?.nextPeriodDate
      ? calculateCycleSyncSchedule(item.cycleSync)
      : null;

  return {
    success: true,
    product: row.productInfo,
    variant: row.variant,
    quantity,
    subscriptionType,
    billing,
    subtotal,
    discount: subtotal - final,
    final,
    amountPaise: Math.round(final * 100),
    label: `${row.productInfo.name} - ${billing.label} Subscription`,
    nextOrderDate:
      cycleSchedule?.valid
        ? cycleSchedule.upcomingDeliveries[0].deliveryDate
        : addDays(now, billing.frequencyInDays),
    mixBoxRecipe: mixPricing ? item.mixBoxRecipe : null,
    totalPads: mixPricing?.totalPads ?? null,
    boxCount: mixPricing?.boxCount ?? null,
    freeLiners: mixPricing?.freeLiners ?? null,
  };
}
