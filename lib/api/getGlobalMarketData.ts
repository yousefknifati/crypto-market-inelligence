import axios from "axios";
import type { CoinGeckoGlobalMarketResponse } from "@/types/globalMarket";

export async function getGlobalMarketData(): Promise<CoinGeckoGlobalMarketResponse> {
  const { data } = await axios.get<CoinGeckoGlobalMarketResponse>(
    "/api/market/global",
    {
      headers: { Accept: "application/json" },
    },
  );

  return data;
}
