import type {
  CoinGeckoGlobalMarketResponse,
  GlobalMarketErrorResponse,
} from "@/type/globalMarket";

function isGlobalMarketResponse(value: unknown): value is CoinGeckoGlobalMarketResponse {
  return typeof value === "object" && value !== null && "data" in value;
}

function isErrorResponse(value: unknown): value is GlobalMarketErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}

export async function getGlobalMarketData(): Promise<CoinGeckoGlobalMarketResponse> {
  const response = await fetch("/api/market/global", {
    headers: { Accept: "application/json" },
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      isErrorResponse(body) ? body.message : "Unable to load global market data.",
    );
  }

  if (!isGlobalMarketResponse(body)) {
    throw new Error("CoinGecko returned an invalid global market response.");
  }

  return body;
}
