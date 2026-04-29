export type ProductType = "cabecero" | "banco" | "cojin" | "puf" | "mesa" | "pantalla";

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  tagline: string;
  basePrice: number;
  image: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export const FABRIC_COLORS: ColorOption[] = [
  { id: "lino-natural",   name: "Lino Natural",   hex: "#C8B99A" },
  { id: "arena",          name: "Arena",           hex: "#D4C5A9" },
  { id: "crudo",          name: "Crudo",           hex: "#EDE5D0" },
  { id: "topo",           name: "Topo",            hex: "#A89880" },
  { id: "gris-perla",     name: "Gris Perla",      hex: "#BEC0C2" },
  { id: "verde-salvia",   name: "Verde Salvia",     hex: "#8A9E8C" },
  { id: "azul-oceano",    name: "Azul Océano",      hex: "#5B7EA6" },
  { id: "terracota",      name: "Terracota",        hex: "#C07050" },
];

export const PRODUCTS: Product[] = [
  {
    id: "cabecero-tapizado",
    type: "cabecero",
    name: "Cabeceros tapizados",
    tagline: "El punto de partida de cualquier dormitorio que merece la pena",
    basePrice: 225,
    image: "/productos-fotos/cabeceros/pregonda-02.webp",
  },
  {
    id: "banco-entelado",
    type: "banco",
    name: "Bancos entelados",
    tagline: "Para el pie de la cama, la entrada o donde quieras que aterrice la vista",
    basePrice: 120,
    image: "/productos-fotos/bancos/oyambre-01.webp",
  },
  {
    id: "cojin-almohadon",
    type: "cojin",
    name: "Almohadones",
    tagline: "Detalles suaves y a medida para camas, bancos o sofás",
    basePrice: 50,
    image: "/productos-fotos/almohadones/covadonga-01.webp",
  },
  {
    id: "pufs",
    type: "puf",
    name: "Pufs",
    tagline: "Tapizados a medida, fáciles de mover y pensados para vivir con ellos",
    basePrice: 125,
    image: "/productos-fotos/puff/patos-card.webp",
  },
  {
    id: "mesa-centro",
    type: "mesa",
    name: "Mesas de centro",
    tagline: "Tapizadas a medida, con una presencia suave y mucho más original",
    basePrice: 280,
    image: "/productos-fotos/mesas/calblanque-01.webp",
  },
  {
    id: "pantalla-lampara",
    type: "pantalla",
    name: "Pantallas de lámpara",
    tagline: "Pantallas tapizadas a mano para transformar cualquier lámpara en una pieza única",
    basePrice: 25,
    image: "/productos-fotos/pantallas/almanzor-01.webp",
  },
];

// ─── Cabeceros ───────────────────────────────────────────────────────────────
// Precio base a 100 cm de altura. Por cada 10 cm extra sobre 100 cm: +15 €.
// Tela premium: +25 €. Vivo doble: +10 €. Colgador: +5 €.
const CABECERO_PRICES: Record<string, number> = {
  "90":  225,
  "105": 250,
  "135": 295,
  "150": 335,
  "160": 350,
  "180": 380,
  "200": 415,
};

// ─── Almohadones ─────────────────────────────────────────────────────────────
// cushionKey = "<shape>-<medida>" (sin espacios, × → x)
// Tela premium: +10 €. Vivo simple: incluido.
export const CUSHION_PRICES: Record<string, number> = {
  "rodiles-40x40":     50,
  "rodiles-45x45":     55,
  "rodiles-50x50":     60,
  "covadonga-50x30":   60,
  "covadonga-60x40":   70,
  "gulpiyuri-13x90":   55,
};

// ─── Mesas de centro ─────────────────────────────────────────────────────────
// Vivo simple: incluido. Metacrilato +50 €, cristal +100 €. Premium: +25 €.
export const MESA_PRICES: Record<string, number> = {
  "120x45x60": 280,
  "80x45x80":  285,
};

// ─── Pantallas de lámpara ────────────────────────────────────────────────────
// pantallaSizeKey = "<shape>-<medida>". Ribete: incluido.
export const PANTALLA_PRICES: Record<string, number> = {
  "cilindro-Ø40×40cm": 75,
  "cilindro-Ø15×20cm": 25,
  "cilindro-Ø25×25cm": 45,
  "cuadrado-20×20cm":  35,
  "rectangulo-20×40cm": 65,
};

