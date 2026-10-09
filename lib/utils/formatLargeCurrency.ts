import { isNumber } from "@/lib/utils/isNumber";

const units = [
  {
    threshold: 1_000_000_000_000,
    divisor: 1_000_000_000_000,
    label: "Trillion",
  },
  {
    threshold: 1_000_000_000,
    divisor: 1_000_000_000,
    label: "Billion",
  },
  {
    threshold: 1_000_000,
    divisor: 1_000_000,
    label: "Million",
  },
] as const;

export function formatLargeCurrency(value: number | null | undefined) {
  if (!isNumber(value)) return null;

  const unit = units.find(({ threshold }) => Math.abs(value) >= threshold);

  if (!unit) {
    return {
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value),
      unit: "",
    };
  }

  return {
    amount: `$${(value / unit.divisor).toFixed(2)}`,
    unit: unit.label,
  };
}
