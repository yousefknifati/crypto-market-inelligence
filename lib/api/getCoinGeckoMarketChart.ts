import "server-only";

import axios from "axios";
import { cacheLife } from "next/cache";
import type { CoinMarketChart } from "@/type/coinDetail";

export async function getCoinGeckoMarketChart(id: string): Promise<CoinMarketChart> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });

  const baseURL = process.env.COINGECKO_API_BASE_URL ?? "https://api.coingecko.com/api/v3";
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;
  const searchParams = new URLSearchParams({
    vs_currency: "usd",
    days: "7",
    interval: "hourly",
  });
  const { data } = await axios.get<CoinMarketChart>(
    `/coins/${encodeURIComponent(id)}/market_chart?${searchParams.toString()}`,
    {
      baseURL,
      headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
      timeout: 10_000,
    },
  );

  return data;
}
