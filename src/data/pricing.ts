// ─────────────────────────────────────────────────────────────────────────────
// FUENTE ÚNICA DE VERDAD DE PRECIOS · Tiroriro Home
// Todos los importes son PVP FINAL CON IVA (21%) INCLUIDO en euros.
// Cualquier cambio de precio se hace SOLO en este archivo.
// ─────────────────────────────────────────────────────────────────────────────

export type Category = "cabecero" | "banco" | "puf" | "mesa" | "cojin" | "pantalla";

// ── Cabeceros ────────────────────────────────────────────────────────────────
export const CABECERO_BASE: Record<string, number> = {
  "90": 285, "105": 315, "135": 360, "150": 400,
  "160": 435, "180": 455, "200": 485,
};
export const CABECERO_PREMIUM: Record<string, number> = {
  "90": 60, "105": 65, "135": 80, "150": 90,
  "160": 100, "180": 110, "200": 115,
};
export const HEIGHT_STEP_EUR = 15;
export const CABECERO_VIVO_DOBLE = 15;

// ── Bancos ───────────────────────────────────────────────────────────────────
export const BANCO_BASE: Record<string, number> = {
  "60": 295, "90": 335, "120": 380, "150": 430, "180": 485,
};
export const BANCO_PREMIUM: Record<string, number> = {
  "60": 60, "90": 75, "120": 90, "150": 100, "180": 135,
};
export const BANCO_VIVO = 30;

// ── Pufs ─────────────────────────────────────────────────────────────────────
export const PUF_BASE: Record<string, number> = {
  "cuadrado-40": 150, "cuadrado-50": 175, "cuadrado-60": 225,
  "redondo-40":  160, "redondo-50":  185, "redondo-60":  240,
};
export const PUF_PREMIUM: Record<string, number> = {
  "cuadrado-40": 45, "cuadrado-50": 55, "cuadrado-60": 70,
  "redondo-40":  45, "redondo-50":  55, "redondo-60":  70,
};
export const PUF_VIVO = 15;
export const PUF_HEIGHT_CM: Record<string, number> = {
  "cuadrado-40": 40, "cuadrado-50": 40, "cuadrado-60": 40,
  "redondo-40":  40, "redondo-50":  40, "redondo-60":  40,
};

// ── Mesas (altura fija 40 cm) ────────────────────────────────────────────────
export const MESA_BASE: Record<string, number> = {
  "60x60": 220, "80x80": 320, "100x100": 360, "120x120": 405,
};
export const MESA_PREMIUM: Record<string, number> = {
  "60x60": 65, "80x80": 100, "100x100": 125, "120x120": 155,
};
export const MESA_VIVO = 30;
export const MESA_HEIGHT_CM = 40;

// ── Almohadones (sin vivo) ───────────────────────────────────────────────────
export const COJIN_BASE: Record<string, number> = {
  "rodiles-40x40":   60,
  "rodiles-45x45":   65,
  "rodiles-50x50":   70,
  "covadonga-50x30": 60,
  "covadonga-60x40": 75,
  "covadonga-70x90": 100,
  "gulpiyuri-13x90": 70,
};
export const COJIN_PREMIUM: Record<string, number> = {
  "rodiles-40x40":   35,
  "rodiles-45x45":   40,
  "rodiles-50x50":   40,
  "covadonga-50x30": 35,
  "covadonga-60x40": 40,
  "covadonga-70x90": 20,
  "gulpiyuri-13x90": 20,
};
export const COJIN_LEGACY_KEYS: Record<string, string> = {
  "gulpiyuri-40x15": "gulpiyuri-13x90",
  "covadonga-30x50": "covadonga-50x30",
  "covadonga-40x60": "covadonga-60x40",
};
export const normalizeCojinKey = (k: string): string =>
  COJIN_LEGACY_KEYS[k] ?? k;

// ── Pantallas (sin vivo) ─────────────────────────────────────────────────────
export const PANTALLA_BASE: Record<string, number> = {
  "cilindro-Ø40×40cm":   75,
  "cilindro-Ø15×20cm":   25,
  "cilindro-Ø25×25cm":   45,
  "cuadrado-20×20cm":    35,
  "rectangulo-20×40cm":  65,
};
export const PANTALLA_PREMIUM: Record<string, number> = {
  "cilindro-Ø40×40cm":   30,
  "cilindro-Ø15×20cm":   15,
  "cilindro-Ø25×25cm":   20,
  "cuadrado-20×20cm":    20,
  "rectangulo-20×40cm":  20,
};

