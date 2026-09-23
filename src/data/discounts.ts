// ─────────────────────────────────────────────────────────────────────────────
// CÓDIGOS DE DESCUENTO · Tiroriro Home
//
// Aquí se "esconden" los códigos que el cliente puede escribir en el
// formulario de contacto. No se anuncian en la web: solo funcionan si el
// cliente los conoce (campaña, colaboración, cliente repetidor…).
//
// Para dar de alta un código basta con añadir una línea a DISCOUNT_CODES:
//
//   { code: "BIENVENIDA10", type: "percent", value: 10, label: "Bienvenida" }
//   { code: "VERANO25",     type: "fixed",   value: 25, validUntil: "2026-09-30" }
//
//   · code       Lo que escribe el cliente. Da igual mayúsculas/minúsculas y
//                los espacios: se normaliza antes de comparar.
//   · type       "percent" = porcentaje sobre el precio del producto.
//                "fixed"   = euros de descuento sobre el precio del producto.
//   · value      El número (10 → 10 % · 25 → 25 €).
//   · label      (opcional) Nombre corto que verá el equipo en el CRM.
//   · validFrom  (opcional) "AAAA-MM-DD": el código no vale antes de ese día.
//   · validUntil (opcional) "AAAA-MM-DD": el código vale hasta ese día incluido.
//
// El descuento se aplica SOLO al precio del producto, nunca al envío. El
// importe con IVA ya viene incluido en el precio, así que el descuento también
// es sobre PVP final.
// ─────────────────────────────────────────────────────────────────────────────

export type DiscountType = "percent" | "fixed";

export interface DiscountCode {
  code: string;
  type: DiscountType;
  value: number;
  label?: string;
  validFrom?: string;
  validUntil?: string;
}

export const DISCOUNT_CODES: DiscountCode[] = [
  // ← Añadir aquí los códigos activos. Mientras esté vacío, cualquier código
  //   que escriba el cliente se rechaza como "no válido".
];

/** Descuento ya calculado sobre un precio concreto. Es lo que viaja al CRM y a los emails. */
export interface AppliedDiscount {
  code: string;
  type: DiscountType;
  value: number;
  label?: string;
  /** Precio del producto antes del descuento (si se conoce). */
  originalPrice?: number;
  /** Euros descontados (si se conoce el precio). */
  amount?: number;
  /** Precio del producto con el descuento aplicado (si se conoce el precio). */
  finalPrice?: number;
}

/** Normaliza lo que escribe el cliente: mayúsculas, sin espacios ni tildes raras. */
export function normalizeDiscountCode(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function isoDay(d: Date): string {
  // Día local en formato AAAA-MM-DD (España). Las fechas de validez se
  // interpretan como días naturales, no como instantes UTC.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Busca un código activo. Devuelve `null` si no existe o si está fuera de
 * fechas. `today` solo se usa en tests.
 */
export function findDiscountCode(raw: string, today: Date = new Date()): DiscountCode | null {
  const wanted = normalizeDiscountCode(raw);
  if (!wanted) return null;
  const day = isoDay(today);
  for (const entry of DISCOUNT_CODES) {
    if (normalizeDiscountCode(entry.code) !== wanted) continue;
    if (entry.validFrom && day < entry.validFrom) return null;
    if (entry.validUntil && day > entry.validUntil) return null;
    if (!(entry.value > 0)) return null;
    return entry;
  }
  return null;
}

/** Redondeo a céntimos (evita 40.499999 al hacer porcentajes). */
const cents = (n: number) => Math.round(n * 100) / 100;

/**
 * Calcula el descuento sobre el precio del producto. Si no hay precio (lead
 * del formulario directo o "a consultar"), devuelve el código sin importes:
 * el equipo lo aplicará al presupuestar.
 */
export function applyDiscount(entry: DiscountCode, productPrice: number | null | undefined): AppliedDiscount {
  const base: AppliedDiscount = {
    code: normalizeDiscountCode(entry.code),
    type: entry.type,
    value: entry.value,
    label: entry.label,
  };
  if (typeof productPrice !== "number" || !(productPrice > 0)) return base;

  const rawAmount = entry.type === "percent" ? (productPrice * entry.value) / 100 : entry.value;
  const amount = cents(Math.min(productPrice, Math.max(0, rawAmount)));
  return {
    ...base,
    originalPrice: productPrice,
    amount,
    finalPrice: cents(productPrice - amount),
  };
}

/** "−10 %" o "−25 €": cómo se enseña el descuento en la web, el CRM y los emails. */
export function formatDiscountValue(d: Pick<AppliedDiscount, "type" | "value">): string {
  return d.type === "percent" ? `−${formatEuroNumber(d.value)} %` : `−${formatEuroNumber(d.value)} €`;
}

/** Número en formato español sin decimales de sobra: 40.5 → "40,50", 40 → "40". */
export function formatEuroNumber(n: number): string {
  const rounded = cents(n);
  const hasCents = Math.abs(rounded - Math.round(rounded)) > 0.004;
  return rounded.toLocaleString("es-ES", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Una sola línea de texto para el CRM y los emails, p. ej.
 * "BIENVENIDA10 · −10 % · −40,50 € · producto 364,50 € en vez de 405 €".
 */
export function describeDiscount(d: AppliedDiscount): string {
  const parts = [d.code, formatDiscountValue(d)];
  if (d.label) parts.splice(1, 0, d.label);
  if (typeof d.amount === "number" && typeof d.finalPrice === "number" && typeof d.originalPrice === "number") {
    parts.push(`−${formatEuroNumber(d.amount)} €`);
    parts.push(`producto ${formatEuroNumber(d.finalPrice)} € en vez de ${formatEuroNumber(d.originalPrice)} €`);
  } else {
    parts.push("se aplicará al presupuesto");
  }
  return parts.join(" · ");
}

/** Versión para el cliente (email de confirmación): más cercana, sin jerga. */
export function describeDiscountForCustomer(d: AppliedDiscount): string {
  const head = `${d.code} · ${formatDiscountValue(d)}`;
  if (typeof d.finalPrice === "number" && typeof d.originalPrice === "number") {
    return `${head} · tu pieza se queda en ${formatEuroNumber(d.finalPrice)} € en vez de ${formatEuroNumber(d.originalPrice)} €`;
  }
  return `${head} · lo aplicaremos en tu presupuesto`;
}

/** Objeto que viaja al CRM (claves en snake_case como el resto del contrato). */
export function discountPayload(d: AppliedDiscount) {
  return {
    codigo: d.code,
    etiqueta: d.label,
    tipo: d.type,
    valor: d.value,
    importe: d.amount,
    precio_original: d.originalPrice,
    precio_final: d.finalPrice,
    texto: describeDiscount(d),
  };
}
