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
      {/* 3 Columns Grid: 3-3-3 Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                className="group relative flex flex-col justify-between rounded-3xl border border-[#E4DED0] bg-white p-3.5 sm:p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0E5C3A]/50 hover:shadow-xl"
              >
                <div>
                  {/* Top Badges Row */}
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                  

                    <div className="flex items-center gap-1">
                     
                      <AddToWishlist product={value} />
                    </div>
                  </div>

                  {/* Image Container */}
                  <Link
                    className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF8F3] border border-[#E4DED0]/50"
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
                  <h3 className="mt-3.5 line-clamp-2 font-serif text-sm sm:text-base font-bold text-[#0A4A2E] leading-snug group-hover:text-[#0E5C3A] transition-colors">
                    {value.name}
                  </h3>
                </div>

                {/* Price & CTA Section */}
                <div className="mt-4 pt-3 border-t border-[#E4DED0]/60">
               

                  <Link href={`/product-detail/${value.slug}`} className="block w-full">
                    <Button className="w-full cursor-pointer rounded-xl bg-[#004851] py-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#0A4A2E] hover:shadow-md active:scale-[0.99]">
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        ) : null}

        {/* ======================================================================= */}
        {/* 9TH PRODUCT CARD: COMING SOON CARD (Matching Attached Reference Image) */}
        {/* ======================================================================= */}
        <div className="group relative flex flex-col justify-between rounded-3xl border border-pink-200/80 bg-[#FAF0F4] p-3.5 sm:p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div>
            {/* Top Badge */}
            <div className="mb-2.5 flex items-center justify-between">
              <span className="rounded-full bg-[#7E4D77] px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider">
                OVY CARE
              </span>
              
            </div>

            {/* Pink Diagonal Striped Graphic Box (Exact match to reference image) */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-pink-200/60 bg-[repeating-linear-gradient(45deg,#fce8f0_0,#fce8f0_12px,#faf0f4_12px,#faf0f4_24px)] flex flex-col items-center justify-center p-4 shadow-2xs">
              <span className="font-serif italic font-extrabold text-[#7E4D77] text-2xl sm:text-3xl tracking-wide text-center drop-shadow-2xs select-none">
                Coming soon
              </span>
            </div>

            {/* Bottom Content Label */}
            <div className="mt-3.5 px-0.5">
              <h3 className="font-serif text-sm sm:text-base font-bold text-gray-900 leading-snug">
                Period Panties
              </h3>
             
            </div>
          </div>

          {/* Footer Notify Action */}
          <div className="mt-4 pt-3 border-t border-pink-200/60">
            <div className="flex items-center justify-between rounded-xl bg-white/80 p-2.5 border border-pink-200/50">
              <span className="text-[11px] font-bold text-[#7E4D77] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Launching Soon
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7E4D77] bg-pink-100 px-2 py-0.5 rounded-md">
                Stay Tuned
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
