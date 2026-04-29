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
  { id: "caliza", name: "Caliza", hex: "#DDD4C7" },
  { id: "arena-suave", name: "Arena suave", hex: "#D8C4AA" },
  { id: "niebla", name: "Niebla", hex: "#C9CCD0" },
  { id: "salvia-clara", name: "Salvia clara", hex: "#A8B0A1" },
  { id: "azul-bruma", name: "Azul bruma", hex: "#90A5AE" },
  { id: "topo", name: "Topo", hex: "#B7A79A" },
  { id: "musgo-seco", name: "Musgo seco", hex: "#7E8A76" },
  { id: "antracita-lavada", name: "Antracita lavada", hex: "#4B5660" },
];

export const PRODUCTS: Product[] = [
  {
    id: "cabecero-tapizado",
    type: "cabecero",
    name: "Cabeceros tapizados",
    tagline: "El punto de partida de cualquier dormitorio que merece la pena",
    basePrice: 180,
    image: "/productos-fotos/cabeceros/IMG_2555.webp",
  },
  {
    id: "banco-entelado",
    type: "banco",
    name: "Bancos entelados",
    tagline: "Para el pie de la cama, la entrada o donde quieras que aterrice la vista",
    basePrice: 120,
    image: "/productos-fotos/bancos/IMG_2552.webp",
  },
  {
    id: "cojin-almohadon",
    type: "cojin",
    name: "Cojines y almohadones",
    tagline: "Detalles suaves y a medida para camas, bancos o sofás",
    basePrice: 35,
    image: "/productos-fotos/almohadones/IMG_2514.webp",
  },
  {
    id: "pufs",
    type: "puf",
    name: "Pufs",
    tagline: "Tapizados a medida, fáciles de mover y pensados para vivir con ellos",
    basePrice: 95,
    image: "/productos-fotos/puf/patos-01.webp",
  },
  {
    id: "mesa-centro",
    type: "mesa",
    name: "Mesas de centro",
    tagline: "Tapizadas a medida, con una presencia suave y mucho más original",
    basePrice: 290,
    image: "/productos-fotos/mesas/calblanque-01.webp",
  },
  {
    id: "pantalla-lampara",
    type: "pantalla",
    name: "Pantallas de lámpara",
    tagline: "Pantallas tapizadas a mano para transformar cualquier lámpara en una pieza única",
    basePrice: 65,
    image: "/productos-fotos/cabeceros/IMG_2502.webp",
  },
];

export const HEADBOARD_SHAPES = [
  { id: "recto", name: "Recto" },
  { id: "semicirculo", name: "Semicírculo" },
  { id: "corona-simple", name: "Corona simple" },
  { id: "corona-doble", name: "Corona doble" },
  { id: "corona-triple", name: "Corona triple" },
];

export const BED_WIDTH_OPTIONS = ["90", "105", "135", "150", "160", "180", "200", "Otro"];
export const HEADBOARD_HEIGHT_OPTIONS = ["1 m", "1,1 m", "1,2 m — estándar", "1,3 m", "Otro"];

export const BENCH_TYPES = [
  { id: "madera", name: "Patas normales de madera" },
  { id: "enteladas", name: "Patas enteladas" },
  { id: "baul", name: "Estilo baúl" },
];

export const PUFF_SHAPES = [
  { id: "cuadrado", name: "Cuadrada" },
  { id: "circular", name: "Circular" },
];

export const CUSHION_SHAPES = [
  { id: "cuadrada", name: "Cuadrada" },
  { id: "rectangular", name: "Rectangular" },
  { id: "cilindro", name: "Cilindro" },
];

export const CUSHION_SIZES = ["40×40 cm", "45×45 cm", "50×30 cm", "60×60 cm", "Otro"];

export const BASE_WIDTH_OPTIONS = ["40 cm", "50 cm", "60 cm", "70 cm", "80 cm", "90 cm", "100 cm", "120 cm", "Otro"];
export const BASE_DEPTH_OPTIONS = ["30 cm", "35 cm", "40 cm", "45 cm", "50 cm", "60 cm", "70 cm", "Otro"];
export const BASE_HEIGHT_OPTIONS = ["30 cm", "35 cm", "40 cm", "45 cm", "50 cm", "Otro"];

export const LAMPSHADE_SHAPES = [
  { id: "conica", name: "Cónica" },
  { id: "cilindrica", name: "Cilíndrica" },
  { id: "cuadrada", name: "Cuadrada" },
  { id: "trapecio", name: "Trapecio" },
  { id: "cuadrada-recta", name: "Cuadrada recta" },
  { id: "rectangular", name: "Rectangular" },
  { id: "ovalada", name: "Ovalada" },
];

