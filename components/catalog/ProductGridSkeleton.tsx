export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 animate-pulse">
          <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-sm" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-neutral-100 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-full bg-neutral-50 dark:bg-neutral-900 rounded" />
          </div>
          <div className="flex gap-1.5 mt-auto pt-2">
            <div className="h-4 w-12 bg-neutral-100 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-14 bg-neutral-100 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
