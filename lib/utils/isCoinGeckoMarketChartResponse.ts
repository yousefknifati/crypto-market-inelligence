import type { CoinMarketChart } from "@/types/coinDetail";

export function isCoinGeckoMarketChartResponse(
  value: unknown,
): value is CoinMarketChart {
  if (typeof value !== "object" || value === null) return false;

  const chart = value as Record<string, unknown>;
  return chart.prices === null || Array.isArray(chart.prices);
}
