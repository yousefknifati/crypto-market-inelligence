import { isNumber } from "@/lib/utils/isNumber";

export function formatSupply(value: number | null | undefined, symbol: string) {
  if (!isNumber(value)) return "Unavailable";

  return `${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)} ${symbol.toUpperCase()}`;
}
