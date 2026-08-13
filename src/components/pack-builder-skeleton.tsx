'use client';

export function PackBuilderSkeleton() {
  return (
    <div className="min-h-screen pb-28 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-6 space-y-4">
          <div className="h-8 w-24 rounded bg-muted" />
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 rounded bg-primary/20" />
              <div className="h-8 w-3/4 max-w-md rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-8 w-20 rounded bg-muted" />
              <div className="h-8 w-24 rounded bg-primary/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Counter Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>

        {/* Items Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border p-4 bg-muted/30"
            >
              <div className="h-5 w-5 rounded bg-muted" />
              <div className="h-14 w-14 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-md bg-muted" />
                <div className="h-4 w-6 rounded bg-muted" />
                <div className="h-8 w-8 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>

        {/* Backpack Section Skeleton */}
        <div className="mt-8 space-y-4">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-3 space-y-2">
                <div className="h-16 w-full rounded-lg bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-6 w-32 rounded bg-muted" />
          </div>
          <div className="h-10 w-40 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
