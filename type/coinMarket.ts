export type CoinMarketRoi = {
  currency?: string | null;
  percentage?: number | null;
  times?: number | null;
};

export type CoinMarketSparkline = {
  price?: Array<number | null> | null;
};

export type CoinMarket = {
  ath?: number | null;
  ath_change_percentage?: number | null;
  ath_date?: string | null;
  atl?: number | null;
  atl_change_percentage?: number | null;
  atl_date?: string | null;
  circulating_supply?: number | null;
  current_price?: number | null;
  fully_diluted_valuation?: number | null;
  high_24h?: number | null;
  id: string;
  image?: string | null;
  last_updated?: string | null;
  low_24h?: number | null;
  market_cap?: number | null;
  market_cap_change_24h?: number | null;
  market_cap_change_percentage_24h?: number | null;
  market_cap_rank?: number | null;
  max_supply?: number | null;
  name: string;
  price_change_24h?: number | null;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  roi?: CoinMarketRoi | null;
  sparkline_in_7d?: CoinMarketSparkline | null;
  symbol: string;
  total_supply?: number | null;
  total_volume?: number | null;
};

export type CoinMarketsResponse = CoinMarket[];

export type CoinMarketsErrorResponse = {
  message: string;
};
