export type PdpSubscriptionType =
  | "monthly"
  | "every_2_months"
  | "cycle_sync";

export type PdpSubscriptionPlan = {
  id: PdpSubscriptionType;
  label: string;
  discountPercentage: number;
  period: number;
  subscriptionType: PdpSubscriptionType;
};

export const BUY_ONCE_PLAN = {
  id: "buy_once",
  label: "Buy Once (One-time order)",
  discountPercentage: 0,
  period: 0,
  subscriptionType: "buy_once",
} as const;

export const PDP_SUBSCRIPTION_PLANS: PdpSubscriptionPlan[] = [
  {
    id: "monthly",
    label: "Subscribe monthly",
    discountPercentage: 15,
    period: 1,
    subscriptionType: "monthly",
  },
  {
    id: "every_2_months",
    label: "Subscribe every 2 months",
    discountPercentage: 12,
    period: 2,
    subscriptionType: "every_2_months",
  },
  {
    id: "cycle_sync",
    label: "Cycle Sync",
    discountPercentage: 15,
    period: 1,
    subscriptionType: "cycle_sync",
  },
];

export const PDP_SUBSCRIPTION_SLUGS = new Set([
  "ovy-pads",
  "ovy-organic-pads",
  "ovy-organic-sanitary-pads",
  "ovy-sanitary-pads",
  "ovy-teen",
  "ovy-teen-pads",
  "ovy-teen-starter-pack",
  "ovy-organic-teen-sanitary-pads",
  "ovy-panty",
  "ovy-period-panties",
  "ovy-super-slim-period-panty",
  "ovy-super-slim-period-panties",
  "ovy-liners",
  "ovy-daily-liners",
  "ovy-organic-panty-liners",
  "looway-pee-puke",
  "looway-pee-puke-bags",
  "pee-puke-bags",
  "looway-pee-and-puke-bags",
  "pee-puke",
  "looway-toilet-seat-covers",
  "toilet-seat-covers",
]);

export const PDP_NO_SUBSCRIPTION_SLUGS = new Set([
  "ovy-cup",
  "menstrual-cup",
  "ovy-reusable-menstrual-cup",
  "looway-pee-funnel",
  "pee-funnel",
  "looway-funnel",
  "looway-reusable-female-pee-funnel",
  "looway-yatra-kit",
  "yatra-kit",
]);

export const PDP_CYCLE_SYNC_SLUGS = new Set([
  "ovy-pads",
  "ovy-organic-pads",
  "ovy-organic-sanitary-pads",
  "ovy-sanitary-pads",
  "ovy-teen",
  "ovy-teen-pads",
  "ovy-teen-starter-pack",
  "ovy-organic-teen-sanitary-pads",
  "ovy-panty",
  "ovy-period-panties",
  "ovy-super-slim-period-panty",
  "ovy-super-slim-period-panties",
]);

export const PDP_NO_CYCLE_SYNC_SLUGS = new Set([
  "ovy-liners",
  "ovy-daily-liners",
  "ovy-organic-panty-liners",
  "looway-pee-puke",
  "looway-pee-puke-bags",
  "pee-puke-bags",
  "looway-pee-and-puke-bags",
  "pee-puke",
  "looway-toilet-seat-covers",
  "toilet-seat-covers",
  ...PDP_NO_SUBSCRIPTION_SLUGS,
]);

export function getPdpSubscriptionDiscount(
  subscriptionType?: string | null,
  product?: any,
) {
  if (!subscriptionType || subscriptionType === "buy_once") return 0;

  if (product && typeof product === "object") {
    if (subscriptionType === "monthly") {
      const dbVal = Number(
        product.subscribeMonthlyDiscount ?? product.subscribe_monthly_discount,
      );
      if (Number.isFinite(dbVal) && dbVal > 0) return dbVal;
    } else if (subscriptionType === "every_2_months") {
      const dbVal = Number(
        product.subscribeBiMontlyDiscount ??
          product.subscribeBiMonthlyDiscount ??
          product.subscribe_bi_montly_discount,
      );
      if (Number.isFinite(dbVal) && dbVal > 0) return dbVal;
    } else if (subscriptionType === "cycle_sync") {
      const dbVal = Number(
        product.cycleSyncDiscount ?? product.cycle_sync_discount,
      );
      if (Number.isFinite(dbVal) && dbVal > 0) return dbVal;
    }
  }

  return (
    PDP_SUBSCRIPTION_PLANS.find(
      (plan) => plan.subscriptionType === subscriptionType,
    )?.discountPercentage ?? 0
  );
}

export function isPdpCycleSyncEligible(product: any) {
  if (!isPdpSubscriptionEligible(product)) return false;

  const slug = String(product?.slug || "").toLowerCase();
  const identity = `${slug} ${String(product?.name || "").toLowerCase()}`;

  // Liners, seat covers, pee & puke bags, cups, funnels, and travel kits never have Cycle Sync.
  if (PDP_NO_CYCLE_SYNC_SLUGS.has(slug)) return false;
  if (
    /(liner|seat cover|pee.*puke|puke.*bag|cup|funnel|yatra|travel kit)/i.test(
      identity,
    )
  ) {
    return false;
  }

  return (
    PDP_CYCLE_SYNC_SLUGS.has(slug) ||
    /ovy.*(organic.*pad|sanitary.*pad|teen|super.*slim.*period pant)/i.test(
      identity,
    )
  );
}

export function getPdpSubscriptionPlans(product: any) {
  if (!isPdpSubscriptionEligible(product)) return [];

  const allowCycleSync = isPdpCycleSyncEligible(product);

  return PDP_SUBSCRIPTION_PLANS.filter(
    (plan) => plan.subscriptionType !== "cycle_sync" || allowCycleSync,
  ).map((plan) => ({
    ...plan,
    discountPercentage: getPdpSubscriptionDiscount(
      plan.subscriptionType,
      product,
    ),
  }));
}

export function isPdpSubscriptionTypeAllowed(
  product: any,
  subscriptionType?: string | null,
) {
  return getPdpSubscriptionPlans(product).some(
    (plan) => plan.subscriptionType === subscriptionType,
  );
}

export function isPdpSubscriptionEligible(product: any) {
  const slug = String(product?.slug || "").toLowerCase();
  const identity = `${slug} ${String(product?.name || "").toLowerCase()}`;

  if (PDP_NO_SUBSCRIPTION_SLUGS.has(slug)) return false;
  if (/(cup|funnel|yatra|travel kit|first period box)/i.test(identity)) {
    return false;
  }
  if (product?.isInStock === false || product?.is_in_stock === false) {
    return false;
  }

  const variants = Array.isArray(product?.productVariants)
    ? product.productVariants
    : Array.isArray(product?.prodcutVarientBoxRes)
      ? product.prodcutVarientBoxRes
      : [];
  if (
    variants.length > 0 &&
    variants.every(
      (v: any) => v.isInStock === false || v.is_in_stock === false,
    )
  ) {
    return false;
  }

  if (PDP_SUBSCRIPTION_SLUGS.has(slug)) return true;

  return /(pad|liner|period pant|pee.*puke|seat cover)/i.test(identity);
}
