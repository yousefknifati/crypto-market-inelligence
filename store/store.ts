import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "@/store/features/watchlistSlice";

export const makeStore = () => configureStore({
  reducer: {
    watchlist: watchlistReducer,
  },
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
