import { FiArrowDown, FiArrowUp, FiSearch } from "react-icons/fi";
import Heading from "@/components/ui/Heading";

export type MarketFilter = "all" | "gainers" | "losers";
export type MarketSortKey =
  | "market_cap"
  | "current_price"
  | "price_change_percentage_24h"
  | "total_volume";
export type MarketSortDirection = "asc" | "desc";

type MarketTableToolbarProps = {
  filter: MarketFilter;
  onFilterChange: (filter: MarketFilter) => void;
  onSearchChange: (search: string) => void;
  onSortDirectionChange: () => void;
  onSortKeyChange: (sortKey: MarketSortKey) => void;
  search: string;
  sortDirection: MarketSortDirection;
  sortKey: MarketSortKey;
};

export default function MarketTableToolbar({
  filter,
  onFilterChange,
  onSearchChange,
  onSortDirectionChange,
  onSortKeyChange,
  search,
  sortDirection,
  sortKey,
}: MarketTableToolbarProps) {
  return (
    <header className="border-b border-sidebar-border px-4 pt-4 pb-[17px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Heading level={2} size="sm">
          Cryptocurrency Prices by Market Cap
        </Heading>
        <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-lg border border-sidebar-border bg-slate-100 p-1">
          {([
            ["all", "All Assets"],
            ["gainers", "Gainers"],
            ["losers", "Losers"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => onFilterChange(value)}
              className={`shrink-0 rounded px-2.5 py-1 text-[11px] leading-[14px] font-semibold tracking-[0.44px] outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                filter === value
                  ? "border border-slate-200/60 bg-white text-slate-900"
                  : "border border-transparent text-slate-600 hover:bg-white/60"
              }`}
            >
              {label}
            </button>
          ))}
          <button type="button" disabled title="Category data is not returned by this endpoint" className="shrink-0 cursor-not-allowed rounded px-2.5 py-1 text-[11px] leading-[14px] font-semibold tracking-[0.44px] text-slate-400">
            Layer 1
          </button>
          <button type="button" disabled title="Category data is not returned by this endpoint" className="shrink-0 cursor-not-allowed rounded px-2.5 py-1 text-[11px] leading-[14px] font-semibold tracking-[0.44px] text-slate-400">
            DeFi
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search assets by name or symbol</span>
          <FiSearch aria-hidden="true" className="pointer-events-none absolute top-2.5 left-3.5 size-3 text-slate-400" />
          <input
            id="market-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name or symbol..."
            className="h-8 w-full rounded-lg border border-sidebar-border bg-sidebar-surface pr-3 pl-8 text-[11px] font-medium tracking-[0.22px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="market-sort" className="text-[11px] leading-[14px] font-medium tracking-[0.22px] text-sidebar-muted">
            Sort by:
          </label>
          <select
            id="market-sort"
            value={sortKey}
            onChange={(event) => onSortKeyChange(event.target.value as MarketSortKey)}
            className="h-8 rounded-lg border border-sidebar-border bg-sidebar-surface px-2.5 text-[11px] font-semibold tracking-[0.44px] text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            <option value="market_cap">Market Cap</option>
            <option value="current_price">Price</option>
            <option value="price_change_percentage_24h">24h Change</option>
            <option value="total_volume">24h Volume</option>
          </select>
          <button
            type="button"
            onClick={onSortDirectionChange}
            aria-label={`Sort ${sortDirection === "desc" ? "ascending" : "descending"}`}
            title={`Currently sorting ${sortDirection === "desc" ? "descending" : "ascending"}`}
            className="flex size-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-surface text-sidebar-muted outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {sortDirection === "desc" ? <FiArrowDown aria-hidden="true" /> : <FiArrowUp aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
