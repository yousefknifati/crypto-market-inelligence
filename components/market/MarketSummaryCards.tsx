import MarketSummaryCard from "@/components/market/MarketSummaryCard";
import MotionStaggerGrid from "@/components/ui/MotionStaggerGrid";
import RefreshButton from "@/components/ui/RefreshButton";
import { getCoinGeckoGlobalMarketData } from "@/lib/api/getCoinGeckoGlobalMarketData";
import { formatLargeCurrency } from "@/lib/utils/formatLargeCurrency";
import { formatPercentage } from "@/lib/utils/formatPercentage";
import { hasGlobalMarketSummaryData } from "@/lib/utils/hasGlobalMarketSummaryData";
import { isNumber } from "@/lib/utils/isNumber";
import type { CoinGeckoGlobalMarketResponse } from "@/types/globalMarket";

export default async function MarketSummaryCards() {
  let response: CoinGeckoGlobalMarketResponse;

  try {
    response = await getCoinGeckoGlobalMarketData();
  } catch {
    return (
      <section role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
        <h2 className="font-semibold">Global market data is unavailable</h2>
        <p className="mt-1 text-sm">Unable to load the latest global market summary.</p>
        <RefreshButton className="mt-4" size="sm" />
      </section>
    );
  }

  const data = response.data;

  if (!data || !hasGlobalMarketSummaryData(data)) {
    return (
      <section role="status" className="mt-6 rounded-xl border border-sidebar-border bg-white p-5 text-sidebar-muted">
        <h2 className="font-semibold text-slate-900">No global market data</h2>
        <p className="mt-1 text-sm">CoinGecko returned a successful response without market summary values.</p>
      </section>
    );
  }

  const marketCap = formatLargeCurrency(data.total_market_cap?.usd);
  const volume = formatLargeCurrency(data.total_volume?.usd);
  const marketChange = data.market_cap_change_percentage_24h_usd;
  const marketChangeDirection = !isNumber(marketChange)
    ? "neutral"
    : marketChange >= 0
      ? "up"
      : "down";
  const totalMarketCap = data.total_market_cap?.usd;
  const totalVolume = data.total_volume?.usd;
  const volumeToCapRatio = isNumber(totalMarketCap) && totalMarketCap !== 0 && isNumber(totalVolume)
    ? (totalVolume / totalMarketCap) * 100
    : null;
  const btcDominance = data.market_cap_percentage?.btc;
  const ethDominance = data.market_cap_percentage?.eth;
  const altcoinDominance = isNumber(btcDominance) && isNumber(ethDominance)
    ? Math.max(0, 100 - btcDominance - ethDominance)
    : null;

  return (
    <section aria-label="Global market summary" className="mt-6">
      <MotionStaggerGrid className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MarketSummaryCard
        title="Total Market Cap"
        trend={{
          direction: marketChangeDirection,
          label: isNumber(marketChange)
            ? `${marketChange >= 0 ? "+" : ""}${marketChange.toFixed(2)}% 24h`
            : "24h unavailable",
        }}
        footerLabel="Volume to Cap Ratio"
        footerValue={formatPercentage(volumeToCapRatio)}
        progressLabel={`Volume to market capitalization ratio: ${formatPercentage(volumeToCapRatio)}`}
        progressSegments={isNumber(volumeToCapRatio) ? [{ value: volumeToCapRatio, colorClassName: "bg-primary" }] : []}
      >
        <p className="whitespace-nowrap text-[30px] leading-[38px] font-bold tracking-[-0.75px] text-slate-900">
          {marketCap ? `${marketCap.amount}${marketCap.unit ? ` ${marketCap.unit}` : ""}` : "Unavailable"}
        </p>
        </MarketSummaryCard>

        <MarketSummaryCard
        title="24h Trading Volume"
        trend={{ direction: "neutral", label: "24h unavailable" }}
        footerLabel="CEX share unavailable"
        footerValue="DEX unavailable"
        progressLabel="Exchange-type volume split is unavailable from this endpoint"
        progressSegments={[]}
      >
        <p className="text-[30px] leading-[38px] font-bold tracking-[-0.75px] text-slate-900">
          {volume?.amount ?? "Unavailable"}
          {volume?.unit && <span className="block">{volume.unit}</span>}
        </p>
        </MarketSummaryCard>

        <MarketSummaryCard
        title="Market Dominance"
        trend={{ direction: "neutral", label: "BTC change unavailable" }}
        footerLabel="BTC Dominance Share"
        footerValue={`Altcoins: ${formatPercentage(altcoinDominance, 1)}`}
        progressLabel={`Market dominance: Bitcoin ${formatPercentage(btcDominance, 1)}, Ethereum ${formatPercentage(ethDominance, 1)}, altcoins ${formatPercentage(altcoinDominance, 1)}`}
        progressSegments={[
          ...(isNumber(btcDominance) ? [{ value: btcDominance, colorClassName: "bg-[#f7931a]" }] : []),
          ...(isNumber(ethDominance) ? [{ value: ethDominance, colorClassName: "bg-primary" }] : []),
          ...(isNumber(altcoinDominance) ? [{ value: altcoinDominance, colorClassName: "bg-slate-300" }] : []),
        ]}
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="flex items-baseline gap-2">
            <span className="text-[30px] leading-[38px] font-bold tracking-[-0.75px] text-slate-900">
              {formatPercentage(btcDominance, 1)}
            </span>
            <span className="text-[11px] leading-[14px] font-semibold tracking-[0.44px] text-sidebar-muted">BTC</span>
          </p>
          <p className="flex items-baseline gap-2">
            <span className="text-base leading-6 font-semibold tracking-[-0.16px] text-slate-900">
              {formatPercentage(ethDominance, 1)}
            </span>
            <span className="text-[11px] leading-[14px] font-medium tracking-[0.22px] text-sidebar-muted">ETH</span>
          </p>
        </div>
        </MarketSummaryCard>
      </MotionStaggerGrid>
    </section>
  );
}
