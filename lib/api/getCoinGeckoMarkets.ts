import "server-only";

import axios from "axios";
import type { CoinMarketsResponse } from "@/types/coinMarket";
import { isCoinGeckoMarketsResponse } from "@/lib/utils/isCoinGeckoMarketsResponse";

export async function getCoinGeckoMarkets(
  ids?: readonly string[],
): Promise<CoinMarketsResponse> {
  const baseURL =
    process.env.COINGECKO_API_BASE_URL ?? "https://api.coingecko.com/api/v3";
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;

  const { data } = await axios.get<unknown>("/coins/markets", {
    baseURL,
    headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
    params: {
      vs_currency: "usd",
      ids: ids?.length ? ids.join(",") : undefined,
      order: "market_cap_desc",
      per_page: ids?.length ?? 100,
      page: 1,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
    timeout: 10_000,
  });

  if (!isCoinGeckoMarketsResponse(data)) {
    throw new Error("CoinGecko returned an invalid markets response.");
  }

  return data;
}
