import type { MetadataRoute } from "next";
import { getCoinGeckoMarkets } from "@/lib/api/getCoinGeckoMarkets";
import { getSiteUrl, isSiteIndexable } from "@/lib/seo/getSiteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  if (!isSiteIndexable(siteUrl)) return [];

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: siteUrl.toString(),
    changeFrequency: "hourly",
    priority: 1,
  };

  try {
    const assets = await getCoinGeckoMarkets();

    return [
      homeEntry,
      ...assets.map((asset) => ({
        url: new URL(`/market/${encodeURIComponent(asset.id)}`, siteUrl).toString(),
        lastModified: asset.last_updated ?? undefined,
        changeFrequency: "hourly" as const,
        priority: 0.8,
        images: asset.image ? [asset.image] : undefined,
      })),
    ];
  } catch {
    return [homeEntry];
  }
}
