"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import {
  readWatchlistFromStorage,
  writeWatchlistToStorage,
} from "@/lib/storage/watchlistStorage";
import { hydrateWatchlist } from "@/store/features/watchlistSlice";
import { makeStore, type AppStore } from "@/store/store";

type ReduxProviderProps = {
  children: ReactNode;
};

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Suspense
      fallback={
        <div role="status" className="flex min-h-dvh items-center justify-center bg-slate-50 text-sm text-sidebar-muted">
          Loading dashboard...
        </div>
      }
    >
      <WatchlistStoreProvider>{children}</WatchlistStoreProvider>
    </Suspense>
  );
}

function WatchlistStoreProvider({ children }: ReduxProviderProps) {
  // Redux generates internal random action IDs during store creation. Keep this
  // component below Suspense so Next.js can defer it during prerendering.
  const [store] = useState<AppStore>(makeStore);

  useEffect(() => {
    store.dispatch(hydrateWatchlist(readWatchlistFromStorage()));

    return store.subscribe(() => {
      const { favoriteIds, hydrated } = store.getState().watchlist;
      if (hydrated) writeWatchlistToStorage(favoriteIds);
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
