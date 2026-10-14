export const MIX_BOX_PAD_UNIT = 21;
export const MIX_BOX_MAX_PADS = 63; // Up to 3 boxes (63 pads) per order
export const MIX_BOX_FREE_LINERS_PER_BOX = 4;

export type PadSize = "L" | "XL" | "XL+";
export type PurchaseType = "one_time" | "subscription";
export type SubscriptionType = "monthly" | "every_2_months" | "cycle_sync" | null;

export type MixBoxRecipe = Record<PadSize, number>;

export type MixBoxSelection = {
  size: PadSize;
  quantity: number;
};

export type MixBoxPricingInput = {
  recipe: MixBoxRecipe;
  setPrice: number;
  purchaseType?: PurchaseType;
  subscriptionType?: SubscriptionType;
};

export const SUBSCRIPTION_MULTIPLIERS: Record<Exclude<SubscriptionType, null>, number> = {
  monthly: 0.85,
  every_2_months: 0.88,
  cycle_sync: 0.85,
};

export const MIX_BOX_DEFAULT_RECIPE: MixBoxRecipe = {
  L: 6,
  XL: 9,
  "XL+": 6,
};

export const MIX_BOX_SHORTCUTS: {
  id: string;
  name: string;
  recipe: MixBoxRecipe;
}[] = [
  { id: "recommended", name: "Recommended", recipe: { L: 6, XL: 9, "XL+": 6 } },
  { id: "lighter_flow", name: "Lighter flow", recipe: { L: 12, XL: 6, "XL+": 3 } },
  { id: "heavier_flow", name: "Heavier flow", recipe: { L: 3, XL: 9, "XL+": 9 } },
  { id: "more_nights", name: "More nights", recipe: { L: 3, XL: 6, "XL+": 12 } },
  { id: "reset", name: "Reset", recipe: { L: 6, XL: 9, "XL+": 6 } },
];

export function emptyMixBoxRecipe(): MixBoxRecipe {
  return { L: 0, XL: 0, "XL+": 0 };
}

export function normalizePadSize(value: string): PadSize | null {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();

  if (
    normalized.includes("XL+") ||
    normalized.includes("XL PLUS") ||
    normalized.includes("XLPLUS") ||
    normalized.includes("320")
  ) {
    return "XL+";
  }

  if (
    normalized.includes("XL") ||
    normalized.includes("EXTRA LARGE") ||
    normalized.includes("EXTRALARGE") ||
    normalized.includes("280")
  ) {
    return "XL";
  }

  if (
    normalized.includes("240") ||
    normalized.includes("LARGE") ||
    /\bL\b/.test(normalized) ||
    normalized.startsWith("L ") ||
    normalized.startsWith("L(") ||
    normalized === "L"
  ) {
    return "L";
  }

  return null;
}

export function normalizeMixBoxRecipe(selections: MixBoxSelection[]): MixBoxRecipe {
  return selections.reduce<MixBoxRecipe>((recipe, selection) => {
    recipe[selection.size] = Math.max(0, Math.trunc(Number(selection.quantity) || 0));
    return recipe;
  }, emptyMixBoxRecipe());
}

export function getMixBoxTotalPads(recipe: MixBoxRecipe): number {
  return (recipe.L || 0) + (recipe.XL || 0) + (recipe["XL+"] || 0);
}

export function getMixBoxRecipeLines(recipe?: MixBoxRecipe | null) {
  if (!recipe) return [];

  return (["L", "XL", "XL+"] as PadSize[])
    .map((size) => ({
      size,
      quantity: Math.max(0, Math.trunc(Number(recipe[size]) || 0)),
    }))
    .filter((item) => item.quantity > 0);
}

