"use client";

import React, { Suspense } from "react";
import FilterBar from "../../components/common/category/filterTopBar";
import FiltersSidebar from "../../components/common/category/filterSideBar";
import CategoryProducts from "../../components/common/category/categoryProducts";
import { ShopSkeleton } from "@/app/components/common/skeletons";

export default function CategoryPageClient({
  initialCategories,
}: {
  initialCategories?: any[];
}) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <div className="bg-[#FAF8F5] min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <FilterBar />
          <div className="mt-6 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            <FiltersSidebar />
            <CategoryProducts productsCategory={initialCategories} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
