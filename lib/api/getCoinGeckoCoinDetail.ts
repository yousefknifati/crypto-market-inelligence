import "server-only";

import axios from "axios";
import { cacheLife } from "next/cache";
import type { CoinDetail } from "@/types/coinDetail";
import { getCoinGeckoRequestErrorMessage } from "@/lib/utils/getCoinGeckoRequestErrorMessage";
import { isCoinGeckoCoinDetailResponse } from "@/lib/utils/isCoinGeckoCoinDetailResponse";

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
  let data: unknown;
  let status: number;
  try {
    const response = await axios.get<unknown>(
      `/coins/${encodeURIComponent(id)}?${searchParams.toString()}`,
      {
        baseURL,
        headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
        timeout: 10_000,
        validateStatus: (responseStatus) =>
          responseStatus === 404 ||
          (responseStatus >= 200 && responseStatus < 300),
      },
    );
    data = response.data;
    status = response.status;
  } catch (error) {
    throw new Error(
      getCoinGeckoRequestErrorMessage(
        error,
        "Unable to load the CoinGecko asset.",
      ),
    );
  }

  if (status === 404) return null;
  if (!isCoinGeckoCoinDetailResponse(data)) {
    throw new Error("CoinGecko returned an incomplete asset response.");
  }

  return data;
}
