import { Skeleton } from "@/components/ui/skeleton";

export function FaqSkeleton() {
  return (
    <section className="bg-white py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Title & Subtitle */}
        <div className="text-center space-y-3">
          <Skeleton className="h-9 sm:h-11 w-72 sm:w-96 mx-auto bg-gray-200/80 rounded-xl" />
          <Skeleton className="h-4 sm:h-5 w-3/4 max-w-md mx-auto bg-gray-200/50 rounded-md" />
        </div>

        {/* Search input */}
        <div className="max-w-xl mx-auto">
          <Skeleton className="h-11 w-full rounded-full bg-gray-200/60" />
        </div>

        {/* Product Tabs pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-36 rounded-full bg-gray-200/60" />
          ))}
        </div>

        {/* Category Tabs pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full bg-gray-200/50" />
          ))}
        </div>

        {/* FAQ Accordion items container */}
        <div className="rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 space-y-2"
            >
              <div className="flex justify-between items-center py-2">
                <Skeleton className="h-5 w-3/4 bg-gray-200/80 rounded-md" />
                <Skeleton className="h-4 w-4 rounded-full bg-gray-200/60" />
              </div>
              <Skeleton className="h-3.5 w-1/3 bg-gray-200/40 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

