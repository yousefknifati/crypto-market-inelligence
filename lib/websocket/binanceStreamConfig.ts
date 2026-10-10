const DEFAULT_BINANCE_STREAM_BASE_URL =
  "wss://data-stream.binance.vision";

const configuredStreamBaseURL =
  process.env.NEXT_PUBLIC_BINANCE_WS_URL?.trim();

export const BINANCE_STREAM_BASE_URL =
  configuredStreamBaseURL || DEFAULT_BINANCE_STREAM_BASE_URL;

export function createBinanceCombinedStreamURL(
  symbols: readonly string[],
  streamName: "miniTicker" | "trade",
): string {
  const streams = symbols
    .map((symbol) => symbol.trim().toLowerCase())
    .filter(Boolean)
    .map((symbol) => `${symbol}@${streamName}`)
    .join("/");

  return `${BINANCE_STREAM_BASE_URL.replace(/\/+$/, "")}/stream?streams=${streams}`;
}
