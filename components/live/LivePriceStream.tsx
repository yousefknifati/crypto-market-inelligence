"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiRefreshCw, FiVolume2, FiVolumeX } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LivePriceStreamSkeleton from "@/components/live/LivePriceStreamSkeleton";
import { useBinanceTradeStream } from "@/hooks/useBinanceTradeStream";

const LIVE_MARKETS = [
  { symbol: "BTCUSDT", label: "BTC/USD", baseAsset: "BTC" },
  { symbol: "ETHUSDT", label: "ETH/USD", baseAsset: "ETH" },
  { symbol: "SOLUSDT", label: "SOL/USD", baseAsset: "SOL" },
] as const;

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  hour12: false,
});

export default function LivePriceStream() {
  const [reconnectKey, setReconnectKey] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const lastAudioTickAt = useRef(0);
  const { error, hasTimedOut, status, trades } = useBinanceTradeStream(
    LIVE_MARKETS.map(({ symbol }) => symbol),
    reconnectKey,
  );
  const latestTrade = useMemo(
    () => Object.values(trades).reduce(
      (latest, trade) => !latest || (trade?.receivedAt ?? 0) > latest.receivedAt
        ? trade
        : latest,
      undefined,
    ),
    [trades],
  );
  const hasTrades = Object.keys(trades).length > 0;
  const isInitialLoading = (status === "connecting" || status === "reconnecting") && !hasTrades;

  useEffect(() => {
    if (!audioEnabled || !latestTrade || Date.now() - lastAudioTickAt.current < 500) {
      return;
    }

    lastAudioTickAt.current = Date.now();
    let context: AudioContext | undefined;
    try {
      context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = latestTrade.side === "buy" ? 660 : 440;
      gain.gain.setValueAtTime(0.025, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.04);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.04);
    } catch {
      if (context) void context.close();
      return;
    }

    return () => {
      if (context) void context.close();
    };
  }, [audioEnabled, latestTrade]);

  if (isInitialLoading && !error) return <LivePriceStreamSkeleton />;

  const connected = status === "connected";
  const latency = latestTrade
    ? Math.max(0, latestTrade.receivedAt - latestTrade.eventTime)
    : null;
  const statusLabel = {
    connected: "CONNECTED",
    connecting: "CONNECTING",
    disconnected: "DISCONNECTED",
    reconnecting: "RECONNECTING",
  }[status];

  return (
    <section aria-labelledby="live-price-stream-title" className="overflow-hidden rounded-xl border border-sidebar-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-sidebar-border px-3 py-3">
        <h2 id="live-price-stream-title" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span aria-hidden="true" className={`size-2 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"}`} />
          Live Price Stream
        </h2>
        <span className={`text-[11px] font-semibold ${connected ? "text-emerald-600" : "text-amber-600"}`}>
          {latency === null ? "—" : `${latency}ms`}
        </span>
      </div>

      <div className="flex items-center gap-4 border-b border-sidebar-border bg-slate-50 px-3 py-2.5 text-[11px] leading-3 text-sidebar-muted">
        <span>WebSocket<br />Feed</span>
        <span role="status" className={connected ? "font-mono font-bold text-emerald-700" : "font-mono font-bold text-amber-700"}>
          STATUS:<br />{statusLabel}
        </span>
      </div>

      {error && !hasTrades ? (
        <div role="alert" className="px-3 py-5 text-center">
          <p className="text-sm font-semibold text-rose-700">Live prices are unavailable</p>
          <p className="mt-1 text-xs text-sidebar-muted">{error}</p>
          <Button className="mt-3" size="sm" variant="outline" leadingIcon={<FiRefreshCw aria-hidden="true" />} onClick={() => setReconnectKey((key) => key + 1)}>
            Retry
          </Button>
        </div>
      ) : hasTimedOut && !hasTrades ? (
        <div role="status" className="px-3 py-5 text-center">
          <p className="text-sm font-semibold text-slate-900">No trades received yet</p>
          <p className="mt-1 text-xs text-sidebar-muted">The stream is connected but has not sent market activity.</p>
        </div>
      ) : (
        <div className="space-y-2.5 p-3">
          {LIVE_MARKETS.map(({ baseAsset, label, symbol }) => {
            const trade = trades[symbol];
            const change = trade?.priceChangePercent;
            const positive = change !== null && change !== undefined && change >= 0;

            return (
              <article key={symbol} className="rounded-lg border border-sidebar-border bg-slate-50 px-3 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="mr-auto text-sm font-bold text-slate-900">{label}</h3>
                  {trade ? (
                    <Badge size="xs" tone={trade.side === "buy" ? "success" : "danger"}>
                      {trade.side.toUpperCase()}
                    </Badge>
                  ) : (
                    <Badge size="xs" tone="neutral">WAIT</Badge>
                  )}
                  <span className={`text-sm font-bold ${trade?.side === "sell" ? "text-rose-600" : "text-emerald-600"}`}>
                    {trade ? priceFormatter.format(trade.price) : "Unavailable"}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-sidebar-muted">
                  <span>Vol: {trade ? `${quantityFormatter.format(trade.quantity)} ${baseAsset}` : "Unavailable"}</span>
                  <span className={!trade || change === null || change === undefined ? "text-sidebar-muted" : positive ? "text-emerald-600" : "text-rose-600"}>
                    {!trade || change === null || change === undefined
                      ? "Waiting for next tick"
                      : `${positive ? "+" : ""}${change.toFixed(3)}% tick`}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="border-t border-sidebar-border bg-slate-50 px-3 py-3">
        {error && hasTrades && (
          <p role="alert" className="mb-2 text-[11px] text-rose-700">{error} Showing the latest received prices.</p>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] leading-3 text-sidebar-muted">
            <span>Last updated:</span>
            <span className="ml-2 font-mono text-slate-700">
              {latestTrade ? timeFormatter.format(latestTrade.receivedAt) : "Unavailable"}
            </span>
          </div>
          <Button size="sm" variant="outline" leadingIcon={<FiRefreshCw aria-hidden="true" />} onClick={() => setReconnectKey((key) => key + 1)}>
            Reconnect
          </Button>
        </div>
        <label className="mt-2 flex cursor-pointer items-center justify-end gap-2 text-[11px] text-sidebar-muted">
          {audioEnabled ? <FiVolume2 aria-hidden="true" /> : <FiVolumeX aria-hidden="true" />}
          Audio Tick
          <input type="checkbox" checked={audioEnabled} onChange={(event) => setAudioEnabled(event.target.checked)} className="size-4 accent-primary" />
        </label>
      </div>
    </section>
  );
}
