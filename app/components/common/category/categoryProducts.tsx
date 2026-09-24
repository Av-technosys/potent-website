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
  const category = params.getAll("category");
  const productType = params.getAll("productType");
  const size = params.getAll("size");
  const flowType = params.getAll("flowType");
  const material = params.get("material");
  const priceRange = params.get("pr")?.split("-");

  const filteredProducts = productDetaials.filter((prodItem: any) => {
    if (
      (!category || category.length === 0) &&
      !productType &&
      !size &&
      !material &&
      !priceRange
    ) {
      return true;
    }

    var isCat = false;
    var isSize = false;
    var isFlow = false;
    var isType = false;

    if (!!category && category.length > 0) {
      isCat = prodItem.categories.some((cat: any) => {
        return category.includes(cat);
      });
    } else {
      isCat = true;
    }

    if (!!productType && productType.length > 0) {
      isType = productType?.some((typ) => {
        return prodItem?.type === productType;
      });
    } else {
      isType = true;
    }

    // size
    if (!!size && size.length > 0) {
      isSize = productType?.some((typ) => {
        return prodItem?.size === typ;
      });
    } else {
      isSize = true;
    }

    if (!!flowType && flowType.length > 0) {
      isFlow = productType?.some((typ) => {
        return prodItem?.type === typ;
      });
    } else {
      isFlow = true;
    }

    return isCat || isSize || isFlow || isType;
  });

  return (
    <div className="grid h-full flex-1 grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {filteredProducts.length > 0 ? (
        filteredProducts?.map((value: any) => {
          const startingPrice = String(value.startingPrice || "").trim();

          return (
            <div
              key={value.id}
              className="relative flex flex-col justify-between rounded-lg bg-white p-2.5 shadow-md transition-shadow duration-300 hover:shadow-lg sm:p-3"
            >
              <div>
                {/* Wishlist */}
                <AddToWishlist product={value} />
                {/* Image */}
                <Link
                  className="relative block aspect-square w-full overflow-hidden rounded-md bg-gray-50"
                  href={`/product-detail/${value.slug}`}
                >
                  <Image
                    src={getImageUrl(value.bannerImage || "/product.png")}
                    alt={value.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized
                  />
                </Link>
              </div>

              {/* Content */}
              <div className="mt-2.5 flex flex-col space-y-2 rounded-lg px-0.5 sm:mt-4 sm:space-y-3 sm:px-1">
                <h3 className="line-clamp-2 text-xs leading-tight font-bold text-gray-800 sm:text-sm">
                  {value.name}
                </h3>

                {startingPrice ? (
                  <p className="text-[11px] font-semibold text-gray-700 sm:text-xs">
                    {startingPrice}
                  </p>
                ) : null}

                <Link
                  href={`/product-detail/${value.slug}`}
                  className="w-full pt-1"
                >
                  <Button className="h-auto w-full rounded-md bg-[#016271] py-2 text-xs font-semibold text-white hover:bg-[#146e71] sm:py-4 sm:text-sm">
                    View Product
                  </Button>
                </Link>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full py-20 text-center text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
}
