export type BinanceConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export type BinancePrice = {
  symbol: string;
  price: string;
  eventTime: number;
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
