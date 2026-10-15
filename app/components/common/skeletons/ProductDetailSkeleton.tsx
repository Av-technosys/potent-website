import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 static lg:sticky lg:top-24 space-y-4 sm:space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-6 shadow-xs flex items-center justify-center">
              <Skeleton className="h-4/5 w-4/5 rounded-2xl bg-gray-200/70" />
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-2"
                >
                  <Skeleton className="h-full w-full rounded-lg bg-gray-200/70" />
                </div>
              ))}
            </div>

            {/* Product highlights banner */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 grid grid-cols-3 gap-2">
              <Skeleton className="h-10 rounded-lg bg-gray-200/60" />
              <Skeleton className="h-10 rounded-lg bg-gray-200/60" />
              <Skeleton className="h-10 rounded-lg bg-gray-200/60" />
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            {/* Brand Badge */}
            <Skeleton className="h-5 w-24 rounded-full bg-gray-200/80" />

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-8 sm:h-10 w-4/5 rounded-lg bg-gray-200/90" />
              <Skeleton className="h-4 sm:h-5 w-3/5 rounded-md bg-gray-200/60" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-24 rounded-md bg-gray-200/70" />
              <Skeleton className="h-4 w-28 rounded-md bg-gray-200/50" />
            </div>

            {/* Price line */}
            <div className="flex items-baseline gap-3 py-1">
              <Skeleton className="h-8 w-24 rounded-lg bg-gray-200/90" />
              <Skeleton className="h-5 w-16 rounded-md bg-gray-200/50" />
              <Skeleton className="h-6 w-20 rounded-full bg-gray-200/60" />
            </div>

            {/* Size / Variant Selector */}
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-28 rounded-md bg-gray-200/70" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <Skeleton className="h-20 rounded-2xl bg-white border border-gray-200/80" />
                <Skeleton className="h-20 rounded-2xl bg-white border border-gray-200/80" />
                <Skeleton className="h-20 rounded-2xl bg-white border border-gray-200/80" />
              </div>
            </div>

            {/* Purchase Frequency / Subscription Card */}
            <div className="rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-6 space-y-3 shadow-xs">
              <Skeleton className="h-4 w-40 rounded-md bg-gray-200/70" />
              <Skeleton className="h-14 w-full rounded-xl bg-gray-200/60" />
              <Skeleton className="h-14 w-full rounded-xl bg-gray-200/40" />
            </div>

            {/* Add to Cart CTA */}
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl bg-gray-200/90" />
            </div>

            {/* Pincode checker */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 space-y-2">
              <Skeleton className="h-4 w-32 rounded-md bg-gray-200/70" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-xl bg-gray-200/60" />
                <Skeleton className="h-10 w-20 rounded-xl bg-gray-200/80" />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200/80 bg-white p-3 space-y-1.5 flex flex-col items-center text-center"
                >
                  <Skeleton className="h-6 w-6 rounded-full bg-gray-200/70" />
                  <Skeleton className="h-3 w-16 rounded-md bg-gray-200/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs & Details */}
        <div className="mt-12 sm:mt-16 border-t border-gray-200 pt-8 space-y-6">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded-xl bg-gray-200/80" />
            <Skeleton className="h-10 w-32 rounded-xl bg-gray-200/50" />
            <Skeleton className="h-10 w-32 rounded-xl bg-gray-200/50" />
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 space-y-4">
            <Skeleton className="h-6 w-48 rounded-md bg-gray-200/80" />
            <Skeleton className="h-4 w-full rounded-md bg-gray-200/60" />
            <Skeleton className="h-4 w-5/6 rounded-md bg-gray-200/60" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-gray-200/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

