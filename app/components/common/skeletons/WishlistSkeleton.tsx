import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <div className="max-w-7xl md:mx-12 mx-auto py-10 px-6 space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 bg-gray-200/80 rounded-md" />
          <Skeleton className="h-4 w-40 bg-gray-200/50 rounded-md" />
        </div>

        {/* Product Cards Grid: 1 col on mobile, 2 on sm, 3 on lg, 4 on xl */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

