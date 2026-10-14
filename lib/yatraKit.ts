export type YatraKitItemKey =
  | "seat"
  | "seat:p2"
  | "seat:p4"
  | "pp"
  | "pp:10"
  | "pp:20"
  | "funnel"
  | "pads:l"
  | "pads:xl"
  | "pads:xlp"
  | "panty:lxl"
  | "panty:xxl3xl"
  | "liner"
  | "liner:40"
  | "liner:60"
  | "liner:80"
  | "cup"
  | "cup:xs"
  | "cup:m"
  | "cup:l";

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
    variantHint: "2",
    unit: "pack",
    label: "Looway Toilet Seat Covers (2-Pack · 50 covers)",
  },
  "seat:p2": {
    slug: "looway-toilet-seat-covers",
    variantHint: "2",
    unit: "pack",
    label: "Looway Toilet Seat Covers (2-Pack · 50 covers)",
  },
  "seat:p4": {
    slug: "looway-toilet-seat-covers",
    variantHint: "4",
    unit: "pack",
    label: "Looway Toilet Seat Covers (4-Pack · 100 covers)",
  },
  pp: {
    slug: "looway-pee-puke",
    variantHint: "10",
    unit: "pack",
    label: "Looway Pee & Puke Bags (Pack of 10)",
  },
  "pp:10": {
    slug: "looway-pee-puke",
    variantHint: "10",
    unit: "pack",
    label: "Looway Pee & Puke Bags (Pack of 10)",
  },
  "pp:20": {
    slug: "looway-pee-puke",
    variantHint: "20",
    unit: "pack",
    label: "Looway Pee & Puke Bags (Pack of 20)",
  },
  funnel: {
    slug: "looway-pee-funnel",
    variantHint: "1",
    unit: "piece",
    label: "Looway Pee Funnel",
  },
  "pads:l": {
    slug: "ovy-pads",
    variantHint: "240",
    unit: "pack",
    label: "Ovy Pads L (240mm)",
  },
  "pads:xl": {
    slug: "ovy-pads",
    variantHint: "280",
    unit: "pack",
    label: "Ovy Pads XL (280mm)",
  },
  "pads:xlp": {
    slug: "ovy-pads",
    variantHint: "320",
    unit: "pack",
    label: "Ovy Pads XL+ (320mm)",
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
    variantHint: "40",
    unit: "pack",
    label: "Ovy Daily Liners (Pack of 40)",
  },
  "liner:40": {
    slug: "ovy-liners",
    variantHint: "40",
    unit: "pack",
    label: "Ovy Daily Liners (Pack of 40)",
  },
  "liner:60": {
    slug: "ovy-liners",
    variantHint: "60",
    unit: "pack",
    label: "Ovy Daily Liners (Pack of 60)",
  },
  "liner:80": {
    slug: "ovy-liners",
    variantHint: "80",
    unit: "pack",
    label: "Ovy Daily Liners (Pack of 80)",
  },
  cup: {
    slug: "ovy-cup",
    variantHint: "Teen",
    unit: "piece",
    label: "Ovy Menstrual Cup (Teen XS Pink)",
  },
  "cup:xs": {
    slug: "ovy-cup",
    variantHint: "Teen",
    unit: "piece",
    label: "Ovy Menstrual Cup (Teen XS Pink)",
  },
  "cup:m": {
    slug: "ovy-cup",
    variantHint: "Medium",
    unit: "piece",
    label: "Ovy Menstrual Cup (Medium Purple)",
  },
  "cup:l": {
    slug: "ovy-cup",
    variantHint: "Large",
    unit: "piece",
    label: "Ovy Menstrual Cup (Large White)",
  },
};

export const MAX_QTY: Record<string, number> = {
  seat: 6,
  "seat:p2": 6,
  "seat:p4": 6,
  pp: 6,
  "pp:10": 6,
  "pp:20": 6,
  funnel: 3,
  "pads:l": 4,
  "pads:xl": 4,
  "pads:xlp": 4,
  "panty:lxl": 4,
  "panty:xxl3xl": 4,
  liner: 4,
  "liner:40": 4,
  "liner:60": 4,
  "liner:80": 4,
  cup: 2,
  "cup:xs": 2,
  "cup:m": 2,
  "cup:l": 2,
};

export type YatraProductGroup = "seat" | "pp" | "funnel" | "pads" | "liner" | "cup" | "panty";

export interface YatraVariantOption {
  key: YatraKitItemKey;
  label: string;
  badge?: string;
  shortDesc?: string;
}

export const YATRA_VARIANT_GROUPS: Record<
  string,
  {
    group: YatraProductGroup;
    title: string;
    options: YatraVariantOption[];
  }
