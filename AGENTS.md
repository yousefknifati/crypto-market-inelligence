# Crypto Market Intelligence - Agent Guide

## Project objective

Build a polished Real-Time Crypto Market Intelligence Dashboard based on the NMO Business Frontend Developer AI-Accelerated One-Day Challenge. Users must be able to discover assets, search and filter the market, inspect asset details, maintain a watchlist, and view live prices.

The challenge recommends an 8-10 hour timebox. Prioritize a complete, maintainable core experience over optional features. Each architectural choice must have a clear purpose and be explainable during review; do not add technologies just to satisfy a checklist.

This file records development requirements. Deployment and repository publication are final project deliverables, not actions to perform merely because this guide is read. Follow the scope of the user's current request.

## Required stack and boundaries

- Use Next.js App Router and TypeScript.
- Prefer React Server Components; add Client Components only where browser APIs or interaction require them.
- Use Redux Toolkit for meaningful shared browser state, especially the watchlist. Keep server-fetched market data on the server when Next.js data primitives are sufficient.
- Use Framer Motion / Motion for purposeful transitions and micro-interactions, respecting `prefers-reduced-motion`.
- Maintain the existing Tailwind CSS styling strategy with consistent, mobile-first layouts.
- Use CoinGecko's public REST API or an equivalent genuinely free market-data source. Use Binance public WebSocket streams for live prices. Document any equivalent free replacement and the reason for switching.

## Required product behavior

### Market overview: `/`

- Render primary market data on the server so it is crawlable.
- Support search by asset name or symbol.
- Provide at least two meaningful filter/sort options, such as market cap, price change, or volume.
- Provide responsive cards or a table with usable mobile behavior.
- Handle loading, empty, error, and retry states explicitly.
- Use pagination or incremental loading to keep the DOM controlled.

### Asset details: `/market/[id]`

- Show core market statistics and source attribution.
- Include a lightweight historical trend/chart when supported by the chosen API.
- Generate asset-specific SEO metadata from the asset data.
- Use an explicit caching/revalidation strategy and explain it in the README.
- Return proper not-found behavior for invalid asset IDs.

### Watchlist: `/watchlist`

- Support adding and removing assets through a Redux Toolkit slice with focused actions and selectors.
- Persist favorites in `localStorage` or another browser-side mechanism.
- Restore persisted state safely without server/client hydration mismatches.

### Live market widget

- Connect to a public WebSocket stream for one or more selected symbols.
- Show connected, reconnecting, and disconnected states.
- Implement reconnect behavior and clean up subscriptions, connections, and reconnect timers on unmount or subscription changes.
- Keep frequent price updates isolated so unrelated application UI does not rerender.

## Rendering, data, and state design

- At least one route must use request-time SSR for a documented freshness or request-specific reason.
- At least one data-driven route must use ISR with an explicit revalidation policy and a documented freshness/performance trade-off.
- Identify server/browser boundaries and caching behavior in the README. Verify the installed Next.js APIs before implementing rendering or caching choices.
- Keep data access, UI, state, utilities, and domain types separate. Avoid oversized components, duplicate business logic, and a single oversized Redux slice.
- Use shared client state for favorites, preferences, selected live symbols, or filters only when sharing is useful.
- If RTK Query is introduced, document why it fits that data flow better than direct server fetching.
- Type external API responses and component contracts. Centralize reusable domain types, avoid broad `any` usage, and handle nullable/missing fields defensively.

Suggested organization from the challenge; adapt to existing project conventions rather than reorganizing unrelated code:

```text
app/
  page.tsx
  market/[id]/page.tsx
  watchlist/page.tsx
components/
  market/
  live/
  ui/
store/
  store.ts
  features/watchlistSlice.ts
lib/
  api/
  seo/
  utils/
hooks/
types/
styles/
```

## Performance expectations

- Use `useMemo` for genuinely expensive derived calculations, such as sorting/filtering larger collections.
- Use `useCallback` where stable callback identity prevents unnecessary child rerenders.
- Use `React.memo` on at least one repeated component where it has measurable or well-reasoned value.
- Keep selectors focused; memoize derived state only when it helps.
- Explain the selected optimizations in the README and avoid blanket memoization.
- Minimize client boundaries, use `next/image` where applicable, and lazy-load noncritical UI.
- Contain WebSocket-driven updates and avoid leaking connections.

## SEO, accessibility, and resilience

- Use the Next.js Metadata API for unique home/detail titles and descriptions, canonical URLs, Open Graph metadata, and dynamic asset metadata.
- Provide sitemap and robots files using Next.js conventions.
- Add JSON-LD where semantically appropriate; keep primary content server-rendered with a correct heading hierarchy.
- Ensure keyboard-accessible navigation and controls, visible focus states, labeled inputs and icon-only buttons, sufficient contrast, and reduced-motion support.
- Do not communicate critical information through color alone.
- Verify layouts at common mobile, tablet, and desktop widths.
- Handle REST failures gracefully with a retry path and expose WebSocket connection failures clearly.
- Avoid uncaught errors during the normal user journey. Never commit credentials, tokens, private keys, or paid API keys.

## Verification

- Before declaring implementation ready, run `npm run lint` and `npm run build`; both must pass.
- Smoke-test the main journey: market search/filter/sort and pagination, asset details and invalid IDs, watchlist persistence across reloads, and live-price connection/reconnection behavior.
- Check responsive layouts, keyboard navigation, reduced motion, hydration behavior, and browser console errors.
- Add targeted tests for selectors, critical components, or transformations when time permits.
- Report checks actually performed and any remaining limitations. A successful build alone does not establish visual or interaction correctness.
- The final submission must build from a clean checkout.

## README and final deliverables

The completed challenge requires a public deployment on a compatible free hosting tier, a GitHub/GitLab repository accessible to the reviewer, and a technical README. The deployed application must be reachable without a paid account; screenshots or a prototype alone are insufficient.

Keep the README aligned with the implementation and include:

- Project overview, live URL, tech stack, local setup commands, environment variables without secrets, and deployment instructions.
- REST and WebSocket sources, including any substitutions and their reasons.
- Architecture diagram or written data flow, SSR/ISR/client rendering decisions, caching/revalidation policy, and Redux state design.
- Performance decisions explaining where `useMemo`, `useCallback`, and `React.memo` help.
- SEO implementation and accessibility considerations.
- An **AI Usage** section naming the tools used, what they accelerated, and at least one actual AI suggestion rejected or corrected. Do not invent an example.
- Known limitations, timebox trade-offs, and what should improve with another day.

AI assistance is encouraged, but every generated line and dependency must be reviewed and understood. Favor changes whose architecture and behavior the candidate can defend.

## Optional improvements

Only after the required experience is complete, consider automated tests, error boundaries and useful logging, offline/PWA support, theme support, justified list virtualization, measured Core Web Vitals/Lighthouse improvements, or CI for lint, typecheck, and build.

## Installed Next.js guidance

Preserve the generated block below and consult the local version-specific documentation before writing application code.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
