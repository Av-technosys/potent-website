import { toast } from "sonner";
import { isUserLoggedIn } from "@/helper/auth/action";
import {
  addToWishlistDB,
  getWishlistDB,
  removeFromWishlistDB,
} from "@/helper/wishlist/action";
import {
  createWishlistItem,
  normalizeWishlistItem,
  useWishlistStore,
} from "./WishlistStore";

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

export const addToWishlist = async (payload: unknown) => {
  const payloadRecord = asRecord(payload);
  const item = payloadRecord.variants
    ? normalizeWishlistItem(payload)
    : createWishlistItem(payload, payloadRecord.selectedVariant);
  if (!item.productId) {
    toast.error("Unable to save this product to wishlist");
    return false;
  }

  const previousItems = useWishlistStore.getState().items;
  useWishlistStore.getState().addItem(item);

  const isAuth = await isUserLoggedIn();
  if (!isAuth) {
    // Guest user - saved to local storage wishlist
    toast.success("Added to wishlist");
    return true;
  }

  try {
    await addToWishlistDB(item.productId);
    toast.success("Added to wishlist");
    return true;
  } catch (error) {
    console.error("Wishlist sync failed:", error);
    useWishlistStore.getState().setWishlist(previousItems);
    toast.error("Failed to add wishlist item. Please try again.");
    return false;
  }
};

export const removeFromWishlist = async (productId: string) => {
  const previousItems = useWishlistStore.getState().items;
  const targetItem = previousItems.find((i) => i.productId === productId || i.slug === productId);
  const targetId = targetItem?.productId || productId;

  useWishlistStore.getState().removeItem(productId);
  if (targetItem?.productId && targetItem.productId !== productId) {
    useWishlistStore.getState().removeItem(targetItem.productId);
  }
  if (targetItem?.slug && targetItem.slug !== productId) {
    useWishlistStore.getState().removeItem(targetItem.slug);
  }

  const isAuth = await isUserLoggedIn();
  if (!isAuth) {
    toast.success("Item removed from wishlist");
    return true;
  }

  try {
    await removeFromWishlistDB(targetId);
    toast.success("Item removed from wishlist");
    return true;
  } catch (error) {
    console.error("Wishlist removal failed:", error);
    toast.error("Failed to remove wishlist item from server.");
    return false;
  }
};

export const syncWishlistFromDB = async (isLogin = false) => {
  try {
    const isAuth = await isUserLoggedIn();
    if (!isAuth) return;

    const data = await getWishlistDB();
    const localItems = useWishlistStore.getState().items;

    // Only merge guest items from localStorage into DB during explicit login
    if (isLogin && localItems.length > 0) {
      for (const localItem of localItems) {
        if (localItem.productId && !data.some((d) => d.productId === localItem.productId)) {
          try {
            await addToWishlistDB(localItem.productId);
          } catch (e) {
            console.error("Failed to sync guest item to DB:", e);
          }
        }
      }
      const updatedData = await getWishlistDB();
      const formatted = (updatedData || []).map((item) => normalizeWishlistItem(item));
      useWishlistStore.getState().setWishlist(formatted);
      return;
    }

    // On standard page load / refresh: DB is the single source of truth for logged-in user
    const formatted = (data || []).map((item) => normalizeWishlistItem(item));
    useWishlistStore.getState().setWishlist(formatted);
  } catch (error) {
    console.error("Failed to sync wishlist:", error);
  }
};
