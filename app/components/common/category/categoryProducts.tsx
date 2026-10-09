/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddToWishlist from "./addToWishlist";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { getImageUrl } from "@/lib/imageUrl";
import { useCatalogStore } from "@/store/catalogStore";
import { Star, ArrowRight, Sparkles, Clock, ShieldCheck } from "lucide-react";

export default function CategoryProducts({ products, productsCategory }: any) {
  const storeProducts = useCatalogStore((state) => state.products);
  const catalogProducts = products ?? storeProducts;
  const catalogProductsCategory = productsCategory ?? [];

  const productDetaials = useMemo(() => {
    return catalogProducts.map((item: any) => {
      const categoryIds =
        item.categories?.length || !catalogProductsCategory.length
          ? item.categories || []
          : catalogProductsCategory
              .filter((category: any) => category.productId === item.id)
              .map((item: any) => item.categoryId);

      return {
        ...item,
        categories: categoryIds,
      };
    });
  }, [catalogProducts, catalogProductsCategory]);

  const params = useSearchParams();
  const selectedBrand = (params.get("brand") || "all").toLowerCase();
  const selectedCategory = (params.get("category") || "all").toLowerCase();

  const filteredProducts = productDetaials.filter((prodItem: any) => {
    const itemBrand = String(prodItem.brand || "").toLowerCase();
    const itemSlug = String(prodItem.slug || "").toLowerCase();
    const itemName = String(prodItem.name || "").toLowerCase();

    // Brand filter
    let matchesBrand = true;
    if (selectedBrand !== "all" && selectedBrand !== "") {
      if (selectedBrand === "ovy") {
        matchesBrand =
          itemBrand === "ovy" ||
          itemSlug.includes("ovy") ||
          itemSlug.includes("menstrual") ||
          itemName.includes("ovy") ||
          itemName.includes("cup") ||
          itemName.includes("teen") ||
          itemName.includes("liner");
      } else if (selectedBrand === "looway" || selectedBrand === "loway") {
        matchesBrand =
          itemBrand === "looway" ||
          itemBrand === "loway" ||
          itemSlug.includes("looway") ||
          itemSlug.includes("pee") ||
          itemSlug.includes("toilet") ||
          itemSlug.includes("seat") ||
          itemSlug.includes("yatra") ||
          itemName.includes("looway") ||
          itemName.includes("bags") ||
          itemName.includes("covers");
      }
    }

    // Category filter
    let matchesCategory = true;
    if (selectedCategory !== "all" && selectedCategory !== "") {
      if (selectedCategory === "ovy") {
        matchesCategory =
          itemBrand === "ovy" ||
          itemSlug.includes("ovy") ||
          itemSlug.includes("menstrual") ||
          itemName.includes("ovy");
      } else if (selectedCategory === "looway") {
        matchesCategory =
          itemBrand === "looway" ||
          itemBrand === "loway" ||
          itemSlug.includes("looway") ||
          itemSlug.includes("pee") ||
          itemSlug.includes("seat") ||
          itemSlug.includes("yatra");
      } else {
        matchesCategory =
          prodItem.categories?.includes(selectedCategory) ||
          itemSlug.includes(selectedCategory);
      }
    }

    return matchesBrand && matchesCategory;
  });

  return (
    <div className="flex-1 w-full">
      {/* 2-column grid on mobile (<640px) and 3-column grid on desktop (>=1024px) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((value: any) => {
            const startingPrice = String(value.startingPrice || "").trim();
            const brandLabel =
              String(value.brand || "").toLowerCase() === "ovy" ? "OVY" : "LOOWAY";
            const brandBadgeColor =
              brandLabel === "OVY"
                ? "bg-[#7E4D77] text-white"
                : "bg-[#0E5C3A] text-white";

            return (
              <div
                key={value.id}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#E4DED0] bg-white p-2.5 sm:p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0E5C3A]/50 hover:shadow-xl"
              >
                <div>
                  {/* Top Badges Row */}
                  <div className="mb-2 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <AddToWishlist product={value} />
                    </div>
                    {(value.isInStock === false || value.is_in_stock === false || (Array.isArray(value.productVariants) && value.productVariants.length > 0 && value.productVariants.every((v: any) => v.isInStock === false || v.is_in_stock === false))) && (
                      <span className="rounded-full bg-stone-100 border border-stone-300 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-stone-600">
                        Out of stock
                      </span>
                    )}
                  </div>

                  {/* Image Container */}
                  <Link
                    className="relative block aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#FAF8F3] border border-[#E4DED0]/50"
                    href={`/product-detail/${value.slug}`}
                  >
                    <Image
                      src={getImageUrl(value.bannerImage || "/product.png")}
                      alt={value.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </Link>

                  {/* Product Title */}
                  <h3 className="mt-2 sm:mt-3.5 line-clamp-2 font-serif text-xs sm:text-base font-bold text-[#0A4A2E] leading-snug group-hover:text-[#0E5C3A] transition-colors">
                    {value.name}
                  </h3>
                </div>

                {/* Price & CTA Section */}
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#E4DED0]/60">
                  <Link href={`/product-detail/${value.slug}`} className="block w-full">
                    <Button className="w-full cursor-pointer rounded-xl bg-[#004851] py-2 sm:py-3 text-[11px] sm:text-xs font-bold text-white shadow-xs transition-all hover:bg-[#0A4A2E] hover:shadow-md active:scale-[0.99] px-2 sm:px-4">
                      <span>{value.isInStock === false || value.is_in_stock === false || (Array.isArray(value.productVariants) && value.productVariants.length > 0 && value.productVariants.every((v: any) => v.isInStock === false || v.is_in_stock === false)) ? "Out of Stock · View" : "View Details"}</span>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1 shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        ) : null}
      </div>
    </div>

  );
}
