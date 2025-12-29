export function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
      <div className="aspect-square skeleton-loading" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 skeleton-loading" />
        <div className="h-4 w-full skeleton-loading" />
        <div className="h-4 w-2/3 skeleton-loading" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 skeleton-loading" />
          <div className="h-9 w-9 rounded-lg skeleton-loading" />
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
