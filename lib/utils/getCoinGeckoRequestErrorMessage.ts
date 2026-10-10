import axios from "axios";

export function getCoinGeckoRequestErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError(error)) return fallback;
  if (error.code === "ECONNABORTED") return `${fallback} The request timed out.`;

  const status = error.response?.status;
  return status ? `${fallback} Upstream status: ${status}.` : fallback;
}
