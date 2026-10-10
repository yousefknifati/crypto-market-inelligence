import Image from "next/image";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Heading from "@/components/ui/Heading";
import MarketDetailActions from "./MarketDetailActions";
import { formatUsdPrice } from "@/lib/utils/formatUsdPrice";
import { formatPercentage } from "@/lib/utils/formatPercentage";
import { isNumber } from "@/lib/utils/isNumber";
import type { CoinDetail, CoinMarketChart } from "@/types/coinDetail";

export default function MarketAssetSummary({
  asset,
  prices,
}: {
  asset: CoinDetail;
  prices: CoinMarketChart["prices"];
}) {
  const data = asset.market_data;
  const change = data?.price_change_percentage_24h;
  const amount = data?.price_change_24h;
  const symbol = asset.symbol.toUpperCase();
  return (
    <section
      aria-label={`${asset.name} summary`}
      className="grid items-center gap-5 rounded-xl border border-sidebar-border bg-white p-5 shadow-sm min-[1200px]:grid-cols-[1fr_1.1fr_auto]"
    >
      <div className="flex min-w-0 items-center gap-4">
        {asset.image?.large ? (
          <Image
            src={asset.image.large}
            alt={`${asset.name} logo`}
            width={56}
            height={56}
            priority
            className="size-14 shrink-0 rounded-full"
          />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl font-bold text-primary">
            {symbol.slice(0, 1)}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Heading level={1} size="lg">
              {asset.name}
            </Heading>
            <Badge size="xs" shape="rounded" className="bg-slate-100">
              {symbol}
            </Badge>
            {isNumber(asset.market_cap_rank) && (
              <Badge
                size="xs"
                className="max-w-16 border-indigo-200 bg-indigo-50 text-primary"
              >
                #{asset.market_cap_rank} in Market Cap
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs leading-4 text-sidebar-muted">
            {asset.categories?.filter(Boolean).slice(0, 2).join(" · ") ||
              "Spot market intelligence"}
          </p>
        </div>
      </div>
      <div className="min-w-0 min-[1200px]:border-l min-[1200px]:border-sidebar-border min-[1200px]:pl-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {formatUsdPrice(data?.current_price?.usd)}
          </p>
          <Badge
            tone={
              !isNumber(change) ? "neutral" : change >= 0 ? "success" : "danger"
            }
          >
            {isNumber(change) &&
              (change >= 0 ? (
                <FiArrowUp aria-hidden="true" />
              ) : (
                <FiArrowDown aria-hidden="true" />
              ))}
            <span>
              {isNumber(amount)
                ? `${amount >= 0 ? "+" : "−"}${formatUsdPrice(Math.abs(amount))}`
                : "Change unavailable"}
              <br />
              {isNumber(change)
                ? `(${change >= 0 ? "+" : ""}${formatPercentage(change)})`
                : "24h"}
            </span>
          </Badge>
        </div>
        <p className="mt-2 text-[11px] text-sidebar-muted">
          24h Range:{" "}
          <span className="text-slate-900">
            {formatUsdPrice(data?.low_24h?.usd)} —{" "}
            {formatUsdPrice(data?.high_24h?.usd)}
          </span>
        </p>
      </div>
      <MarketDetailActions
        assetId={asset.id}
        assetName={asset.name}
        prices={prices}
      />
    </section>
  );
}
