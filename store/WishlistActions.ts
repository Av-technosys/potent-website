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
    useWishlistStore.getState().setWishlist(previousItems);
    toast.error("Failed to remove wishlist item. Please try again.");
    return false;
  }
};

export const syncWishlistFromDB = async () => {
  try {
    const data = await getWishlistDB();
    const localItems = useWishlistStore.getState().items;

    // Sync any guest items from localStorage into DB
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
    const localByProductId = new Map(localItems.map((item) => [item.productId, item]));
    const formatted = updatedData.map((item) => {
      const localItem = localByProductId.get(item.productId);
      return localItem
        ? { ...localItem, name: item.name || localItem.name, slug: item.slug || localItem.slug }
        : normalizeWishlistItem(item);
    });
    useWishlistStore.getState().setWishlist(formatted);
  } catch (error) {
    console.error("Failed to sync wishlist:", error);
  }
};
