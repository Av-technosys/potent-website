import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen md:mx-12 bg-[#FDFCF9]">
      <main className="container mx-auto px-4 py-10 md:px-16 space-y-8">

        {/* Title */}
        <Skeleton className="h-8 w-48 bg-gray-200" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                
                {/* Product Image */}
                <Skeleton className="h-24 w-24 rounded-md bg-gray-200" />

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                  <Skeleton className="h-4 w-1/3 bg-gray-200" />
                </div>

                {/* Price / Qty */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-16 bg-gray-200" />
                  <Skeleton className="h-8 w-20 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-6 w-32 bg-gray-200" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
            </div>

            <Skeleton className="h-10 w-full bg-gray-200 rounded-md" />
          </div>

        </div>
      </main>
    </div>
  );
}