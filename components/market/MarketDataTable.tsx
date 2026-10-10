"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import MarketDataTableSkeleton from "@/components/market/MarketDataTableSkeleton";
import MarketTable from "@/components/market/MarketTable";
import MarketTablePagination from "@/components/market/MarketTablePagination";
import MarketTableToolbar, {
  type MarketFilter,
  type MarketSortDirection,
  type MarketSortKey,
} from "@/components/market/MarketTableToolbar";
import { isNumber } from "@/lib/utils/isNumber";
import type { MarketSnapshotResult } from "@/type/coinMarket";

export default function MarketDataTable({ snapshot }: { snapshot: MarketSnapshotResult }) {
  const { assets, error } = snapshot;
  const router = useRouter();
  const [isFetching, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MarketFilter>("all");
  const [sortKey, setSortKey] = useState<MarketSortKey>("market_cap");
  const [sortDirection, setSortDirection] = useState<MarketSortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredAssets = useMemo(() => {
    if (!assets) return [];

    const normalizedSearch = search.trim().toLowerCase();
    return assets
      .filter((asset) => {
        if (
          normalizedSearch &&
          !asset.name.toLowerCase().includes(normalizedSearch) &&
          !asset.symbol.toLowerCase().includes(normalizedSearch)
        ) {
          return false;
        }

        const change = asset.price_change_percentage_24h_in_currency
          ?? asset.price_change_percentage_24h;
        if (filter === "gainers") return isNumber(change) && change > 0;
        if (filter === "losers") return isNumber(change) && change < 0;
        return true;
      })
      .sort((first, second) => {
        const firstValue = first[sortKey];
        const secondValue = second[sortKey];
        if (!isNumber(firstValue)) return 1;
        if (!isNumber(secondValue)) return -1;
        return sortDirection === "asc"
          ? firstValue - secondValue
          : secondValue - firstValue;
      });
  }, [assets, filter, search, sortDirection, sortKey]);

  if (isFetching && assets === null) return <MarketDataTableSkeleton />;

  if (assets === null) {
    return (
      <section role="alert" className="mt-6 w-full rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
        <h2 className="font-semibold">Cryptocurrency prices are unavailable</h2>
        <p className="mt-1 text-sm">{error}</p>
        <Button className="mt-4" size="sm" onClick={() => startTransition(() => router.refresh())}>
          Retry
        </Button>
      </section>
    );
  }

  if (assets.length === 0) {
    return (
      <section role="status" className="mt-6 w-full rounded-xl border border-sidebar-border bg-white p-5 text-sidebar-muted">
        <h2 className="font-semibold text-slate-900">No cryptocurrency market data</h2>
        <p className="mt-1 text-sm">CoinGecko returned a successful response without any assets.</p>
      </section>
    );
  }

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);
  const startIndex = safeCurrentPage * pageSize;
  const visibleAssets = filteredAssets.slice(startIndex, startIndex + pageSize);

  return (
    <section className="mt-6 w-full min-w-0 overflow-hidden rounded-xl border border-sidebar-border bg-white shadow-sm">
      <MarketTableToolbar
        search={search}
        filter={filter}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(0);
        }}
        onFilterChange={(value) => {
          setFilter(value);
          setCurrentPage(0);
        }}
        onSortKeyChange={(value) => {
          setSortKey(value);
          setCurrentPage(0);
        }}
        onSortDirectionChange={() => {
          setSortDirection((direction) => direction === "desc" ? "asc" : "desc");
          setCurrentPage(0);
        }}
      />

      {visibleAssets.length === 0 ? (
        <div role="status" className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <h3 className="font-semibold text-slate-900">No matching assets</h3>
          <p className="mt-1 max-w-sm text-sm text-sidebar-muted">
            No assets match the current search and market filter.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setFilter("all");
              setCurrentPage(0);
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <MarketTable assets={visibleAssets} startIndex={startIndex} />
      )}

      <MarketTablePagination
        currentPage={safeCurrentPage}
        isFetching={isFetching}
        pageSize={pageSize}
        totalItems={filteredAssets.length}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onLoadMore={() => {
          setPageSize((size) => Math.min(size + 10, filteredAssets.length));
          setCurrentPage(0);
        }}
      />
    </section>
  );
}
