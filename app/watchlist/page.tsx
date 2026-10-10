import type { Metadata } from "next";
import WatchlistContent from "@/components/watchlist/WatchlistContent";

export const metadata: Metadata = {
  title: "Watchlist | Crypto Market Intelligence",
  description: "Monitor your saved cryptocurrency assets and their latest market performance.",
  alternates: { canonical: "/watchlist" },
};

export default function WatchlistPage() {
  return <WatchlistContent />;
}
