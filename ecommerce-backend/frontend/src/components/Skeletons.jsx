export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-[color:var(--surface-soft)] ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)]">
      <SkeletonBlock className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-6 w-5/6" />
        <SkeletonBlock className="h-4 w-3/5" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-4/5" />
        <div className="flex gap-3">
          <SkeletonBlock className="h-11 flex-1" />
          <SkeletonBlock className="h-11 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 lg:block">
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-32" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-28 w-full" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid gap-3 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-3 w-56" />
          </div>
          <SkeletonBlock className="h-8 w-20" />
          <SkeletonBlock className="h-8 w-28" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[28px] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-soft)] p-8 text-center">
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-[color:var(--surface)]">
        <span className="text-2xl">◌</span>
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-[color:var(--foreground)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--muted)]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

