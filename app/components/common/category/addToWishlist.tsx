/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/WishlistStore";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/WishlistActions";

const AddToWishlist = ({ product }: any) => {
  const items = useWishlistStore((state) => state.items);

  const isActive = items.some(
    (i) => i.productId === product.id
  );

  const toggleWishlist = async () => {
    if (isActive) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.basePrice,
        image: product.bannerImage || "/product.png",
        hasVarientBox: product.hasVarientBox,
        slug: product.slug,
      });
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute left-2 top-2 z-10 rounded-full bg-white p-1.5 text-gray-400 shadow-sm"
    >
      <Heart
        className={`h-4 w-4 ${
          isActive ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </button>
  );
};

export default AddToWishlist;