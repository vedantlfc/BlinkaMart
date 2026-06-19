import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function RouteScrollReset() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    if (previousPathname === pathname) {
      return;
    }

    if (navigationType === "POP") {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const appContent = document.querySelector<HTMLElement>(".app-content");
    appContent?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
  }, [navigationType, pathname]);

  return null;
}
