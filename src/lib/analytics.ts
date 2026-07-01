// GA4 con Consent Mode v2. El script solo se carga una vez el usuario acepta cookies.
// El default de consent ('denied') se declara en index.html antes de este script.

const GA_ID = "G-03HDLKFQ5T";
const CONSENT_KEY = "cookies_consent"; // "granted" | "denied"

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let scriptLoaded = false;
let configured = false;

function loadGtagScript() {
  if (scriptLoaded || typeof document === "undefined") return;
  scriptLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function getConsent(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function grantAnalyticsConsent() {
  try { localStorage.setItem(CONSENT_KEY, "granted"); } catch {}
  try { localStorage.setItem("cookies_accepted", "true"); } catch {}
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });
  loadGtagScript();
  if (!configured) {
    configured = true;
    window.gtag("config", GA_ID, { send_page_view: true });
  }
}

export function denyAnalyticsConsent() {
  try { localStorage.setItem(CONSENT_KEY, "denied"); } catch {}
  try { localStorage.setItem("cookies_accepted", "true"); } catch {}
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: "denied",
  });
}

// Called on app boot to re-hydrate consent from previous visits.
export function initAnalyticsFromStorage() {
  const v = getConsent();
  if (v === "granted") grantAnalyticsConsent();
}

// SPA page view — dispara un page_view manual en cada cambio de ruta.
export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  if (getConsent() !== "granted") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  });
}

// Evento genérico
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  if (getConsent() !== "granted") return;
  window.gtag("event", name, params ?? {});
}