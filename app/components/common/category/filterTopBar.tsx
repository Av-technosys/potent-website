"use client";

import { useCatalogStore } from "@/store/catalogStore";

export default function FilterBar({ total }: any) {
  const productsTotal = useCatalogStore((state) => state.products.length);
  const visibleTotal = total ?? productsTotal;

  return (
    <div className="w-full bg-white py-2 pt-10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          <span className="font-medium">
            Showing {visibleTotal} Products
          </span>
        </div>
      </div>
    </div>

  )
}
