import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function RouteScrollReset() {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const appContent = document.querySelector<HTMLElement>(".app-content");
    appContent?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
  }, [navigationType, pathname, search]);

  return null;
}
