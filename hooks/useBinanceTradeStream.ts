"use client";

import { useEffect, useState } from "react";
import { subscribeBinanceTrades } from "@/lib/websocket/binanceTrades";
import { createBinanceCombinedStreamURL } from "@/lib/websocket/binanceStreamConfig";
import type { BinanceTradeStreamState } from "@/types/binanceTrade";

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
        url: createBinanceCombinedStreamURL(
          symbolKey ? symbolKey.split(",") : [],
          "trade",
        ),
      }),
    [reconnectKey, symbolKey],
  );

  return state;
}
