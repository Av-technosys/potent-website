import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 md:mx-12">

      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Skeleton className="h-8 w-32 bg-gray-200" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-16 bg-gray-200" />
          <Skeleton className="h-6 w-16 bg-gray-200" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-6 space-y-6">

        {/* Title */}
        <Skeleton className="h-8 w-48 bg-gray-200" />

        {/* Wishlist Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 w-full rounded-md bg-gray-200" />
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/2 bg-gray-200" />
              <Skeleton className="h-6 w-1/3 bg-gray-200" />
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <div className="px-6 py-10">
        <Skeleton className="h-40 w-full bg-gray-200" />
      </div>
    </div>
  );
}