import Link from "next/link";

export default function NotFound() {
  return (
    <div className="m-4 rounded-xl border border-sidebar-border bg-white p-8 text-center shadow-sm sm:m-6">
      <h1 className="text-xl font-semibold text-slate-900">Asset not found</h1>
      <p className="mt-2 text-sm text-sidebar-muted">
        CoinGecko does not have a market asset matching this URL.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
      >
        Return to market
      </Link>
    </div>
  );
}
