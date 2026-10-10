import type { CoinDetail } from "@/types/coinDetail";

export function isCoinGeckoCoinDetailResponse(
  value: unknown,
): value is CoinDetail {
  if (typeof value !== "object" || value === null) return false;

  const asset = value as Record<string, unknown>;
  return (
    typeof asset.id === "string" &&
    asset.id.trim().length > 0 &&
    typeof asset.name === "string" &&
    asset.name.trim().length > 0 &&
    typeof asset.symbol === "string" &&
    asset.symbol.trim().length > 0
  );
}
