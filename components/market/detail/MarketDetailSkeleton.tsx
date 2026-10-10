export default function MarketDetailSkeleton() {
  return (
    <div aria-label="Loading asset details" role="status" className="animate-pulse motion-reduce:animate-none">
      <div className="h-12 border-b border-sidebar-border bg-slate-100" />
      <div className="space-y-6 px-4 py-6 sm:px-6">
        <div className="h-36 rounded-xl border border-sidebar-border bg-slate-100" />
        <div className="h-[480px] rounded-xl border border-sidebar-border bg-slate-100" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-40 rounded-xl border border-sidebar-border bg-slate-100" />)}
        </div>
      </div>
      <span className="sr-only">Loading asset details</span>
    </div>
  );
}
