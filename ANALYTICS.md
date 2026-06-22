# DopeCart Analytics

DopeCart uses the official `posthog-js` SDK for anonymous product analytics. Analytics is
disabled until a PostHog project token is provided.

## Enable analytics

Create a PostHog project, then set these variables in local `.env` and in Cloudflare Pages:

```text
VITE_POSTHOG_PROJECT_TOKEN=<your_project_token>
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_POSTHOG_SESSION_REPLAY=false
VITE_ANALYTICS_DEBUG=false
```

Use the EU host instead if that is where your PostHog project lives. The app keeps
`capture_pageview` disabled in the SDK and sends route pageviews through
`AnalyticsRouteTracker`, so React Router route changes are counted once.

## What gets tracked

PostHog autocapture is enabled for ordinary interactions. Important buttons also expose stable
`data-attr` names, such as `product_add`, `cart_open`, `cart_review_order`,
`checkout_confirm_order`, `tracking_view_receipt`, and `receipt_share_poster`.

The app sends named custom events for the core funnel:

- `$pageview` with `screen_name`, `screen_path`, and navigation type
- `category selected`
- `product added`
- `product quantity increased`
- `product quantity decreased`
- `product removed`
- `cart opened`
- `cart cleared`
- `checkout blocked`
- `checkout draft created`
- `tracking started`
- `tracking resumed`
- `tracking completed`
- `receipt opened`
- `receipt viewed`
- `share poster clicked`
- `poster generation started`
- `poster generated`
- `poster generation failed`
- `share sheet opened`
- `share cancelled`
- `share failed`
- `share fallback copied`
- `share fallback shown`
- `progress opened`
- `products browsed`

Cart mutation events report post-action cart totals, so the `cart_total_*` properties describe
what the cart contained after that click.

## Funnel to build in PostHog

Start with this funnel:

1. `$pageview` where `screen_name = home` or `screen_name = products`
2. `product added`
3. `cart opened`
4. `checkout draft created`
5. `tracking started`
6. `tracking completed`
7. `receipt viewed`
8. `share poster clicked`
9. `poster generated` or `share fallback copied`

This shows where visitors drop out between browsing, building a cart, completing the fake
delivery, and trying to share the poster.

## Live verification checklist

Run locally with `VITE_ANALYTICS_DEBUG=true`, or deploy with a real PostHog token and watch
PostHog Live Events. Verify one complete journey:

1. Open `/`.
2. Browse `/products`.
3. Add, increment, decrement, and remove a product.
4. Open `/cart`.
5. Continue to checkout and confirm the order.
6. Complete `/tracking`.
7. Open `/receipt`.
8. Click Share Poster.

Confirm the events appear in order, `data-attr` names appear on autocaptured button clicks, and
cart events show post-action totals.

## Privacy notes

The app does not collect payment, address, email, phone, UPI, card, login, or identity
information. Custom events send anonymous product IDs, categories, cart totals, order IDs, and
flow status only.

Session replay is disabled by default. If you enable it with
`VITE_POSTHOG_SESSION_REPLAY=true`, inputs stay masked and the app should remain free of personal
data fields.
