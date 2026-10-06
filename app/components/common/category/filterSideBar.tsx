"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Filter, RotateCcw, ChevronDown, Check, ShieldCheck, Sparkles, Layers } from "lucide-react";

export default function FiltersSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Active brand selection from URL query param ('all', 'ovy', or 'looway')
  const currentBrand = (params.get("brand") || "all").toLowerCase();

  const handleBrandSelect = (brandId: string) => {
    const current = new URLSearchParams(params.toString());
    if (brandId === "all") {
      current.delete("brand");
    } else {
      current.set("brand", brandId);
    }
    const query = current.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const clearAll = () => {
    const current = new URLSearchParams(params.toString());
    current.delete("brand");
    const query = current.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const hasActiveFilters = currentBrand !== "all";

  return (
    <div className="w-full md:w-64 lg:w-72 shrink-0">
      {/* Mobile Collapsible Header Button */}
      <button
        type="button"
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="md:hidden flex w-full items-center justify-between rounded-2xl border border-[#E4DED0] bg-white p-3.5 text-xs font-bold text-[#0A4A2E] shadow-2xs cursor-pointer mb-3"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#0E5C3A]" />
          <span>Filter by Brand Line</span>
          {hasActiveFilters && (
            <span className="rounded-full bg-[#0E5C3A] px-2 py-0.5 text-[10px] text-white font-extrabold uppercase">
              {currentBrand}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpenMobile ? "rotate-180 text-[#0E5C3A]" : "text-gray-400"
          }`}
        />
      </button>

      {/* Sidebar Content (Sticky on Desktop, Collapsible on Mobile) */}
      <div
        className={`${
          isOpenMobile ? "block" : "hidden"
        } md:block sticky top-24 rounded-3xl border border-[#E4DED0] bg-white p-5 shadow-sm`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4DED0]/60 pb-3 mb-5">
          <div className="flex items-center gap-2 font-serif text-base font-extrabold text-[#0A4A2E]">
            <Filter className="h-4 w-4 text-[#0E5C3A]" />
            <span>Filters</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-xs font-bold text-[#0E5C3A] hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Brand Line Section */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0E5C3A] mb-3 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Brand Line</span>
          </h3>

          <div className="space-y-2">
            {[
              {
                id: "all",
                label: "All Products",
                desc: "Explore full range of travel & period care",
                badge: "8+ Items",
              },
              {
                id: "looway",
                label: "Looway",
                desc: "Travel & Public Loo Freedom",
                badge: "Travel",
              },
              {
                id: "ovy",
                label: "Ovy",
                desc: "Intimate Care & Period Essentials",
                badge: "Period",
              },
            ].map((brandOption) => {
              const isSelected =
                currentBrand === brandOption.id ||
                (brandOption.id === "all" && currentBrand === "all");

              return (
                <button
                  key={brandOption.id}
                  type="button"
                  onClick={() => handleBrandSelect(brandOption.id)}
                  className={`flex w-full items-start justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#0E5C3A] bg-[#F1F7F3] shadow-2xs"
                      : "border-[#E4DED0]/70 bg-white hover:border-[#0E5C3A]/40 hover:bg-[#FAF8F3]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0A4A2E]">
                        {brandOption.label}
                      </span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[9.5px] font-extrabold text-[#0E5C3A] border border-[#0E5C3A]/15">
                        {brandOption.badge}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#17271E]/65 mt-0.5 leading-tight font-medium">
                      {brandOption.desc}
                    </div>
                  </div>

                  <div
                    className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#0E5C3A] border-[#0E5C3A] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 100% Quality & Leak Guarantee Box (Retained as requested) */}
        <div className="rounded-2xl bg-[#F1F7F3] p-4 border border-[#0E5C3A]/15 text-center">
          <ShieldCheck className="h-6 w-6 text-[#0E5C3A] mx-auto mb-1.5" />
          <div className="text-xs font-extrabold text-[#0A4A2E]">
            100% Quality &amp; Leak Guarantee
          </div>
          <div className="text-[11px] text-[#17271E]/75 mt-1 font-medium leading-relaxed">
            Dermatologically tested &amp; travel certified.
          </div>
        </div>
      </div>
    </div>
  );
}

// {/* Material */}
// <div>
//   <h3 className="font-medium mb-3">Material</h3>
//   {filterBarData?.material?.map((item: any) => (
//     <div key={item.name} className="flex items-center gap-2 mb-2">
//       <Checkbox
//         checked={filters.material === item.slug}
//         onCheckedChange={() =>
//           toggleFilter("material", item.slug)
//         }
//       />
//       <label>{item.name}</label>
//     </div>
//   ))}
// </div>

// {/* Price */}
// <div>
//   <h3 className="font-medium mb-3">Price Range</h3>
//   <div className="flex gap-2">
//     <Input
//       placeholder="₹0"
//       value={filters.min}
//       onChange={(e) =>
//         setFilters((prev: any) => ({
//           ...prev,
//           min: e.target.value,
//         }))
//       }
//     />
//     <Input
//       placeholder="₹1000"
//       value={filters.max}
//       onChange={(e) =>
//         setFilters((prev: any) => ({
//           ...prev,
//           max: e.target.value,
//         }))
//       }
//     />
//   </div>
// </div>

// {/* Stock */}
// <div className="flex items-center gap-2">
//   <Checkbox
//     checked={filters.stock === "true"}
//     onCheckedChange={() =>
//       toggleFilter("stock", "true")
//     }
//   />
//   <label>In Stock Only</label>
// </div>
