export default function WatchlistSkeleton() {
  return (
    <div aria-label="Restoring watchlist" role="status" className="animate-pulse motion-reduce:animate-none">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="h-28 rounded-xl border border-sidebar-border bg-slate-100" />
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-sidebar-border bg-white">
        <div className="h-20 border-b border-sidebar-border bg-slate-200" />
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="h-14 border-b border-slate-200 bg-slate-100 last:border-b-0" />
        ))}
      </div>
      <span className="sr-only">Restoring saved assets</span>
    </div>
  );
}
