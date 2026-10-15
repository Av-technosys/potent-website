import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <main className="container mx-auto px-4 py-10 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Checkout Steps (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Delivery Address */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <Skeleton className="h-6 w-44 bg-gray-200/80 rounded-md" />
                  <Skeleton className="h-3.5 w-56 bg-gray-200/50 rounded-md" />
                </div>
                <Skeleton className="h-9 w-32 rounded-xl bg-gray-200/60" />
              </div>

              {/* Saved Address Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border-2 border-gray-200/80 p-4 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-28 bg-gray-200/80 rounded-md" />
                    <Skeleton className="h-4 w-12 rounded-full bg-gray-200/60" />
                  </div>
                  <Skeleton className="h-3.5 w-full bg-gray-200/50 rounded-md" />
                  <Skeleton className="h-3.5 w-3/4 bg-gray-200/50 rounded-md" />
                  <Skeleton className="h-3.5 w-24 bg-gray-200/50 rounded-md" />
                </div>

                <div className="rounded-xl border border-gray-200/60 p-4 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24 bg-gray-200/70 rounded-md" />
                  </div>
                  <Skeleton className="h-3.5 w-full bg-gray-200/40 rounded-md" />
                  <Skeleton className="h-3.5 w-2/3 bg-gray-200/40 rounded-md" />
                  <Skeleton className="h-3.5 w-24 bg-gray-200/40 rounded-md" />
                </div>
              </div>

              <Skeleton className="h-11 w-48 rounded-xl bg-gray-200/90" />
            </div>

            {/* Step 2: Payment Preview */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <Skeleton className="h-6 w-40 bg-gray-200/80 rounded-md" />
              <Skeleton className="h-4 w-64 bg-gray-200/50 rounded-md" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200/50" />
                <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200/50" />
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="rounded-xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-5">
              <Skeleton className="h-6 w-36 bg-gray-200/80 rounded-md" />

              {/* Items Preview */}
              <div className="space-y-3 border-y border-gray-100 py-3">
                <div className="flex gap-3 items-center">
                  <Skeleton className="h-14 w-14 shrink-0 rounded-lg bg-gray-200/70" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-36 bg-gray-200/80 rounded-md" />
                    <Skeleton className="h-3 w-20 bg-gray-200/50 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-12 bg-gray-200/70 rounded-md" />
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16 bg-gray-200/60 rounded-md" />
                  <Skeleton className="h-4 w-16 bg-gray-200/60 rounded-md" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-gray-200/60 rounded-md" />
                  <Skeleton className="h-4 w-14 bg-gray-200/60 rounded-md" />
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <Skeleton className="h-5 w-24 bg-gray-200/80 rounded-md" />
                  <Skeleton className="h-5 w-20 bg-gray-200/80 rounded-md" />
                </div>
              </div>

              {/* Pay Now Button */}
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200/90" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

