/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/imageUrl";

export default function RelatedProducts({ products, themeColor }: any) {
  if (products.length > 0) {
    return (
      <section className="mx-auto w-full pb-16">
        <div className="mb-8 py-4">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900">
            You May Also Like
          </h2>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product: any, index: number) => {
              const startingPrice = String(product.startingPrice || "").trim();

              return (
                <div
                  key={index}
                  // Laptop: 'md:w-auto' ensures grid controls the size.
                  // Mobile: 'w-[280px]' and 'flex-shrink-0' enables the scroll.
                  className="relative shrink-0 rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg md:w-auto md:shrink"
                >
                  {/* Wishlist */}
                  <button className="absolute top-2 left-2 rounded-full bg-white p-1 shadow">
                    <Heart
                      style={{ color: themeColor.darkColor }}
                      className="h-4 w-4 text-gray-500"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = themeColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#6b7280";
                      }}
                    />{" "}
                  </button>

                  {/* Discount Badge */}
                  <span
                    className="absolute top-2 right-2 rounded-full px-3 py-1 text-xs text-white"
                    style={{
                      backgroundColor: themeColor.darkColor || "#016271",
                    }}
                  >
                    25% OFF
                  </span>

                  {/* Product Image */}
                  <Link
                    href={product.slug}
                    className="overflow-hidden rounded-xl"
                  >
                    <Image
                      src={getImageUrl(product.bannerImage)}
                      alt={product.name}
                      width={200}
                      height={150}
                      className="w-full object-cover"
                    />
                  </Link>

                  {/* Tag */}
                  <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-600">
                    {product.category}
                  </span>

                  <Link href={product.slug}>
                    {/* Title */}
                    <h3 className="mt-3 text-sm leading-snug font-medium text-gray-900">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1 text-yellow-400">
                    {Array(product.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400" />
                      ))}
                    <span className="ml-1 text-xs text-gray-500">
                      ({product.reviewCount})
                    </span>
                  </div>

                  {startingPrice ? (
                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      {startingPrice}
                    </p>
                  ) : null}

                  {/* Button */}

                  {product.hasVarientBox ? (
                    <Link href={`/product-detail/${product.slug}`}>
                      <Button
                        style={{ backgroundColor: themeColor.darkColor }}
                        className="w-full rounded-md py-5 text-sm font-semibold text-white hover:bg-[#146e71]"
                      >
                        Add to Cart
                      </Button>
                    </Link>
                  ) : (
                    <button
                      className="mt-4 w-full rounded-lg py-2.5 text-sm text-white transition"
                      style={{
                        backgroundColor: themeColor.darkColor || "#016271",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "brightness(0.9)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "brightness(1)";
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}
