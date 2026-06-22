import type { Product } from "../data/catalog";
import type { CartTotals } from "../state/cart";
import type { OrderSnapshot } from "../state/order";

type AnalyticsPrimitive = string | number | boolean | null | undefined;
type AnalyticsValue = AnalyticsPrimitive | AnalyticsPrimitive[];
export type AnalyticsProperties = Record<string, AnalyticsValue>;

type PostHogQueue = unknown[] & {
  __SV?: number;
  capture?: (eventName: string, properties?: AnalyticsProperties) => void;
  init?: (token: string, config?: Record<string, unknown>) => void;
  register?: (properties: AnalyticsProperties) => void;
};

declare global {
  interface Window {
    posthog?: PostHogQueue;
  }
}

const ANALYTICS_SCHEMA_VERSION = "2026-06-22";
const POSTHOG_DEFAULT_HOST = "https://us.i.posthog.com";
const POSTHOG_DEFAULTS_VERSION = "2026-01-30";
const POSTHOG_METHODS = [
  "init",
  "capture",
  "register",
  "register_once",
  "register_for_session",
  "unregister",
  "unregister_for_session",
  "getFeatureFlag",
  "getFeatureFlagPayload",
  "isFeatureEnabled",
  "reloadFeatureFlags",
  "updateEarlyAccessFeatureEnrollment",
  "getEarlyAccessFeatures",
  "on",
  "onFeatureFlags",
  "onSessionId",
  "getSurveys",
  "getActiveMatchingSurveys",
  "renderSurvey",
  "canRenderSurvey",
  "getNextSurveyStep",
  "identify",
  "setPersonProperties",
  "group",
  "resetGroups",
  "setPersonPropertiesForFlags",
  "resetPersonPropertiesForFlags",
  "setGroupPropertiesForFlags",
  "resetGroupPropertiesForFlags",
  "reset",
  "get_distinct_id",
  "getGroups",
  "get_session_id",
  "get_session_replay_url",
  "alias",
  "set_config",
  "startSessionRecording",
  "stopSessionRecording",
  "sessionRecordingStarted",
  "captureException",
  "loadToolbar",
  "get_property",
  "getSessionProperty",
  "createPersonProfile",
  "opt_in_capturing",
  "opt_out_capturing",
  "has_opted_in_capturing",
  "has_opted_out_capturing",
  "clear_opt_in_out_capturing",
  "debug",
];

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

function normalizePostHogAssetHost(apiHost: string) {
  return apiHost.replace(".i.posthog.com", "-assets.i.posthog.com");
}

function createPostHogStub(apiHost: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return undefined;
  }

  const existingPostHog = window.posthog;
  if (existingPostHog?.__SV) {
    return existingPostHog;
  }

  const posthog = (existingPostHog ?? []) as PostHogQueue;
  window.posthog = posthog;

  for (const methodName of POSTHOG_METHODS) {
    (posthog as unknown as Record<string, unknown>)[methodName] = (...args: unknown[]) => {
      posthog.push([methodName, ...args]);
    };
  }

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `${normalizePostHogAssetHost(apiHost)}/static/array.js`;

  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);

  posthog.__SV = 1;
  return posthog;
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
  const projectToken = getPostHogProjectToken();
  if (!projectToken) {
    if (shouldDebugAnalytics()) {
      console.info("[analytics] PostHog disabled: VITE_POSTHOG_PROJECT_TOKEN is not set.");
    }
    return;
  }

  const apiHost = getPostHogHost();
  const posthog = createPostHogStub(apiHost);
  if (!posthog?.init) {
    return;
  }

  posthog.init(projectToken, {
    api_host: apiHost,
    autocapture: true,
    capture_pageview: false,
    defaults: POSTHOG_DEFAULTS_VERSION,
    disable_session_recording: !shouldEnableSessionReplay(),
    person_profiles: "identified_only",
    session_recording: {
      maskAllInputs: true,
      maskCapturedNetworkRequestFn: (request: { name?: string }) => {
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

  posthog.register?.({
    app_name: "DopeCart",
    app_surface: "mobile_web",
  });
}

export function trackEvent(eventName: string, properties: AnalyticsProperties = {}) {
  const eventProperties = cleanProperties({
    ...getCurrentPageProperties(),
    ...properties,
  });

  window.posthog?.capture?.(eventName, eventProperties);

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
