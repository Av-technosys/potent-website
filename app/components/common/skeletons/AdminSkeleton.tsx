import { Skeleton } from "@/components/ui/skeleton";

export function AdminSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Admin Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-48 bg-gray-200/80 rounded-md" />
          <Skeleton className="h-4 w-64 bg-gray-200/50 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl bg-gray-200/80" />
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
        <Skeleton className="h-10 flex-1 max-w-sm rounded-lg bg-gray-200/60" />
        <Skeleton className="h-10 w-24 rounded-lg bg-gray-200/60" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-2xs">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100 bg-gray-50/50">
          <Skeleton className="h-4 w-24 bg-gray-200/70 rounded-md" />
          <Skeleton className="h-4 w-28 bg-gray-200/70 rounded-md" />
          <Skeleton className="h-4 w-20 bg-gray-200/70 rounded-md" />
          <Skeleton className="h-4 w-20 bg-gray-200/70 rounded-md" />
          <Skeleton className="h-4 w-16 bg-gray-200/70 rounded-md ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 items-center">
              <Skeleton className="h-4 w-32 bg-gray-200/60 rounded-md" />
              <Skeleton className="h-4 w-36 bg-gray-200/60 rounded-md" />
              <Skeleton className="h-4 w-16 bg-gray-200/60 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full bg-gray-200/60" />
              <div className="flex gap-2 ml-auto">
                <Skeleton className="h-8 w-8 rounded-lg bg-gray-200/50" />
                <Skeleton className="h-8 w-8 rounded-lg bg-gray-200/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

