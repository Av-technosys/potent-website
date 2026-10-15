import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function ShopSkeleton() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Top Shop Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#075965] p-6 sm:p-8 md:p-10 text-white shadow-md">
          <div className="relative z-10 max-w-2xl space-y-3">
            <Skeleton className="h-8 sm:h-10 w-64 bg-white/20 rounded-lg" />
            <Skeleton className="h-4 sm:h-5 w-full max-w-lg bg-white/15 rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-md bg-white/10 rounded-md" />
          </div>
        </div>

        {/* Quick Filter Strap & Counter (Hidden on mobile < md) */}
        <div className="mt-6 hidden md:flex items-center justify-between gap-4 rounded-2xl bg-white p-3 sm:p-4 shadow-2xs border border-[#E4DED0]">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-full bg-gray-200/80" />
            <Skeleton className="h-9 w-24 rounded-full bg-gray-200/60" />
            <Skeleton className="h-9 w-24 rounded-full bg-gray-200/60" />
          </div>
          <Skeleton className="h-4 w-32 bg-gray-200/60 rounded-md" />
        </div>

        {/* Mobile filter button row */}
        <div className="mt-4 md:hidden flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-24 bg-gray-200/80 rounded-md" />
          <Skeleton className="h-9 w-36 bg-gray-200/80 rounded-2xl" />
        </div>

        {/* Main Layout: Sidebar + Products Grid */}
        <div className="mt-6 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          {/* Sidebar (Desktop only) */}
          <div className="w-full md:w-64 lg:w-72 shrink-0 hidden md:block">
            <div className="rounded-2xl sm:rounded-3xl border border-[#E4DED0] bg-white p-5 space-y-6 shadow-2xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DED0]/60">
                <Skeleton className="h-5 w-20 bg-gray-200/80 rounded-md" />
                <Skeleton className="h-4 w-12 bg-gray-200/60 rounded-md" />
              </div>

              {/* Brand section */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-28 bg-gray-200/80 rounded-md" />
                <Skeleton className="h-14 w-full rounded-xl bg-gray-200/60" />
                <Skeleton className="h-14 w-full rounded-xl bg-gray-200/50" />
                <Skeleton className="h-14 w-full rounded-xl bg-gray-200/50" />
              </div>

              {/* Categories section */}
              <div className="space-y-2 pt-2 border-t border-[#E4DED0]/60">
                <Skeleton className="h-4 w-24 bg-gray-200/80 rounded-md" />
                <Skeleton className="h-8 w-full rounded-lg bg-gray-200/50" />
                <Skeleton className="h-8 w-full rounded-lg bg-gray-200/50" />
                <Skeleton className="h-8 w-full rounded-lg bg-gray-200/50" />
              </div>
            </div>
          </div>

          {/* Products Grid: 2 columns on mobile, 3 on lg */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

