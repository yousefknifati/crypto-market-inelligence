import type { CoinMarketsResponse } from "@/types/coinMarket";

export function isCoinGeckoMarketsResponse(
  value: unknown,
): value is CoinMarketsResponse {
  return (
    Array.isArray(value) &&
    value.every(
      (asset) =>
        typeof asset === "object" &&
        asset !== null &&
        typeof asset.id === "string" &&
        asset.id.trim().length > 0 &&
        typeof asset.name === "string" &&
        asset.name.trim().length > 0 &&
        typeof asset.symbol === "string" &&
        asset.symbol.trim().length > 0,
    )
  );
}
