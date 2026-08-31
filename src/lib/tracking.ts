import { safeLocalStorageGet, safeLocalStorageSet } from "./safe-storage";

export const CLICK_IDS_KEY = "tiroriro_click_ids";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 días

export const CLICK_ID_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "fbclid",
] as const;

export type ClickIdKey = (typeof CLICK_ID_PARAMS)[number];
export type ClickIds = Partial<Record<ClickIdKey, string>>;

export interface StoredClickIds extends ClickIds {
  captured_at?: string;
  landing_path?: string;
}

/** Lee los parámetros de clic de la URL actual y los persiste si hay alguno. */
export const captureClickIds = (): StoredClickIds => {
  try {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const found: ClickIds = {};
    for (const key of CLICK_ID_PARAMS) {
      const value = params.get(key);
      if (value && value.trim()) found[key] = value.trim().slice(0, 500);
    }
    if (Object.keys(found).length === 0) return getClickIds();

    const payload: StoredClickIds = {
      ...found,
      captured_at: new Date().toISOString(),
      landing_path: window.location.pathname + window.location.search,
    };
    safeLocalStorageSet(CLICK_IDS_KEY, JSON.stringify(payload));
    return payload;
  } catch {
    return {};
  }
};

/** Devuelve los parámetros guardados, o {} si no hay o han pasado más de 90 días. */
export const getClickIds = (): StoredClickIds => {
  try {
    const raw = safeLocalStorageGet(CLICK_IDS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredClickIds;
    if (!parsed || typeof parsed !== "object") return {};
    const capturedAt = parsed.captured_at ? Date.parse(parsed.captured_at) : NaN;
    if (!Number.isFinite(capturedAt)) return {};
    if (Date.now() - capturedAt > MAX_AGE_MS) return {};
    return parsed;
  } catch {
    return {};
  }
};

/** Conversión de Google Ads — llamar solo tras confirmación de lead creado. */
export function trackLeadConversion(email?: string) {
  if (typeof window === "undefined" || !(window as any).gtag) return;
  const gtag = (window as any).gtag;
  if (email) {
    gtag("set", "user_data", { email: email.trim().toLowerCase() });
  }
  gtag("event", "conversion", {
    send_to: "AW-18316237534/G2cjCMvYjOscEN617p1E",
    value: 155.0,
    currency: "EUR",
  });
  gtag("event", "generate_lead", { value: 155.0, currency: "EUR" });
}
