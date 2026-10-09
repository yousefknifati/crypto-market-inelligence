This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Configure these server-side variables in `.env.local` and in your deployment environment:

```dotenv
COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_DEMO_API_KEY=your_demo_api_key
```

The `.env.local` file is ignored by Git. The API base URL is configurable;
the `/simple/price` endpoint path stays in the request module.

Import `getBitcoinPrice` from `@/lib/api/getBitcoinPrice` in server-side code.
Pass one asset ID, a comma-separated string, or an array of IDs:

```ts
const prices = await getBitcoinPrice(["bitcoin", "ethereum", "solana"]);
const ethereumPrice = prices.ethereum?.usd;
```

It uses CoinGecko's `/api/v3/simple/price` endpoint with the supplied `ids` and
`vs_currencies=usd` through Axios. It returns the response body keyed by asset ID;
missing assets/prices remain absent rather than becoming zero. It rejects empty
input, missing configuration, and HTTP errors, with a 10-second request timeout.
The response type is defined in `type/coinPrices.ts`.
Axios does not use Next.js fetch caching options;
configure rendering/caching in the calling route when integrating this helper.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Global providers

The server root layout directly wraps its children in `ReactQueryProvider`.
It mounts one React Query client (created with `useState`),
the `#1b86be` navigation loader, and one `AppToaster`. The toaster dynamically
loads `react-hot-toast` with SSR disabled inside its client component.
Toasts appear at the top-right, wrap long messages, and use the existing CSS
theme variables so they follow the system light/dark preference.

The website uses English; no localization provider or language switching is installed.

React Query is available for future interactive data flows. Existing
server-side Axios helpers remain on the server and are not registered as
browser query functions.

## Binance live prices

Set the public market-stream URL in `.env.local` and your deployment environment:

```dotenv
NEXT_PUBLIC_BINANCE_WS_URL=wss://stream.binance.com:9443
```

Call `useBinancePrices(["btcusdt", "ethusdt"])` inside a Client Component to get
`{ status, prices }`. Prices are indexed by uppercase trading pair, for example
`prices.BTCUSDT?.price`. Use Binance trading pairs, not CoinGecko asset IDs.
USDT pairs are quoted in USDT, not USD. Price strings preserve decimal precision.

The hook uses the browser's native WebSocket with Binance combined `miniTicker`
streams, validates incoming events, reconnects with capped exponential backoff,
and closes the connection and clears retry timers on unmount or symbol changes.
Browser WebSocket handles protocol ping/pong frames automatically.
Connection status is `connecting`, `connected`, `reconnecting`, or `disconnected`.
During reconnection, retained prices are stale; consumers should show the status.
An empty symbol list or missing URL leaves it disconnected.

The sidebar's isolated `ConnectionStatus` component uses the hook with BTCUSDT
to show the real connection status. Frequent price updates stay within that
component. The badge does not claim a measured uptime percentage.

## Sidebar

`components/sidebar/Sidebar.tsx` provides the screenshot-based navigation with
`react-icons`, active routes, a bottom support section, and a compact icon rail
below the small breakpoint. The root layout mounts it beside the page content.
Market Overview and Watchlist are connected to their routes; both pages are
currently empty shells. Other navigation/support actions remain disabled until
their destinations exist. The small brand wordmark is text, pending a logo asset.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
