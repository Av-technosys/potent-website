import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container  space-y-6">

      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-3">
        <Skeleton className="h-8 w-32 bg-gray-200" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-16 bg-gray-200" />
          <Skeleton className="h-6 w-16 bg-gray-200" />
          <Skeleton className="h-6 w-16 bg-gray-200" />
        </div>
      </div>

      {/* Hero */}
      <Skeleton className="h-[400px] m-12 rounded-md bg-gray-200" />

      {/* Brand Accordion */}
      <Skeleton className="h-20 m-12 rounded-md bg-gray-200" />

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 m-12 rounded-md bg-gray-200" />
        ))}
      </div>

      {/* StoryTruth */}
      <Skeleton className="h-40 m-12 rounded-md bg-gray-200" />

      {/* Bestselling Products */}
      <div className="px-4 space-y-4">
        <Skeleton className="h-6 w-40 bg-gray-200" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 m-12 rounded-md bg-gray-200" />
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/2 bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <Skeleton className="h-40 m-12 rounded-md bg-gray-200" />

      {/* Why Choose Us */}
      <div className="grid md:grid-cols-3 gap-4 px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 m-12 rounded-md bg-gray-200" />
        ))}
      </div>

      {/* About Story */}
      <Skeleton className="h-40 m-12 rounded-md bg-gray-200" />

      {/* Instagram Feed */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 m-12 rounded-md bg-gray-200" />
        ))}
      </div>

      {/* Testimonials */}
      <Skeleton className="h-40 m-12 rounded-md bg-gray-200" />

      {/* Product Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 m-12 rounded-md bg-gray-200" />
        ))}
      </div>

      {/* Newsletter */}
      <Skeleton className="h-32 m-12 rounded-md bg-gray-200" />

      {/* Blog Section */}
      <div className="grid md:grid-cols-3 gap-4 px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 m-12 rounded-md bg-gray-200" />
        ))}
      </div>

      {/* Footer */}
      <Skeleton className="h-40 m-12 bg-gray-200" />
    </main>
  );
}