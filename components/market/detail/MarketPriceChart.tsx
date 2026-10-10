"use client";

import { useState, type PointerEvent as ReactPointerEvent } from "react";
import { isNumber } from "@/lib/utils/isNumber";
import { formatUsdPrice } from "@/lib/utils/formatUsdPrice";
import Button from "@/components/ui/Button";

type MarketPriceChartProps = {
  assetName: string;
  period: "24H" | "7D";
  error?: string;
  prices: Array<[number, number | null]> | null | undefined;
};

export default function MarketPriceChart({
  assetName,
  error,
  prices,
  period,
}: MarketPriceChartProps) {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  if (error) {
    return (
      <div
        role="alert"
        className="flex min-h-72 items-center justify-center px-6 text-center"
      >
        <div>
          <p className="font-semibold text-rose-700">
            Historical prices are unavailable
          </p>
          <p className="mt-1 text-sm text-sidebar-muted">{error}</p>
          <Button className="mt-3" onClick={() => window.location.reload()}>
            Retry chart
          </Button>
        </div>
      </div>
    );
  }

  const points =
    prices?.filter(
      (point): point is [number, number] =>
        isNumber(point[0]) && isNumber(point[1]),
    ) ?? [];
  if (points.length < 2) {
    return (
      <div
        role="status"
        className="flex min-h-72 items-center justify-center px-6 text-center text-sm text-sidebar-muted"
      >
        No price history is available for this period.
      </div>
    );
  }

  const values = points.map(([, value]) => value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || 1;
  const chartCoordinates = points.map(([, value], index) => {
      const duration = points.at(-1)![0] - points[0][0];
      const x =
        duration > 0
          ? ((points[index][0] - points[0][0]) / duration) * 760
          : (index / (points.length - 1)) * 760;
      const y = 224 - ((value - minimum) / range) * 192;
      return { x, y };
    });
  const chartPoints = chartCoordinates
    .map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const startDate = new Date(points[0][0]);
  const endDate = new Date(points.at(-1)![0]);
  const activePoint = activePointIndex === null
    ? null
    : points[activePointIndex];
  const activeCoordinates = activePointIndex === null
    ? null
    : chartCoordinates[activePointIndex];

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = Math.min(
      760,
      Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 760),
    );
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    chartCoordinates.forEach(({ x }, index) => {
      const distance = Math.abs(x - pointerX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActivePointIndex(nearestIndex);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-sidebar-border bg-slate-50/60 px-0 pb-3 pt-6">
      <div className="relative">
        <svg
          role="img"
          aria-label={`${assetName} ${period} price chart from ${formatUsdPrice(values[0])} to ${formatUsdPrice(values.at(-1))}`}
          viewBox="0 0 760 240"
          className="h-64 w-full sm:h-80"
          preserveAspectRatio="none"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActivePointIndex(null)}
        >
          <defs>
            <linearGradient
              id="market-detail-chart-fill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[32, 80, 128, 176, 224].map((y) => (
            <line
              key={y}
              x1="0"
              x2="760"
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="4 5"
            />
          ))}
          <polygon
            points={`0,224 ${chartPoints} 760,224`}
            fill="url(#market-detail-chart-fill)"
          />
          <polyline
            points={chartPoints}
            fill="none"
            stroke="#5546ff"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {activeCoordinates && (
            <>
              <line
                x1={activeCoordinates.x}
                x2={activeCoordinates.x}
                y1="32"
                y2="224"
                stroke="#818cf8"
                strokeWidth="1"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={activeCoordinates.x}
                cy={activeCoordinates.y}
                r="5"
                fill="#ffffff"
                stroke="#4f46e5"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
        {activePoint && activeCoordinates && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute z-10 min-w-36 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-white shadow-lg ${
              activeCoordinates.x < 100
                ? "translate-x-0"
                : activeCoordinates.x > 660
                  ? "-translate-x-full"
                  : "-translate-x-1/2"
            } ${activeCoordinates.y < 80 ? "translate-y-3" : "-translate-y-[calc(100%+12px)]"}`}
            style={{
              left: `${(activeCoordinates.x / 760) * 100}%`,
              top: `${(activeCoordinates.y / 240) * 100}%`,
            }}
          >
            <p className="text-xs font-semibold">{formatUsdPrice(activePoint[1])}</p>
            <p className="mt-1 text-[10px] whitespace-nowrap text-slate-300">
              {new Date(activePoint[0]).toLocaleString("en-US", {
                timeZone: "UTC",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZoneName: "short",
              })}
            </p>
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[13.333%] right-3 bottom-[6.667%] flex flex-col justify-between text-[11px] leading-none text-sidebar-muted"
        >
          {[
            minimum + range,
            minimum + range * 0.75,
            minimum + range * 0.5,
            minimum + range * 0.25,
            minimum,
          ].map((value, index) => (
            <span key={index} className="bg-slate-50/80 px-1">
              {formatUsdPrice(value)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 px-4 text-[11px] font-medium text-sidebar-muted">
        <span>
          {startDate.toLocaleString("en-US", {
            timeZone: "UTC",
            month: "short",
            day: "numeric",
            ...(period === "24H"
              ? ({ hour: "2-digit", minute: "2-digit" } as const)
              : {}),
          })}
        </span>
        <span>
          {period} range: {formatUsdPrice(minimum)} – {formatUsdPrice(maximum)}
        </span>
        <span>
          {endDate.toLocaleString("en-US", {
            timeZone: "UTC",
            month: "short",
            day: "numeric",
            ...(period === "24H"
              ? ({ hour: "2-digit", minute: "2-digit" } as const)
              : {}),
          })}
        </span>
      </div>
    </div>
  );
}
