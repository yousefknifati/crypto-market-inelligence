import "server-only";

import axios from "axios";
import type { CoinPricesResponse } from "@/types/coinPrices";

export async function getBitcoinPrice(
  ids: string | readonly string[],
): Promise<CoinPricesResponse> {
  const baseURL = process.env.COINGECKO_API_BASE_URL;
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;

  if (!baseURL || !apiKey) {
    throw new Error(
      "CoinGecko API base URL and demo API key must be configured.",
    );
  }

  const coinIds = (typeof ids === "string" ? ids.split(",") : ids)
    .map((id) => id.trim())
    .filter(Boolean);

  if (coinIds.length === 0) {
    throw new Error("Provide at least one CoinGecko asset ID.");
  }

  const { data } = await axios.get<CoinPricesResponse>("/simple/price", {
    baseURL,
    params: {
      ids: [...new Set(coinIds)].join(","),
      vs_currencies: "usd",
    },
    headers: {
      "x-cg-demo-api-key": apiKey,
    },
    timeout: 10_000,
  });

  return data;
}
