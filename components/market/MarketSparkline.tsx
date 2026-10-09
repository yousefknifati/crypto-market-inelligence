import { isNumber } from "@/lib/utils/isNumber";

type MarketSparklineProps = {
  assetName: string;
  prices: Array<number | null> | null | undefined;
};

export default function MarketSparkline({ assetName, prices }: MarketSparklineProps) {
  const values = prices?.filter(isNumber) ?? [];

  if (values.length < 2) {
    return <span className="text-[11px] text-slate-400">Unavailable</span>;
  }

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 112;
      const y = 18 - ((value - minimum) / range) * 16;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const rising = values.at(-1)! >= values[0];

  return (
    <svg
      role="img"
      aria-label={`${assetName} seven-day price trend, ${rising ? "rising" : "falling"}`}
      viewBox="0 0 112 20"
      className="h-5 w-28"
    >
      <polyline
        points={points}
        fill="none"
        stroke={rising ? "#16a34a" : "#ef4444"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
