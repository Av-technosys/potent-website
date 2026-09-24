/* eslint-disable @typescript-eslint/no-explicit-any */
import { PRODUCTS_STATIC_CONTENT } from "@/const/productsContent";

export type ProductTabKey =
  | "Description"
  | "Usage"
  | "Benefits"
  | "Ingredients"
  | "Safety";

const PLAN_ALIASES: Record<string, string[]> = {
  monthly: ["monthly", "month"],
  every_2_months: ["every_2_months", "bimonthly", "bi_monthly", "2_months"],
  cycle_sync: ["cycle_sync", "cycleSync", "cyclesync"],
};

const SIZE_ALIASES: Array<{ key: string; patterns: RegExp[] }> = [
  { key: "MIX", patterns: [/mix/i, /custom/i] },
  { key: "XLP", patterns: [/xl\+/i, /\bxlp\b/i, /320/i, /overnight/i, /day[-\s]?night/i] },
  { key: "XXL", patterns: [/\bxxl\b/i, /xxxl/i, /44/i, /56/i] },
  { key: "LXL", patterns: [/\bm-xl\b/i, /\blxl\b/i, /28/i, /44/i] },
  { key: "XL", patterns: [/\bxl\b/i, /280/i, /extra\s*large/i] },
  { key: "L", patterns: [/\bl\b/i, /240/i, /large/i] },
  { key: "M", patterns: [/\bm\b/i, /medium/i] },
  { key: "S", patterns: [/\bs\b/i, /small/i] },
];

const TAB_FIELD_ALIASES: Record<ProductTabKey, string[]> = {
  Description: ["description", "desc", "long", "copy", "short"],
  Usage: ["usage", "howToUse", "how_to_use", "instructions", "use"],
  Benefits: ["benefits", "benefit", "features", "bullets"],
  Ingredients: ["ingredients", "ingredient", "materials", "material"],
  Safety: ["safety", "safe", "warnings", "warning", "care"],
};

export function getProductStaticContent(product: any) {
  const slug = product?.slug || product?.productSlug || product?.product?.slug;
  if (!slug) return null;

  return (
    PRODUCTS_STATIC_CONTENT[slug] ||
    PRODUCTS_STATIC_CONTENT[String(slug).toLowerCase()] ||
    null
  );
}

export function resolveStaticSizeKey(
  sizeOrHash: string | undefined,
  variant: any,
  staticContent: any,
) {
  const source = [
    sizeOrHash,
    variant?.size,
    variant?.name,
    variant?.flowType,
    variant?.sku,
  ]
    .filter(Boolean)
    .join(" ");

  const hash = sizeOrHash?.startsWith("#") ? sizeOrHash.toLowerCase() : "";
  const hashKey = hash ? staticContent?.HASH_MAP?.[hash] : "";
  if (hashKey) return hashKey;

  const availableKeys = Object.keys(staticContent?.SIZES || {});
  const exact = availableKeys.find(
    (key) =>
      key.toLowerCase() === String(sizeOrHash || "").toLowerCase() ||
      staticContent?.SIZES?.[key]?.label?.toLowerCase() ===
        String(sizeOrHash || "").toLowerCase(),
  );
  if (exact) return exact;

  const matchedAlias = SIZE_ALIASES.find(
    (alias) =>
      availableKeys.includes(alias.key) &&
      alias.patterns.some((pattern) => pattern.test(source)),
  );
  if (matchedAlias) return matchedAlias.key;

  return availableKeys[0] || null;
}

export function getStaticVariantInfo(staticContent: any, sizeKey: string | null) {
  if (!staticContent || !sizeKey) return null;
  return (
    staticContent?.SIZES?.[sizeKey] ||
    staticContent?.VARIANTS?.[sizeKey] ||
    staticContent?.DETAILS?.[sizeKey] ||
    staticContent?.[sizeKey] ||
    null
  );
}

export function getStaticShortText(variantInfo: any, staticContent: any) {
  return (
    variantInfo?.short ||
    variantInfo?.description ||
    variantInfo?.desc ||
    staticContent?.MIX_DESC ||
    ""
  );
}

export function getStaticBullets(variantInfo: any) {
  const bullets = variantInfo?.bullets || variantInfo?.tags || [];
  return Array.isArray(bullets) ? bullets.filter(Boolean) : [];
}

export function getStaticTabCopy(
  staticContent: any,
  sizeKey: string | null,
  selectedTab: ProductTabKey,
) {
  const tabKey = selectedTab.toLowerCase();
  const tabCopy = sizeKey ? staticContent?.TAB_COPY?.[sizeKey]?.[tabKey] : null;
  if (tabCopy) return tabCopy;

  const variantInfo = getStaticVariantInfo(staticContent, sizeKey);
  const field = TAB_FIELD_ALIASES[selectedTab].find(
    (key) => variantInfo?.[key],
  );
  return field ? variantInfo[field] : null;
}

export function getStaticSpecs(staticContent: any, sizeKey: string | null) {
  const specs = getStaticVariantInfo(staticContent, sizeKey)?.specs;
  return Array.isArray(specs) ? specs : [];
}

export function getMaxBoxes(staticContent: any, fallback = 6) {
  const value = Number(staticContent?.PRICING?.MAX_BOXES);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function getFreeShippingThreshold(staticContent: any, fallback?: number) {
  const value = Number(staticContent?.PRICING?.FREE_SHIP ?? fallback);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function getModeDiscount(staticContent: any, planId?: string | null) {
  const discounts = staticContent?.PRICING?.modeDiscount || {};
  const aliases = PLAN_ALIASES[planId || ""] || [planId || ""];
  const raw = aliases.map((alias) => discounts[alias]).find((value) => value != null);
  return normalizeDiscount(raw);
}

export function getVolumeDiscount(staticContent: any, quantity: number) {
  const discounts = staticContent?.PRICING?.volumeDiscount;
  if (!discounts) return 0;

  if (Array.isArray(discounts)) {
    const best = discounts
      .filter((entry) => Number(entry?.qty ?? entry?.quantity ?? entry?.min) <= quantity)
      .sort(
        (a, b) =>
          Number(b?.qty ?? b?.quantity ?? b?.min) -
          Number(a?.qty ?? a?.quantity ?? a?.min),
      )[0];
    return normalizeDiscount(best?.discount ?? best?.value);
  }

  return normalizeDiscount(discounts[String(quantity)] ?? discounts[quantity]);
}

export function applyDiscounts(price: number, ...discounts: number[]) {
  const discounted = discounts.reduce(
    (current, discount) => current * (1 - discount),
    Number(price) || 0,
  );
  return Math.round(discounted);
}

function normalizeDiscount(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return numeric > 1 ? numeric / 100 : numeric;
}
