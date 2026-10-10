import { isNumber } from "@/lib/utils/isNumber";
import type { CoinGeckoGlobalMarketData } from "@/types/globalMarket";

export function hasGlobalMarketSummaryData(data: CoinGeckoGlobalMarketData) {
  return [
    data.total_market_cap?.usd,
    data.total_volume?.usd,
    data.market_cap_percentage?.btc,
    data.market_cap_percentage?.eth,
  ].some(isNumber);
}
