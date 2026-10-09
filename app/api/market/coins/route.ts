import axios from "axios";
import { getCoinGeckoMarkets } from "@/lib/api/getCoinGeckoMarkets";

export async function GET() {
  try {
    const data = await getCoinGeckoMarkets();

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    const upstreamStatus = axios.isAxiosError(error) ? error.response?.status : undefined;
    console.error("CoinGecko markets request failed", { upstreamStatus });

    return Response.json(
      { message: "Unable to load cryptocurrency markets from CoinGecko." },
      { status: upstreamStatus === 429 ? 429 : 502 },
    );
  }
}
