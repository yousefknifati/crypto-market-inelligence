"use client";

import { useBinancePrices } from "@/hooks/useBinancePrices";

export default function ConnectionStatus() {
  const { status } = useBinancePrices(["btcusdt"]);
  const connected = status === "connected";
  const label = {
    connected: "WS Connected",
    connecting: "WS Connecting",
    reconnecting: "WS Reconnecting",
    disconnected: "WS Disconnected",
  }[status];

  return (
    <div
      role="status"
      aria-label={label}
      title={label}
      className="flex min-h-8 items-center justify-center gap-1.5 rounded-lg border border-sidebar-border bg-sidebar-surface px-2 text-xs sm:justify-start"
    >
      <span
        aria-hidden="true"
        className={`size-1.5 shrink-0 rounded-full ${connected ? "bg-secondary" : "bg-secondary-200"}`}
      />
      <span className="hidden sm:inline">{label}</span>
      {connected && (
        <span aria-hidden="true" className="ml-auto hidden text-secondary sm:inline">
          Live
        </span>
      )}
    </div>
  );
}
