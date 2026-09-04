// Wrapper delgado sobre src/data/pricing.ts (única fuente de verdad de precios).
// Este archivo NO debe contener ningún número de precio.

import {
  calculatePrice as _calculatePrice,
  getCategoryPriceFrom,
  normalizeCojinKey,
  type Category,
  type PriceOptions,
} from "@/data/pricing";

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
    id: "cabecero-tapizado", type: "cabecero",
    name: "Cabeceros tapizados",
    tagline: "El punto de partida de cualquier dormitorio que merece la pena",
    basePrice: getCategoryPriceFrom("cabecero"),
    image: "/productos-fotos/cabeceros/pregonda-01.webp",
  },
  {
    id: "banco-entelado", type: "banco",
    name: "Bancos entelados",
    tagline: "Para el pie de la cama, la entrada o donde quieras que aterrice la vista",
    basePrice: getCategoryPriceFrom("banco"),
    image: "/productos-fotos/bancos/banco-entelado.png",
  },
  {
    id: "cojin-almohadon", type: "cojin",
    name: "Almohadones",
    tagline: "Detalles suaves y a medida para camas, bancos o sofás",
    basePrice: getCategoryPriceFrom("cojin"),
    image: "/productos-fotos/almohadones/card-home.webp",
  },
  {
    id: "pufs", type: "puf",
    name: "Pufs",
    tagline: "Tapizados a medida, fáciles de mover y pensados para vivir con ellos",
    basePrice: getCategoryPriceFrom("puf"),
    image: "/productos-fotos/puff/patos-card.webp",
  },
  {
    id: "mesa-centro", type: "mesa",
    name: "Mesas de centro",
    tagline: "Tapizadas a medida, con una presencia suave y mucho más original",
    basePrice: getCategoryPriceFrom("mesa"),
    image: "/productos-fotos/mesas/calblanque-01.webp",
  },
  {
    id: "pantalla-lampara", type: "pantalla",
    name: "Pantallas de lámpara",
    tagline: "Pantallas tapizadas a mano para transformar cualquier lámpara en una pieza única",
    basePrice: getCategoryPriceFrom("pantalla"),
    image: "/productos-fotos/pantallas/almanzor-01.webp",
  },
];

// Traduce el `options: Record<string,string>` que emite el configurador a un
// PriceOptions estructurado para pricing.ts.
function toPriceOptions(type: ProductType, o: Record<string, string>): PriceOptions {
  const finish = o.finish || "";
  const vivo: PriceOptions["vivo"] =
    finish === "vivo-doble" ? "doble"
    : finish === "vivo-simple" ? "simple"
    : finish === "liso" ? "sin"
    : "sin";

  const heightCm = o.bedHeightCm ? parseInt(o.bedHeightCm) : undefined;

  let sizeId = "";
  if (type === "cabecero") sizeId = o.bedWidthCm || "";
  else if (type === "banco") sizeId = (o.benchLength || "").replace(/[^0-9]/g, "");
  else if (type === "puf") {
    const shape = o.pufShape === "circular" ? "redondo" : "cuadrado";
    const cm = o.pufSizeCm || "";
    sizeId = cm ? `${shape}-${cm}` : "";
  } else if (type === "mesa") sizeId = o.mesaPreset || "";
  else if (type === "cojin") sizeId = normalizeCojinKey(o.cushionKey || "");
  else if (type === "pantalla") sizeId = o.pantallaSizeKey || "";

  return {
    sizeId,
    fabricGroup: o.fabricGroup,
    heightCm,
    vivo,
    vivoDiferente: o.hasCustomVivo === "true",
    lateralDiferente: o.hasCustomLateral === "true",
    surface: (o.surface as PriceOptions["surface"]) || "",
  };
}

export function calculatePrice(type: ProductType, options: Record<string, string>): number {
  if (options.priceOnRequest === "true") return 0;
  return _calculatePrice(type as Category, toPriceOptions(type, options));
}

export function buildConfigSummary(type: ProductType, options: Record<string, string>): string {
  const product = PRODUCTS.find((item) => item.type === type);
  if (!product) return "";
  const parts: string[] = [product.name];

  if (type === "cabecero") {
    if (options.shapeLabel)  parts.push(options.shapeLabel);
    if (options.bedWidthCm)  parts.push(`Ancho ${options.bedWidthCm} cm`);
    if (options.bedHeightCm) parts.push(`Alto ${options.bedHeightCm} cm`);
    parts.push(options.finish === "vivo-doble" ? "Vivo doble" : "Vivo simple");
    if (options.montaje === "colgar") parts.push("Montaje: colgado a la pared");
    if (options.montaje === "apoyar") parts.push("Montaje: apoyado en el suelo");
  }
  if (type === "banco") {
    parts[0] = "Banco Oyambre";
    if (options.benchLength === "custom") {
      parts.push(`Largo ${options.bancoCustomLargo || "?"} cm`);
      parts.push(`Alto ${options.bancoCustomAlto || "?"} cm`);
      parts.push(`Fondo ${options.bancoCustomFondo || "?"} cm`);
      parts.push("Precio a consultar — nos pondremos en contacto contigo");
    } else {
      if (options.benchLength) parts.push(`Largo ${options.benchLength}`);
      parts.push("Alto 45 cm");
      parts.push("Fondo 33 cm");
      if (options.finish === "vivo-simple") parts.push("Con vivo");
    }
  }
  if (type === "puf") {
    if (options.pufShapeLabel) parts.push(options.pufShapeLabel);
    if (options.pufShape === "circular") {
      if (options.pufDiameter) parts.push(`Ø ${options.pufDiameter}`);
      if (options.pufHeight)   parts.push(`Alto ${options.pufHeight}`);
    } else if (options.pufSizeCm) {
      parts.push(`${options.pufSizeCm}×${options.pufSizeCm} cm`);
    }
    if (options.finish === "vivo-simple") parts.push("Con vivo");
  }
  if (type === "mesa") {
    if (options.mesaPreset) parts.push(options.mesaPreset.replace(/x/g, " × ") + " × 40 cm");
    if (options.surface === "metacrilato") parts.push("Metacrilato 5 mm");
    if (options.surface === "cristal")     parts.push("Cristal 6 mm");
    if (options.finish === "vivo-simple") parts.push("Con vivo");
  }
  if (type === "cojin" && options.cushionKey) {
    parts.push(normalizeCojinKey(options.cushionKey).replace(/^[^-]+-/, "").replace(/x/g, "×") + " cm");
  }
  if (type === "pantalla" && options.pantallaSizeKey) {
    parts.push(options.pantallaSizeKey.replace(/^[^-]+-/, ""));
  }

  if (options.fabricLabel) parts.push(`Tela: ${options.fabricLabel}`);
  if (options.fabricGroup === "Premium") parts.push("Tela premium");
  if (options.hasCustomVivo === "true") parts.push("Vivo en tela diferente");
  if (options.hasCustomLateral === "true") parts.push("Laterales en tela diferente");

  return parts.join(" · ");
}
