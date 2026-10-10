const LOCAL_SITE_URL = new URL("http://localhost:3000");

function parseSiteUrl(value: string | undefined): URL | null {
  if (!value) return null;

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return new URL(url.origin);
  } catch {
    return null;
  }
}

export function getSiteUrl(): URL {
  return (
    parseSiteUrl(process.env.SITE_URL) ??
    parseSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    LOCAL_SITE_URL
  );
}

export function isSiteIndexable(siteUrl = getSiteUrl()): boolean {
  return siteUrl.hostname !== "localhost" && siteUrl.hostname !== "127.0.0.1";
}
