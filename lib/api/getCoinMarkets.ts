import axios from "axios";
import type { CoinMarketsResponse } from "@/type/coinMarket";

export async function getCoinMarkets(
  ids?: readonly string[],
): Promise<CoinMarketsResponse> {
  const { data } = await axios.get<CoinMarketsResponse>("/api/market/coins", {
    headers: { Accept: "application/json" },
    params: ids?.length ? { ids: ids.join(",") } : undefined,
  });

  return data;
}
