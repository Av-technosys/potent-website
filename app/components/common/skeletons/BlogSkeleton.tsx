import { Skeleton } from "@/components/ui/skeleton";

export function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <main className="mx-auto max-w-7xl px-6 py-12 space-y-12">
        {/* Blog Header */}
        <div className="mb-12 py-16 sm:py-24 text-center space-y-4">
          <Skeleton className="h-10 sm:h-14 w-3/4 sm:w-2/3 mx-auto bg-gray-200/80 rounded-xl" />
          <Skeleton className="h-4 sm:h-5 w-1/2 sm:w-1/3 mx-auto bg-gray-200/50 rounded-md" />
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs space-y-4 p-4"
            >
              {/* Blog Image */}
              <div className="relative aspect-video w-full rounded-xl bg-gray-100 flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-xl bg-gray-200/70" />
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded-full bg-gray-200/70" />
                <Skeleton className="h-3.5 w-20 rounded-md bg-gray-200/50" />
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-5/6 rounded-md bg-gray-200/80" />
                <Skeleton className="h-4 w-full rounded-md bg-gray-200/50" />
                <Skeleton className="h-4 w-3/4 rounded-md bg-gray-200/50" />
              </div>

              {/* Read More Link */}
              <div className="pt-2">
                <Skeleton className="h-4 w-24 rounded-md bg-gray-200/60" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="min-h-screen pb-16 bg-[#FDFCF9]">
      {/* Title & Back link */}
      <div className="max-w-3xl mx-auto pt-16 pb-8 px-6 space-y-6">
        <Skeleton className="h-6 w-20 bg-gray-200/60 rounded-md" />
        <Skeleton className="h-10 sm:h-12 w-full bg-gray-200/80 rounded-xl" />
        <Skeleton className="h-6 w-3/4 bg-gray-200/60 rounded-lg" />

        {/* Author / Date row */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-6 pt-2">
          <Skeleton className="h-10 w-10 rounded-full bg-gray-200/70" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 bg-gray-200/80 rounded-md" />
            <Skeleton className="h-3 w-36 bg-gray-200/50 rounded-md" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        {/* Featured Image */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100">
          <Skeleton className="h-full w-full rounded-2xl bg-gray-200/70" />
        </div>

        {/* Paragraphs */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-4 w-full bg-gray-200/60 rounded-md" />
          <Skeleton className="h-4 w-full bg-gray-200/60 rounded-md" />
          <Skeleton className="h-4 w-5/6 bg-gray-200/60 rounded-md" />
          <Skeleton className="h-4 w-3/4 bg-gray-200/60 rounded-md" />
        </div>

        <div className="space-y-4 pt-4">
          <Skeleton className="h-6 w-48 bg-gray-200/80 rounded-md" />
          <Skeleton className="h-4 w-full bg-gray-200/60 rounded-md" />
          <Skeleton className="h-4 w-full bg-gray-200/60 rounded-md" />
          <Skeleton className="h-4 w-4/5 bg-gray-200/60 rounded-md" />
        </div>
      </div>
    </div>
  );
}

