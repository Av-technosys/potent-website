// lib/shippingConfig.ts
/**
 * Single source of truth for store-wide shipping & delivery thresholds.
 * An order of exactly ₹399 qualifies for free delivery.
 */
export const FREE_SHIPPING_THRESHOLD = 399;
export const STANDARD_SHIPPING_FEE = 60;

export function calculateShippingFee(amount: number): number {
  if (amount <= 0) return 0;
  return amount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function isFreeShippingEligible(amount: number): boolean {
  return amount >= FREE_SHIPPING_THRESHOLD;
}

export const FREE_SHIPPING_TEXT = `Free shipping over ₹${FREE_SHIPPING_THRESHOLD}`;
export const FREE_DELIVERY_TEXT = `Free delivery over ₹${FREE_SHIPPING_THRESHOLD}`;

