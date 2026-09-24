/* eslint-disable @typescript-eslint/no-explicit-any */
// helper/cart.ts

import { useCartStore } from "@/store/cartStore";

import {
  addToCart as addToCartDB,
  removeFromCart as removeFromCartDB,
  updateCartItemQuantity,
  clearCart as clearCartDB,
  getCart,
} from "@/helper/cart/action";
import { isUserLoggedIn } from "@/helper/auth/action";
import { toast } from "sonner";
import type { MixBoxRecipe, PurchaseType, SubscriptionType } from "@/lib/mixYourBox";

// Types
type CartItem = {
  productId: string;
  productVariantId?: string;
  sku?: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  selectedPlan?:any;
  isSubscribed?:any;
  originalPrice?: number;
  cartSizes?: any[];
  mixBoxRecipe?: MixBoxRecipe;
  totalPads?: number;
  boxCount?: number;
  freeLiners?: number;
  purchaseType?: PurchaseType;
  subscriptionType?: SubscriptionType;
  cycleSync?: {
    nextPeriodDate: string;
    cycleLength: number;
  };
  isQuantityChangable?: boolean;
  quantity?: number;
  uuid?: string; 
};

// Add to cart
export const addToCart = async (item: CartItem) => {
  const isAuth = await isUserLoggedIn();

  if (!isAuth) {
    toast.info("Please login to add items to cart");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
    return false; // ✅ stop execution
  }

  const normalizedItem = {
    productId: item.productId,
    productVariantId: item.productVariantId,
    sku: item.sku,
    slug: item.slug,
    title: item.title,
    image: item.image,
    price: item.price,
    selectedPlan: item.selectedPlan,
    isSubscribed: item.isSubscribed,
    originalPrice: item.originalPrice,
    cartSizes: item.cartSizes,
    mixBoxRecipe: item.mixBoxRecipe,
    totalPads: item.totalPads,
    boxCount: item.boxCount,
    freeLiners: item.freeLiners,
    purchaseType: item.purchaseType,
    subscriptionType: item.subscriptionType,
    cycleSync: item.cycleSync,
    isQuantityChangable: item.isQuantityChangable,
    quantity: item.quantity || 1,
    uuid: item.uuid 
  };

  // ✅ optimistic UI
  useCartStore.getState().addItem(normalizedItem);

  if (item.isQuantityChangable) {
    // ✅ DB sync
    const result = await addToCartDB(item.productId, item.quantity, item.selectedPlan, item.isSubscribed, item.productVariantId, undefined, undefined, {
      mixBoxRecipe: item.mixBoxRecipe,
    }).catch((error) => {
      console.error("Failed to sync with DB:", error);
      return { success: false };
    });
    if (!result?.success) return false;
    toast.success("Item added to cart");
  } else {
    // ✅ DB sync
    const result = await addToCartDB(item.productId, item.quantity, item.selectedPlan, item.isSubscribed, item.productVariantId, item.cartSizes, item.uuid, {
      mixBoxRecipe: item.mixBoxRecipe,
    }).catch((error) => {
      console.error("Failed to sync with DB:", error);
      return { success: false };
    });
    if (!result?.success) return false;
    toast.success("Item added to cart");
  }

  return true;
};

// Remove
export const removeFromCart = async (productId: string, sku?: string, uuid?: string, cartSizes?: any, productVariantId?: string) => {
  useCartStore.getState().removeItem(productId, sku, uuid);

  if (!cartSizes || cartSizes.length === 0) {
    removeFromCartDB(productId, productVariantId, uuid).catch((error) => {
      console.error("Failed to remove from DB:", error);
    });
    toast.success("Item removed from cart");
  } else {
    removeFromCartDB(productId, productVariantId, uuid, cartSizes).catch((error) => {
      console.error("Failed to remove from DB:", error);
    });
    toast.success("Item removed from cart");
  }
};

// Update quantity
export const updateCartQuantity = async (
  productId: string,
  quantity: number,
  sku?: string,
  productVariantId?: string
) => {
  useCartStore.getState().updateQuantity(productId, quantity, sku);

  updateCartItemQuantity(productId, quantity, productVariantId).catch((error) => {
    console.error("Failed to update DB:", error);
  });
};

// Clear
export const clearCart = async () => {
  useCartStore.getState().clearCart();

  clearCartDB().catch((error) => {
    console.error("Failed to clear DB:", error);
  });
  toast.success("Cart cleared");
};

// Sync from DB
export const syncCartFromDB = async () => {
  try {
    const result = await getCart();

    if (result.success && result.items) {
      const formattedItems = result.items.map((item: any) => ({
        productId: item.productId,
        productVariantId: item.productVariantId,
        sku: item.sku || "",
        slug: item.slug || "",
        title: item.title || "Product",
        image: item.image || "/product.png",
        price: item.price || 0,
        originalPrice: item.originalPrice,
        quantity: item.quantity ?? 0,
        mixBoxRecipe: item.mixBoxRecipe,
        totalPads: item.totalPads,
        boxCount: item.boxCount,
        freeLiners: item.freeLiners,
        isQuantityChangable: !item.mixBoxRecipe,
        addedAt: Date.now(),
      }));

      useCartStore.getState().setCart(formattedItems);
    }
  } catch (error) {
    console.error("Failed to sync cart:", error);
  }
};
