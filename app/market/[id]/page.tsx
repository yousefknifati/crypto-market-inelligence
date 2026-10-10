import { notFound } from "next/navigation";
import MarketDetailSubHeader from "@/components/market/detail/MarketDetailSubHeader";
import MarketAssetSummary from "@/components/market/detail/MarketAssetSummary";
import MarketChartPanel from "@/components/market/detail/MarketChartPanel";
import MarketFundamentalMetrics from "@/components/market/detail/MarketFundamentalMetrics";
import Heading from "@/components/ui/Heading";
import { getCoinGeckoCoinDetail } from "@/lib/api/getCoinGeckoCoinDetail";
import { getCoinGeckoMarketChart } from "@/lib/api/getCoinGeckoMarketChart";
import {
  generateMarketDetailMetadata,
  MarketDetailStructuredData,
} from "@/lib/seo/marketDetailSeo";
import { stripHtml } from "@/lib/utils/stripHtml";

export async function generateMetadata({
  params,
}: PageProps<"/market/[id]">) {
  const { id } = await params;
  return generateMarketDetailMetadata(id);
}

export default async function MarketDetailPage({
  params,
}: PageProps<"/market/[id]">) {
  const { id } = await params;
  const [asset, chartResult] = await Promise.all([
    getCoinGeckoCoinDetail(id),
    getCoinGeckoMarketChart(id)
      .then((chart) => ({ chart, error: undefined }))
      .catch((error: unknown) => ({
        chart: undefined,
        error:
          error instanceof Error ? error.message : "The chart request failed.",
      })),
  ]);

  if (!asset) notFound();

  const marketData = asset.market_data;
  const description = stripHtml(asset.description?.en);
  const symbol = asset.symbol.toUpperCase();
  const homepage = asset.links?.homepage?.find((url): url is string =>
    Boolean(url),
  );

  return (
    <>
      <MarketDetailStructuredData asset={asset} description={description} />
      <div className="min-h-full bg-slate-50">
        <MarketDetailSubHeader assetName={asset.name} symbol={symbol} />

        <div className="space-y-5 px-4 py-6 sm:px-6">
          <MarketAssetSummary
            asset={asset}
            prices={chartResult.chart?.prices}
          />
          <MarketChartPanel
            assetName={asset.name}
            marketData={marketData}
            prices={chartResult.chart?.prices}
            error={chartResult.error}
          />
          <MarketFundamentalMetrics asset={asset} />
          <section
            aria-labelledby="about-asset-title"
            className="rounded-xl border border-sidebar-border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Heading id="about-asset-title" size="sm">
                About {asset.name}
              </Heading>
              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Official website
                </a>
              )}
            </div>
            <p className="mt-3 max-w-5xl text-sm leading-6 text-sidebar-muted">
              {description || "No asset description is available."}
            </p>
            <p className="mt-4 border-t border-sidebar-border pt-3 text-[11px] text-sidebar-muted">
              Source: CoinGecko API
              {asset.last_updated
                ? ` · Last updated ${new Date(asset.last_updated).toLocaleString("en-US", { timeZone: "UTC", timeZoneName: "short" })}`
                : " · Update time unavailable"}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
