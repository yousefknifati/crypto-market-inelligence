import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { FiStar, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { motion } from "motion/react";
import Badge from "@/components/ui/Badge";
import MarketSparkline from "@/components/market/MarketSparkline";
import { formatCompactUsd } from "@/lib/utils/formatCompactUsd";
import { formatPercentage } from "@/lib/utils/formatPercentage";
import { formatUsdPrice } from "@/lib/utils/formatUsdPrice";
import { isNumber } from "@/lib/utils/isNumber";
import {
  selectIsFavorite,
  selectWatchlistHydrated,
  toggleFavorite,
} from "@/store/features/watchlistSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import type { CoinMarket } from "@/types/coinMarket";

type MarketTableRowProps = {
  asset: CoinMarket;
  fallbackRank: number;
  prefersReducedMotion: boolean;
};

function MarketTableRow({
  asset,
  fallbackRank,
  prefersReducedMotion,
}: MarketTableRowProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    selectIsFavorite(state, asset.id),
  );
  const watchlistHydrated = useAppSelector(selectWatchlistHydrated);
  const hasHydrated = useHasHydrated();
  const watchlistReady = hasHydrated && watchlistHydrated;
  const displayedFavorite = watchlistReady && isFavorite;
  const change =
    asset.price_change_percentage_24h_in_currency ??
    asset.price_change_percentage_24h;
  const hasChange = isNumber(change);
  const symbol = asset.symbol.toUpperCase();

  return (
    <tr className="group border-t border-slate-100 transition-colors duration-150 hover:bg-indigo-50/70 focus-within:bg-indigo-50/70 motion-reduce:transition-none">
      <td className="border-l-2 border-transparent px-2 py-2.5 text-center text-[11px] font-medium tracking-[0.22px] text-slate-400 transition-colors duration-150 group-hover:border-primary group-hover:text-slate-600 group-focus-within:border-primary group-focus-within:text-slate-600 motion-reduce:transition-none md:px-3">
        {asset.market_cap_rank ?? fallbackRank}
      </td>
      <th scope="row" className="px-2 py-2.5 text-left md:px-3">
        <div className="flex min-w-0 items-center gap-2 md:gap-2.5">
          {asset.image ? (
            <Image
              src={asset.image}
              alt=""
              width={24}
              height={24}
              className="size-5 rounded-full transition-transform duration-150 group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none md:size-6"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-5 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-surface text-[10px] font-bold text-sidebar-muted md:size-6"
            >
              {symbol.slice(0, 1)}
            </span>
          )}
          <Link
            href={`/market/${asset.id}`}
            className="flex min-w-0 items-baseline rounded outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <span className="block max-w-24 truncate font-semibold text-slate-900 transition-colors duration-150 group-hover:text-primary group-focus-within:text-primary motion-reduce:transition-none sm:max-w-32 md:max-w-none">
              {asset.name}
            </span>
            <span className="ml-1.5 hidden text-[11px] font-medium tracking-[0.22px] text-slate-400 sm:inline">
              {symbol}
            </span>
          </Link>
        </div>
      </th>
      <td className="px-2 py-2.5 text-right text-xs font-semibold whitespace-nowrap text-slate-900 transition-colors duration-150 group-hover:text-primary group-focus-within:text-primary motion-reduce:transition-none md:px-3 md:text-sm">
        {formatUsdPrice(asset.current_price)}
      </td>
      <td className="px-2 py-2.5 text-right md:px-3">
        <Badge
          size="xs"
          tone={!hasChange ? "neutral" : change >= 0 ? "success" : "danger"}
        >
          {hasChange && change >= 0 && (
            <FiTrendingUp aria-hidden="true" className="size-3" />
          )}
          {hasChange && change < 0 && (
            <FiTrendingDown aria-hidden="true" className="size-3" />
          )}
          {hasChange
            ? `${change >= 0 ? "+" : ""}${formatPercentage(change)}`
            : "Unavailable"}
        </Badge>
      </td>
      <td className="hidden px-3 py-2.5 text-right text-sm whitespace-nowrap text-sidebar-muted lg:table-cell">
        {formatCompactUsd(asset.total_volume)}
      </td>
      <td className="hidden px-3 py-2.5 text-right text-sm font-medium whitespace-nowrap text-slate-900 md:table-cell">
        {formatCompactUsd(asset.market_cap)}
      </td>
      <td className="hidden px-3 py-2.5 text-center xl:table-cell">
        <div className="flex justify-center">
          <MarketSparkline
            assetName={asset.name}
            prices={asset.sparkline_in_7d?.price}
          />
        </div>
      </td>
      <td className="px-2 py-2.5 text-center">
        <motion.button
          type="button"
          disabled={!watchlistReady}
          aria-label={`${displayedFavorite ? "Remove" : "Add"} ${asset.name} ${displayedFavorite ? "from" : "to"} watchlist`}
          aria-pressed={displayedFavorite}
          title={
            watchlistReady
              ? `${displayedFavorite ? "Remove from" : "Add to"} watchlist`
              : "Restoring watchlist"
          }
          onClick={() => dispatch(toggleFavorite(asset.id))}
          whileHover={
            prefersReducedMotion ? undefined : { rotate: -6, scale: 1.1 }
          }
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          className={`rounded-md p-1.5 outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-wait ${displayedFavorite ? "bg-amber-50 text-amber-600" : "text-slate-400 group-hover:bg-white group-hover:text-amber-600 hover:bg-amber-50"}`}
        >
          <FiStar
            aria-hidden="true"
            className={`size-4 ${displayedFavorite ? "fill-current" : ""}`}
          />
        </motion.button>
      </td>
    </tr>
  );
}

export default memo(MarketTableRow);
