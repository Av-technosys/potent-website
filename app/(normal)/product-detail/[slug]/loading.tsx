import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pt-12 container space-y-6">

      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] w-full bg-gray-200 rounded-md" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 bg-gray-200" />
          <Skeleton className="h-6 w-1/2 bg-gray-200" />
          <Skeleton className="h-10 w-1/3 bg-gray-200" />
          <Skeleton className="h-24 w-full bg-gray-200" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 bg-gray-200 rounded-md" />
        ))}
      </div>

      <Skeleton className="h-40 w-full bg-gray-200 rounded-md" />

      <Skeleton className="h-40 w-full bg-gray-200 rounded-md" />

      <Skeleton className="h-[300px] w-full bg-gray-200 rounded-md" />

      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 bg-gray-200 rounded-md" />
        ))}
      </div>
    </div>
  );
}