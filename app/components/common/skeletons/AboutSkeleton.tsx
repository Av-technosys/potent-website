import { Skeleton } from "@/components/ui/skeleton";

export function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] pb-16 space-y-12">
      {/* About Hero Banner */}
      <div className="w-full bg-[#075965] py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-4">
          <Skeleton className="h-6 w-32 mx-auto rounded-full bg-white/20" />
          <Skeleton className="h-10 sm:h-16 w-4/5 mx-auto rounded-2xl bg-white/20" />
          <Skeleton className="h-4 sm:h-5 w-2/3 mx-auto rounded-md bg-white/15" />
        </div>
      </div>

      {/* Mission / Story Block */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-56 bg-gray-200/80 rounded-xl" />
          <Skeleton className="h-4 w-full bg-gray-200/50 rounded-md" />
          <Skeleton className="h-4 w-11/12 bg-gray-200/50 rounded-md" />
          <Skeleton className="h-4 w-4/5 bg-gray-200/50 rounded-md" />
        </div>
        <div className="aspect-4/3 rounded-3xl bg-gray-200/60 flex items-center justify-center p-6">
          <Skeleton className="h-full w-full rounded-2xl bg-gray-200/80" />
        </div>
      </div>

      {/* Values Grid */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-3"
            >
              <Skeleton className="h-12 w-12 rounded-xl bg-gray-200/70" />
              <Skeleton className="h-5 w-36 bg-gray-200/80 rounded-md" />
              <Skeleton className="h-3.5 w-full bg-gray-200/50 rounded-md" />
              <Skeleton className="h-3.5 w-4/5 bg-gray-200/50 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

