
import MarketOverviewHeader from "@/components/market/MarketOverviewHeader";
import MarketSummaryCards from "@/components/market/MarketSummaryCards";

export default function Home() {
  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6">
      <MarketOverviewHeader />
      <MarketSummaryCards />
    </div>
  );
}
