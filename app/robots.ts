import type { MetadataRoute } from "next";
import { getSiteUrl, isSiteIndexable } from "@/lib/seo/getSiteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (!isSiteIndexable(siteUrl)) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl.origin,
  };
}
