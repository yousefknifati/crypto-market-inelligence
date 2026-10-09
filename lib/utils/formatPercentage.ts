import { isNumber } from "@/lib/utils/isNumber";

export function formatPercentage(
  value: number | null | undefined,
  digits = 2,
) {
  return isNumber(value) ? `${value.toFixed(digits)}%` : "Unavailable";
}
