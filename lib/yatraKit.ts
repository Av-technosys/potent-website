export type YatraKitItemKey =
  | "seat"
  | "pp"
  | "funnel"
  | "pads:l"
  | "pads:xl"
  | "pads:xlp"
  | "panty:lxl"
  | "panty:xxl3xl"
  | "liner"
  | "cup";

export type YatraKitRecipe = Partial<Record<YatraKitItemKey, number>>;

export type YatraMappedProduct = {
  key: YatraKitItemKey;
  productId: string;
  productVariantId: string;
  slug: string;
  title: string;
  variantName: string;
  sku: string;
  image: string;
  price: number;
  unit: string;
};

export const YATRA_ITEM_LOOKUP: Record<
  YatraKitItemKey,
  {
    slug: string;
    variantHint: string;
    unit: string;
    label: string;
  }
> = {
  seat: {
    slug: "looway-toilet-seat-covers",
    variantHint: "Pack of 10",
    unit: "pack",
    label: "Looway Toilet Seat Covers",
  },
  pp: {
    slug: "looway-pee-puke",
    variantHint: "Pack of 10",
    unit: "pack",
    label: "Looway Pee & Puke Bags",
  },
  funnel: {
    slug: "looway-pee-funnel",
    variantHint: "Pack of 1",
    unit: "piece",
    label: "Looway Pee Funnel",
  },
  "pads:l": {
    slug: "ovy-pads",
    variantHint: "Ovy L Organic",
    unit: "pack",
    label: "Ovy Pads L",
  },
  "pads:xl": {
    slug: "ovy-pads",
    variantHint: "Ovy XL Organic",
    unit: "pack",
    label: "Ovy Pads XL",
  },
  "pads:xlp": {
    slug: "ovy-pads",
    variantHint: "Ovy XL+ Organic",
    unit: "pack",
    label: "Ovy Pads XL+",
  },
  "panty:lxl": {
    slug: "ovy-panty",
    variantHint: "L-XL",
    unit: "pack",
    label: "Ovy Period Panty L-XL",
  },
  "panty:xxl3xl": {
    slug: "ovy-panty",
    variantHint: "XXL",
    unit: "pack",
    label: "Ovy Period Panty XXL",
  },
  liner: {
    slug: "ovy-liners",
    variantHint: "Pack of 40",
    unit: "pack",
    label: "Ovy Daily Liners",
  },
  cup: {
    slug: "ovy-cup",
    variantHint: "Teen",
    unit: "piece",
    label: "Ovy Menstrual Cup",
  },
};

const MAX_QTY: Record<YatraKitItemKey, number> = {
  seat: 6,
  pp: 6,
  funnel: 3,
  "pads:l": 4,
  "pads:xl": 4,
  "pads:xlp": 4,
  "panty:lxl": 4,
  "panty:xxl3xl": 4,
  liner: 4,
  cup: 2,
};

export function normalizeYatraKitRecipe(recipe: Record<string, unknown> | null | undefined) {
  const normalized: YatraKitRecipe = {};

  Object.keys(YATRA_ITEM_LOOKUP).forEach((key) => {
    const itemKey = key as YatraKitItemKey;
    const qty = Math.trunc(Number(recipe?.[itemKey]) || 0);
    const cappedQty = Math.min(Math.max(qty, 0), MAX_QTY[itemKey]);

    if (cappedQty > 0) {
      normalized[itemKey] = cappedQty;
    }
  });

  return normalized;
}

export function getYatraKitDistinctItemCount(recipe: YatraKitRecipe) {
  return Object.values(recipe).filter((qty) => Number(qty || 0) > 0).length;
}

export function getYatraKitTotal(recipe: YatraKitRecipe, mappedProducts: Partial<Record<YatraKitItemKey, YatraMappedProduct>>) {
  return Object.entries(recipe).reduce((total, [key, quantity]) => {
    const product = mappedProducts[key as YatraKitItemKey];
    return total + Number(product?.price || 0) * Number(quantity || 0);
  }, 0);
}
