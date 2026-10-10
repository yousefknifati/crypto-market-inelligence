import type { Metadata } from "next";
import { getSiteUrl } from "./getSiteUrl";

export const watchlistMetadata: Metadata = {
  title: "Watchlist",
  description:
    "Monitor your saved cryptocurrency assets and their latest market performance.",
  alternates: { canonical: new URL("/watchlist", getSiteUrl()) },
  robots: { index: false, follow: true },
};
