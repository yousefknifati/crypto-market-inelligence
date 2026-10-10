import "server-only";

import axios from "axios";
import type { CoinGeckoGlobalMarketResponse } from "@/types/globalMarket";

export async function getCoinGeckoGlobalMarketData(): Promise<CoinGeckoGlobalMarketResponse> {
  const baseURL =
    process.env.COINGECKO_API_BASE_URL ?? "https://api.coingecko.com/api/v3";
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;

  const { data } = await axios.get<CoinGeckoGlobalMarketResponse>("/global", {
    baseURL,
    headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
    timeout: 10_000,
  });

  return data;
}
