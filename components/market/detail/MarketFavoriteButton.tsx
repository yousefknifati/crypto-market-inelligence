"use client";

import { FiStar } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { selectIsFavorite, selectWatchlistHydrated, toggleFavorite } from "@/store/features/watchlistSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useHasHydrated } from "@/hooks/useHasHydrated";

type MarketFavoriteButtonProps = {
  assetId: string;
  assetName: string;
};

export default function MarketFavoriteButton({ assetId, assetName }: MarketFavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, assetId));
  const hydrated = useAppSelector(selectWatchlistHydrated);
  const hasHydrated = useHasHydrated();
  const watchlistReady = hasHydrated && hydrated;
  const displayedFavorite = watchlistReady && isFavorite;

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-indigo-200 text-primary"
      disabled={!watchlistReady}
      aria-pressed={displayedFavorite}
      aria-label={`${displayedFavorite ? "Remove" : "Add"} ${assetName} ${displayedFavorite ? "from" : "to"} watchlist`}
      leadingIcon={<FiStar aria-hidden="true" className={`size-4 ${displayedFavorite ? "fill-current text-amber-500" : ""}`} />}
      onClick={() => dispatch(toggleFavorite(assetId))}
    >
      {!watchlistReady ? "Restoring..." : displayedFavorite ? "In Watchlist" : "Watchlist"}
    </Button>
  );
}
