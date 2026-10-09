import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export type WatchlistState = {
  favoriteIds: string[];
  hydrated: boolean;
};

const initialState: WatchlistState = {
  favoriteIds: [],
  hydrated: false,
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<string>) {
      if (!state.favoriteIds.includes(action.payload)) {
        state.favoriteIds.push(action.payload);
      }
    },
    hydrateWatchlist(state, action: PayloadAction<string[]>) {
      state.favoriteIds = [...new Set(action.payload)];
      state.hydrated = true;
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.favoriteIds = state.favoriteIds.filter((id) => id !== action.payload);
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const index = state.favoriteIds.indexOf(action.payload);
      if (index >= 0) {
        state.favoriteIds.splice(index, 1);
      } else {
        state.favoriteIds.push(action.payload);
      }
    },
  },
});

export const {
  addFavorite,
  hydrateWatchlist,
  removeFavorite,
  toggleFavorite,
} = watchlistSlice.actions;

export const selectFavoriteIds = (state: RootState) => state.watchlist.favoriteIds;
export const selectWatchlistHydrated = (state: RootState) => state.watchlist.hydrated;
export const selectIsFavorite = (state: RootState, assetId: string) =>
  state.watchlist.favoriteIds.includes(assetId);

export default watchlistSlice.reducer;
