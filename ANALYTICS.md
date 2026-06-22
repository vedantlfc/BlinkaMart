# DopeCart Analytics

DopeCart uses a lightweight PostHog integration for product analytics. It is disabled until a
PostHog project token is provided.

## Enable analytics

Create a PostHog project, then set these variables in your local `.env` and in Cloudflare Pages:

```text
VITE_POSTHOG_PROJECT_TOKEN=<your_project_token>
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_POSTHOG_SESSION_REPLAY=false
VITE_ANALYTICS_DEBUG=false
```

Use the EU host instead if that is where your PostHog project lives.

## What gets tracked

PostHog autocapture is enabled for ordinary button/link/form interactions. The app also sends
named events for the important funnel:

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
9. `share sheet opened`

This shows where visitors drop out between browsing, building a cart, completing the fake delivery,
and trying to share the poster.

## Privacy notes

The app does not collect payment, address, email, or login information. The custom events send
anonymous product IDs, categories, cart totals, order IDs, and flow status only.

Session replay is disabled by default. If you enable it with
`VITE_POSTHOG_SESSION_REPLAY=true`, keep inputs masked and avoid collecting any personal fields.
