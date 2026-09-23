import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  DISCOUNT_CODES,
  applyDiscount,
  describeDiscount,
  describeDiscountForCustomer,
  discountPayload,
  findDiscountCode,
  formatDiscountValue,
  formatEuroNumber,
  normalizeDiscountCode,
  type DiscountCode,
} from "@/data/discounts";

const PERCENT: DiscountCode = { code: "Bienvenida10", type: "percent", value: 10, label: "Bienvenida" };
const FIXED: DiscountCode = { code: "VERANO25", type: "fixed", value: 25, validFrom: "2026-06-01", validUntil: "2026-09-30" };

describe("códigos de descuento", () => {
  let backup: DiscountCode[];
  beforeEach(() => {
    backup = [...DISCOUNT_CODES];
    DISCOUNT_CODES.splice(0, DISCOUNT_CODES.length, PERCENT, FIXED);
  });
  afterEach(() => {
    DISCOUNT_CODES.splice(0, DISCOUNT_CODES.length, ...backup);
  });

  it("normaliza mayúsculas, espacios y tildes", () => {
    expect(normalizeDiscountCode("  bien venida 10 ")).toBe("BIENVENIDA10");
    expect(normalizeDiscountCode("verÁno25")).toBe("VERANO25");
  });

  it("encuentra el código sin importar cómo lo escriba el cliente", () => {
    expect(findDiscountCode("bienvenida10")).toBe(PERCENT);
    expect(findDiscountCode(" BIENVENIDA 10 ")).toBe(PERCENT);
    expect(findDiscountCode("NOEXISTE")).toBeNull();
    expect(findDiscountCode("")).toBeNull();
  });

  it("respeta las fechas de validez (día natural incluido)", () => {
    expect(findDiscountCode("VERANO25", new Date(2026, 4, 31))).toBeNull();
    expect(findDiscountCode("VERANO25", new Date(2026, 5, 1))).toBe(FIXED);
    expect(findDiscountCode("VERANO25", new Date(2026, 8, 30, 23, 59))).toBe(FIXED);
    expect(findDiscountCode("VERANO25", new Date(2026, 9, 1))).toBeNull();
  });

  it("aplica un porcentaje sobre el producto y redondea a céntimos", () => {
    const d = applyDiscount(PERCENT, 405);
    expect(d).toMatchObject({ code: "BIENVENIDA10", amount: 40.5, finalPrice: 364.5, originalPrice: 405 });
    expect(applyDiscount({ ...PERCENT, value: 33 }, 100).finalPrice).toBe(67);
  });

  it("aplica un importe fijo sin dejar el precio en negativo", () => {
    expect(applyDiscount(FIXED, 300)).toMatchObject({ amount: 25, finalPrice: 275 });
    expect(applyDiscount(FIXED, 10)).toMatchObject({ amount: 10, finalPrice: 0 });
  });

  it("sin precio conocido devuelve solo el código (se aplica al presupuestar)", () => {
    const d = applyDiscount(PERCENT, null);
    expect(d.amount).toBeUndefined();
    expect(d.finalPrice).toBeUndefined();
    expect(describeDiscount(d)).toBe("BIENVENIDA10 · Bienvenida · −10 % · se aplicará al presupuesto");
    expect(describeDiscountForCustomer(d)).toBe("BIENVENIDA10 · −10 % · lo aplicaremos en tu presupuesto");
  });

  it("formatea los textos para el CRM, los emails y el cliente", () => {
    const d = applyDiscount(PERCENT, 405);
    expect(formatDiscountValue(d)).toBe("−10 %");
    expect(formatDiscountValue(applyDiscount(FIXED, 300))).toBe("−25 €");
    expect(formatEuroNumber(40.5)).toBe("40,50");
    expect(formatEuroNumber(405)).toBe("405");
    expect(describeDiscount(d)).toBe("BIENVENIDA10 · Bienvenida · −10 % · −40,50 € · producto 364,50 € en vez de 405 €");
    expect(describeDiscountForCustomer(d)).toBe("BIENVENIDA10 · −10 % · tu pieza se queda en 364,50 € en vez de 405 €");
    expect(discountPayload(d)).toEqual({
      codigo: "BIENVENIDA10",
      etiqueta: "Bienvenida",
      tipo: "percent",
      valor: 10,
      importe: 40.5,
      precio_original: 405,
      precio_final: 364.5,
      texto: describeDiscount(d),
    });
  });
});
