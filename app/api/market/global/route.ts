import { getCoinGeckoGlobalMarketData } from "@/lib/api/getCoinGeckoGlobalMarketData";

export async function GET() {
  try {
    const data = await getCoinGeckoGlobalMarketData();

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return Response.json(
      { message: "Unable to load global market data from CoinGecko." },
      { status: 502 },
    );
  }
}
