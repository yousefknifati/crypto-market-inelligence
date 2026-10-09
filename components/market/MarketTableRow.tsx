import Image from "next/image";
import { memo } from "react";
import { FiStar, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import MarketSparkline from "@/components/market/MarketSparkline";
import { formatCompactUsd } from "@/lib/utils/formatCompactUsd";
import { formatPercentage } from "@/lib/utils/formatPercentage";
import { formatUsdPrice } from "@/lib/utils/formatUsdPrice";
import { isNumber } from "@/lib/utils/isNumber";
import { selectIsFavorite, selectWatchlistHydrated, toggleFavorite } from "@/store/features/watchlistSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { CoinMarket } from "@/type/coinMarket";

type MarketTableRowProps = {
  asset: CoinMarket;
  fallbackRank: number;
};

function MarketTableRow({ asset, fallbackRank }: MarketTableRowProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, asset.id));
  const watchlistHydrated = useAppSelector(selectWatchlistHydrated);
  const change = asset.price_change_percentage_24h_in_currency
    ?? asset.price_change_percentage_24h;
  const hasChange = isNumber(change);
  const symbol = asset.symbol.toUpperCase();

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/70">
      <td className="px-3 py-2.5 text-center text-[11px] font-medium tracking-[0.22px] text-slate-400">
        {asset.market_cap_rank ?? fallbackRank}
      </td>
      <th scope="row" className="px-3 py-2.5 text-left">
        <div className="flex items-center gap-2.5">
          {asset.image ? (
            <Image src={asset.image} alt="" width={24} height={24} className="size-6 rounded-full" />
          ) : (
            <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-surface text-[10px] font-bold text-sidebar-muted">
              {symbol.slice(0, 1)}
            </span>
          )}
          <span className="min-w-0">
            <span className="font-semibold text-slate-900">{asset.name}</span>
            <span className="ml-1.5 text-[11px] font-medium tracking-[0.22px] text-slate-400">{symbol}</span>
          </span>
        </div>
      </th>
      <td className="px-3 py-2.5 text-right text-sm font-semibold whitespace-nowrap text-slate-900">
        {formatUsdPrice(asset.current_price)}
      </td>
      <td className="px-3 py-2.5 text-right">
        <Badge size="xs" tone={!hasChange ? "neutral" : change >= 0 ? "success" : "danger"}>
          {hasChange && change >= 0 && <FiTrendingUp aria-hidden="true" className="size-3" />}
          {hasChange && change < 0 && <FiTrendingDown aria-hidden="true" className="size-3" />}
          {hasChange ? `${change >= 0 ? "+" : ""}${formatPercentage(change)}` : "Unavailable"}
        </Badge>
      </td>
      <td className="px-3 py-2.5 text-right text-sm whitespace-nowrap text-sidebar-muted">
        {formatCompactUsd(asset.total_volume)}
      </td>
      <td className="px-3 py-2.5 text-right text-sm font-medium whitespace-nowrap text-slate-900">
        {formatCompactUsd(asset.market_cap)}
      </td>
      <td className="px-3 py-2.5 text-center">
        <div className="flex justify-center">
          <MarketSparkline assetName={asset.name} prices={asset.sparkline_in_7d?.price} />
        </div>
      </td>
      <td className="px-2 py-2.5 text-center">
        <button
          type="button"
          disabled={!watchlistHydrated}
          aria-label={`${isFavorite ? "Remove" : "Add"} ${asset.name} ${isFavorite ? "from" : "to"} watchlist`}
          aria-pressed={isFavorite}
          title={watchlistHydrated ? `${isFavorite ? "Remove from" : "Add to"} watchlist` : "Restoring watchlist"}
          onClick={() => dispatch(toggleFavorite(asset.id))}
          className={`rounded p-1 outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-wait ${isFavorite ? "text-amber-500" : "text-slate-300 hover:text-amber-500"}`}
        >
          <FiStar aria-hidden="true" className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </td>
    </tr>
  );
}

export default memo(MarketTableRow);
