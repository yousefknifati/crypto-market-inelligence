export type CoinPricesResponse = {
  [coinId: string]: { usd?: number | null } | undefined;
};
