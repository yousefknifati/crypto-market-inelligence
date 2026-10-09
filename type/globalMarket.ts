export type GlobalCurrencyValues = Partial<Record<string, number | null>>;

export type CoinGeckoGlobalMarketData = {
  active_cryptocurrencies?: number | null;
  ended_icos?: number | null;
  market_cap_change_percentage_24h_usd?: number | null;
  market_cap_percentage?: GlobalCurrencyValues | null;
  markets?: number | null;
  ongoing_icos?: number | null;
  total_market_cap?: GlobalCurrencyValues | null;
  total_volume?: GlobalCurrencyValues | null;
  upcoming_icos?: number | null;
  updated_at?: number | null;
};

export type CoinGeckoGlobalMarketResponse = {
  data?: CoinGeckoGlobalMarketData | null;
};

export type GlobalMarketErrorResponse = {
  message: string;
};
