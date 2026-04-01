export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 animate-pulse">
          <div className="aspect-4/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-3.5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
