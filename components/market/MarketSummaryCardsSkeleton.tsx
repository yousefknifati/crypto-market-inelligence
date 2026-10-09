export default function MarketSummaryCardsSkeleton() {
  return (
    <section
      aria-label="Loading global market summary"
      className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {[0, 1, 2].map((card) => (
        <div
          key={card}
          className="h-[178px] animate-pulse rounded-xl border border-sidebar-border bg-white p-[17px] motion-reduce:animate-none"
        >
          <div className="flex justify-between">
            <span className="h-3 w-28 rounded bg-slate-200" />
            <span className="h-5 w-24 rounded-full bg-slate-200" />
          </div>
          <div className="mt-8 h-9 w-40 rounded bg-slate-200" />
          <div className="mt-9 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200" />
        </div>
      ))}
    </section>
  );
}
