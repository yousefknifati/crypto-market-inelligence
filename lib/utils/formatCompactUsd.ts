import { isNumber } from "@/lib/utils/isNumber";

export function formatCompactUsd(value: number | null | undefined) {
  if (!isNumber(value)) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}
