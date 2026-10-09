export type BinanceConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export type BinancePrice = {
  symbol: string;
  price: string;
  priceChangePercent: number;
  eventTime: number;
  receivedAt: number;
};

export type BinancePriceState = {
  status: BinanceConnectionStatus;
  prices: Partial<Record<string, BinancePrice>>;
};

export type BinancePriceSubscription = {
  baseURL: string;
  symbols: readonly string[];
  onState: (state: BinancePriceState) => void;
};
