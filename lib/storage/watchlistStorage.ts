const WATCHLIST_STORAGE_KEY = "crypto-market-intelligence:watchlist";

export function readWatchlistFromStorage(): string[] {
  try {
    const storedValue = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return [];

    return [...new Set(
      parsedValue.filter(
        (value): value is string => typeof value === "string" && value.trim() !== "",
      ),
    )];
  } catch {
    return [];
  }
}

export function writeWatchlistToStorage(favoriteIds: readonly string[]) {
  try {
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch {
    // The in-memory watchlist remains usable when storage is unavailable.
  }
}
