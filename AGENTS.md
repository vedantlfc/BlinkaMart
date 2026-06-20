# AGENTS.md

## Scope

These instructions apply to the whole repository. There are no nested
instruction files at the moment, so keep project guidance in this root file
unless the repo grows into clearly separate packages.

## Project Shape

- DopeCart is a frontend-only Vite + React + TypeScript mobile web app.
- The core routes live in `src/App.tsx`: `/`, `/products`, `/cart`, `/checkout`,
  `/tracking`, `/receipt`, and `/progress`.
- State is local and anonymous. Cart, settings, current order, and progress are
  persisted through `localStorage` providers under `src/state/`.
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
- If copy in `Design_Doc.txt` conflicts with the current app, prefer the current
  implemented behavior and recent user direction. The design doc contains older
  wording that is no longer always source-of-truth for visible copy.

## UI And Product Direction

- Design mobile-first and keep the desktop experience centered in the
  `--app-max-width` app frame.
- Keep the style playful and original. Do not clone Blinkit, Zepto, Instamart,
  or any real quick-commerce brand.
- Current browse layout expectations:
  - Categories use a compact single-row horizontal icon rail.
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
  including product cards, cart, checkout, receipt, progress, and share text.

## Order Flow Rules

- Preserve the main loop: Home -> Products -> Cart -> Checkout -> Tracking ->
  Receipt -> Share/Progress.
- Checkout must stay fieldless. It should have 0 `input`, `textarea`, and
  `select` elements unless the user explicitly changes the product direction.
- Tracking simulates a realistic delivery-style flow: order received, packing,
  delivery partner assigned, ETA, map movement, then lost near Self Control
  Signal.
- Complete tracking only once per order. The cart should clear after completion,
  while the receipt continues to render from the saved order snapshot.
- Receipt/progress recording must not double-count on refresh or route changes.

## Validation Expectations

For most UI or behavior changes, run:

```powershell
npm.cmd run generate:catalog
npm.cmd run build
```

For visual or route-flow changes, also verify in a browser at mobile width
around `390x844` and desktop width around `1280x900`:

- Home, Products, Cart, Checkout, Tracking, Receipt, and Progress render.
- Search still works for representative queries such as `momos`, `BhookBoss`,
  `salary`, `coffee`, `cable`, and `stress`.
- Category filtering and cart add/increment/decrement/remove controls work.
- Checkout has 0 form fields.
- Tracking reaches the final lost-order state and then receipt.
- Cart clears after tracking completion, and receipt keeps order details.
- Hidden calories stay hidden through the full flow.
- No horizontal overflow, console errors, JavaScript dialogs, broken product
  images, visible `fake/Fake`, or repeated disclaimer copy.

Save screenshots for substantial visual passes under `.qa-screenshots/`; that
directory is intentionally ignored by git.

## Deployment Notes

- This app uses React Router with browser-history routing.
- If deploying to Netlify or another static host, deep links such as `/cart` and
  `/receipt` need an SPA fallback, for example `public/_redirects` containing
  `/* /index.html 200`.
- The usual deployment shape is build command `npm run build` and publish
  directory `dist`.

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
