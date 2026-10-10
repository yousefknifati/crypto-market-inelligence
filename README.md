This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Asset detail presentation

## Watchlist

`/watchlist` restores favorite CoinGecko IDs from the existing Redux/localStorage
flow, then requests only those assets through `/api/market/coins?ids=...`. The
server route forwards the IDs to CoinGecko's `/coins/markets` endpoint so the
browser never receives the API key and the page does not download unrelated
market rows. The response is cached by React Query for 60 seconds while the IDs
remain in Redux as the only shared watchlist state.

The page includes saved/gainer/performance summaries, search, sorting, links to
asset details, and removal through the shared table row. Restoring, loading,
empty, filtered-empty, missing-data, and retryable error states are distinct.
Motion provides a small state transition and uses `useReducedMotion` to disable
movement when requested. The initial server/client render masks persisted values
until hydration completes, preventing localStorage-driven attribute mismatches.

Route content uses a short fade and vertical reveal to orient users after
navigation. Market summary and fundamental metric cards use a reusable staggered
reveal with a two-pixel hover lift, while the market table uses a short entrance
to make new results easier to locate after an empty or loading state. Row hover
and keyboard-focus styles highlight the active asset, and the watchlist star
uses a small scale/rotation micro-interaction. `useReducedMotion` removes route,
card, table, and control transforms without removing non-motion visual feedback.

### Home SSR and detail ISR boundaries

On `/`, `MarketSnapshot` waits for a real request using Next.js `connection()`
and calls the uncached, server-only Axios `getCoinGeckoMarkets` helper directly.
This deliberately fetches current market-cap rankings per server request instead
of freezing the initial table at build time. The trade-off is an upstream API
request and its latency for each page request. A local Suspense boundary streams
the existing table skeleton while the surrounding dashboard can render.

The server passes the snapshot to `MarketDataTable`, whose initial rows are
included in server-rendered HTML. Its client boundary handles search, filters,
sorting, pagination, and watchlist interaction. The table no longer fetches a
duplicate snapshot with React Query or copies market responses into Redux.
An upstream failure renders an error with Retry; Retry uses `router.refresh()`
to fetch a new server snapshot. Empty successful responses remain distinct.
Browser filtering uses the fetched top 100 assets; it does not fetch on each
keystroke or automatically refresh on window focus.

`/market/[id]` retains its explicit ISR caching: 60-second revalidation and
300-second expiry. This reduces upstream traffic for repeated detail visits
while allowing modest staleness. Revalidation is demand-driven, not polling.
The existing `/api/market/coins` response cache is bypassed by home SSR.

The asset detail page composes reusable summary, chart panel, action, and metric
components. Summary and fundamental data stay server-rendered. The chart panel
is a client boundary for selecting 24H/7D and fullscreen; it filters the existing
seven-day hourly response with `useMemo`. Detail requests retain their existing
60-second revalidation and 300-second expiry policy.

Watchlist actions use the existing Redux persistence. CSV export contains actual
timestamp/price observations, not OHLCV candles. Sharing copies the asset URL.
Alerts, candles, depth, and longer chart periods are visibly disabled because
their data or service is not integrated. Network health displays an unavailable
state; source attribution is CoinGecko. The breadcrumb feed badge reports the
shared Binance BTC stream's actual connection state, not asset-specific latency.

The supplied screenshots guided this layout using Codex. The design's static
live status, FIX protocol label, and oracle verification claim were corrected
to reflect the implemented sources rather than copied as factual claims.

## Getting Started

Configure these server-side variables in `.env.local` and in your deployment environment:

```dotenv
COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_DEMO_API_KEY=your_demo_api_key
SITE_URL=https://your-public-domain.example
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

## SEO

The home route and every asset-detail route publish unique titles, descriptions,
canonical URLs, Open Graph fields, and Twitter card metadata through the Next.js
Metadata API. Asset metadata is generated from the server-fetched CoinGecko
record. Home content and asset statistics are present in the server-rendered HTML,
with one page-level `h1` and ordered section headings.

Next.js serves `robots.txt` from `app/robots.ts` and `sitemap.xml` from
`app/sitemap.ts`. The sitemap includes the home page and available asset-detail
URLs. Home emits `WebSite` JSON-LD; detail pages emit `Dataset` and breadcrumb
JSON-LD with CoinGecko attribution. JSON-LD values are serialized with `<`
characters escaped before insertion into the script element.

Set `SITE_URL` to the public production origin so canonical URLs, structured data,
robots, and sitemap entries use the deployed domain. If no public origin is
configured, local builds deliberately emit `noindex` metadata, disallow crawling
in `robots.txt`, and return an empty sitemap. Vercel production URL variables are
used automatically when present.

## Accessibility and resilience

The dashboard provides a skip link, visible keyboard focus, labeled search and
sort fields, names for icon-only controls, and a mobile navigation drawer that
traps focus, closes with Escape, and restores focus to its trigger. The market
chart supports pointer inspection plus Left/Right, Home, and End keyboard
navigation. Statuses and price directions include text, signs, or icons so color
is not the only cue. Motion transitions and skeleton animation respect the
operating system's reduced-motion preference.

REST-backed views distinguish loading, error, empty, and missing-field states.
Retry actions are available for the market overview, summary, watchlist, asset
details, and historical chart. Binance streams expose connecting, reconnecting,
connected, and disconnected labels, retry with capped backoff, clean up sockets
and timers, and reject invalid stream configuration without throwing into the
React tree. Nullable numeric fields render as `Unavailable` instead of fabricated
zero values.

Secrets stay in ignored `.env.local` files or deployment environment variables.
Only placeholder values are documented; public WebSocket URLs are safe to expose
through `NEXT_PUBLIC_` configuration.

## Performance decisions

`MarketDataTable` memoizes the search, filter, and sort pipeline because it can
process and reorder up to 100 market rows on each interactive change. The
watchlist memoizes its ID lookup and visible sorting pipeline, and the detail
chart memoizes its 24-hour slice of the seven-day series. These are the derived
collections whose repeated work grows with the response size.

`MarketTableRow` uses `React.memo` because rows repeat and retain stable asset
object references while unrelated table controls change. Each row also selects
only its own favorite boolean, so toggling one favorite does not make every row
respond to the Redux update. `HeaderToolbar` and `LiveTicker` are memoized around
the high-frequency header stream, while stable drawer callbacks are supplied
with `useCallback`. Small fixed-size operations, such as finding the latest item
among three or four live symbols, remain plain calculations to avoid premature
memoization.

Pages and data-fetching components remain Server Components. Client boundaries
are limited to browser state, WebSocket subscriptions, Redux persistence, chart
interaction, and retry controls; nested accessibility hooks inherit their client
owner instead of declaring additional boundaries. CoinGecko logos use
`next/image`. The noncritical live-price widget and toast renderer are loaded
with `next/dynamic` and render lightweight fallbacks while their client code
loads.

Frequent Binance updates stay inside `MarketHeader`, `ConnectionStatus`, or
`LivePriceStream`; they are not copied into Redux or a page-level context. This
keeps market tables, summary cards, asset details, and watchlist content outside
the WebSocket render path. Sockets and reconnect timers are cleaned up whenever
their owning component unmounts or its subscription changes.

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
