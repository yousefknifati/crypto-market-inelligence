import type { Metadata } from "next";
import { getSiteUrl, isSiteIndexable } from "./getSiteUrl";

const siteUrl = getSiteUrl();
const siteIsIndexable = isSiteIndexable(siteUrl);

export const siteMetadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Crypto Market Intelligence",
  title: {
    default: "Crypto Market Intelligence",
    template: "%s | Crypto Market Intelligence",
  },
  description:
    "Track cryptocurrency prices, market rankings, historical trends, live updates, and personal watchlists.",
  robots: siteIsIndexable
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
      },
};
