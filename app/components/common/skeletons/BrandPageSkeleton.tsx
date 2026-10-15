import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function BrandPageSkeleton() {
  return (
    <main className="min-h-screen pb-16">
      {/* Brand Hero Banner */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative h-[340px] sm:h-[440px] md:h-[500px] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-200/60 p-6 sm:p-12 flex flex-col justify-end space-y-4">
            <Skeleton className="h-6 w-32 rounded-full bg-gray-300/70" />
            <Skeleton className="h-10 sm:h-14 w-3/4 max-w-xl rounded-xl bg-gray-300/80" />
            <Skeleton className="h-4 sm:h-5 w-1/2 max-w-md rounded-md bg-gray-300/60" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 sm:h-12 w-36 rounded-xl bg-gray-300/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Products Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-gray-200/80 rounded-xl" />
            <Skeleton className="h-4 w-44 bg-gray-200/50 rounded-md" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

