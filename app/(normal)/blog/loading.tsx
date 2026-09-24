import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen container md:mx-12 bg-[#FDFCF9] space-y-10">

      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center">
        <Skeleton className="h-8 w-32 bg-gray-200" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-16 bg-gray-200" />
          <Skeleton className="h-6 w-16 bg-gray-200" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* Title Section */}
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-2/3 mx-auto bg-gray-200" />
          <Skeleton className="h-4 w-1/2 mx-auto bg-gray-200" />
        </div>

        {/* Blog Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-md bg-gray-200" />
              <Skeleton className="h-5 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/2 bg-gray-200" />
            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <div className="px-6 py-10">
        <Skeleton className="h-40 w-full bg-gray-200" />
      </div>
    </div>
  );
}