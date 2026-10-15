import { Skeleton } from "@/components/ui/skeleton";

export function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      {/* Hero Banner Section */}
      <section className="bg-[#075965] py-14 sm:py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8 space-y-4">
          <Skeleton className="h-6 w-36 mx-auto rounded-full bg-white/20" />
          <Skeleton className="h-10 sm:h-14 w-3/4 max-w-2xl mx-auto rounded-xl bg-white/20" />
          <Skeleton className="h-4 sm:h-5 w-full max-w-lg mx-auto rounded-md bg-white/15" />
        </div>
      </section>

      {/* Quick Contact Info Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-xl bg-gray-200/70" />
                <Skeleton className="h-4 w-16 rounded-full bg-gray-200/50" />
              </div>
              <Skeleton className="h-5 w-32 bg-gray-200/80 rounded-md" />
              <Skeleton className="h-3.5 w-40 bg-gray-200/50 rounded-md" />
              <Skeleton className="h-4 w-28 bg-gray-200/80 rounded-md" />
              <Skeleton className="h-8 w-full rounded-xl bg-gray-200/60" />
            </div>
          ))}
        </div>
      </section>

      {/* Form + Info Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Form */}
          <div className="lg:col-span-7 rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-xs space-y-5">
            <Skeleton className="h-7 w-48 bg-gray-200/80 rounded-md" />
            <Skeleton className="h-4 w-72 bg-gray-200/50 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Skeleton className="h-11 rounded-xl bg-gray-200/60" />
              <Skeleton className="h-11 rounded-xl bg-gray-200/60" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl bg-gray-200/60" />
            <Skeleton className="h-28 w-full rounded-xl bg-gray-200/60" />
            <Skeleton className="h-12 w-full rounded-xl bg-gray-200/90" />
          </div>

          {/* Office Info & Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <Skeleton className="h-6 w-36 bg-gray-200/80 rounded-md" />
              <Skeleton className="h-4 w-full bg-gray-200/50 rounded-md" />
              <Skeleton className="h-4 w-4/5 bg-gray-200/50 rounded-md" />
              <Skeleton className="h-12 w-full rounded-2xl bg-gray-200/60" />
            </div>
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-3">
              <Skeleton className="h-5 w-40 bg-gray-200/80 rounded-md" />
              <Skeleton className="h-4 w-52 bg-gray-200/50 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

