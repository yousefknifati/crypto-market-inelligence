export type BinanceTradeConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export type BinanceTradePayload = {
  e: "trade";
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  T: number;
  m: boolean;
  M: boolean;
};

export type BinanceCombinedTradeMessage = {
  stream: string;
  data: BinanceTradePayload;
};

export type BinanceLiveTrade = {
  eventTime: number;
  price: number;
  priceChangePercent: number | null;
  quantity: number;
  receivedAt: number;
  side: "buy" | "sell";
  symbol: string;
  tradeId: number;
};

export type BinanceTradeStreamState = {
  error: string | null;
  hasTimedOut: boolean;
  status: BinanceTradeConnectionStatus;
  trades: Partial<Record<string, BinanceLiveTrade>>;
};

export type BinanceTradeStreamSubscription = {
  onState: (state: BinanceTradeStreamState) => void;
  symbols: readonly string[];
  url: string;
};
