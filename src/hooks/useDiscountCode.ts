import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  applyDiscount,
  findDiscountCode,
  type AppliedDiscount,
  type DiscountCode,
} from "@/data/discounts";

// El código aplicado se recuerda en el navegador para que pase del
// configurador al formulario (y sobreviva a una recarga) sin depender solo
// de la URL. Se vuelve a validar siempre: si caducó, desaparece.
const STORAGE_KEY = "tiro_discount_code_v1";

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStored(code: string | null) {
  try {
    if (code) localStorage.setItem(STORAGE_KEY, code);
    else localStorage.removeItem(STORAGE_KEY);
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
  error: string | null;
  clearError: () => void;
  apply: (raw: string) => boolean;
  remove: () => void;
}

/**
 * Estado compartido del código de descuento (configurador y formulario).
 * `urlCode` es el `?codigo=` de la URL: manda sobre lo guardado.
 */
export function useDiscountCode(opts: {
  urlCode?: string | null;
  productPrice: number | null;
  /** Quita ?codigo= de la URL al pulsar "Quitar" (si no, volvería al recargar). */
  clearUrlCode?: () => void;
}): DiscountCodeState {
  const { urlCode, productPrice, clearUrlCode } = opts;
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
    writeStored(null);
    clearUrlCode?.();
  }, [clearUrlCode]);

  // Al montar (o si cambia ?codigo=): URL primero, si no lo guardado. Sin
  // mensaje de error: un código caducado simplemente no se aplica.
  useEffect(() => {
    const candidate = urlCode || readStored();
    if (!candidate) return;
    const found = findDiscountCode(candidate);
    if (found) {
      setEntry(found);
      setInput(found.code);
      setError(null);
    } else if (!urlCode) {
      writeStored(null);
    }
  }, [urlCode]);

  useEffect(() => {
    if (entry) writeStored(entry.code);
  }, [entry]);

  const applied = entry ? applyDiscount(entry, productPrice) : null;

  return {
    input,
    setInput,
    entry,
    applied,
    error,
    clearError: () => setError(null),
    apply,
    remove,
  };
}
