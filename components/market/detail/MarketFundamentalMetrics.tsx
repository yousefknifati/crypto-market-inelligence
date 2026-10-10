import {
  FiBarChart2,
  FiTrendingUp,
  FiPieChart,
  FiLayers,
  FiActivity,
  FiArrowDown,
} from "react-icons/fi";
import Heading from "@/components/ui/Heading";
import Badge from "@/components/ui/Badge";
import MotionStaggerGrid from "@/components/ui/MotionStaggerGrid";
import MarketStatCard from "./MarketStatCard";
import { formatCompactUsd } from "@/lib/utils/formatCompactUsd";
import { formatSupply } from "@/lib/utils/formatSupply";
import { formatUsdPrice } from "@/lib/utils/formatUsdPrice";
import { isNumber } from "@/lib/utils/isNumber";
import type { CoinDetail } from "@/types/coinDetail";

export default function MarketFundamentalMetrics({
  asset,
}: {
  asset: CoinDetail;
}) {
  const data = asset.market_data;
  const cap = data?.market_cap?.usd;
  const volume = data?.total_volume?.usd;
  const max = data?.max_supply;
  const supply = data?.circulating_supply;
  const fdv = data?.fully_diluted_valuation?.usd;
  const issued =
    isNumber(supply) && isNumber(max) && max > 0
      ? (supply / max) * 100
      : undefined;
  return (
    <section aria-labelledby="market-stats-title">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Heading id="market-stats-title" size="sm">
          Fundamental Metrics
        </Heading>
        <p className="text-[11px] text-sidebar-muted">Source: CoinGecko</p>
      </div>
      <MotionStaggerGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MarketStatCard
          label="Market Capitalization"
          icon={<FiBarChart2 />}
          value={formatCompactUsd(cap)}
          badge={
            asset.market_cap_rank ? (
              <Badge size="xs" className="border-0 bg-indigo-50 text-primary">
                Rank #{asset.market_cap_rank}
              </Badge>
            ) : undefined
          }
        >
          <div className="flex justify-between gap-2">
            <span>Market Cap Rank</span>
            <span className="text-slate-900">
              {asset.market_cap_rank
                ? `#${asset.market_cap_rank}`
                : "Unavailable"}
            </span>
          </div>
        </MarketStatCard>
        <MarketStatCard
          label="24h Trading Volume"
          icon={<FiActivity />}
          value={formatCompactUsd(volume)}
        >
          <div className="flex justify-between gap-2">
            <span>Volume / Market Cap</span>
            <span className="font-mono text-slate-900">
              {isNumber(volume) && isNumber(cap) && cap > 0
                ? (volume / cap).toFixed(4)
                : "Unavailable"}
            </span>
          </div>
        </MarketStatCard>
        <MarketStatCard
          label="Circulating Supply"
          icon={<FiPieChart />}
          value={formatSupply(supply, asset.symbol.toUpperCase())}
          badge={
            isNumber(issued) ? (
              <Badge size="xs">{issued.toFixed(1)}% Issued</Badge>
            ) : undefined
          }
        >
          {isNumber(issued) && (
            <meter
              aria-label="Circulating supply as a share of maximum supply"
              min={0}
              max={100}
              value={Math.min(100, Math.max(0, issued))}
              className="mb-1 h-2 w-full [&::-webkit-meter-bar]:border-0 [&::-webkit-meter-bar]:bg-slate-100 [&::-webkit-meter-optimum-value]:bg-primary"
            />
          )}
          <p>Max Supply: {formatSupply(max, asset.symbol.toUpperCase())}</p>
        </MarketStatCard>
        <MarketStatCard
          label="Fully Diluted Valuation"
          icon={<FiLayers />}
          value={formatCompactUsd(fdv)}
        >
          <div className="flex justify-between gap-2">
            <span>FDV / Market Cap Ratio</span>
            <span className="text-slate-900">
              {isNumber(fdv) && isNumber(cap) && cap > 0
                ? `${(fdv / cap).toFixed(2)}x`
                : "Unavailable"}
            </span>
          </div>
        </MarketStatCard>
        <MarketStatCard
          label="All-Time Extremes"
          icon={<FiTrendingUp />}
          value={`ATH: ${formatUsdPrice(data?.ath?.usd)}`}
        >
          <p>
            ATL:{" "}
            <span className="text-slate-900">
              {formatUsdPrice(data?.atl?.usd)}
            </span>
          </p>
        </MarketStatCard>
        <MarketStatCard
          label="Consensus & Network Health"
          icon={<FiArrowDown />}
          value="Unavailable"
        >
          <p>
            Hashrate, block height, and halving data are not provided by this
            market feed.
          </p>
        </MarketStatCard>
      </MotionStaggerGrid>
    </section>
  );
}
