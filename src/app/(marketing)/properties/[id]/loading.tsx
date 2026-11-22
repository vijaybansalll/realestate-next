export default function PropertyDetailLoading() {
  return (
    <main className="min-h-screen bg-neutral-50 pt-24 pb-20 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb Skeleton */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="h-8 w-32 animate-pulse rounded-xl border border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-900/60" />

          <div className="flex items-center gap-2">
            <div className="h-3.5 w-10 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-neutral-400 dark:text-neutral-700">/</span>
            <div className="h-3.5 w-14 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-neutral-400 dark:text-neutral-700">/</span>
            <div className="h-3.5 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        {/* Title Header Bar Skeleton */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-neutral-200/80 pb-6 md:flex-row md:items-end dark:border-neutral-800/80">
          <div className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-6 w-32 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* Title */}
            <div className="h-9 w-72 sm:w-96 md:h-10 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />

            {/* Location */}
            <div className="h-4 w-48 animate-pulse rounded-md bg-neutral-200/80 dark:bg-neutral-800/80" />
          </div>

          {/* Pricing & Area */}
          <div className="flex flex-row items-baseline justify-between gap-4 border-t border-neutral-200/60 pt-4 md:flex-col md:items-end md:border-t-0 md:pt-0 dark:border-neutral-800/60">
            <div className="space-y-1 md:text-right">
              <div className="h-3.5 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 md:ml-auto" />
              <div className="h-8 sm:h-9 w-36 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 md:ml-auto" />
            </div>
            <div className="h-6 w-28 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        {/* 5-Image Mosaic Grid Gallery Skeleton */}
        <div className="mb-12 relative grid grid-cols-1 gap-2.5 overflow-hidden rounded-2xl sm:grid-cols-2 md:h-[460px] md:grid-cols-4 md:grid-rows-2 lg:h-[500px]">
          {/* Main Hero Image */}
          <div className="aspect-[16/10] sm:aspect-auto md:col-span-2 md:row-span-2 w-full h-full animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl" />

          {/* 4 Supporting Images */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="hidden sm:block aspect-[4/3] md:aspect-auto w-full h-full animate-pulse bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl"
            />
          ))}
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column: Overview & Specifications */}
          <div className="space-y-10 lg:col-span-2">
            {/* Overview Section Skeleton */}
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="h-6 w-52 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-800/80" />
                <div className="h-4 w-[94%] animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-800/80" />
                <div className="h-4 w-[98%] animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-800/80" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-800/80" />
              </div>
            </div>

            {/* Specifications Grid Skeleton */}
            <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="mb-6 flex items-center justify-between border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80">
                <div className="h-6 w-64 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-28 animate-pulse rounded bg-neutral-200/70 dark:bg-neutral-800/70" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 sm:gap-4">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-950/40 h-24"
                  >
                    <div className="flex items-center justify-between">
                      <div className="size-5 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
                      <div className="size-3 animate-pulse rounded-full bg-neutral-200/70 dark:bg-neutral-800/70" />
                    </div>
                    <div className="space-y-1.5 mt-2">
                      <div className="h-3 w-16 animate-pulse rounded bg-neutral-200/70 dark:bg-neutral-800/70" />
                      <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Inquiry Form Skeleton */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-xl backdrop-blur-md sm:p-7 dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="border-b border-neutral-200 pb-4 dark:border-neutral-800 space-y-2">
                <div className="h-3.5 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-6 w-48 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3.5 w-full animate-pulse rounded bg-neutral-200/70 dark:bg-neutral-800/70" />
              </div>

              {/* Input Skeletons */}
              <div className="mt-5 space-y-4">
                {Array.from({ length: 3 }).map((_, fIdx) => (
                  <div key={fIdx} className="space-y-1.5">
                    <div className="h-3 w-20 animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-800/80" />
                    <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800" />
                  </div>
                ))}

                <div className="pt-2">
                  <div className="h-11 w-full animate-pulse rounded-xl bg-amber-500/20 dark:bg-amber-500/15 border border-amber-500/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Estates Section Skeleton */}
        <section className="mt-20 border-t border-neutral-200/80 pt-12 dark:border-neutral-800/80">
          <div className="mb-8 flex items-end justify-between">
            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-6 w-64 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <div className="aspect-[16/10] w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200/70 dark:bg-neutral-800/70" />
                  <div className="h-8 w-full animate-pulse rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
