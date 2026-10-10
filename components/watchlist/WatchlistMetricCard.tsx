import type { IconType } from "react-icons";

type WatchlistMetricCardProps = {
  icon: IconType;
  label: string;
  value: string;
  description: string;
  tone?: "neutral" | "positive" | "negative";
};

export default function WatchlistMetricCard({
  icon: Icon,
  label,
  value,
  description,
  tone = "neutral",
}: WatchlistMetricCardProps) {
  const valueColor = tone === "positive"
    ? "text-emerald-600"
    : tone === "negative"
      ? "text-rose-600"
      : "text-slate-900";

  return (
    <article className="rounded-xl border border-sidebar-border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-sidebar-muted">
        <Icon aria-hidden="true" className="size-4 text-primary" />
        <h2>{label}</h2>
      </div>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${valueColor}`}>{value}</p>
      <p className="mt-1 text-xs text-sidebar-muted">{description}</p>
    </article>
  );
}
