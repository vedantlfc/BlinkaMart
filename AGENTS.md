# AGENTS.md

## Scope

These instructions apply to the whole repository. Codex loads repository
guidance from the project root downward, and there are no nested instruction
files right now, so keep project guidance in this root file unless the repo
grows into clearly separate packages.

Keep this file operational: setup, commands, architecture, product rules, and
validation expectations. Do not turn it into a changelog, long prompt, or
feature spec. If a future subtree needs different commands or ownership rules,
add a nested `AGENTS.md` or `AGENTS.override.md` close to that subtree and keep
this root file focused on shared expectations.

## Project Shape

- DopeCart is a frontend-only Vite + React + TypeScript mobile web app.
- It is also PWA-capable through `vite-plugin-pwa`, generated icons in
  `public/pwa/`, and the static-host SPA fallback in `public/_redirects`.
- The core routes live in `src/App.tsx`: `/`, `/products`, `/cart`, `/checkout`,
  `/tracking`, `/receipt`, and `/progress`.
- State is local and anonymous. Cart, settings, current order, and progress are
  persisted through `localStorage` providers under `src/state/`.
- Optional anonymous analytics lives in `src/lib/analytics.ts`, route pageviews
  are sent from `src/components/AnalyticsRouteTracker.tsx`, and detailed event
  guidance lives in `ANALYTICS.md`.
- The app should stay no-login and should never ask for address, phone, payment,
  UPI, card, or identity details.
- The visible product stance is parody-first. Keep the top-right `Parody app`
  badge as the primary signal, and do not reintroduce visible `fake/Fake`,
  repeated "no real order", "no payment", or "no delivery" disclaimer copy.
- The legacy localStorage keys under the `blinkamart.*` namespace are
  intentionally preserved for compatibility. Do not rename them unless you also
  write and verify a migration.

## Commands

- Install dependencies with `npm.cmd install` on Windows.
- Start development with `npm.cmd run dev`.
- Regenerate the catalog with `npm.cmd run generate:catalog`.
- Regenerate PWA icons with `npm.cmd run generate:pwa-icons`.
- Build with `npm.cmd run build`.
- Preview a production build with `npm.cmd run preview`.
- On this Windows setup, Vite/esbuild may fail with `Error: spawn EPERM` in the
  normal sandbox. If that happens, rerun the same command through the approved
  elevated PowerShell path rather than treating it as an app failure.

## Catalog And Assets

- Treat `products/product_list.csv` as the source of truth for product data.
- Treat `public/product-images/` as the source used by the app at runtime.
- Product image paths in generated data should stay `/product-images/{id}.jpg`.
- Do not hand-edit `src/data/catalog.ts` for product changes. Update the CSV or
  generator, then run `npm.cmd run generate:catalog`.
- The generator expects 150 products, 10 categories, 15 products per category,
  valid public images, numeric prices/calories, and 0 calories for non-food or
  emotional-purchase categories.
- Category icons live under `public/category-icons/` and are mapped from current
  generated category ids in `src/data/categoryIcons.ts`.
- The app logo source for the header and generated PWA icons is
  `public/dopecart-logo-web.svg`.
- If the logo changes, rerun `npm.cmd run generate:pwa-icons` and verify the
  generated PNGs in `public/pwa/`.
- Shared cart/coupon art lives in `public/dopecart-*.svg`. If a route-map marker
  asset exists, still check `src/components/DeliveryRouteMap.tsx`; the live
  marker may be drawn inline rather than referenced as an image.
- If copy in `Design_Doc.txt` conflicts with the current app, prefer the current
  implemented behavior and recent user direction. The design doc contains older
  wording that is no longer always source-of-truth for visible copy.

## UI And Product Direction

- Design mobile-first and keep the desktop experience centered in the
  `--app-max-width` app frame.
- Keep the style playful and original. Do not clone Blinkit, Zepto, Instamart,
  or any real quick-commerce brand.
- Current browse layout expectations:
  - Categories use a compact single-row horizontal icon rail with an active
    underline and no product counts.
  - Products use a 2-column mobile grid.
  - Product images are first-class and should remain visible in browse, cart,
    checkout, tracking previews, and receipts where appropriate.
  - The fixed cart bar must not cover product controls or the final product row.
- Keep controls thumb-friendly on mobile. Add, increment, decrement, remove, and
  primary CTA controls should remain easy to tap at 390px width.
- Use existing design tokens in `src/styles/tokens.css` and existing component
  classes in `src/styles/global.css` before introducing new styling patterns.
- Avoid shame-heavy copy. The app can be funny and absurd, but should not shame
  hunger, food, spending, body size, or the user.
- Calories are optional UI. Respect `settings.showCalories` everywhere,
  including product cards, cart, checkout, receipt, progress, share poster, and
  share text.
- Page headers use India-time desk labels through `src/utils/cravingDesk.ts` and
  `src/components/PageHeader.tsx`. Preserve the `Asia/Kolkata` behavior when
  changing time-of-day copy.

## Order Flow Rules

- Preserve the main loop: Home -> Products -> Cart -> Checkout -> Tracking ->
  Receipt -> Share/Progress.
- Checkout must stay fieldless. It should have 0 `input`, `textarea`, and
  `select` elements unless the user explicitly changes the product direction.
- Tracking is a timestamp-based five-minute flow. It should resume after refresh
  instead of restarting.
