/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/store/WishlistStore";
import { addToWishlist, removeFromWishlist } from "@/store/WishlistActions";
import { getImageUrl } from "@/lib/imageUrl";
import { useCatalogStore } from "@/store/catalogStore";

interface CategoryProductsProps {
  categories?: any[];
}

export default function CategoryProducts({
  categories,
}: CategoryProductsProps) {
  const router = useRouter();
  const storeCategories = useCatalogStore((state) => state.categories);
  const visibleCategories = categories ?? storeCategories;

  const items = useWishlistStore((state) => state.items);

  const isWishlisted = (id: string) => items.some((i) => i.productId === id);

  const toggleWishlist = async (product: any) => {
    const exists = isWishlisted(product.id);

    if (exists) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist({
        productId: product.id,
        name: product.name,
        image: product.bannerImage,
        price: product.basePrice || 0,
      });
    }
  };

  return (
    <div className="grid h-full flex-1 grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
      {visibleCategories.map((product) => (
        <div
          key={product.id}
          className="relative flex flex-col rounded-md bg-white p-3 shadow-md"
        >
          {/* ❤️ Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-2 left-2 z-10 rounded-full bg-white p-1.5 text-gray-400 shadow-sm"
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted(product.id) ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>

          {/* Discount */}
          <div className="absolute top-2 right-2 z-10">
            <div className="rounded-xl bg-[#016271] px-2 py-1 text-[10px] font-bold text-white">
              25% OFF
            </div>
          </div>

          {/* Image */}
          <div
            className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md bg-gray-50"
            onClick={() => router.push(`/shop?category=${product.id}`)}
          >
            <Image
              src={getImageUrl(product.bannerImage)}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          </div>

          <span className="absolute bottom-23 left-1 w-fit rounded-full bg-[#10B981] px-2 py-0.5 text-[10px] text-white">
            Bestseller
          </span>

          {/* Content */}
          <div className="mt-4 flex flex-col space-y-3 rounded-lg px-1">
            <h3 className="line-clamp-1 text-sm font-bold text-gray-800">
              {product.name}
            </h3>

            <Button
              className="w-full rounded-md bg-[#016271] py-5 text-sm font-semibold text-white hover:bg-[#146e71]"
              onClick={() => router.push(`/shop?category=${product.id}`)}
            >
              View all
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
