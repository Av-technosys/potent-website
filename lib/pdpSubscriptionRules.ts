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

export function getPdpSubscriptionDiscount(
  subscriptionType?: string | null,
) {
  return (
    PDP_SUBSCRIPTION_PLANS.find(
      (plan) => plan.subscriptionType === subscriptionType,
    )?.discountPercentage ?? 0
  );
}

export function getPdpSubscriptionPlans(product: any) {
  if (!isPdpSubscriptionEligible(product)) return [];

  const slug = String(product?.slug || "").toLowerCase();
  return PDP_SUBSCRIPTION_PLANS.filter(
    (plan) =>
      plan.subscriptionType !== "cycle_sync" ||
      PDP_CYCLE_SYNC_SLUGS.has(slug) ||
      /ovy.*(organic.*pad|teen|super.*slim.*period pant)/i.test(
        `${slug} ${String(product?.name || "")}`,
      ),
  );
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

  if (PDP_NO_SUBSCRIPTION_SLUGS.has(slug)) return false;
  if (product?.isInStock === false || product?.is_in_stock === false) return false;
  if (
    Array.isArray(product?.productVariants) &&
    product.productVariants.length > 0 &&
    product.productVariants.every(
      (v: any) => v.isInStock === false || v.is_in_stock === false,
    )
  ) {
    return false;
  }
  if (PDP_SUBSCRIPTION_SLUGS.has(slug)) return true;

  // Keep the generic PDP safe for equivalent product slugs while ensuring
  // cups, funnels, and travel kits never receive subscription UI.
  const identity = `${slug} ${String(product?.name || "").toLowerCase()}`;
  if (/(cup|funnel|yatra|travel kit)/i.test(identity)) return false;

  return /(pad|liner|period pant|pee.*puke|seat cover)/i.test(identity);
}
