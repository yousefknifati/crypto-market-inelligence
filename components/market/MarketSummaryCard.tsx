import Image from "next/image";
import type { ReactNode } from "react";
import { FiMinus, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import Badge from "@/components/ui/Badge";

type TrendDirection = "up" | "down" | "neutral";

type ProgressSegment = {
  colorClassName: string;
  value: number;
};

type MarketSummaryCardProps = {
  children: ReactNode;
  footerLabel: ReactNode;
  footerValue: ReactNode;
  progressLabel: string;
  progressSegments: readonly ProgressSegment[];
  sparkline?: {
    alt: string;
    src: string;
  };
  title: string;
  trend: {
    direction: TrendDirection;
    label: string;
  };
};

export default function MarketSummaryCard({
  children,
  footerLabel,
  footerValue,
  progressLabel,
  progressSegments,
  sparkline,
  title,
  trend,
}: MarketSummaryCardProps) {
  const TrendIcon = trend.direction === "up"
    ? FiTrendingUp
    : trend.direction === "down"
      ? FiTrendingDown
      : FiMinus;

  return (
    <article className="flex h-[178px] min-w-0 flex-col rounded-xl border border-sidebar-border bg-white p-[17px] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-2 pb-2">
        <h2 className="truncate text-[11px] leading-[14px] font-semibold tracking-[0.44px] text-sidebar-muted">
          {title}
        </h2>
        <Badge
          size="xs"
          tone={trend.direction === "up" ? "success" : trend.direction === "down" ? "danger" : "neutral"}
        >
          <TrendIcon aria-hidden="true" className="size-3" />
          {trend.label}
        </Badge>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-between gap-2 pb-3">
        <div className="min-w-0">{children}</div>
        {sparkline && (
          <Image
            src={sparkline.src}
            alt={sparkline.alt}
            width={98}
            height={32}
            className="hidden h-8 w-[98px] shrink-0 sm:block"
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2 text-[11px] leading-[14px] font-medium tracking-[0.22px]">
          <span className="min-w-0 text-sidebar-muted">{footerLabel}</span>
          <span className="shrink-0 text-right text-slate-800">{footerValue}</span>
        </div>
        <div
          role="img"
          aria-label={progressLabel}
          className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        >
          {progressSegments.map((segment, index) => (
            <span
              key={`${segment.value}-${index}`}
              aria-hidden="true"
              className={`h-full ${segment.colorClassName}`}
              style={{ width: `${Math.max(0, Math.min(segment.value, 100))}%` }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
