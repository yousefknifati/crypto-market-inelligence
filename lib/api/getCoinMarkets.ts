import type {
  CoinMarketsErrorResponse,
  CoinMarketsResponse,
} from "@/type/coinMarket";

function isCoinMarketsResponse(value: unknown): value is CoinMarketsResponse {
  return Array.isArray(value);
}

function isErrorResponse(value: unknown): value is CoinMarketsErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}

export async function getCoinMarkets(): Promise<CoinMarketsResponse> {
  const response = await fetch("/api/market/coins", {
    headers: { Accept: "application/json" },
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      isErrorResponse(body) ? body.message : "Unable to load cryptocurrency markets.",
    );
  }

  if (!isCoinMarketsResponse(body)) {
    throw new Error("CoinGecko returned an invalid markets response.");
  }

  return body;
}