export function formatMixBoxRecipe(
  recipe?: MixBoxRecipe | null,
  optionsOrLiners?: number | boolean | { includeLiners?: boolean; freeLiners?: number },
  includeLiners: boolean = false,
): string {
  if (!recipe || (recipe as any).type === "yatraKit" || (recipe as any).kitId) return "";

  const l = Number(recipe.L) || 0;
  const xl = Number(recipe.XL) || 0;
  const xlPlus = Number(recipe["XL+"]) || 0;

  if (l === 0 && xl === 0 && xlPlus === 0) return "";

  const base = `Mix Your Box · ${l} L · ${xl} XL · ${xlPlus} XL+`;

  let shouldInclude = false;
  let linersCount = MIX_BOX_FREE_LINERS_PER_BOX;

  if (typeof optionsOrLiners === "boolean") {
    shouldInclude = optionsOrLiners;
  } else if (typeof optionsOrLiners === "object" && optionsOrLiners !== null) {
    shouldInclude = Boolean(optionsOrLiners.includeLiners);
    if (typeof optionsOrLiners.freeLiners === "number") {
      linersCount = optionsOrLiners.freeLiners;
    }
  } else if (typeof includeLiners === "boolean" && includeLiners) {
    shouldInclude = true;
    if (typeof optionsOrLiners === "number") {
      linersCount = optionsOrLiners;
    }
  }

  if (shouldInclude && linersCount > 0) {
    return `${base} · ${linersCount} liners`;
  }

  return base;
}

export function getMixBoxAdjustmentMessage(totalPads: number): string {
  if (totalPads === MIX_BOX_PAD_UNIT) {
    return "✓ Box complete: 21 pads + 4 free liners included!";
  }

  if (totalPads < MIX_BOX_PAD_UNIT) {
    const diff = MIX_BOX_PAD_UNIT - totalPads;
    return `Add ${diff} more`;
  }

  const diff = totalPads - MIX_BOX_PAD_UNIT;
  return `Remove ${diff}`;
}

export function validateMixBoxRecipe(recipe: MixBoxRecipe) {
  const totalPads = getMixBoxTotalPads(recipe);

  if (totalPads !== MIX_BOX_PAD_UNIT) {
    return {
      valid: false,
      totalPads,
      message: getMixBoxAdjustmentMessage(totalPads),
    };
  }

  return { valid: true, totalPads, message: "" };
}

export function calculateMixBoxPricing({
  recipe,
  setPrice,
  boxCount = 1,
  purchaseType = "one_time",
  subscriptionType = null,
}: MixBoxPricingInput & { boxCount?: number }) {
  const validation = validateMixBoxRecipe(recipe);

  if (!validation.valid) {
    return {
      valid: false as const,
      totalPads: validation.totalPads,
      boxCount: 0,
      freeLiners: 0,
      price: null,
      perPadPrice: null,
      message: validation.message,
    };
  }

  const effectiveBoxCount = Math.max(1, Math.min(boxCount, 3));
  const multiplier =
    purchaseType === "subscription" && subscriptionType
      ? SUBSCRIPTION_MULTIPLIERS[subscriptionType] ?? 1
      : 1;

  const price = Number((effectiveBoxCount * setPrice * multiplier).toFixed(2));
  const perPadPrice = Number(((setPrice * multiplier) / MIX_BOX_PAD_UNIT).toFixed(2));

  return {
    valid: true as const,
    totalPads: MIX_BOX_PAD_UNIT * effectiveBoxCount,
    boxCount: effectiveBoxCount,
    freeLiners: effectiveBoxCount * MIX_BOX_FREE_LINERS_PER_BOX,
    price,
    perPadPrice,
    message: "",
  };
}

export function getMixBoxCartKey({
  productId,
  recipe,
  purchaseType,
  subscriptionType,
}: {
  productId: string;
  recipe: MixBoxRecipe;
  purchaseType: PurchaseType;
  subscriptionType: SubscriptionType;
}) {
  return [
    productId,
    recipe.L,
    recipe.XL,
    recipe["XL+"],
    purchaseType,
    subscriptionType ?? "none",
  ].join(":");
}
