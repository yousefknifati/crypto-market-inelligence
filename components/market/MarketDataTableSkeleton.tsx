export default function MarketDataTableSkeleton() {
  return (
    <section aria-label="Loading cryptocurrency market table" className="mt-6 w-full min-w-0 overflow-hidden rounded-xl border border-sidebar-border bg-white shadow-sm">
      <div className="animate-pulse p-4 motion-reduce:animate-none">
        <div className="flex items-center justify-between gap-4">
          <span className="h-5 w-64 rounded bg-slate-300" />
          <span className="h-8 w-80 rounded-lg bg-slate-200" />
        </div>
        <div className="mt-4 flex justify-between gap-4">
          <span className="h-8 w-72 rounded-lg bg-slate-200" />
          <span className="h-8 w-44 rounded-lg bg-slate-200" />
        </div>
      </div>
      <div className="border-t border-sidebar-border">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
          <div key={row} className="flex h-12 animate-pulse items-center gap-4 border-b border-slate-100 px-4 last:border-b-0 motion-reduce:animate-none">
            <span className="h-3 w-5 rounded bg-slate-200" />
            <span className="size-6 rounded-full bg-slate-300" />
            <span className="h-3 w-28 rounded bg-slate-300" />
            <span className="ml-auto h-3 w-20 rounded bg-slate-200" />
            <span className="h-5 w-16 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
