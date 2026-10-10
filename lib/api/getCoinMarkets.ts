import axios from "axios";
import type { CoinMarketsResponse } from "@/type/coinMarket";

export async function getCoinMarkets(): Promise<CoinMarketsResponse> {
  const { data } = await axios.get<CoinMarketsResponse>("/api/market/coins", {
    headers: { Accept: "application/json" },
  });

  return data;
}
