export const MIX_BOX_PAD_UNIT = 21;
export const MIX_BOX_MAX_PADS = 126;
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

export function emptyMixBoxRecipe(): MixBoxRecipe {
  return { L: 0, XL: 0, "XL+": 0 };
}

export function normalizePadSize(value: string): PadSize | null {
  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");

  if (normalized.includes("XL+")) return "XL+";
  if (normalized === "XL" || normalized.includes("EXTRALARGE")) return "XL";
  if (normalized === "L" || normalized.includes("LARGE")) return "L";

  return null;
}

export function normalizeMixBoxRecipe(selections: MixBoxSelection[]): MixBoxRecipe {
  return selections.reduce<MixBoxRecipe>((recipe, selection) => {
    recipe[selection.size] += Math.max(0, Math.trunc(Number(selection.quantity) || 0));
    return recipe;
  }, emptyMixBoxRecipe());
}

export function getMixBoxTotalPads(recipe: MixBoxRecipe): number {
  return recipe.L + recipe.XL + recipe["XL+"];
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

export function formatMixBoxRecipe(recipe?: MixBoxRecipe | null) {
  const lines = getMixBoxRecipeLines(recipe);
  if (!lines.length) return "";

  return lines.map((item) => `${item.size}: ${item.quantity}`).join(", ");
}

export function getMixBoxAdjustmentMessage(totalPads: number): string {
  if (totalPads <= 0) return `Add ${MIX_BOX_PAD_UNIT} pads to complete 1 box.`;

  const remainder = totalPads % MIX_BOX_PAD_UNIT;
  if (remainder === 0) return "";

  const padsToAdd = MIX_BOX_PAD_UNIT - remainder;
  const padsToRemove = remainder;

  return padsToAdd <= padsToRemove
    ? `Add ${padsToAdd} more pad${padsToAdd === 1 ? "" : "s"} to complete this box.`
    : `Remove ${padsToRemove} pad${padsToRemove === 1 ? "" : "s"} to complete this box.`;
}

export function validateMixBoxRecipe(recipe: MixBoxRecipe) {
  const totalPads = getMixBoxTotalPads(recipe);

  if (totalPads <= 0) {
    return { valid: false, totalPads, message: "Add pads to build your box." };
  }

  if (totalPads > MIX_BOX_MAX_PADS) {
    return {
      valid: false,
      totalPads,
      message: `Remove ${totalPads - MIX_BOX_MAX_PADS} pads. Maximum is ${MIX_BOX_MAX_PADS} pads.`,
    };
  }

  if (totalPads % MIX_BOX_PAD_UNIT !== 0) {
    return { valid: false, totalPads, message: getMixBoxAdjustmentMessage(totalPads) };
  }

  return { valid: true, totalPads, message: "" };
}

export function calculateMixBoxPricing({
  recipe,
  setPrice,
  purchaseType = "one_time",
  subscriptionType = null,
}: MixBoxPricingInput) {
  const validation = validateMixBoxRecipe(recipe);

  if (!validation.valid) {
    return {
      valid: false as const,
      totalPads: validation.totalPads,
      boxCount: 0,
      freeLiners: 0,
      price: null,
      message: validation.message,
    };
  }

  const boxCount = validation.totalPads / MIX_BOX_PAD_UNIT;
  const multiplier =
    purchaseType === "subscription" && subscriptionType
      ? SUBSCRIPTION_MULTIPLIERS[subscriptionType]
      : 1;

  return {
    valid: true as const,
    totalPads: validation.totalPads,
    boxCount,
    freeLiners: boxCount * MIX_BOX_FREE_LINERS_PER_BOX,
    price: Number((boxCount * setPrice * multiplier).toFixed(2)),
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
