"use client";

import { useEffect, useState } from "react";
import { subscribeBinanceTrades } from "@/lib/websocket/binanceTrades";
import type { BinanceTradeStreamState } from "@/types/binanceTrade";

const BINANCE_TRADE_STREAM_URL =
  "wss://data-stream.binance.vision/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade";

export function useBinanceTradeStream(
  symbols: readonly string[],
  reconnectKey: number,
): BinanceTradeStreamState {
  const [state, setState] = useState<BinanceTradeStreamState>({
    error: null,
    hasTimedOut: false,
    status: "disconnected",
    trades: {},
  });
  const symbolKey = [
    ...new Set(symbols.map((symbol) => symbol.trim().toLowerCase())),
  ]
    .filter(Boolean)
    .sort()
    .join(",");

  useEffect(
    () =>
      subscribeBinanceTrades({
        onState: setState,
        symbols: symbolKey ? symbolKey.split(",") : [],
        url: BINANCE_TRADE_STREAM_URL,
      }),
    [reconnectKey, symbolKey],
  );

  return state;
}
