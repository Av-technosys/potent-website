"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import BestsellingCard from "../BestSellingCard";
import { useCatalogStore } from "@/store/catalogStore";

export type BrandPageProduct = {
  id: string;
  name: string | null;
  image?: string | null;
  bannerImage?: string | null;
  startingPrice?: string | null;
  slug: string;
  hasVarientBox?: boolean | null;
  brand?: string | null;
};

type Props = {
  title: string;
  description?: string;
  products?: BrandPageProduct[];
  productBrand?: string;
  buttonColor?: string;
  bgColor?: string;
  limit?: number;
  showViewAll?: boolean;
};

export function BrandProductsSection({
  title,
  description,
  products,
  productBrand,
  buttonColor = "#016271",
  bgColor = "#F8F6F1",
  limit = 4,
  showViewAll = true,
}: Props) {
  const storeProducts = useCatalogStore((state) => state.products);
  const sectionProducts =
    products ??
    (productBrand
      ? storeProducts.filter((product) => product.brand === productBrand)
      : storeProducts);
  const visibleProducts = sectionProducts.slice(0, limit);

  return (
    <section
      className="mb-12 overflow-hidden py-10"
      style={{ backgroundColor: bgColor }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 space-y-4 text-center md:mb-12">
          <h2 className="font-serif text-3xl font-bold text-[#333333] md:text-4xl">
            {title}
          </h2>

          {description ? (
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/50">
              {description}
            </p>
          ) : null}
        </div>

        {visibleProducts.length ? (
          <div className="flex flex-wrap justify-center gap-4">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="flex w-full min-w-[140px] sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
              >
                <BestsellingCard
                  product={product}
                  buttonColor={buttonColor}
                  brand
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-black/50">
            No products found for this brand yet.
          </p>
        )}
      </div>
    </section>
  );
}
