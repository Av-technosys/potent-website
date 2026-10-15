import { Skeleton } from "@/components/ui/skeleton";

export function PolicySkeleton({ titleWidth = "w-64" }: { titleWidth?: string }) {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full flex items-start justify-center bg-white py-16 px-4 md:px-8">
        <div className="w-full max-w-3xl flex flex-col items-center gap-8">
          {/* Centered Page Title */}
          <Skeleton className={`h-9 sm:h-11 ${titleWidth} bg-gray-200/80 rounded-xl`} />

          {/* Document Card */}
          <div className="w-full bg-[#F8F6F1] md:rounded-2xl rounded-none shadow-xs border border-neutral-200 p-6 sm:p-8 lg:p-10 space-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-48 bg-gray-200/80 rounded-md" />
                <Skeleton className="h-4 w-full bg-gray-200/50 rounded-md" />
                <Skeleton className="h-4 w-11/12 bg-gray-200/50 rounded-md" />
                <Skeleton className="h-4 w-4/5 bg-gray-200/50 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

