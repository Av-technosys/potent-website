import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen md:mx-12 bg-[#FDFCF9]">
      <main className="container mx-auto px-4 py-10 md:px-16 lg:px-24">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">

          {/* Checkout Form (Left) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section title */}
            <Skeleton className="h-8 w-48 bg-gray-200" />

            {/* Input fields */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-full bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>

            {/* Address box */}
            <Skeleton className="h-24 w-full bg-gray-200 rounded-md" />

            {/* Button */}
            <Skeleton className="h-12 w-40 bg-gray-200 rounded-md" />
          </div>

          {/* Order Summary (Right) */}
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