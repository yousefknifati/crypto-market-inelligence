"use client";

import { memo } from "react";
import type {
  BinanceConnectionStatus,
  BinancePrice,
} from "@/types/binancePrices";

type LiveTickerProps = {
  status: BinanceConnectionStatus;
  prices: Partial<Record<string, BinancePrice>>;
};

const markets = [
  { symbol: "BTCUSDT", label: "BTC/USD" },
  { symbol: "ETHUSDT", label: "ETH/USD" },
  { symbol: "SOLUSDT", label: "SOL/USD" },
  { symbol: "BNBUSDT", label: "BNB/USD" },
] as const;

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function LiveTicker({ status, prices }: LiveTickerProps) {
  const connected = status === "connected";
  const statusLabel = {
    connecting: "CONNECTING STREAM",
    connected: "REAL-TIME STREAM",
    reconnecting: "RECONNECTING STREAM",
    disconnected: "STREAM OFFLINE",
  }[status];

  return (
    <section
      aria-label="Live cryptocurrency prices"
      className="flex h-8 shrink-0 items-center overflow-hidden border-b border-sidebar-border bg-white px-4 text-[11px] leading-[14px] font-medium tracking-[0.22px]"
    >
      <div className="flex min-w-max items-center gap-6">
        <div
          className="flex items-center gap-1.5 text-sidebar-muted"
          role="status"
        >
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          <span>{statusLabel}</span>
        </div>

        {markets.map(({ symbol, label }, index) => {
          const market = prices[symbol];
          const change = market?.priceChangePercent;
          const positive = change !== undefined && change >= 0;

          return (
            <div key={symbol} className="contents">
              {index > 0 && (
                <span aria-hidden="true" className="text-slate-300">
                  •
                </span>
              )}
              <div className="flex items-center gap-1.5 whitespace-nowrap text-slate-900">
                <span>{label}</span>
                <span className="text-slate-800">
                  {market ? priceFormatter.format(Number(market.price)) : "—"}
                </span>
                <span
                  className={
                    change === undefined
                      ? "text-sidebar-muted"
                      : positive
                        ? "text-secondary"
                        : "text-tertiary"
                  }
                >
                  {change === undefined
                    ? "—"
                    : `${positive ? "+" : ""}${change.toFixed(2)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default memo(LiveTicker);
