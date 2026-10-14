/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Returns the maximum purchase quantity allowed for a product or cart item.
 * Rules:
 * - Admin limit takes precedence if configured on the product record.
 * - Pads of one size: 6
 * - Teen kits: 6
 * - Panties: 6
 * - Liners: 6
 * - Seat covers: 6
 * - Bags: 6
 * - Mix Your Box: up to 3 boxes
 * - Cup: 4 (or admin limit if set)
 * - Funnel: 3 (or admin limit if set)
 */
export function getProductMaxQuantity(productOrItem?: {
  slug?: string;
  productId?: string;
  maxQuantityPurchase?: number | null;
  max_quantity_purchase?: number | null;
  mixBoxRecipe?: any;
  isMixBox?: boolean;
} | null): number {
  if (!productOrItem) return 6;

  const slug = (productOrItem.slug || "").toLowerCase();

  // Mix Your Box: up to 3 boxes (see A6)
  if (productOrItem.mixBoxRecipe || productOrItem.isMixBox || slug.includes("mix")) {
    return 3;
  }

  // Yatra Kit: up to 3 kits
  if ((productOrItem as any)?.yatraKit || slug.includes("yatra")) {
    return 3;
  }

  const adminLimit = Number(
    productOrItem.maxQuantityPurchase || productOrItem.max_quantity_purchase
  );

  if (slug === "ovy-cup" || slug.includes("cup")) {
    return adminLimit > 0 ? adminLimit : 4;
  }

  if (slug === "looway-pee-funnel" || slug.includes("funnel")) {
    return adminLimit > 0 ? adminLimit : 3;
  }

  if (adminLimit > 0) {
    return adminLimit;
  }

  return 6;
}

export function getMaxQuantityMessage(max: number): string {
  return `Maximum ${max} per order`;
}

export function getMixBoxLimitMessage(): string {
  return "Need more? Write to care@potenthygiene.com";
}

