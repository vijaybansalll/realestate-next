export default function PropertiesLoading() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-20 text-neutral-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-3.5 w-12 animate-pulse rounded-md bg-neutral-800" />
          <span className="text-neutral-700">/</span>
          <div className="h-3.5 w-24 animate-pulse rounded-md bg-neutral-800" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col gap-4 border-b border-neutral-800/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 animate-pulse rounded-md bg-neutral-800" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-neutral-800" />
            </div>
            <div className="h-10 w-80 animate-pulse rounded-xl bg-neutral-800 sm:w-96" />
            <div className="h-4 max-w-xl animate-pulse rounded-md bg-neutral-800/80" />
          </div>
          <div className="hidden h-8 w-36 animate-pulse rounded-xl bg-neutral-800 sm:block" />
        </div>

        {/* Control Bar Skeleton */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="h-9 w-64 animate-pulse rounded-xl bg-neutral-800" />
            <div className="h-9 w-24 animate-pulse rounded-xl bg-neutral-800" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-28 animate-pulse rounded-md bg-neutral-800" />
            <div className="h-8 w-36 animate-pulse rounded-xl bg-neutral-800" />
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60"
            >
              {/* Image Skeleton */}
              <div className="bg-neutral-850 aspect-[16/10] w-full animate-pulse bg-neutral-800" />

              {/* Content Skeleton */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded-md bg-neutral-800" />
                  <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-neutral-800/70" />

                  {/* Specs matrix */}
                  <div className="mt-4 grid grid-cols-4 gap-2 border-y border-neutral-800/80 py-3">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="space-y-1">
                        <div className="h-2.5 w-8 animate-pulse rounded bg-neutral-800" />
                        <div className="h-4 w-12 animate-pulse rounded bg-neutral-800" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button Skeleton */}
                <div className="mt-5 border-t border-neutral-800/60 pt-2">
                  <div className="h-8 w-full animate-pulse rounded-xl bg-neutral-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
