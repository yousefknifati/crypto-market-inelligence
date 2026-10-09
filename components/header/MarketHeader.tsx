"use client";

import { useBinancePrices } from "@/hooks/useBinancePrices";
import HeaderToolbar from "@/components/header/HeaderToolbar";
import LiveTicker from "@/components/header/LiveTicker";

const LIVE_SYMBOLS = ["btcusdt", "ethusdt", "solusdt", "bnbusdt"] as const;

export default function MarketHeader() {
  const { status, prices } = useBinancePrices(LIVE_SYMBOLS);
  const latestPrice = Object.values(prices).reduce(
    (latest, price) => !latest || (price?.receivedAt ?? 0) > latest.receivedAt ? price : latest,
    undefined,
  );
  const latency = latestPrice
    ? Math.max(0, latestPrice.receivedAt - latestPrice.eventTime)
    : null;

  return (
    <header className="sticky top-0 z-30 shrink-0">
      <LiveTicker status={status} prices={prices} />
      <HeaderToolbar status={status} latency={latency} />
    </header>
  );
}
