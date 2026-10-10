"use client";

import { motion, useReducedMotion } from "motion/react";
import MarketTableRow from "@/components/market/MarketTableRow";
import type { CoinMarket } from "@/types/coinMarket";

type MarketTableProps = {
  assets: readonly CoinMarket[];
  startIndex: number;
};

export default function MarketTable({ assets, startIndex }: MarketTableProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeOut",
      }}
      className="overflow-x-auto"
    >
      <table className="w-full min-w-[740px] border-collapse">
        <thead className="border-b border-sidebar-border bg-slate-50/80">
          <tr className="text-[11px] leading-[14px] font-bold tracking-[0.22px] text-sidebar-muted">
            <th scope="col" className="w-10 px-3 py-3 text-center">
              #
            </th>
            <th scope="col" className="min-w-40 px-3 py-3 text-left">
              Asset
            </th>
            <th scope="col" className="px-3 py-3 text-right">
              Price
            </th>
            <th scope="col" className="px-3 py-3 text-right">
              24h Change
            </th>
            <th scope="col" className="px-3 py-3 text-right">
              24h Volume
            </th>
            <th scope="col" className="px-3 py-3 text-right">
              Market Cap
            </th>
            <th scope="col" className="min-w-36 px-3 py-3 text-center">
              Last 7 Days
            </th>
            <th scope="col" className="w-10 px-2 py-3">
              <span className="sr-only">Watchlist</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <MarketTableRow
              key={asset.id}
              asset={asset}
              fallbackRank={startIndex + index + 1}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
            />
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
