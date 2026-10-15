import { Skeleton } from "@/components/ui/skeleton";

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs space-y-2">
        <Skeleton className="h-6 w-48 bg-gray-200/80 rounded-md" />
        <Skeleton className="h-4 w-72 bg-gray-200/50 rounded-md" />
      </div>

      {/* Stats Cards: Total Orders, Total Spent, Rewards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 bg-gray-200/60 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200/60" />
            </div>
            <Skeleton className="h-8 w-20 bg-gray-200/90 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Recent Orders section */}
      <div className="rounded-2xl bg-white p-6 shadow-2xs border border-gray-100 space-y-5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32 bg-gray-200/80 rounded-md" />
          <Skeleton className="h-4 w-16 bg-gray-200/50 rounded-md" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 border border-gray-100 rounded-xl"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-32 bg-gray-200/80 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-full bg-gray-200/60" />
                </div>
                <Skeleton className="h-3 w-40 bg-gray-200/50 rounded-md" />
              </div>
              <Skeleton className="h-5 w-16 bg-gray-200/80 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardOrdersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-36 bg-gray-200/80 rounded-md" />
        <Skeleton className="h-4 w-24 bg-gray-200/50 rounded-md" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Skeleton className="h-9 w-24 rounded-full bg-gray-200/80" />
        <Skeleton className="h-9 w-28 rounded-full bg-gray-200/50" />
        <Skeleton className="h-9 w-24 rounded-full bg-gray-200/50" />
        <Skeleton className="h-9 w-24 rounded-full bg-gray-200/50" />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs space-y-4"
          >
            {/* Header: Order ID + Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-40 bg-gray-200/80 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-full bg-gray-200/60" />
                </div>
                <Skeleton className="h-3 w-32 bg-gray-200/50 rounded-md" />
              </div>
              <Skeleton className="h-5 w-20 bg-gray-200/80 rounded-md" />
            </div>

            {/* Items row */}
            <div className="flex items-center gap-4 py-1">
              <Skeleton className="h-16 w-16 shrink-0 rounded-xl bg-gray-200/70" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48 sm:w-64 bg-gray-200/80 rounded-md" />
                <Skeleton className="h-3 w-28 bg-gray-200/50 rounded-md" />
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
              <Skeleton className="h-8 w-28 rounded-xl bg-gray-200/60" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-xl bg-gray-200/60" />
                <Skeleton className="h-8 w-24 rounded-xl bg-gray-200/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardOrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Skeleton className="h-5 w-32 bg-gray-200/60 rounded-md" />

      {/* Order Status Banner */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-48 bg-gray-200/80 rounded-md" />
            <Skeleton className="h-4 w-36 bg-gray-200/50 rounded-md" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full bg-gray-200/70" />
        </div>

        {/* Tracking steps timeline */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 text-center">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200/70 mx-auto" />
              <Skeleton className="h-3 w-16 bg-gray-200/50 rounded-md mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs space-y-4">
        <Skeleton className="h-5 w-32 bg-gray-200/80 rounded-md" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-xl bg-gray-200/70" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-44 bg-gray-200/80 rounded-md" />
                  <Skeleton className="h-3 w-20 bg-gray-200/50 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-16 bg-gray-200/80 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Address & Payment summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-2xs space-y-3">
          <Skeleton className="h-5 w-36 bg-gray-200/80 rounded-md" />
          <Skeleton className="h-4 w-48 bg-gray-200/60 rounded-md" />
          <Skeleton className="h-3.5 w-full bg-gray-200/50 rounded-md" />
          <Skeleton className="h-3.5 w-2/3 bg-gray-200/50 rounded-md" />
        </div>
        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-2xs space-y-3">
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
    </div>
  );
}

export function DashboardAddressSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-44 bg-gray-200/80 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-xl bg-gray-200/80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-32 bg-gray-200/80 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-full bg-gray-200/60" />
            </div>
            <Skeleton className="h-3.5 w-full bg-gray-200/50 rounded-md" />
            <Skeleton className="h-3.5 w-3/4 bg-gray-200/50 rounded-md" />
            <Skeleton className="h-3.5 w-28 bg-gray-200/50 rounded-md" />
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Skeleton className="h-8 w-16 rounded-lg bg-gray-200/60" />
              <Skeleton className="h-8 w-16 rounded-lg bg-gray-200/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardProfileSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-6 w-36 bg-gray-200/80 rounded-md" />
        <Skeleton className="h-4 w-60 bg-gray-200/50 rounded-md" />
      </div>

      <div className="space-y-4 max-w-xl">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-gray-200/70 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl bg-gray-200/50" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-gray-200/70 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl bg-gray-200/50" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-gray-200/70 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl bg-gray-200/50" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-11 w-32 rounded-xl bg-gray-200/90" />
        </div>
      </div>
    </div>
  );
}