> = {
  pads: {
    group: "pads",
    title: "Ovy Soft Sanitary Pads",
    options: [
      { key: "pads:l", label: "L", badge: "240mm", shortDesc: "Light to Medium flow" },
      { key: "pads:xl", label: "XL", badge: "280mm", shortDesc: "Regular to Heavy flow" },
      { key: "pads:xlp", label: "XL+", badge: "320mm", shortDesc: "Heavy & Night coverage" },
    ],
  },
  liner: {
    group: "liner",
    title: "Ovy Daily Panty Liners",
    options: [
      { key: "liner:40", label: "Pack of 40", badge: "40 pcs", shortDesc: "Starter pack" },
      { key: "liner:60", label: "Pack of 60", badge: "60 pcs", shortDesc: "Our pick" },
      { key: "liner:80", label: "Pack of 80", badge: "80 pcs", shortDesc: "Best value" },
    ],
  },
  seat: {
    group: "seat",
    title: "Looway Toilet Seat Covers",
    options: [
      { key: "seat:p2", label: "2-Pack", badge: "50 covers", shortDesc: "2 boxes · 50 covers" },
      { key: "seat:p4", label: "4-Pack", badge: "100 covers", shortDesc: "4 boxes · Best value" },
    ],
  },
  cup: {
    group: "cup",
    title: "Ovy Menstrual Cup",
    options: [
      { key: "cup:xs", label: "Teen (XS)", badge: "Pink", shortDesc: "For teens & first-time users" },
      { key: "cup:m", label: "Medium", badge: "Purple", shortDesc: "Regular flow & adult fit" },
      { key: "cup:l", label: "Large", badge: "White", shortDesc: "Heavy flow & post-childbirth" },
    ],
  },
  pp: {
    group: "pp",
    title: "Looway Pee & Puke Bags",
    options: [
      { key: "pp:10", label: "Pack of 10", badge: "10 bags", shortDesc: "Standard travel supply" },
      { key: "pp:20", label: "Pack of 20", badge: "20 bags", shortDesc: "Save vs two 10-packs" },
    ],
  },
};

export function getItemProductGroup(key: string): YatraProductGroup {
  if (key.startsWith("pads:")) return "pads";
  if (key.startsWith("liner")) return "liner";
  if (key.startsWith("seat")) return "seat";
  if (key.startsWith("cup")) return "cup";
  if (key.startsWith("pp")) return "pp";
  if (key.startsWith("panty:")) return "panty";
  if (key === "funnel") return "funnel";
  return key as YatraProductGroup;
}

export function normalizeYatraKitRecipe(recipe: Record<string, unknown> | null | undefined) {
  const normalized: YatraKitRecipe = {};
  if (!recipe || typeof recipe !== "object") return normalized;

  Object.entries(recipe).forEach(([key, val]) => {
    let itemKey = key as YatraKitItemKey;
    if ((key as string) === "seat") itemKey = "seat:p2";
    else if ((key as string) === "pp") itemKey = "pp:10";
    else if ((key as string) === "liner") itemKey = "liner:40";
    else if ((key as string) === "cup") itemKey = "cup:xs";

    const qty = Math.trunc(Number(val) || 0);
    const maxLimit = MAX_QTY[itemKey] || 6;
    const cappedQty = Math.min(Math.max(qty, 0), maxLimit);

    if (cappedQty > 0) {
      normalized[itemKey] = Math.min(maxLimit, (normalized[itemKey] || 0) + cappedQty);
    }
  });

  return normalized;
}

export function getYatraKitDistinctItemCount(recipe: YatraKitRecipe) {
  return Object.values(recipe).filter((qty) => Number(qty || 0) > 0).length;
}

export function getYatraKitTotal(
  recipe: YatraKitRecipe,
  mappedProducts: Partial<Record<YatraKitItemKey, YatraMappedProduct>>,
) {
  return Object.entries(recipe).reduce((total, [key, quantity]) => {
    const product = mappedProducts[key as YatraKitItemKey];
    return total + Number(product?.price || 0) * Number(quantity || 0);
  }, 0);
}

export interface YatraKitCartItem {
  kitId: string;
  kitName: string;
  recipe: YatraKitRecipe;
  items: Array<{
    key: YatraKitItemKey;
    qty: number;
    title: string;
    variantName?: string;
    price: number;
    productId?: string;
    productVariantId?: string;
    sku?: string;
  }>;
  freeWipes: boolean;
  freeWipesCount?: number;
}

export function formatYatraKitSummary(kit?: YatraKitCartItem | null): string {
  if (!kit) return "";
  const itemsText = (kit.items || [])
    .filter((i) => i.qty > 0)
    .map((i) => {
      const v = i.variantName && i.variantName !== i.title ? ` (${i.variantName})` : "";
      return `${i.qty} ${i.title}${v}`;
    })
    .join(" · ");

  const wipesText = kit.freeWipes ? ` · Free Intimate Wipes (${kit.freeWipesCount || 10} wipes)` : "";
  return `Looway Yatra Kit (${kit.kitName}) · ${itemsText}${wipesText}`;
}

export const DEFAULT_KIT_RECIPES: Record<string, YatraKitRecipe> = {
  complete: { "seat:p2": 1, funnel: 1, "pp:10": 1, "liner:40": 1 },
  weekender: { "seat:p2": 1, "pp:10": 1 },
  family: { "seat:p2": 2, "pp:10": 2, funnel: 1 },
  girls: { "seat:p2": 2, funnel: 1, "pads:l": 1, "liner:40": 1 },
  boys: { "seat:p4": 1, "pp:20": 2 },
  teerth: { "seat:p2": 2, funnel: 1, "pp:10": 1 },
  preg: { "seat:p2": 1, funnel: 1, "pp:10": 1, "liner:40": 1 },
  toddler: { "seat:p2": 2, "pp:10": 1 },
};

