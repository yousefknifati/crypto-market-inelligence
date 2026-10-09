import { isNumber } from "@/lib/utils/isNumber";

export function formatUsdPrice(value: number | null | undefined) {
  if (!isNumber(value)) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}
