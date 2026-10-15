import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] space-y-12 pb-16">
      {/* Tracker Hero Banner */}
      <div className="w-full h-[60vh] sm:h-[75vh] bg-neutral-800/10 flex items-center justify-center p-6">
        <div className="max-w-xl text-center space-y-4">
          <Skeleton className="h-10 sm:h-14 w-3/4 mx-auto rounded-xl bg-gray-300/60" />
          <Skeleton className="h-4 w-full bg-gray-300/40 rounded-md" />
          <Skeleton className="h-4 w-4/5 mx-auto bg-gray-300/40 rounded-md" />
        </div>
      </div>

      {/* Log Entry Section */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
          <Skeleton className="h-6 w-44 bg-gray-200/80 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded-xl bg-gray-200/50" />
            <Skeleton className="h-12 rounded-xl bg-gray-200/50" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl bg-gray-200/80" />
        </div>
      </div>
    </div>
  );
}

