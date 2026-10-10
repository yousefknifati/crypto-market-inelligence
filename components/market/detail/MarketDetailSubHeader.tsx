import Link from "next/link";
import Badge from "@/components/ui/Badge";
import MarketFeedStatus from "./MarketFeedStatus";

type MarketDetailSubHeaderProps = {
  assetName: string;
  symbol: string;
};

export default function MarketDetailSubHeader({
  assetName,
  symbol,
}: MarketDetailSubHeaderProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-sidebar-border bg-white px-4 py-2.5 sm:px-6">
      <div className="flex min-w-0 flex-col gap-2 text-[11px] font-semibold sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Link href="/" className="text-sidebar-muted outline-none hover:text-primary focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/30">
            Market
          </Link>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span className="text-slate-900">{assetName} ({symbol.toUpperCase()})</span>
          <span aria-hidden="true" className="text-slate-300">•</span>
          <Badge shape="rounded" size="xs" className="border-indigo-200 bg-indigo-50 text-indigo-700">
            Spot Intelligence
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sidebar-muted">
          <span>
            Feed Protocol: <span className="font-mono text-slate-800">Binance WebSocket</span>
          </span>
          <MarketFeedStatus />
        </div>
      </div>
    </nav>
  );
}
