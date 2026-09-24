import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 container my-12">

      {/* Top Filter Bar */}
      <div className="container m-12 py-4 flex justify-between items-center">
        <Skeleton className="h-8 w-40 bg-gray-200" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-24 bg-gray-200" />
          <Skeleton className="h-8 w-24 bg-gray-200" />
          <Skeleton className="h-8 w-24 bg-gray-200" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl md:mx-12 mx-auto py-8 px-6 flex gap-8">

        {/* Sidebar Filters */}
        <div className="hidden md:block w-64 space-y-4">
          <Skeleton className="h-6 w-32 bg-gray-200" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full bg-gray-200" />
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 space-y-6">

          {/* Sorting / header */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40 bg-gray-200" />
            <Skeleton className="h-8 w-32 bg-gray-200" />
          </div>

          {/* Products */}
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

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <Skeleton className="h-8 w-8 bg-gray-200" />
            <Skeleton className="h-8 w-8 bg-gray-200" />
            <Skeleton className="h-8 w-8 bg-gray-200" />
          </div>

        </div>
      </div>
    </div>
  );
}