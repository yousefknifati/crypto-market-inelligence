import MarketOverviewHeader from "@/components/market/MarketOverviewHeader";
import MarketSummaryCards from "@/components/market/MarketSummaryCards";
import { Suspense } from "react";
import MarketSnapshot from "@/components/market/MarketSnapshot";
import MarketDataTableSkeleton from "@/components/market/MarketDataTableSkeleton";
import MarketSummaryCardsSkeleton from "@/components/market/MarketSummaryCardsSkeleton";
import LazyLivePriceStream from "@/components/live/LazyLivePriceStream";
import { HomeStructuredData, homeMetadata } from "@/lib/seo/homeSeo";

export const metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <HomeStructuredData />
      <div className="min-h-full w-full min-w-0 max-w-full overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-6 sm:py-6">
        <MarketOverviewHeader />
        <Suspense fallback={<MarketSummaryCardsSkeleton />}>
          <MarketSummaryCards />
        </Suspense>
        <div className="items-start gap-5 xl:flex">
          <div className="min-w-0 flex-1">
            <Suspense fallback={<MarketDataTableSkeleton />}>
              <MarketSnapshot />
            </Suspense>
          </div>
          <aside aria-label="Live market tools" className="mt-6 shrink-0 xl:w-75">
            <LazyLivePriceStream />
          </aside>
        </div>
      </div>
    </>
  );
}
