import "server-only";

import axios from "axios";
import { cacheLife } from "next/cache";
import type { CoinDetail } from "@/types/coinDetail";

export async function getCoinGeckoCoinDetail(
  id: string,
): Promise<CoinDetail | null> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });

  const baseURL =
    process.env.COINGECKO_API_BASE_URL ?? "https://api.coingecko.com/api/v3";
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;
  const searchParams = new URLSearchParams({
    localization: "false",
    tickers: "false",
    community_data: "false",
    developer_data: "false",
    sparkline: "false",
  });
  const { data } = await axios.get<CoinDetail>(
    `/coins/${encodeURIComponent(id)}?${searchParams.toString()}`,
    {
      baseURL,
      headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
      timeout: 10_000,
      validateStatus: (status) =>
        status === 404 || (status >= 200 && status < 300),
    },
  );

  return data;
}