export const KIT_NAME_TO_ID: Record<string, string> = {
  complete: "complete",
  weekender: "weekender",
  family: "family",
  girls: "girls",
  "girls' trip": "girls",
  "girls trip": "girls",
  boys: "boys",
  "boys' trip": "boys",
  "boys trip": "boys",
  teerth: "teerth",
  "teerth yatra": "teerth",
  preg: "preg",
  pregnancy: "preg",
  "pregnancy travel": "preg",
  toddler: "toddler",
  "toddler travel": "toddler",
};

export function getKitRecipeByIdOrName(idOrName?: string | null): YatraKitRecipe {
  if (!idOrName) return DEFAULT_KIT_RECIPES.complete;
  const key = idOrName.toLowerCase().trim();
  const matchedId = KIT_NAME_TO_ID[key] || key;
  return DEFAULT_KIT_RECIPES[matchedId] || DEFAULT_KIT_RECIPES.complete;
}

export function formatYatraKitContents(kit?: YatraKitCartItem | null): string {
  if (!kit) return "";

  if (Array.isArray(kit.items) && kit.items.length > 0) {
    const formatted = kit.items
      .filter((i) => Number(i.qty) > 0)
      .map((i) => {
        const v = i.variantName && i.variantName !== i.title ? ` (${i.variantName})` : "";
        return `${i.qty}× ${i.title}${v}`;
      })
      .join(" · ");
    if (formatted) return formatted;
  }

  const recipe =
    kit.recipe && Object.values(kit.recipe).some((q) => Number(q) > 0)
      ? kit.recipe
      : getKitRecipeByIdOrName(kit.kitId || kit.kitName);

  if (recipe && typeof recipe === "object") {
    const formatted = Object.entries(recipe)
      .filter(([, qty]) => Number(qty) > 0)
      .map(([key, qty]) => {
        const lookup = YATRA_ITEM_LOOKUP[key as YatraKitItemKey];
        const label = lookup?.label || key;
        return `${qty}× ${label}`;
      })
      .join(" · ");
    if (formatted) return formatted;
  }

  return "";
}

export function getYatraKitCartKey(kit: YatraKitCartItem): string {
  const recipeStr = Object.entries(kit.recipe || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join(",");
  return `yatra-kit-${kit.kitId}-${recipeStr}`;
}

export function isYatraKitCartItem(data: any): data is YatraKitCartItem {
  return Boolean(
    data &&
      (data.type === "yatraKit" ||
        data.kitId ||
        (data.recipe && Array.isArray(data.items))),
  );
}

export function getYatraKitData(item: any): YatraKitCartItem | null {
  if (!item) return null;

  let yk = item.yatraKit;
  if (typeof yk === "string") {
    try {
      yk = JSON.parse(yk);
    } catch {}
  }
  if (
    yk &&
    (yk.type === "yatraKit" ||
      yk.kitId ||
      yk.kitName ||
      yk.recipe ||
      Array.isArray(yk.items))
  ) {
    if ((!yk.recipe || Object.keys(yk.recipe).length === 0) && (!yk.items || yk.items.length === 0)) {
      yk.recipe = getKitRecipeByIdOrName(yk.kitId || yk.kitName);
    }
    return yk;
  }

  let mbr = item.mixBoxRecipe;
  if (typeof mbr === "string") {
    try {
      mbr = JSON.parse(mbr);
    } catch {}
  }
  if (
    mbr &&
    (mbr.type === "yatraKit" || mbr.kitId || mbr.kitName || mbr.recipe)
  ) {
    if ((!mbr.recipe || Object.keys(mbr.recipe).length === 0) && (!mbr.items || mbr.items.length === 0)) {
      mbr.recipe = getKitRecipeByIdOrName(mbr.kitId || mbr.kitName);
    }
    return mbr;
  }

  if (
    item.slug === "looway-yatra-kit" ||
    (typeof item.sku === "string" && item.sku.startsWith("YATRA-KIT")) ||
    (typeof item.title === "string" && item.title.includes("Yatra Kit"))
  ) {
    const skuKitMatch = typeof item.sku === "string" ? item.sku.match(/YATRA-KIT-([A-Z0-9_-]+)/i) : null;
    const rawKitId = (skuKitMatch ? skuKitMatch[1].toLowerCase() : item.variantName?.toLowerCase()) || "complete";
    const kitId = KIT_NAME_TO_ID[rawKitId] || rawKitId;
    return {
      kitId,
      kitName: item.variantName || (kitId.charAt(0).toUpperCase() + kitId.slice(1)),
      recipe: getKitRecipeByIdOrName(kitId),
      items: [],
      freeWipes: true,
      freeWipesCount: 10,
    };
  }

  return null;
}

