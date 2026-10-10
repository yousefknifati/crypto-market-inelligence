"use client";

import Badge from "@/components/ui/Badge";
import { useBinancePrices } from "@/hooks/useBinancePrices";

export default function MarketFeedStatus() {
  const { status } = useBinancePrices(["btcusdt"]);
  const labels = { connected: "WebSocket Feed Live", connecting: "WebSocket Connecting", reconnecting: "WebSocket Reconnecting", disconnected: "WebSocket Disconnected" };
  return <Badge role="status" tone={status === "connected" ? "success" : "neutral"} size="xs" dot>{labels[status]}</Badge>;
}
