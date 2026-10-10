import { FiDownload } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";

export default function MarketOverviewHeader() {
  return (
    <section className="flex flex-col gap-4 pb-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <Heading level={1} size="lg">
            Market Overview
          </Heading>
          <Badge className="max-w-full whitespace-normal">
            CoinGecko Market Data • Binance Live Prices
          </Badge>
        </div>
        <p className="text-sm leading-5 text-sidebar-muted">
          Track cryptocurrency prices, trends, and market activity in real time.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <Badge shape="rounded" size="md">
          Data provided by CoinGecko API
        </Badge>
        <Button
          aria-label="Export market data as CSV"
          disabled
          title="Use an asset detail page to export its price history"
          leadingIcon={<FiDownload aria-hidden="true" className="size-3" />}
        >
          Export CSV
        </Button>
      </div>
    </section>
  );
}
