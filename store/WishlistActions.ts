/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWishlistStore } from "./WishlistStore";
import {
    addToWishlistDB,
    removeFromWishlistDB,
    getWishlistDB,
} from "@/helper/wishlist/action";
import { isUserLoggedIn } from "@/helper/auth/action";
import { toast } from "sonner";

export const addToWishlist = async (item: any) => {
    const isAuth = await isUserLoggedIn();

    if (!isAuth) {
        toast.info("Please login first");

        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);

        return;
    }

    useWishlistStore.getState().addItem(item);

    try {
        await addToWishlistDB(item.productId);

        toast.success("Item Added to wishlist");
    } catch (error) {
        console.error("DB failed:", error);

        useWishlistStore
            .getState()
            .removeItem(item.productId);

        toast.error("Failed to add wishlist");
    }
};

export const removeFromWishlist = async (productId: string) => {
    useWishlistStore.getState().removeItem(productId);

    try {
        await removeFromWishlistDB(productId);

        toast.success("Item removed from wishlist");
    } catch (error) {
        console.error(error);
        toast.error("Failed to remove wishlist");
    }
};

export const syncWishlistFromDB = async () => {
    try {
        const data = await getWishlistDB();

        const formatted = data.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
        }));

        useWishlistStore.getState().setWishlist(formatted);
    } catch (error) {
        console.error("Failed to sync wishlist:", error);
    }
};
