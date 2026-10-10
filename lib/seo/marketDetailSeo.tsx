import type { Metadata } from "next";
import { getCoinGeckoCoinDetail } from "@/lib/api/getCoinGeckoCoinDetail";
import type { CoinDetail } from "@/types/coinDetail";
import { getSiteUrl } from "./getSiteUrl";
import { serializeJsonLd } from "./serializeJsonLd";

export async function generateMarketDetailMetadata(
  id: string,
): Promise<Metadata> {
  const asset = await getCoinGeckoCoinDetail(id);

  if (!asset) {
    return {
      title: "Asset not found",
      robots: { index: false, follow: false },
    };
  }

  const description = `Live ${asset.name} (${asset.symbol.toUpperCase()}) price, market statistics, and seven-day trend.`;
  const title = `${asset.name} Price & Market Data`;
  const canonicalUrl = new URL(
    `/market/${encodeURIComponent(asset.id)}`,
    getSiteUrl(),
  );

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Crypto Market Intelligence",
      type: "website",
      images: asset.image?.large
        ? [{ url: asset.image.large, alt: `${asset.name} logo` }]
        : [],
    },
    twitter: {
      card: asset.image?.large ? "summary_large_image" : "summary",
      title,
      description,
      images: asset.image?.large ? [asset.image.large] : undefined,
    },
  };
}

export function MarketDetailStructuredData({
  asset,
  description,
}: {
  asset: CoinDetail;
  description: string;
}) {
  const symbol = asset.symbol.toUpperCase();
  const assetDescription =
    description ||
    `Current ${asset.name} price, market statistics, and historical trend data.`;
  const siteUrl = getSiteUrl();
  const assetUrl = new URL(
    `/market/${encodeURIComponent(asset.id)}`,
    siteUrl,
  ).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        "@id": `${assetUrl}#dataset`,
        name: `${asset.name} (${symbol}) market data`,
        description: assetDescription,
        url: assetUrl,
        image: asset.image?.large || undefined,
        dateModified: asset.last_updated || undefined,
        keywords: [asset.name, symbol, "cryptocurrency", "market data"],
        creator: {
          "@type": "Organization",
          name: "CoinGecko",
          url: "https://www.coingecko.com/",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Market Overview",
            item: siteUrl.toString(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: asset.name,
            item: assetUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  );
}
