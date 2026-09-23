import { Ticket, X } from "lucide-react";
import { formatDiscountValue, formatEuroNumber } from "@/data/discounts";
import type { DiscountCodeState } from "@/hooks/useDiscountCode";

// Bloque del código de descuento. Es el mismo en el configurador y en el
// formulario: caja visible sobre el crema, campo + "Aplicar", y cuando hay
// código aplicado, una franja con el resultado y un botón para quitarlo.
const DiscountCodeField = ({ state, id = "discount-code", className = "" }: { state: DiscountCodeState; id?: string; className?: string }) => {
  const { input, setInput, entry, applied, error, clearError, apply, remove } = state;

  if (entry && applied) {
    return (
      <div className={`rounded-md border border-accent-warm/40 bg-background px-4 py-3 ${className}`} data-testid="discount-applied">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-foreground leading-snug">
            <Ticket size={16} strokeWidth={1.6} className="inline -mt-0.5 mr-1.5 text-accent-warm" aria-hidden />
            Código <span className="font-medium">{entry.code}</span> aplicado
            <span className="block sm:inline text-muted-foreground sm:before:content-['_·_']">
              {formatDiscountValue(applied)}
              {typeof applied.amount === "number"
                ? ` (te ahorras ${formatEuroNumber(applied.amount)} €)`
                : " sobre el precio del producto"}
            </span>
          </p>
          <button
            type="button"
            onClick={remove}
            aria-label="Quitar el código de descuento"
            className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} /> Quitar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-md border border-border bg-background px-4 py-4 ${className}`}>
      <label htmlFor={id} className="flex items-center gap-2 text-xs tracking-wide uppercase text-foreground mb-2 font-medium">
        <Ticket size={16} strokeWidth={1.6} className="text-accent-warm" aria-hidden />
        ¿Tienes un código de descuento?
      </label>
      <div className="flex gap-2">
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
          className={`min-w-0 flex-1 bg-secondary border rounded-md px-4 py-3 text-base text-foreground uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-sm placeholder:text-muted-foreground/50 placeholder:font-light focus:outline-none focus:border-accent-warm focus:ring-1 focus:ring-accent-warm/30 transition-colors ${error ? "border-destructive" : "border-border"}`}
        />
        <button
          type="button"
          onClick={() => apply(input)}
          className="shrink-0 px-5 py-3 text-xs tracking-[0.14em] uppercase font-medium border border-foreground/70 rounded-md text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          Aplicar
        </button>
      </div>
      {error
        ? <p className="text-xs mt-2 text-destructive">{error}</p>
        : <p className="text-xs mt-2 text-muted-foreground font-light">Se descuenta del precio de la pieza (no del envío).</p>}
    </div>
  );
};

export default DiscountCodeField;