// ── Envío ────────────────────────────────────────────────────────────────────
export const SHIPPING_MADRID = 40;

// ── Extras heredados (§4) ────────────────────────────────────────────────────
export const EXTRA_COLGADOR = 5;
export const EXTRA_TAPETES = 5;
export const EXTRA_VIVO_DIFERENTE = 5;
export const EXTRA_LATERAL_DIFERENTE = 15;
export const EXTRA_METACRILATO = 50;
export const EXTRA_CRISTAL = 100;

const TABLES = {
  cabecero: { base: CABECERO_BASE, premium: CABECERO_PREMIUM },
  banco:    { base: BANCO_BASE,    premium: BANCO_PREMIUM },
  puf:      { base: PUF_BASE,      premium: PUF_PREMIUM },
  mesa:     { base: MESA_BASE,     premium: MESA_PREMIUM },
  cojin:    { base: COJIN_BASE,    premium: COJIN_PREMIUM },
  pantalla: { base: PANTALLA_BASE, premium: PANTALLA_PREMIUM },
} as const;

export function getBasePrice(category: Category, sizeId: string): number {
  const t = TABLES[category];
  if (!t) return 0;
  const key = category === "cojin" ? normalizeCojinKey(sizeId) : sizeId;
  return t.base[key] ?? 0;
}

export function getPremiumSurcharge(category: Category, sizeId: string): number {
  const t = TABLES[category];
  if (!t) return 0;
  const key = category === "cojin" ? normalizeCojinKey(sizeId) : sizeId;
  return t.premium[key] ?? 0;
}

export function getVivoSurcharge(category: Category): number {
  if (category === "banco") return BANCO_VIVO;
  if (category === "puf")   return PUF_VIVO;
  if (category === "mesa")  return MESA_VIVO;
  return 0;
}

export function getHeightSurcharge(heightCm: number | undefined): number {
  if (!heightCm || heightCm <= 100) return 0;
  return Math.ceil((heightCm - 100) / 10) * HEIGHT_STEP_EUR;
}

export function getCategoryPriceFrom(category: Category): number {
  const base = TABLES[category].base;
  const vals = Object.values(base);
  return vals.length ? Math.min(...vals) : 0;
}

export function formatPrice(n: number): string {
  return `${Math.round(n)} €`;
}

export interface PriceOptions {
  sizeId: string;
  fabricGroup?: "Básicas" | "Premium" | string;
  heightCm?: number;
  vivo?: "sin" | "simple" | "doble";
  colgador?: boolean;
  tapetes?: boolean;
  vivoDiferente?: boolean;
  lateralDiferente?: boolean;
  surface?: "metacrilato" | "cristal" | "";
}

export function calculatePrice(category: Category, opt: PriceOptions): number {
  const base = getBasePrice(category, opt.sizeId);
  if (!base) return 0;

  let total = base;
  const isPremium = opt.fabricGroup === "Premium";
  if (isPremium) total += getPremiumSurcharge(category, opt.sizeId);

  if (category === "cabecero") {
    total += getHeightSurcharge(opt.heightCm);
    if (opt.vivo === "doble") total += CABECERO_VIVO_DOBLE;
    if (opt.colgador) total += EXTRA_COLGADOR;
    if (opt.tapetes)  total += EXTRA_TAPETES;
  }
  if (category === "banco" && opt.vivo === "simple") total += BANCO_VIVO;
  if (category === "puf"   && opt.vivo === "simple") total += PUF_VIVO;
  if (category === "mesa"  && opt.vivo === "simple") total += MESA_VIVO;

  if (opt.vivoDiferente)    total += EXTRA_VIVO_DIFERENTE;
  if (opt.lateralDiferente) total += EXTRA_LATERAL_DIFERENTE;
  if (category === "mesa" && opt.surface === "metacrilato") total += EXTRA_METACRILATO;
  if (category === "mesa" && opt.surface === "cristal")     total += EXTRA_CRISTAL;

  return total;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  cabecero: "Cabeceros",
  banco:    "Bancos entelados",
  puf:      "Pufs",
  mesa:     "Mesas de centro",
  cojin:    "Almohadones",
  pantalla: "Pantallas de lámpara",
};

export const GULPIYURI_KEY = "gulpiyuri-13x90";
