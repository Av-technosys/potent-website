import { Skeleton } from "@/components/ui/skeleton";

export function OrderConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] py-10">
      <main className="mx-auto max-w-4xl px-4 space-y-8">
        {/* Success Card Header */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center space-y-4 shadow-xs">
          <Skeleton className="h-16 w-16 rounded-full bg-gray-200/80 mx-auto" />
          <Skeleton className="h-8 w-64 bg-gray-200/90 rounded-xl mx-auto" />
          <Skeleton className="h-4 w-48 bg-gray-200/50 rounded-md mx-auto" />
          <div className="flex justify-center gap-3 pt-2">
            <Skeleton className="h-9 w-36 rounded-xl bg-gray-200/70" />
            <Skeleton className="h-9 w-36 rounded-xl bg-gray-200/70" />
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
          <Skeleton className="h-6 w-36 bg-gray-200/80 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-xl bg-gray-200/70" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48 bg-gray-200/80 rounded-md" />
                    <Skeleton className="h-3 w-28 bg-gray-200/50 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20 bg-gray-200/80 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Payment Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3">
            <Skeleton className="h-5 w-36 bg-gray-200/80 rounded-md" />
            <Skeleton className="h-4 w-48 bg-gray-200/60 rounded-md" />
            <Skeleton className="h-3.5 w-full bg-gray-200/50 rounded-md" />
            <Skeleton className="h-3.5 w-2/3 bg-gray-200/50 rounded-md" />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3">
            <Skeleton className="h-5 w-36 bg-gray-200/80 rounded-md" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 bg-gray-200/60 rounded-md" />
                <Skeleton className="h-4 w-16 bg-gray-200/60 rounded-md" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 bg-gray-200/60 rounded-md" />
                <Skeleton className="h-4 w-16 bg-gray-200/60 rounded-md" />
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <Skeleton className="h-5 w-24 bg-gray-200/80 rounded-md" />
                <Skeleton className="h-5 w-20 bg-gray-200/80 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

