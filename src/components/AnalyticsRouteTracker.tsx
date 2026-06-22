import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

function getScreenName(pathname: string) {
  switch (pathname) {
    case "/":
      return "home";
    case "/products":
      return "products";
    case "/cart":
      return "cart";
    case "/checkout":
      return "checkout";
    case "/tracking":
      return "tracking";
    case "/receipt":
      return "receipt";
    case "/progress":
      return "progress";
    default:
      return "unknown";
  }
}

export function AnalyticsRouteTracker() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    trackPageView({
      navigation_type: navigationType,
      referrer: document.referrer || undefined,
      screen_name: getScreenName(location.pathname),
      screen_path: location.pathname,
      screen_search: location.search || undefined,
    });
  }, [location.pathname, location.search, navigationType]);

  return null;
}
