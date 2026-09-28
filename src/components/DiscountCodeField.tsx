import { Check, Ticket, X } from "lucide-react";
import { formatDiscountValue, formatEuroNumber } from "@/data/discounts";
import type { DiscountCodeState } from "@/hooks/useDiscountCode";

// Bloque del código de descuento, el mismo en el configurador y en el
// formulario. Tres estados en una sola fila cada uno, sin cajas dentro de
// cajas: campo con el botón "Aplicar" integrado; código aplicado (etiqueta
// con el ahorro y "Quitar"); y código válido pero que no vale para el
// producto elegido.
const DiscountCodeField = ({
  state,
  id = "discount-code",
  className = "",
  note = true,
}: {
  state: DiscountCodeState;
  id?: string;
  className?: string;
  /** Muestra la nota "se descuenta de la pieza, no del envío" bajo el campo. */
  note?: boolean;
}) => {
  const { input, setInput, entry, applied, notApplicable, error, clearError, apply, remove } = state;

  const removeButton = (
    <button
      type="button"
      onClick={remove}
      aria-label="Quitar el código de descuento"
      className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
    >
      <X size={13} strokeWidth={2} /> Quitar
    </button>
  );

  if (entry && notApplicable) {
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2.5 ${className}`}
        data-testid="discount-not-applicable"
      >
        <p className="flex items-start gap-2 text-xs text-muted-foreground leading-snug">
          <Ticket size={15} strokeWidth={1.6} className="mt-px shrink-0 text-accent-warm" aria-hidden />
          <span>{notApplicable}</span>
        </p>
        {removeButton}
      </div>
    );
  }

  if (entry && applied) {
    const saving = typeof applied.amount === "number" ? `te ahorras ${formatEuroNumber(applied.amount)} €` : "sobre el precio de la pieza";
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-md border border-accent-warm/30 bg-accent-warm/[0.06] px-3 py-2.5 ${className}`}
        data-testid="discount-applied"
      >
        <p className="flex min-w-0 items-center gap-2 text-xs leading-snug">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-warm text-accent-warm-foreground" aria-hidden>
            <Check size={12} strokeWidth={2.5} />
          </span>
          <span className="min-w-0">
            <span className="font-medium text-foreground">{entry.code}</span>
            <span className="text-muted-foreground"> · {formatDiscountValue(applied)} · {saving}</span>
          </span>
        </p>
        {removeButton}
      </div>
    );
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <Ticket size={14} strokeWidth={1.6} className="text-accent-warm" aria-hidden />
        Código de descuento
        <span className="normal-case tracking-normal font-light text-muted-foreground/70">(opcional)</span>
      </label>
      <div
        className={`flex h-11 items-stretch overflow-hidden rounded-md border bg-background transition-colors focus-within:border-accent-warm focus-within:ring-1 focus-within:ring-accent-warm/30 ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        <input
          id={id}
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          value={input}
          onChange={(e) => { setInput(e.target.value.toUpperCase()); if (error) clearError(); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(input); } }}
          placeholder="Escribe tu código"
          className="min-w-0 flex-1 bg-transparent px-3.5 text-base text-foreground uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-sm placeholder:font-light placeholder:text-muted-foreground/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => apply(input)}
          disabled={!input.trim()}
          className="shrink-0 border-l border-border px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background disabled:text-muted-foreground/50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground/50"
        >
          Aplicar
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : note ? (
        <p className="mt-1.5 text-[11px] font-light text-muted-foreground">Se descuenta del precio de la pieza, no del envío.</p>
      ) : null}
    </div>
  );
};

export default DiscountCodeField;
