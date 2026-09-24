/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/WishlistStore";
import { removeFromWishlist } from "@/store/WishlistActions";
import { addToCart } from "@/store/cartActions";
import Link from "next/link";
import { NEXT_PUBLIC_S3_URL } from "@/env";

export default function WishlistProducts() {
  const products = useWishlistStore((state) => state.items);

  const removeWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const addToCartHandler = async (product: any) => {
    await addToCart({
      productId: product.productId,
      sku: "default",
      slug: product.slug || "",
      title: product.name,
      image: product.image || "/product.png",
      price: product.price || 0,
      quantity: 1,
      isQuantityChangable: true,
      originalPrice: product.strikethroughPrice,
    });

    // optional: remove after adding
    await removeFromWishlist(product.productId);
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        Your wishlist is empty
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product: any) => (
        <Card key={product.productId} className="rounded-3xl p-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative flex w-full items-center justify-center rounded-xl">
              <button
                onClick={() => removeWishlist(product.productId)}
                className="absolute top-2 left-2 rounded-full bg-white p-1 shadow"
              >
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </button>

              <Image
                alt={"product image"}
                src={getImageUrl(product.image)}
                width={180}
                height={180}
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>

              {product.price && (
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{product.price}</span>
                  {product.strikethroughPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.strikethroughPrice}
                    </span>
                  )}
                </div>
              )}

              {product.hasVarientBox ? (
                <Link href={`/product-detail/${product.slug}`}>
                  <Button className="w-full rounded-md bg-[#016271] py-5 text-sm font-semibold text-white hover:bg-[#146e71]">
                    Add to Cart
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => addToCartHandler(product)}
                  className="w-full rounded-xl bg-[#1A8D91] text-white"
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
