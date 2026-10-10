"use client";

import { useEffect, useState } from "react";
import { subscribeBinancePrices } from "@/lib/websocket/binancePrices";
import { BINANCE_STREAM_BASE_URL } from "@/lib/websocket/binanceStreamConfig";
import type { BinancePriceState } from "@/types/binancePrices";

export function useBinancePrices(
  symbols: readonly string[],
): BinancePriceState {
  const [state, setState] = useState<BinancePriceState>({
    status: "disconnected",
    prices: {},
  });
  const symbolKey = [
    ...new Set(symbols.map((symbol) => symbol.trim().toLowerCase())),
  ]
    .filter(Boolean)
    .sort()
    .join(",");

  useEffect(() => {
    return subscribeBinancePrices({
      baseURL: BINANCE_STREAM_BASE_URL,
      symbols: symbolKey ? symbolKey.split(",") : [],
      onState: setState,
    });
  }, [symbolKey]);

  return state;
}
