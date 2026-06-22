import posthog from "posthog-js";
import type { Product } from "../data/catalog";
import type { CartTotals } from "../state/cart";
import type { OrderSnapshot } from "../state/order";

type AnalyticsPrimitive = string | number | boolean | null | undefined;
type AnalyticsValue = AnalyticsPrimitive | AnalyticsPrimitive[];
export type AnalyticsProperties = Record<string, AnalyticsValue>;

const ANALYTICS_SCHEMA_VERSION = "2026-06-22";
const POSTHOG_DEFAULT_HOST = "https://us.i.posthog.com";
const POSTHOG_DEFAULTS_VERSION = "2026-01-30";

let analyticsInitialized = false;

function getPostHogProjectToken() {
  return (
    import.meta.env.VITE_POSTHOG_PROJECT_TOKEN ??
    import.meta.env.VITE_POSTHOG_KEY ??
    ""
  ).trim();
}

function getPostHogHost() {
  return (import.meta.env.VITE_POSTHOG_HOST ?? POSTHOG_DEFAULT_HOST).trim();
}

function getBooleanEnv(value: string | boolean | undefined, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (!value) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function shouldDebugAnalytics() {
  return import.meta.env.DEV || getBooleanEnv(import.meta.env.VITE_ANALYTICS_DEBUG);
}

function shouldEnableSessionReplay() {
  return getBooleanEnv(import.meta.env.VITE_POSTHOG_SESSION_REPLAY);
}

function cleanProperties(properties: AnalyticsProperties = {}) {
  return Object.entries(properties).reduce<AnalyticsProperties>(
    (cleanedProperties, [key, value]) => {
      if (value !== undefined) {
        cleanedProperties[key] = value;
      }
      return cleanedProperties;
    },
    {
      analytics_schema_version: ANALYTICS_SCHEMA_VERSION,
    },
  );
}

function getCurrentPageProperties() {
  if (typeof window === "undefined") {
    return {};
  }

  return {
    path: window.location.pathname,
    search: window.location.search || undefined,
    url: window.location.href,
  };
}

export function initAnalytics() {
  if (analyticsInitialized || typeof window === "undefined") {
    return;
  }

  const projectToken = getPostHogProjectToken();
  if (!projectToken) {
    if (shouldDebugAnalytics()) {
      console.info("[analytics] PostHog disabled: VITE_POSTHOG_PROJECT_TOKEN is not set.");
    }
    return;
  }

  posthog.init(projectToken, {
    api_host: getPostHogHost(),
    autocapture: true,
    capture_pageview: false,
    defaults: POSTHOG_DEFAULTS_VERSION,
    disable_session_recording: !shouldEnableSessionReplay(),
    person_profiles: "identified_only",
    session_recording: {
      maskAllInputs: true,
      maskCapturedNetworkRequestFn: (request) => {
        if (request.name) {
          request.name = request.name.replace(
            /([?&](token|auth|email)=)[^&]+/gi,
            "$1[REDACTED]",
          );
        }
        return request;
      },
    },
  });

  posthog.register({
    app_name: "DopeCart",
    app_surface: "mobile_web",
  });
  analyticsInitialized = true;
}

export function trackEvent(eventName: string, properties: AnalyticsProperties = {}) {
  const eventProperties = cleanProperties({
    ...getCurrentPageProperties(),
    ...properties,
  });

  if (analyticsInitialized) {
    posthog.capture(eventName, eventProperties);
  }

  if (shouldDebugAnalytics()) {
    console.debug("[analytics]", eventName, eventProperties);
  }
}

export function trackPageView(properties: AnalyticsProperties) {
  trackEvent("$pageview", properties);
}

export function cartTotalsAnalyticsProperties(totals: CartTotals) {
  return {
    cart_unique_items: totals.uniqueItems,
    cart_total_quantity: totals.totalQuantity,
    cart_total_price: totals.totalPrice,
    cart_total_calories: totals.totalCalories,
    cart_average_regret_score: totals.averageRegretScore,
  };
}

export function productAnalyticsProperties(product: Product, properties: AnalyticsProperties = {}) {
  return {
    product_id: product.id,
    product_name: product.name,
    product_category_id: product.categoryId,
    product_subcategory: product.subcategory,
    product_price: product.price,
    product_calories: product.calories,
    product_regret_score: product.regretScore,
    ...properties,
  };
}

export function orderAnalyticsProperties(order: OrderSnapshot) {
  return {
    order_id: order.id,
    order_status: order.status,
    order_total_quantity: order.totalQuantity,
    order_total_price: order.totalPrice,
    order_total_calories: order.totalCalories,
    order_average_regret_score: order.averageRegretScore,
    order_show_calories: order.showCalories,
    order_item_count: order.items.length,
    order_category_ids: Array.from(new Set(order.items.map((item) => item.categoryId))),
    tracking_outcome: order.tracking.trackingOutcome,
  };
}
