/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartCoupon } from "./cartTypes";
import { getMixBoxCartKey } from "@/lib/mixYourBox";
import { getProductMaxQuantity } from "@/lib/productQuantityLimits";

type CartState = {
  items: CartItem[];
  appliedCoupon: CartCoupon | null;
  isGift: boolean;
  giftNote: string;

  addItem: (item: Omit<CartItem, "addedAt">) => void;
  removeItem: (
    productId: string,
    sku?: string,
    uuid?: any,
    productVariantId?: string,
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    sku?: string,
    productVariantId?: string,
  ) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  setAppliedCoupon: (coupon: CartCoupon | null) => void;
  setIsGift: (isGift: boolean) => void;
  setGiftNote: (giftNote: string) => void;

  totalItems: () => number;
  subtotal: () => number;
};

// const getItemKey = (item: { productId: string; sku?: string, uuid?: any }) =>
//   `${item.productId}-${item.sku || "default"}`;

const getItemKey = (item: {
  productId: string;
  productVariantId?: string;
  sku?: string;
  uuid?: string;
  mixBoxRecipe?: CartItem["mixBoxRecipe"];
  purchaseType?: CartItem["purchaseType"];
  subscriptionType?: CartItem["subscriptionType"];
}) => {
  if (item.mixBoxRecipe) {
    return getMixBoxCartKey({
      productId: item.productId,
      recipe: item.mixBoxRecipe,
      purchaseType: item.purchaseType ?? "one_time",
      subscriptionType: item.subscriptionType ?? null,
    });
  }

  return `${item.productId}-${item.productVariantId || item.sku || "default"}-${item.uuid || "no-uuid"}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isGift: false,
      giftNote: "",

      setCart: (items) => set({ items }),
      setAppliedCoupon: (appliedCoupon) => set({ appliedCoupon }),
      setIsGift: (isGift) => set({ isGift }),
      setGiftNote: (giftNote) => set({ giftNote }),

      addItem: (item) =>
        set((state:any) => {
          const existing = state.items.find(
            (i:any) => getItemKey(i) === getItemKey(item)
          );

          if (existing && item.isQuantityChangable == true) {
            const maxQty = getProductMaxQuantity(existing);
            const targetQty = Math.min(maxQty, existing.quantity + (item.quantity || 1));
            return {
              items: state.items.map((i:any) =>
                getItemKey(i) === getItemKey(item)
                  ? { ...i, quantity: targetQty }
                  : i
              ),
            };
          }

          if (existing && item.mixBoxRecipe) {
            const maxQty = getProductMaxQuantity(existing);
            const targetQty = Math.min(maxQty, existing.quantity + 1);
            return {
              items: state.items.map((i:any) =>
                getItemKey(i) === getItemKey(item)
                  ? { ...i, quantity: targetQty }
                  : i
              ),
            };
          }

          const maxQty = getProductMaxQuantity(item);
          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: Math.min(maxQty, item.quantity || 1),
                addedAt: Date.now(),
              },
            ],
          };
        }),

      // removeItem: (productId, sku,uuid) =>
      //   set((state) => ({
      //     items: state.items.filter(
      //       (i) =>
      //         getItemKey(i) !==
      //         getItemKey({ productId, sku , uuid })
      //     ),
      //   })),

      removeItem: (productId, sku, uuid, productVariantId) =>
        set((state) => ({
          items: state.items.filter((i) => {
            // ✅ Case 1: uuid exists → strict match
            if (uuid) {
              return !(i.uuid === uuid);
            }

            // ✅ Case 2: productVariantId exists → match by product + variant
            if (productVariantId || i.productVariantId) {
              return !(
                i.productId === productId &&
                i.productVariantId === productVariantId
              );
            }

            // ✅ Case 3: fallback → productId + sku match
            return !(
              i.productId === productId &&
              (sku ? i.sku === sku : true)
            );
          }),
        })),

      updateQuantity: (productId, quantity, sku, productVariantId) =>
        set((state) => ({
          items: state.items
            .map((i) => {
              const isMatch =
                i.productId === productId &&
                (productVariantId
                  ? i.productVariantId === productVariantId
                  : sku
                    ? i.sku === sku
                    : true);
              if (isMatch) {
                const maxQty = getProductMaxQuantity(i);
                return { ...i, quantity: Math.min(maxQty, quantity) };
              }
              return i;
            })
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () =>
        set({ items: [], appliedCoupon: null, isGift: false, giftNote: "" }),

      totalItems: () =>
        get().items.length,

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "potent-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
