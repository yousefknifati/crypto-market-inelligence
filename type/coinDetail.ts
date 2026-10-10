export type CoinDetailMarketData = {
  fully_diluted_valuation?: { usd?: number | null } | null;
  ath?: { usd?: number | null } | null;
  atl?: { usd?: number | null } | null;
  circulating_supply?: number | null;
  current_price?: { usd?: number | null } | null;
  high_24h?: { usd?: number | null } | null;
  low_24h?: { usd?: number | null } | null;
  market_cap?: { usd?: number | null } | null;
  max_supply?: number | null;
  price_change_24h?: number | null;
  price_change_percentage_24h?: number | null;
  price_change_percentage_7d?: number | null;
  total_supply?: number | null;
  total_volume?: { usd?: number | null } | null;
};

export type CoinDetail = {
  categories?: Array<string | null> | null;
  description?: { en?: string | null } | null;
  id: string;
  image?: {
    large?: string | null;
    small?: string | null;
    thumb?: string | null;
  } | null;
  last_updated?: string | null;
  links?: { homepage?: Array<string | null> | null } | null;
  market_cap_rank?: number | null;
  market_data?: CoinDetailMarketData | null;
  name: string;
  symbol: string;
};

export type CoinMarketChart = {
  market_caps?: Array<[number, number | null]> | null;
  prices?: Array<[number, number | null]> | null;
  total_volumes?: Array<[number, number | null]> | null;
};