export const FINISHES = {
  cabecero: [
    { id: "vivo-simple", name: "Vivo simple", desc: "Un ribete limpio que perfila la pieza", extra: 15 },
    { id: "vivo-doble", name: "Vivo doble", desc: "Más trabajado y con una lectura más sofisticada", extra: 25 },
  ],
  banco: [
    { id: "sin-vivo", name: "Sin vivo", desc: "Remate limpio y sobrio", extra: 0 },
    { id: "vivo-simple", name: "Vivo simple", desc: "Una línea de vivo que enmarca el banco", extra: 15 },
  ],
  puf: [
    { id: "sin-vivo", name: "Sin vivo", desc: "Tapizado limpio, de líneas más serenas", extra: 0 },
    { id: "vivo-simple", name: "Vivo simple", desc: "Ribete sencillo para perfilar el volumen", extra: 15 },
  ],
  mesa: [
    { id: "sin-vivo", name: "Sin vivo", desc: "Acabado limpio, muy contemporáneo", extra: 0 },
    { id: "vivo-simple", name: "Vivo simple", desc: "Un borde sutil para definir la pieza", extra: 15 },
  ],
  cojin: [
    { id: "sin-vivo", name: "Sin vivo", desc: "Acabado suave y ligero", extra: 0 },
    { id: "vivo-simple", name: "Vivo simple", desc: "Un vivo fino que remata el cojín", extra: 10 },
  ],
  pantalla: [
    { id: "sin-vivo", name: "Sin vivo", desc: "Acabado limpio y ligero", extra: 0 },
    { id: "vivo-simple", name: "Vivo simple", desc: "Un ribete sutil que define la silueta", extra: 12 },
  ],
} as const;

const parseNumber = (value?: string): number => {
  if (!value) return 0;
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const finishExtra = (type: ProductType, finish?: string) =>
  FINISHES[type].find((item) => item.id === finish)?.extra || 0;

export function calculatePrice(type: ProductType, options: Record<string, string>): number {
  const product = PRODUCTS.find((item) => item.type === type);
  if (!product) return 0;

  let price = product.basePrice + finishExtra(type, options.finish);

  if (type === "cabecero") {
    price += Math.max(0, parseNumber(options.width) - 135) * 1.8;
    price += Math.max(0, parseNumber(options.height) - 120) * 1.2;
    if (options.lateralMode === "otra-tela") price += 15;
    if (options.hangingAccessories === "true") price += 5;
  }

  if (type === "banco") {
    price += Math.max(0, parseNumber(options.length) - 80) * 1.1;
    price += Math.max(0, parseNumber(options.depth) - 35) * 0.8;
    if (options.kind === "enteladas") price += 25;
    if (options.kind === "baul") price += 55;
    if (options.extraFirm === "true") price += 20;
  }

  if (type === "puf") {
    price += Math.max(0, parseNumber(options.width) - 45) * 0.9;
    price += Math.max(0, parseNumber(options.depth) - 45) * 0.8;
    if (options.doubleSet === "true") price += product.basePrice + 70;
  }

  if (type === "mesa") {
    price += Math.max(0, parseNumber(options.width) - 80) * 1.4;
    price += Math.max(0, parseNumber(options.depth) - 40) * 1.1;
    if (options.kind === "tipo-banco") price += 35;
    if (options.surface === "cristal" || options.surface === "metacrilato") price += 45;
  }

  if (type === "cojin") {
    price += Math.max(0, parseNumber(options.width) - 40) * 0.45;
    price += Math.max(0, parseNumber(options.depth) - 30) * 0.35;
  }

  if (type === "pantalla") {
    price += Math.max(0, parseNumber(options.diameter) - 30) * 0.8;
  }

  if (options.express === "true") price += 35;
  return Math.round(price);
}

export function buildConfigSummary(type: ProductType, options: Record<string, string>): string {
  const product = PRODUCTS.find((item) => item.type === type);
  if (!product) return "";

  const parts: string[] = [product.name];

  if (type === "cabecero") {
    if (options.shapeLabel) parts.push(options.shapeLabel);
    if (options.width) parts.push(`Ancho ${options.width}`);
    if (options.height) parts.push(`Alto ${options.height}`);
    if (options.lateralLabel) parts.push(`Lateral: ${options.lateralLabel}`);
    if (options.hangingAccessories === "true") parts.push("Accesorios para colgar");
  }

  if (type === "banco") {
    if (options.kindLabel) parts.push(options.kindLabel);
    if (options.length) parts.push(`Largo ${options.length}`);
    if (options.depth) parts.push(`Fondo ${options.depth}`);
    if (options.height) parts.push(`Alto ${options.height}`);
  }

  if (type === "puf") {
    if (options.shapeLabel) parts.push(options.shapeLabel);
    if (options.width) parts.push(`Ancho ${options.width}`);
    if (options.depth) parts.push(`Fondo ${options.depth}`);
    if (options.height) parts.push(`Alto ${options.height}`);
    if (options.doubleSet === "true") parts.push("Pareja de pufs iguales");
  }

  if (type === "mesa") {
    if (options.kindLabel) parts.push(options.kindLabel);
    if (options.width) parts.push(`Ancho ${options.width}`);
    if (options.depth) parts.push(`Fondo ${options.depth}`);
    if (options.height) parts.push(`Alto ${options.height}`);
    if (options.surfaceLabel) parts.push(options.surfaceLabel);
  }

  if (type === "cojin") {
    if (options.shapeLabel) parts.push(options.shapeLabel);
    if (options.sizeLabel) parts.push(options.sizeLabel);
  }

  if (type === "pantalla") {
    if (options.shapeLabel) parts.push(options.shapeLabel);
    if (options.diameter) parts.push(`Diámetro ${options.diameter}`);
    if (options.height) parts.push(`Alto ${options.height}`);
  }

  if (options.fabricLabel) parts.push(`Tela ${options.fabricLabel}`);
  if (options.finishLabel) parts.push(options.finishLabel);
  if (options.vivoLabel) parts.push(`Vivo ${options.vivoLabel}`);
  if (options.express === "true") parts.push("Entrega express");

  return parts.join(" · ");
}
