import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="my-5 flex w-full max-w-4xl flex-col gap-8 rounded-2xl bg-white p-6 shadow-lg md:my-0 md:p-10">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32 bg-gray-200/70 rounded-md" />
            <Skeleton className="h-4 w-12 bg-gray-200/70 rounded-md" />
          </div>
          <Skeleton className="h-3 w-full rounded-full bg-gray-200/50" />
        </div>

        <Skeleton className="h-8 w-3/4 max-w-xl bg-gray-200/80 rounded-xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-gray-200/60" />
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-100">
          <Skeleton className="h-10 w-24 rounded-xl bg-gray-200/60" />
          <Skeleton className="h-10 w-24 rounded-xl bg-gray-200/60" />
        </div>
      </div>
    </div>
  );
}