- Tracking chronology should stay: order confirmed, packing, delivery partner
  search, delivery partner assigned, route movement, near Self Control Signal,
  then lost near Self Control Signal.
- Do not show an explicit countdown or visible timer in tracking. Qualitative
  status copy and route movement are okay.
- The route/map should not show the removed old labels/buttons such as
  "Fictional map", "Route active", or a full tracking timeline.
- Complete tracking only once per order. The cart should clear after completion,
  while the receipt continues to render from the saved order snapshot.
- Receipt/progress recording must not double-count on refresh or route changes.

## Receipt, Sharing, And PWA

- The share surface is the receipt poster in
  `src/components/ShareReceiptPoster.tsx`, exported from `ReceiptPage` with
  `html-to-image`.
- Poster export currently uses a 360x450 source rendered at 2x
  (`720x900`) with an 8-second generation timeout.
- Share text should include one app URL only. `VITE_DOPECART_PUBLIC_URL` can
  override the URL through `src/utils/publicAppUrl.ts`; otherwise the current
  origin is used.
- Native Web Share with files is best-effort. If file sharing is unavailable or
  poster generation times out, the app should fall back gracefully to link/text
  sharing without breaking the receipt.
- Do not add back the removed `Save Poster` or `Copy text` buttons unless the
  user explicitly asks.
- For PWA work, verify production output contains `manifest.webmanifest`,
  `registerSW.js`, `sw.js`, Workbox files, `/pwa` icons, `_redirects`, and
  product images.
- PWA installability and native share behavior should be checked on a deployed
  HTTPS URL when possible. Localhost is useful for smoke tests, but Android/iOS
  install/share behavior can differ.

## Analytics And Privacy

- Analytics uses `posthog-js` and is disabled until a PostHog token is provided.
  Environment examples live in `.env.example`; `.env` and `.env.*` are ignored
  and must not be committed with real tokens.
- Keep `capture_pageview: false` in the SDK config and send React Router
  pageviews through `AnalyticsRouteTracker` to avoid duplicate route events.
- Session replay is off by default through `VITE_POSTHOG_SESSION_REPLAY=false`.
  If it is enabled for a test or deployment, preserve input masking and the
  app's no-PII product direction.
- Custom analytics should stay anonymous and product-flow focused: product ids,
  categories, cart totals, order ids, route status, and share outcomes are okay;
  personal data, identity fields, payment data, addresses, phone numbers, and
  email addresses are not okay.
- Stable button instrumentation flows through the shared `Button` component's
  `analyticsName` prop, which renders as `data-attr`. If event names or
  `data-attr` values change, update `ANALYTICS.md` in the same change.

## Validation Expectations

For most UI or behavior changes, run:

```powershell
npm.cmd run generate:catalog
npm.cmd run build
```

For PWA icon, manifest, or logo changes, also run:

```powershell
npm.cmd run generate:pwa-icons
npm.cmd run build
```

For visual or route-flow changes, also verify in a browser at mobile width
around `390x844` and desktop width around `1280x900`:

- Home, Products, Cart, Checkout, Tracking, Receipt, and Progress render.
- Search still works for representative queries such as `momos`, `BhookBoss`,
  `salary`, `coffee`, `cable`, and `stress`.
- Category filtering and cart add/increment/decrement/remove controls work.
- Checkout has 0 form fields.
- Tracking keeps its five-minute chronology in normal mode and reaches the final
  lost-order state in accelerated local verification.
- Cart clears after tracking completion, and receipt keeps order details.
- Hidden calories stay hidden through the full flow, including the share poster
  and fallback share text.
- Share Poster either opens native sharing or falls back with a clear toast.
- Analytics changes should be verified with `VITE_ANALYTICS_DEBUG=true` locally
  or PostHog Live Events on a deployed build; confirm route pageviews are not
  duplicated and core button `data-attr` values still appear.
- No horizontal overflow, console errors, JavaScript dialogs, broken product
  images, visible `fake/Fake`, old `BlinkaMart` branding, or repeated disclaimer
  copy.

Save screenshots for substantial visual passes under `.qa-screenshots/`; that
directory is intentionally ignored by git.

## Deployment Notes

- This app uses React Router with browser-history routing.
- Static hosts need an SPA fallback for deep links such as `/cart`, `/tracking`,
  and `/receipt`. Keep `public/_redirects` for hosts that support it.
- The usual deployment shape is build command `npm run build` and publish
  directory `dist`.
- PWA installability requires HTTPS in normal mobile browsers.
- The service worker uses auto-update behavior and runtime-caches product images
  with a `CacheFirst` strategy. If product images or generated assets look stale,
  test a fresh build and consider service-worker/cache effects before assuming a
  React bug.

## Editing Norms

- Keep changes narrowly scoped to the user request.
- Do not revert unrelated user changes in the working tree.
- Do not stage, commit, push, or open a PR unless the user asks.
- Use `apply_patch` for manual edits.
- Prefer existing components and state helpers over new abstractions.
- Add dependencies only when they are clearly necessary and after calling out
  the tradeoff.
- Keep generated/build output such as `dist/` out of source edits unless the
  user specifically asks for deployment artifacts.
- Docs-only changes to this file do not need a full build unless the guidance
  depends on verifying command output, generated files, or runtime behavior.
