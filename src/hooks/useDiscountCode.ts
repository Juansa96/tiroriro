import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { ProductType } from "@/lib/products";
import {
  applyDiscount,
  discountAppliesTo,
  excludedProductsText,
  findDiscountCode,
  type AppliedDiscount,
  type DiscountCode,
} from "@/data/discounts";

// El código NO se recuerda en el navegador (decisión de Juan, 28/09/2026):
// solo se aplica si alguien lo escribe, o si llega por ?codigo= desde el
// configurador en esa misma solicitud. Antes se guardaba en localStorage y
// volvía a aparecer solo en cada visita. Esta clave se limpia por si quedó
// guardada en algún navegador.
const LEGACY_STORAGE_KEY = "tiro_discount_code_v1";

function clearLegacyStored() {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export interface DiscountCodeState {
  input: string;
  setInput: (v: string) => void;
  entry: DiscountCode | null;
  /** Descuento calculado sobre `productPrice` (o solo el código si no hay precio). */
  applied: AppliedDiscount | null;
  /** Aviso si el código es válido pero no vale para este producto (p. ej. cojines). */
  notApplicable: string | null;
  error: string | null;
  clearError: () => void;
  apply: (raw: string) => boolean;
  remove: () => void;
}

/**
 * Estado compartido del código de descuento (configurador y formulario).
 * `urlCode` es el `?codigo=` de la URL (viene del configurador).
 */
export function useDiscountCode(opts: {
  urlCode?: string | null;
  productPrice: number | null;
  /** Productos que pide el cliente, para los códigos que excluyen algunos. */
  productTypes?: readonly ProductType[] | null;
  /** Quita ?codigo= de la URL al pulsar "Quitar" (si no, volvería al recargar). */
  clearUrlCode?: () => void;
}): DiscountCodeState {
  const { urlCode, productPrice, productTypes, clearUrlCode } = opts;
  const [input, setInput] = useState("");
  const [entry, setEntry] = useState<DiscountCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback((raw: string): boolean => {
    const found = findDiscountCode(raw);
    if (!found) {
      setEntry(null);
      setError(raw.trim() ? "Este código no es válido o ha caducado." : null);
      return false;
    }
    setEntry(found);
    setInput(found.code);
    setError(null);
    trackEvent("discount_code_applied", { coupon: found.code });
    return true;
  }, []);

  const remove = useCallback(() => {
    setEntry(null);
    setInput("");
    setError(null);
    clearUrlCode?.();
  }, [clearUrlCode]);

  // Al montar (o si cambia ?codigo=): solo la URL. Sin mensaje de error: un
  // código caducado simplemente no se aplica.
  useEffect(() => {
    clearLegacyStored();
    if (!urlCode) return;
    const found = findDiscountCode(urlCode);
    if (found) {
      setEntry(found);
      setInput(found.code);
      setError(null);
    }
  }, [urlCode]);

  // Un código que no vale para este producto se queda guardado (vuelve a
  // aplicarse si el cliente cambia a otro producto) pero no descuenta nada.
  const fits = !!entry && discountAppliesTo(entry, productTypes);
  const applied = entry && fits ? applyDiscount(entry, productPrice) : null;
  const notApplicable = entry && !fits
    ? `El código ${entry.code} no vale para ${excludedProductsText(entry) ?? "este producto"}.`
    : null;

  return {
    input,
    setInput,
    entry,
    applied,
    notApplicable,
    error,
    clearError: () => setError(null),
    apply,
    remove,
  };
}
