import { safeLocalStorageGet, safeLocalStorageSet } from "./safe-storage";

export const ATTRIBUTION_KEY = "tiroriro_attribution";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_placement",
  "utm_id",
  "fbclid",
  "gclid",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_PARAMS)[number];
export type AttributionParams = Partial<Record<AttributionKey, string>>;

export interface StoredAttribution extends AttributionParams {
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
}

/** Devuelve la atribución guardada, o {} si no hay o tiene más de 30 días. */
export const getAttribution = (): StoredAttribution => {
  try {
    const raw = safeLocalStorageGet(ATTRIBUTION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

const isFresh = (record: StoredAttribution): boolean => {
  const seen = record.first_seen ? Date.parse(record.first_seen) : NaN;
  if (!Number.isFinite(seen)) return false;
  return Date.now() - seen <= MAX_AGE_MS;
};

/**
 * Lee los parámetros de atribución de la URL actual y los persiste.
 * No sobrescribe un registro de menos de 30 días salvo que la visita
 * traiga un utm_source distinto.
 */
export const captureAttribution = (): StoredAttribution => {
  try {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const found: AttributionParams = {};
    for (const key of ATTRIBUTION_PARAMS) {
      const value = params.get(key);
      if (value && value.trim()) found[key] = value.trim().slice(0, 500);
    }

    const existing = getAttribution();
    const hasExisting = Object.keys(existing).length > 0;
    if (Object.keys(found).length === 0) return hasExisting ? existing : {};

    if (hasExisting && isFresh(existing)) {
      const sameSource = (existing.utm_source ?? "") === (found.utm_source ?? "");
      if (sameSource) return existing;
    }

    const payload: StoredAttribution = {
      ...found,
      landing_page: window.location.pathname,
      referrer: document.referrer || undefined,
      first_seen: new Date().toISOString(),
    };
    safeLocalStorageSet(ATTRIBUTION_KEY, JSON.stringify(payload));
    return payload;
  } catch {
    return {};
  }
};
