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
import type { YatraKitCartItem } from "@/lib/yatraKit";
import { getProductMaxQuantity, getMaxQuantityMessage } from "@/lib/productQuantityLimits";

// Types
type CartItem = {
  productId: string;
  productVariantId?: string;
  sku?: string;
  slug: string;
  title: string;
  variantName?: string;
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
  yatraKit?: YatraKitCartItem;
  purchaseType?: PurchaseType;
  subscriptionType?: SubscriptionType;
  cycleSync?: {
    lastPeriodDate?: string;
    nextPeriodDate?: string;
    cycleLength: number | string;
    periodLength?: number | string;
    consentAccepted?: boolean;
  };
  isQuantityChangable?: boolean;
  quantity?: number;
  uuid?: string; 
};

// Add to cart
export const addToCart = async (item: CartItem) => {
  // Subscriptions never go into the bag — route directly to subscription checkout
  const isSubscriptionItem =
    item.purchaseType === "subscription" ||
    item.isSubscribed === true ||
    (item.subscriptionType &&
      String(item.subscriptionType) !== "buy_once" &&
      String(item.subscriptionType) !== "one_time") ||
    (item.selectedPlan?.subscriptionType &&
      String(item.selectedPlan.subscriptionType) !== "buy_once" &&
      String(item.selectedPlan.subscriptionType) !== "one_time");

  if (isSubscriptionItem) {
    if (typeof window !== "undefined") {
      const subType =
        item.subscriptionType ??
        item.selectedPlan?.subscriptionType ??
        "monthly";
      window.sessionStorage.setItem(
        "potent-subscription-checkout",
        JSON.stringify({
          productId: item.productId,
          productVariantId: item.productVariantId,
          quantity: item.quantity || 1,
          subscriptionType: subType,
          selectedPlan: item.selectedPlan ?? { subscriptionType: subType },
          cycleSync: item.cycleSync ?? null,
          mixBoxRecipe: item.mixBoxRecipe ?? null,
        }),
      );
      window.location.href = "/checkout?mode=subscription";
    }
    return false;
  }

  const existingItem = useCartStore
    .getState()
    .items.find(
      (i: any) =>
        i.productId === item.productId &&
        (item.productVariantId
          ? i.productVariantId === item.productVariantId
          : item.sku
            ? i.sku === item.sku
            : true)
    );
  const maxQty = getProductMaxQuantity(item);
  const currentQty = existingItem ? Number(existingItem.quantity || 1) : 0;
  if (!item.cartSizes?.length && currentQty + (item.quantity || 1) > maxQty) {
    toast.info(getMaxQuantityMessage(maxQty));
    return false;
  }

  const normalizedItem = {
    productId: item.productId,
    productVariantId: item.productVariantId,
    sku: item.sku,
    slug: item.slug,
    title: item.title,
    variantName: item.variantName,
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
    yatraKit: item.yatraKit,
    purchaseType: item.purchaseType,
    subscriptionType: item.subscriptionType,
    cycleSync: item.cycleSync,
    isQuantityChangable: item.isQuantityChangable,
    quantity: item.quantity || 1,
    uuid: item.uuid 
  };

  const previousCartItems = useCartStore.getState().items;
  // ✅ Always update optimistic / local cart store
  useCartStore.getState().addItem(normalizedItem);

  const isAuth = await isUserLoggedIn();
  if (!isAuth) {
    // Guest user: Item added to local cart successfully!
    toast.success("Added to bag!");
    return true;
  }

  if (item.isQuantityChangable) {
    // ✅ DB sync
    const result = await addToCartDB(item.productId, item.quantity, item.selectedPlan, item.isSubscribed, item.productVariantId, undefined, undefined, {
      mixBoxRecipe: item.mixBoxRecipe,
      yatraKit: item.yatraKit,
    }).catch((error) => {
      console.error("Failed to sync with DB:", error);
      return { success: false };
    });
    if (!result?.success) {
      useCartStore.getState().setCart(previousCartItems);
      toast.error((result as any)?.message || "Failed to add item to bag. Please try again.");
      return false;
    }
    toast.success("Added to bag!");
  } else {
    // ✅ DB sync
    const result = await addToCartDB(item.productId, item.quantity, item.selectedPlan, item.isSubscribed, item.productVariantId, item.cartSizes, item.uuid, {
      mixBoxRecipe: item.mixBoxRecipe,
      yatraKit: item.yatraKit,
    }).catch((error) => {
      console.error("Failed to sync with DB:", error);
      return { success: false };
    });
    if (!result?.success) {
      useCartStore.getState().setCart(previousCartItems);
      toast.error((result as any)?.message || "Failed to add item to bag. Please try again.");
      return false;
    }
    toast.success("Added to bag!");
  }

  return true;
};

