import type { Metadata } from "next";
import { getSiteUrl } from "./getSiteUrl";
import { serializeJsonLd } from "./serializeJsonLd";

const homeTitle = "Real-Time Crypto Market Intelligence";
const homeDescription =
  "Discover and compare leading cryptocurrencies with fresh market rankings, price changes, trading volume, and live price updates.";

export const homeMetadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: { canonical: new URL("/", getSiteUrl()) },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: new URL("/", getSiteUrl()),
    siteName: "Crypto Market Intelligence",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: homeTitle,
    description: homeDescription,
  },
};

export function HomeStructuredData() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Crypto Market Intelligence",
    url: getSiteUrl().toString(),
    description: homeDescription,
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
    />
  );
}
