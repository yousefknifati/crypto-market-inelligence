"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  FiArrowDown,
  FiArrowUp,
  FiSearch,
  FiStar,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import MarketTable from "@/components/market/MarketTable";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import WatchlistMetricCard from "@/components/watchlist/WatchlistMetricCard";
import WatchlistSkeleton from "@/components/watchlist/WatchlistSkeleton";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import { getCoinMarkets } from "@/lib/api/getCoinMarkets";
import { formatPercentage } from "@/lib/utils/formatPercentage";
import { isNumber } from "@/lib/utils/isNumber";
import {
  selectFavoriteIds,
  selectWatchlistHydrated,
} from "@/store/features/watchlistSlice";
import { useAppSelector } from "@/store/hooks";

type WatchlistSort = "saved" | "market_cap" | "current_price" | "change";

export default function WatchlistContent() {
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const persistedStateReady = useAppSelector(selectWatchlistHydrated);
  const hasHydrated = useHasHydrated();
  const watchlistReady = hasHydrated && persistedStateReady;
  const requestedFavoriteIds = watchlistReady ? favoriteIds : [];
  const savedCount = watchlistReady ? favoriteIds.length : 0;
  const prefersReducedMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<WatchlistSort>("saved");
  const [descending, setDescending] = useState(true);
  const {
    data: assets = [],
    error,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["market", "watchlist", requestedFavoriteIds],
    queryFn: () => getCoinMarkets(requestedFavoriteIds),
    enabled: requestedFavoriteIds.length > 0,
    placeholderData: (previousAssets) => previousAssets,
    retry: 1,
    staleTime: 60_000,
  });

  const favoriteAssets = useMemo(() => {
    const assetsById = new Map(assets.map((asset) => [asset.id, asset]));
    return favoriteIds.flatMap((id) => {
      const asset = assetsById.get(id);
      return asset ? [asset] : [];
    });
  }, [assets, favoriteIds]);

  const visibleAssets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = favoriteAssets.filter(
      (asset) =>
        !normalizedSearch ||
        asset.name.toLowerCase().includes(normalizedSearch) ||
        asset.symbol.toLowerCase().includes(normalizedSearch),
    );

    if (sort === "saved") return filtered;

    return [...filtered].sort((first, second) => {
      const firstValue =
        sort === "change"
          ? (first.price_change_percentage_24h_in_currency ??
            first.price_change_percentage_24h)
          : first[sort];
      const secondValue =
        sort === "change"
          ? (second.price_change_percentage_24h_in_currency ??
            second.price_change_percentage_24h)
          : second[sort];
      if (!isNumber(firstValue)) return 1;
      if (!isNumber(secondValue)) return -1;
      return descending ? secondValue - firstValue : firstValue - secondValue;
    });
  }, [descending, favoriteAssets, search, sort]);

  const changes = favoriteAssets
    .map(
      (asset) =>
        asset.price_change_percentage_24h_in_currency ??
        asset.price_change_percentage_24h,
    )
    .filter(isNumber);
  const gainers = changes.filter((change) => change > 0).length;
  const losers = changes.filter((change) => change < 0).length;
  const averageChange = changes.length
    ? changes.reduce((total, change) => total + change, 0) / changes.length
    : null;
  const missingAssets = Math.max(0, favoriteIds.length - favoriteAssets.length);
  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      };

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Heading level={1} size="lg">
              Watchlist
            </Heading>
            <Badge tone="success" dot>
              {savedCount} saved
            </Badge>
          </div>
          <p className="mt-1 text-sm text-sidebar-muted">
            Follow saved assets and open their detailed market intelligence.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          <IoArrowBack aria-hidden="true" className="size-4" />
          Browse market
        </Link>
      </header>

      <AnimatePresence mode="wait">
        {!watchlistReady ? (
          <motion.div key="restoring" {...motionProps}>
            <WatchlistSkeleton />
          </motion.div>
        ) : favoriteIds.length === 0 ? (
          <motion.section
            key="empty"
            {...motionProps}
            role="status"
            className="flex min-h-105 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border bg-white px-6 text-center shadow-sm"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-indigo-50 text-primary">
              <FiStar aria-hidden="true" className="size-6" />
            </span>
            <Heading level={2} size="md" className="mt-4">
              Your watchlist is empty
            </Heading>
            <p className="mt-2 max-w-md text-sm leading-6 text-sidebar-muted">
              Save assets from the market overview or an asset details page to
              monitor them here.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            >
              Explore assets
            </Link>
          </motion.section>
        ) : isPending ? (
          <motion.div key="loading" {...motionProps}>
            <WatchlistSkeleton />
          </motion.div>
        ) : isError ? (
          <motion.section
            key="error"
            {...motionProps}
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800"
          >
            <Heading level={2} size="sm" className="text-rose-900">
              Saved market data is unavailable
            </Heading>
            <p className="mt-1 text-sm">{error.message}</p>
            <Button className="mt-4" size="sm" onClick={() => void refetch()}>
              Retry
            </Button>
          </motion.section>
        ) : favoriteAssets.length === 0 ? (
          <motion.section
            key="no-data"
            {...motionProps}
            role="status"
            className="rounded-xl border border-sidebar-border bg-white p-6 text-sidebar-muted shadow-sm"
          >
            <Heading level={2} size="sm">
              No saved asset data was returned
            </Heading>
            <p className="mt-1 text-sm">
              Your saved IDs remain stored. Retry later or remove them from
              their asset pages.
            </p>
            <Button
              className="mt-4"
              size="sm"
              variant="outline"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </motion.section>
        ) : (
          <motion.div key="content" {...motionProps}>
            <section
              aria-label="Watchlist summary"
              className="grid gap-4 sm:grid-cols-3"
            >
              <WatchlistMetricCard
                icon={FiStar}
                label="Saved Assets"
                value={String(favoriteAssets.length)}
                description="Assets currently returned by CoinGecko"
              />
              <WatchlistMetricCard
                icon={FiTrendingUp}
                label="24h Gainers"
                value={String(gainers)}
                description="Saved assets trading higher today"
                tone="positive"
              />
              <WatchlistMetricCard
                icon={FiTrendingDown}
                label="24h Performance"
                value={formatPercentage(averageChange)}
                description={`${losers} saved asset${losers === 1 ? "" : "s"} trading lower`}
                tone={
                  isNumber(averageChange) && averageChange < 0
                    ? "negative"
                    : "positive"
                }
              />
            </section>

            <section
              aria-labelledby="saved-assets-title"
              className="mt-5 overflow-hidden rounded-xl border border-sidebar-border bg-white shadow-sm"
            >
              <div className="flex flex-col gap-4 border-b border-sidebar-border p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <Heading id="saved-assets-title" level={2} size="sm">
                    Saved Assets
                  </Heading>
                  <p className="mt-1 text-xs text-sidebar-muted">
                    Select an asset for details or use the star to remove it.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative min-w-0 sm:w-64">
                    <span className="sr-only">Search saved assets</span>
                    <FiSearch
                      aria-hidden="true"
                      className="pointer-events-none absolute top-2.5 left-3 size-3 text-slate-400"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search saved assets..."
                      className="h-8 w-full rounded-lg border border-sidebar-border bg-sidebar-surface pr-3 pl-8 text-[11px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="watchlist-sort"
                      className="text-[11px] text-sidebar-muted"
                    >
                      Sort by:
                    </label>
                    <select
                      id="watchlist-sort"
                      value={sort}
                      onChange={(event) =>
                        setSort(event.target.value as WatchlistSort)
                      }
                      className="h-8 rounded-lg border border-sidebar-border bg-sidebar-surface px-2.5 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary/15"
                    >
                      <option value="saved">Saved order</option>
                      <option value="market_cap">Market cap</option>
                      <option value="current_price">Price</option>
                      <option value="change">24h change</option>
                    </select>
                    <button
                      type="button"
                      disabled={sort === "saved"}
                      onClick={() => setDescending((value) => !value)}
                      aria-label={`Sort ${descending ? "ascending" : "descending"}`}
                      className="flex size-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-surface text-sidebar-muted outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {descending ? (
                        <FiArrowDown aria-hidden="true" />
                      ) : (
                        <FiArrowUp aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {visibleAssets.length ? (
                <MarketTable assets={visibleAssets} startIndex={0} />
              ) : (
                <div
                  role="status"
                  className="flex min-h-56 flex-col items-center justify-center px-6 text-center"
                >
                  <Heading level={3} size="sm">
                    No matching saved assets
                  </Heading>
                  <p className="mt-1 text-sm text-sidebar-muted">
                    Try a different name or symbol.
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    variant="outline"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}

              <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-sidebar-border bg-slate-50/50 px-4 py-3 text-[11px] text-sidebar-muted">
                <span>
                  Showing {visibleAssets.length} of {favoriteAssets.length}{" "}
                  saved assets
                </span>
                <span>
                  {missingAssets
                    ? `${missingAssets} saved asset unavailable from the current response`
                    : "Data provided by CoinGecko"}
                </span>
              </footer>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