// Remove
export const removeFromCart = async (
  productId: string,
  sku?: string,
  uuid?: string,
  cartSizes?: any,
  productVariantId?: string,
) => {
  // Capture item before removal so it can be restored on Undo
  const itemToRestore = useCartStore
    .getState()
    .items.find((i: any) => {
      if (uuid) return i.uuid === uuid;
      if (productVariantId || i.productVariantId) {
        return i.productId === productId && i.productVariantId === productVariantId;
      }
      return i.productId === productId && (sku ? i.sku === sku : true);
    });

  useCartStore.getState().removeItem(productId, sku, uuid, productVariantId);

  const isAuth = await isUserLoggedIn();
  if (isAuth) {
    if (!cartSizes || cartSizes.length === 0) {
      removeFromCartDB(productId, productVariantId, uuid).catch((error) => {
        console.error("Failed to remove from DB:", error);
      });
    } else {
      removeFromCartDB(productId, productVariantId, uuid, cartSizes).catch((error) => {
        console.error("Failed to remove from DB:", error);
      });
    }
  }

  // Toast with Undo action for 5 seconds
  if (itemToRestore) {
    toast("Item removed from bag", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: async () => {
          await addToCart(itemToRestore);
          toast.success("Item restored to bag");
        },
      },
    });
  } else {
    toast("Item removed from bag");
  }
};

// Update quantity
export const updateCartQuantity = async (
  productId: string,
  quantity: number,
  sku?: string,
  productVariantId?: string,
  uuid?: string,
) => {
  const currentItem = useCartStore
    .getState()
    .items.find(
      (i: any) =>
        uuid
          ? i.uuid === uuid
          : i.productId === productId &&
            (productVariantId
              ? i.productVariantId === productVariantId
              : sku
                ? i.sku === sku
                : true)
    );
  const maxQty = getProductMaxQuantity(currentItem);
  if (quantity > maxQty) {
    toast.info(getMaxQuantityMessage(maxQty));
    return;
  }

  useCartStore.getState().updateQuantity(productId, quantity, sku, productVariantId, uuid);

  const isAuth = await isUserLoggedIn();
  if (!isAuth) return;

  updateCartItemQuantity(productId, quantity, productVariantId, uuid).catch((error) => {
    console.error("Failed to update DB:", error);
  });
};

// Clear
export const clearCart = async () => {
  useCartStore.getState().clearCart();

  const isAuth = await isUserLoggedIn();
  if (!isAuth) {
    toast.success("Cart cleared");
    return;
  }

  clearCartDB().catch((error) => {
    console.error("Failed to clear DB:", error);
  });
  toast.success("Cart cleared");
};

// Sync from DB
export const syncCartFromDB = async (isLogin = false) => {
  try {
    const isAuth = await isUserLoggedIn();
    if (!isAuth) return;

    const localItems = useCartStore.getState().items;

    // 1. Fetch initial DB cart
    const result = await getCart();
    const dbItems = result.success && Array.isArray(result.items) ? result.items : [];

    // 2. Only merge guest items into DB when explicitly logging in
    if (isLogin && localItems.length > 0) {
      for (const item of localItems) {
        const alreadyInDB = dbItems.some(
          (d: any) =>
            d.productId === item.productId &&
            (item.productVariantId ? d.productVariantId === item.productVariantId : true) &&
            (item.sku ? d.sku === item.sku : true)
        );

        if (!alreadyInDB) {
          try {
            await addToCartDB(
              item.productId,
              item.quantity || 1,
              item.selectedPlan,
              item.isSubscribed,
              item.productVariantId,
              item.cartSizes,
              item.uuid,
              { mixBoxRecipe: item.mixBoxRecipe, yatraKit: item.yatraKit }
            );
          } catch (e) {
            console.error("Failed to sync guest cart item to DB:", e);
          }
        }
      }
      const finalResult = await getCart();
      if (finalResult.success && finalResult.items) {
        const formattedItems = finalResult.items.map((item: any) => ({
          productId: item.productId,
          productVariantId: item.productVariantId,
          sku: item.sku || "",
          slug: item.slug || "",
          title: item.title || "Product",
          variantName: item.variantName,
          image: item.image || "/product.png",
          price: item.price || 0,
          originalPrice: item.originalPrice,
          quantity: item.quantity ?? 0,
          mixBoxRecipe: item.mixBoxRecipe,
          totalPads: item.totalPads,
          boxCount: item.boxCount,
          freeLiners: item.freeLiners,
          yatraKit: item.yatraKit,
          isQuantityChangable: !item.mixBoxRecipe && !item.yatraKit,
          uuid: item.uuid || item.cartItemId,
          addedAt: Date.now(),
        }));
        useCartStore.getState().setCart(formattedItems);
      }
      return;
    }

    // On standard page load / refresh: DB is the single source of truth for logged-in user
    if (result.success && Array.isArray(result.items)) {
      const formattedItems = result.items.map((item: any) => ({
        productId: item.productId,
        productVariantId: item.productVariantId,
        sku: item.sku || "",
        slug: item.slug || "",
        title: item.title || "Product",
        variantName: item.variantName,
        image: item.image || "/product.png",
        price: item.price || 0,
        originalPrice: item.originalPrice,
        quantity: item.quantity ?? 0,
        mixBoxRecipe: item.mixBoxRecipe,
        totalPads: item.totalPads,
        boxCount: item.boxCount,
        freeLiners: item.freeLiners,
        yatraKit: item.yatraKit,
        isQuantityChangable: !item.mixBoxRecipe && !item.yatraKit,
        uuid: item.uuid || item.cartItemId,
        addedAt: Date.now(),
      }));

      useCartStore.getState().setCart(formattedItems);
    }
  } catch (error) {
    console.error("Failed to sync cart:", error);
  }
};
