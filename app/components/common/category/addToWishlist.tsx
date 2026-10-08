/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/WishlistStore";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/WishlistActions";

const AddToWishlist = ({ product }: any) => {
  const items = useWishlistStore((state) => state.items);
  const [isLoading, setIsLoading] = useState(false);

  const isActive = items.some(
    (i) => i.productId === product.id
  );

  const toggleWishlist = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isActive) {
        await removeFromWishlist(product.id);
        return;
      }

      // The shop catalog is intentionally lightweight. Fetch the existing
      // product-details payload so the wishlist stores every sellable variant.
      let productWithVariants = product;
      if (product?.slug) {
        const response = await fetch(`/api/catalog/products/${encodeURIComponent(product.slug)}`);
        if (response.ok) {
          const payload = await response.json();
          if (!payload.product) throw new Error("Product details were not returned");
          productWithVariants = { ...product, ...payload.product };
        } else if (
          !Array.isArray(product?.productVariants) &&
          !Array.isArray(product?.prodcutVarientBoxRes) &&
          !Array.isArray(product?.variants)
        ) {
          throw new Error("Unable to load product variants");
        }
      }

      await addToWishlist({
        ...productWithVariants,
        productId: productWithVariants.id || product.id,
        name: productWithVariants.name || product.name,
        image: productWithVariants.bannerImage || product.bannerImage || "/product.png",
        hasVarientBox: productWithVariants.hasVarientBox,
        slug: productWithVariants.slug || product.slug,
      });
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      // addToWishlist/removeFromWishlist handle their own rollback/toast;
      // this catches fetch/network failures before they reach those actions.
      toast.error("Unable to update wishlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
      className="absolute left-2 top-2 z-10 rounded-full bg-white p-1.5 text-gray-400 shadow-sm"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={`h-4 w-4 ${
            isActive ? "fill-red-500 text-red-500" : ""
          }`}
        />
      )}
    </button>
  );
};

export default AddToWishlist;
