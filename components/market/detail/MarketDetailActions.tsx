"use client";

import { FiBell, FiDownload, FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import MarketFavoriteButton from "./MarketFavoriteButton";
import { isNumber } from "@/lib/utils/isNumber";
import type { CoinMarketChart } from "@/type/coinDetail";

export default function MarketDetailActions({ assetId, assetName, prices }: { assetId: string; assetName: string; prices: CoinMarketChart["prices"] }) {
  const validPrices = prices?.filter(([time, price]) => isNumber(time) && isNumber(price)) ?? [];
  function exportPrices() {
    const csv = ["timestamp_utc,price_usd", ...validPrices.map(([time, price]) => `${new Date(time).toISOString()},${price}`)].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${assetId}-prices.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Asset link copied");
    } catch { toast.error("Could not copy the link. Copy the address from your browser."); }
  }
  return (
    <div className="flex flex-wrap gap-2 min-[1200px]:max-w-72">
      <MarketFavoriteButton assetId={assetId} assetName={assetName} />
      <Button variant="outline" size="sm" disabled title="Price alerts are not available yet" leadingIcon={<FiBell aria-hidden="true" />}>Set Price Alert</Button>
      <Button variant="outline" size="sm" disabled={!validPrices.length} onClick={exportPrices} leadingIcon={<FiDownload aria-hidden="true" />}>Export Prices (CSV)</Button>
      <Button variant="outline" size="sm" aria-label="Copy asset link" onClick={share}><FiShare2 aria-hidden="true" /></Button>
    </div>
  );
}
