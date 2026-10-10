import WatchlistContent from "@/components/watchlist/WatchlistContent";
import { watchlistMetadata } from "@/lib/seo/watchlistMetadata";

export const metadata = watchlistMetadata;

export default function WatchlistPage() {
  return <WatchlistContent />;
}
