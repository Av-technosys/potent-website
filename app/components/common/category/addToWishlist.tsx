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

  const prodId = product?.id || product?._id || product?.slug;
  const isActive = items.some(
    (i) =>
      i.productId === prodId ||
      i.productId === product?.id ||
      i.productId === product?.slug ||
      i.slug === product?.slug,
  );

  const toggleWishlist = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isActive) {
        await removeFromWishlist(prodId);
        return;
      }

      // The shop catalog is intentionally lightweight. Fetch the existing
      // product-details payload so the wishlist stores every sellable variant.
      let productWithVariants = product;
      if (product?.slug) {
        const response = await fetch(`/api/catalog/products/${encodeURIComponent(product.slug)}`);
        if (response.ok) {
          const payload = await response.json();
          if (payload.product) {
            productWithVariants = { ...product, ...payload.product };
          }
        }
      }

      const selectedVar =
        productWithVariants.selectedVariant ||
        productWithVariants.productVariants?.[0] ||
        productWithVariants.prodcutVarientBoxRes?.[0] ||
        productWithVariants.variants?.[0];

      const allVars =
        productWithVariants.productVariants ||
        productWithVariants.prodcutVarientBoxRes ||
        productWithVariants.variants;

      await addToWishlist({
        ...productWithVariants,
        productId: prodId,
        name: productWithVariants.name || product.name,
        image: selectedVar?.image || productWithVariants.bannerImage || product.bannerImage || "/product.png",
        hasVarientBox: Boolean(productWithVariants.hasVarientBox),
        slug: productWithVariants.slug || product.slug,
        selectedVariant: selectedVar,
        variants: allVars,
      });
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
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
