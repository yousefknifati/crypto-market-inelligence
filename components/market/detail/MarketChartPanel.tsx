"use client";

import { useMemo, useRef, useState } from "react";
import { FiMaximize } from "react-icons/fi";
import toast from "react-hot-toast";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import MarketPriceChart from "./MarketPriceChart";
import { formatUsdPrice } from "@/lib/utils/formatUsdPrice";
import type { CoinDetailMarketData, CoinMarketChart } from "@/type/coinDetail";

export default function MarketChartPanel({
  assetName,
  marketData,
  prices,
  error,
}: {
  assetName: string;
  marketData: CoinDetailMarketData | null | undefined;
  prices: CoinMarketChart["prices"];
  error?: string;
}) {
  const [period, setPeriod] = useState<"24H" | "7D">("24H");
  const panel = useRef<HTMLElement>(null);
  const visiblePrices = useMemo(() => {
    if (period === "7D" || !prices?.length) return prices;
    const latest = Math.max(...prices.map(([time]) => time));
    return prices.filter(([time]) => time >= latest - 86_400_000);
  }, [period, prices]);
  async function expand() {
    try {
      await panel.current?.requestFullscreen();
    } catch {
      toast.error("Fullscreen is unavailable in this browser.");
    }
  }
  return (
    <section
      ref={panel}
      aria-label={`${assetName} price chart`}
      className="min-w-0 rounded-xl border border-sidebar-border bg-white p-4 shadow-sm sm:p-5 fullscreen:overflow-auto fullscreen:p-6"
    >
      <div className="flex flex-wrap gap-2">
        <Badge size="xs" shape="rounded" className="bg-slate-50">
          24h High:{" "}
          <span className="text-slate-900">
            {formatUsdPrice(marketData?.high_24h?.usd)}
          </span>
        </Badge>
        <Badge size="xs" shape="rounded" className="bg-slate-50">
          24h Low:{" "}
          <span className="text-slate-900">
            {formatUsdPrice(marketData?.low_24h?.usd)}
          </span>
        </Badge>
        <Badge size="xs" shape="rounded" className="bg-slate-50">
          All-Time High:{" "}
          <span className="text-slate-900">
            {formatUsdPrice(marketData?.ath?.usd)}
          </span>
        </Badge>
      </div>
      <div className="my-4 flex flex-wrap items-center gap-3 border-b border-sidebar-border pb-3">
        <div
          role="group"
          aria-label="Chart style"
          className="flex rounded-lg border border-sidebar-border bg-slate-100 p-0.5"
        >
          <Button size="sm" variant="outline" aria-pressed>
            Area
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled
            title="Candlestick data is not available in this feed"
          >
            Candles
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled
            title="Order book data is not available in this feed"
          >
            Depth
          </Button>
        </div>
        <div
          role="group"
          aria-label="Chart period"
          className="flex flex-wrap rounded-lg border border-sidebar-border bg-slate-100 p-0.5"
        >
          {(["24H", "7D"] as const).map((value) => (
            <Button
              key={value}
              size="sm"
              variant={period === value ? "primary" : "ghost"}
              aria-pressed={period === value}
              onClick={() => setPeriod(value)}
            >
              {value}
            </Button>
          ))}
          {["30D", "90D", "1Y", "ALL"].map((value) => (
            <Button
              key={value}
              size="sm"
              variant="ghost"
              disabled
              title="Only the last seven days are available"
            >
              {value}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          aria-label="Expand chart to fullscreen"
          onClick={expand}
        >
          <FiMaximize aria-hidden="true" />
        </Button>
        <span className="text-[11px] text-sidebar-muted">
          Hourly prices · UTC
        </span>
      </div>
      <MarketPriceChart
        assetName={assetName}
        prices={visiblePrices}
        error={error}
        period={period}
      />
    </section>
  );
}
