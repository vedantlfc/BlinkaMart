const LOCAL_FALLBACK_APP_URL = "http://127.0.0.1:5173/";

function normalizeHomeUrl(value: string) {
  try {
    const url = new URL(value);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return LOCAL_FALLBACK_APP_URL;
  }
}

export function getPublicAppUrl() {
  const envUrl = import.meta.env.VITE_DOPECART_PUBLIC_URL?.trim();

  if (envUrl) {
    return normalizeHomeUrl(envUrl);
  }

  if (typeof window !== "undefined") {
    return normalizeHomeUrl(window.location.origin);
  }

  return LOCAL_FALLBACK_APP_URL;
}
