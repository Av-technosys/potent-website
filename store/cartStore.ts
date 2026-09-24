/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "./cartTypes";
import { getMixBoxCartKey } from "@/lib/mixYourBox";

type CartState = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "addedAt">) => void;
  removeItem: (productId: string, sku?: string, uuid?: any) => void;
  updateQuantity: (productId: string, quantity: number, sku?: string) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;

  totalItems: () => number;
  subtotal: () => number;
};

// const getItemKey = (item: { productId: string; sku?: string, uuid?: any }) =>
//   `${item.productId}-${item.sku || "default"}`;

const getItemKey = (item: {
  productId: string;
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

  return `${item.productId}-${item.sku || "default"}-${item.uuid || "no-uuid"}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      setCart: (items) => set({ items }),

      addItem: (item) =>
        set((state:any) => {
          const existing = state.items.find(
            (i:any) => getItemKey(i) === getItemKey(item)
          );

          if (existing && item.isQuantityChangable == true) {
            return {
              items: state.items.map((i:any) =>
                getItemKey(i) === getItemKey(item)
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }

          if (existing && item.mixBoxRecipe) {
            return {
              items: state.items.map((i:any) =>
                getItemKey(i) === getItemKey(item)
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { ...item, quantity: item.quantity || 1, addedAt: Date.now() },
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

      removeItem: (productId, sku, uuid) =>
  set((state) => ({
    items: state.items.filter((i) => {
      // ✅ Case 1: uuid exists → strict match
      if (uuid) {
        return !(i.uuid === uuid);
      }

      // ✅ Case 2: fallback → productId + sku match
      return !(
        i.productId === productId &&
        (sku ? i.sku === sku : true)
      );
    }),
  })),

      updateQuantity: (productId, quantity, sku) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              getItemKey(i) ===
              getItemKey({ productId, sku })
                ? { ...i, quantity }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

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
