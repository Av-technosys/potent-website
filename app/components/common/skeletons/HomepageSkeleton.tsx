import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function HomepageSkeleton() {
  return (
    <main className="min-h-screen bg-linear-to-b from-[#E2F4F7] to-[#FFFFFF] md:bg-white pb-16">
      <div className="flex flex-col">
        {/* Order 1: Hero Banner */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="mx-auto max-w-7xl">
            <div className="relative h-[320px] sm:h-[420px] md:h-[500px] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-emerald-950/10 p-6 sm:p-12 flex flex-col justify-end space-y-4">
              <Skeleton className="h-6 w-36 rounded-full bg-gray-300/60" />
              <Skeleton className="h-10 sm:h-14 w-3/4 max-w-xl rounded-xl bg-gray-300/70" />
              <Skeleton className="h-4 sm:h-5 w-1/2 max-w-md rounded-md bg-gray-300/50" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-11 sm:h-12 w-36 sm:w-44 rounded-xl bg-gray-300/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Order 2: Brand Line quick selector */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-28 sm:h-36 rounded-2xl sm:rounded-3xl bg-gray-100/90 border border-gray-200/60" />
            <Skeleton className="h-28 sm:h-36 rounded-2xl sm:rounded-3xl bg-gray-100/90 border border-gray-200/60" />
          </div>
        </div>

        {/* Order 3: Bestselling Products section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1.5">
                <Skeleton className="h-7 sm:h-9 w-60 sm:w-80 bg-gray-200/80 rounded-xl" />
                <Skeleton className="h-4 w-44 bg-gray-200/50 rounded-md" />
              </div>
              <Skeleton className="h-9 w-24 rounded-xl bg-gray-200/60 hidden sm:block" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Category Grid Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <Skeleton className="h-7 w-48 bg-gray-200/80 rounded-xl" />
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-4 text-center space-y-3"
                >
                  <Skeleton className="h-16 w-16 rounded-full bg-gray-200/70 mx-auto" />
                  <Skeleton className="h-4 w-20 rounded-md bg-gray-200/60 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

