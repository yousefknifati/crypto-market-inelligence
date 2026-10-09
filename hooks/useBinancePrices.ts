"use client";

import { useEffect, useState } from "react";
import { subscribeBinancePrices } from "@/lib/websocket/binancePrices";
import type { BinancePriceState } from "@/type/binancePrices";

export function useBinancePrices(symbols: readonly string[]): BinancePriceState {
  const [state, setState] = useState<BinancePriceState>({
    status: "disconnected",
    prices: {},
  });
  const symbolKey = [...new Set(symbols.map((symbol) => symbol.trim().toLowerCase()))]
    .filter(Boolean)
    .sort()
    .join(",");

  useEffect(() => {
    return subscribeBinancePrices({
      baseURL: process.env.NEXT_PUBLIC_BINANCE_WS_URL ?? "",
      symbols: symbolKey ? symbolKey.split(",") : [],
      onState: setState,
    });
  }, [symbolKey]);

  return state;
}
