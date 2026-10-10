import { connection } from "next/server";
import MarketDataTable from "@/components/market/MarketDataTable";
import { getCoinGeckoMarkets } from "@/lib/api/getCoinGeckoMarkets";
import type { MarketSnapshotResult } from "@/type/coinMarket";

export default async function MarketSnapshot() {
  // Rankings must reflect a real page request, not build-time or cached data.
  await connection();

  let snapshot: MarketSnapshotResult;
  try {
    snapshot = { assets: await getCoinGeckoMarkets(), error: null };
  } catch {
    snapshot = {
      assets: null,
      error: "Unable to load the latest market rankings. Please try again.",
    };
  }

  return <MarketDataTable snapshot={snapshot} />;
}
