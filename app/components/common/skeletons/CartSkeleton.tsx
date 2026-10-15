import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <main className="container mx-auto px-4 py-10 md:px-16">
        <div className="grid grid-cols-1 gap-6 lg:gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Cart Items (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="space-y-1">
              <Skeleton className="h-7 w-32 bg-gray-200/80 rounded-md" />
              <Skeleton className="h-4 w-20 bg-gray-200/60 rounded-md" />
            </div>

            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
                >
                  <div className="flex gap-3.5 items-center">
                    {/* Item Image */}
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl bg-[#FAF8F3] border border-gray-100 flex items-center justify-center p-2">
                      <Skeleton className="h-3/4 w-3/4 rounded-lg bg-gray-200/70" />
                    </div>

                    {/* Item Details */}
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48 sm:w-60 rounded-md bg-gray-200/80" />
                      <Skeleton className="h-3.5 w-24 rounded-full bg-gray-200/60" />
                      <Skeleton className="h-4 w-20 rounded-md bg-gray-200/70" />
                    </div>
                  </div>

                  {/* Quantity Stepper & Delete Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <Skeleton className="h-8 w-24 rounded-lg bg-gray-200/60" />
                    <Skeleton className="h-8 w-8 rounded-lg bg-gray-200/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="rounded-xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-3">
                <Skeleton className="h-6 w-36 bg-gray-200/80 rounded-md" />
                <Skeleton className="h-4 w-14 bg-gray-200/50 rounded-md" />
              </div>

              {/* Free Shipping bar */}
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-48 bg-gray-200/70 rounded-md" />
                <Skeleton className="h-2 w-full rounded-full bg-gray-200/50" />
              </div>

              {/* Coupon input */}
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-xl bg-gray-200/60" />
                <Skeleton className="h-10 w-20 rounded-xl bg-gray-200/80" />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16 bg-gray-200/60 rounded-md" />
                  <Skeleton className="h-4 w-16 bg-gray-200/60 rounded-md" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-gray-200/60 rounded-md" />
                  <Skeleton className="h-4 w-12 bg-gray-200/60 rounded-md" />
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <Skeleton className="h-5 w-24 bg-gray-200/80 rounded-md" />
                  <Skeleton className="h-5 w-20 bg-gray-200/80 rounded-md" />
                </div>
              </div>

              {/* Checkout Button */}
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200/90" />

              {/* Trust Badges */}
              <div className="pt-2 flex justify-around">
                <Skeleton className="h-4 w-24 bg-gray-200/50 rounded-md" />
                <Skeleton className="h-4 w-24 bg-gray-200/50 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