export function calculatePrice(type: ProductType, options: Record<string, string>): number {
  const isPremium = options.fabricGroup === "Premium";

  // ── Cabecero ──────────────────────────────────────────────────────────────
  if (type === "cabecero") {
    const widthKey = options.bedWidthCm || "";
    let base = CABECERO_PRICES[widthKey] ?? 0;
    if (!base) return 0; // Sin medida elegida aún

    // Altura extra: +15 € por cada 10 cm sobre 100 cm
    const heightCm = parseInt(options.bedHeightCm || "100");
    if (heightCm > 100) {
      base += Math.ceil((heightCm - 100) / 10) * 15;
    }

    if (isPremium)                    base += 25;
    if (options.finish === "vivo-doble") base += 10;
    if (options.colgador === "true")  base += 5;

    return base;
  }

  // ── Puf ───────────────────────────────────────────────────────────────────
  if (type === "puf") {
    const sizeCm = options.pufSizeCm || "40";
    const qty    = parseInt(options.pufQuantity || "1");

    let base: number;
    if (sizeCm === "40") {
      base = qty >= 2 ? 220 : 125;
    } else {
      // 50 cm
      base = qty >= 2 ? 300 : 165;
    }

    // Premium: +15 € por unidad
    if (isPremium) base += 15 * qty;

    return base;
  }

  // ── Mesa de centro ────────────────────────────────────────────────────────
  if (type === "mesa") {
    const key  = options.mesaPreset || "";
    let base   = MESA_PRICES[key] ?? 0;
    if (!base) return 0;

    if (isPremium)                         base += 25;
    if (options.surface === "metacrilato") base += 50;
    if (options.surface === "cristal")     base += 100;

    return base;
  }

  // ── Almohadón ─────────────────────────────────────────────────────────────
  if (type === "cojin") {
    const key  = options.cushionKey || "";
    let base   = CUSHION_PRICES[key] ?? 0;
    if (!base) return 0;

    if (isPremium) base += 10;

    return base;
  }

  // ── Pantalla ──────────────────────────────────────────────────────────────
  if (type === "pantalla") {
    const key  = options.pantallaSizeKey || "";
    const base = PANTALLA_PRICES[key] ?? 0;
    return base;
  }

  // ── Banco (sin precios definitivos) ───────────────────────────────────────
  if (type === "banco") {
    return 120;
  }

  return 0;
}

export function buildConfigSummary(type: ProductType, options: Record<string, string>): string {
  const product = PRODUCTS.find((item) => item.type === type);
  if (!product) return "";

  const parts: string[] = [product.name];

  if (type === "cabecero") {
    if (options.shapeLabel)  parts.push(options.shapeLabel);
    if (options.bedWidthCm)  parts.push(`Ancho ${options.bedWidthCm} cm`);
    if (options.bedHeightCm) parts.push(`Alto ${options.bedHeightCm} cm`);
    if (options.finish === "vivo-doble") parts.push("Vivo doble");
    else parts.push("Vivo simple");
    if (options.colgador === "true") parts.push("Con colgador");
  }

  if (type === "banco") {
    if (options.kindLabel)  parts.push(options.kindLabel);
    if (options.benchLength) parts.push(`Largo ${options.benchLength}`);
  }

  if (type === "puf") {
    const qty = parseInt(options.pufQuantity || "1");
    parts.push(`${options.pufSizeCm ?? "40"} cm`);
    if (qty >= 2) parts.push("Pareja (×2)");
  }

  if (type === "mesa") {
    if (options.mesaPreset) parts.push(options.mesaPreset.replace(/x/g, " × ") + " cm");
    if (options.surface === "metacrilato") parts.push("Metacrilato 5 mm");
    if (options.surface === "cristal")     parts.push("Cristal 6 mm");
  }

  if (type === "cojin") {
    if (options.cushionKey) parts.push(options.cushionKey.replace(/-/, " ").replace(/x/g, "×") + " cm");
  }

  if (type === "pantalla") {
    if (options.pantallaSizeKey) parts.push(options.pantallaSizeKey.replace(/^[^-]+-/, ""));
  }

  if (options.fabricLabel) parts.push(`Tela: ${options.fabricLabel}`);
  if (options.fabricGroup === "Premium") parts.push("Tela premium");

  return parts.join(" · ");
}
