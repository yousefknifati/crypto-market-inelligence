export default function LivePriceStreamSkeleton() {
  return (
    <div role="status" aria-label="Loading live cryptocurrency prices" className="rounded-xl border border-sidebar-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-sidebar-border px-3 py-3">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-3 w-9 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      </div>
      <div className="space-y-2.5 p-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-16 animate-pulse rounded-lg border border-sidebar-border bg-slate-50 motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}
