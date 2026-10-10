import "server-only";

import axios from "axios";
import { cacheLife } from "next/cache";
import type { CoinMarketChart } from "@/types/coinDetail";
import { getCoinGeckoRequestErrorMessage } from "@/lib/utils/getCoinGeckoRequestErrorMessage";
import { isCoinGeckoMarketChartResponse } from "@/lib/utils/isCoinGeckoMarketChartResponse";

export async function getCoinGeckoMarketChart(
  id: string,
): Promise<CoinMarketChart> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });

  const baseURL =
    process.env.COINGECKO_API_BASE_URL ?? "https://api.coingecko.com/api/v3";
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;
  const searchParams = new URLSearchParams({
    vs_currency: "usd",
    days: "7",
    interval: "hourly",
  });
  let data: unknown;
  try {
    const response = await axios.get<unknown>(
      `/coins/${encodeURIComponent(id)}/market_chart?${searchParams.toString()}`,
      {
        baseURL,
        headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
        timeout: 10_000,
      },
    );
    data = response.data;
  } catch (error) {
    throw new Error(
      getCoinGeckoRequestErrorMessage(
        error,
        "Unable to load the CoinGecko market chart.",
      ),
    );
  }

  if (!isCoinGeckoMarketChartResponse(data)) {
    throw new Error("CoinGecko returned an invalid market chart response.");
  }

  return data;
}
