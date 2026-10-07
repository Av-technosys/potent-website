"use client";

import { useCatalogStore } from "@/store/catalogStore";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Sparkles, PackageCheck, Layers } from "lucide-react";

export default function FilterBar({ total }: any) {
  const productsTotal = useCatalogStore((state) => state.products.length);
  const visibleTotal = total ?? (productsTotal > 0 ? productsTotal : 8);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeCategory = searchParams.get("category") || "all";

  const handleCategorySelect = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="w-full">
      {/* Top Shop Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#075965] p-6 sm:p-8 md:p-10 text-white shadow-md">
        {/* Background decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-[#F4C430]/10 blur-2xl" />

        <div className="relative z-10 max-w-2xl">
         

          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Shop All Essentials
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl font-medium">
            Discover leak-proof travel bags, hygienic seat covers, and reusable period care. Engineered for complete peace of mind anywhere.
          </p>
        </div>
      </div>

      {/* Quick Filter Strap & Counter (Hidden on mobile screens < md) */}
      <div className="mt-6 hidden md:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-3 sm:p-4 shadow-2xs border border-[#E4DED0]">
        {/* Category Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Products" },
           
           
          ].map((tab) => {
            const isSelected =
              activeCategory === tab.id ||
              (tab.id === "all" && !searchParams.get("category"));
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategorySelect(tab.id)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#075965] text-white shadow-xs"
                    : "bg-[#FAF8F3] text-[#17271E]/75 hover:bg-[#E4F0E8] hover:text-[#0E5C3A]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#0A4A2E] bg-[#F1F7F3] px-3 py-2 rounded-xl border border-[#0E5C3A]/15 shrink-0">
          <PackageCheck className="h-4 w-4 text-[#0E5C3A]" />
          <span>Showing {visibleTotal} Products </span>
        </div>
      </div>
    </div>
  );
}
