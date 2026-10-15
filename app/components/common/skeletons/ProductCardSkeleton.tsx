import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#E4DED0] bg-white p-2.5 sm:p-4 shadow-2xs">
      <div>
        {/* Top Badges Row */}
        <div className="mb-2 flex items-center justify-between gap-1">
          <Skeleton className="h-7 w-7 rounded-full bg-gray-200/80" />
          <Skeleton className="h-4 w-16 rounded-full bg-gray-200/80" />
        </div>

        {/* Product Image Square */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#FAF8F3] border border-[#E4DED0]/50 p-4 flex items-center justify-center">
          <Skeleton className="h-3/4 w-3/4 rounded-xl bg-gray-200/70" />
        </div>

        {/* Details */}
        <div className="mt-3 space-y-2">
          {/* Brand Tag */}
          <Skeleton className="h-3.5 w-14 rounded-full bg-gray-200/80" />

          {/* Product Name */}
          <Skeleton className="h-4 sm:h-5 w-4/5 rounded-md bg-gray-200/80" />

          {/* Subtitle / Size */}
          <Skeleton className="h-3 w-1/2 rounded-md bg-gray-200/60" />

          {/* Rating */}
          <div className="flex items-center gap-1 pt-0.5">
            <Skeleton className="h-3 w-14 rounded-md bg-gray-200/70" />
            <Skeleton className="h-3 w-8 rounded-md bg-gray-200/50" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-md bg-gray-200/80" />
            <Skeleton className="h-3.5 w-12 rounded-md bg-gray-200/50" />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-1">
        <Skeleton className="h-9 sm:h-10 w-full rounded-xl bg-gray-200/80" />
      </div>
    </div>
  );
}

