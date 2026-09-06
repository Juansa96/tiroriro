import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import {
  CABECERO_BASE, CABECERO_PREMIUM, CABECERO_VIVO_DOBLE, HEIGHT_STEP_EUR,
  BANCO_BASE, BANCO_PREMIUM, BANCO_VIVO,
  PUF_BASE, PUF_PREMIUM, PUF_VIVO,
  MESA_BASE, MESA_PREMIUM, MESA_VIVO, EXTRA_METACRILATO, EXTRA_CRISTAL,
  COJIN_BASE, COJIN_PREMIUM,
  PANTALLA_BASE, PANTALLA_PREMIUM,
  SHIPPING_MADRID, EXTRA_LATERAL_DIFERENTE, EXTRA_VIVO_DIFERENTE,
  type Category,
} from "@/data/pricing";

// Tabla "Precios orientativos" por medida estándar, sacada de la fuente única
// de precios (src/data/pricing.ts): nunca se desactualiza a mano. Responde a
// lo que la gente pregunta a buscadores e IAs ("cuánto cuesta un cabecero
// para cama de 150") sin necesitar página de precios ni configurador.

interface Tabla {
  columna: string;
  filas: Array<{ label: string; basica: number; premium: number }>;
  notas: string[];
}

const fila = (base: Record<string, number>, premium: Record<string, number>, label: (k: string) => string) =>
  Object.keys(base).map((k) => ({ label: label(k), basica: base[k], premium: base[k] + (premium[k] ?? 0) }));

const TABLAS: Record<Category, Tabla> = {
  cabecero: {
    columna: "Ancho de cama",
    filas: fila(CABECERO_BASE, CABECERO_PREMIUM, (k) => `Cama de ${k} cm`),
    notas: [
      `Alto estándar hasta 100 cm; cada 10 cm más de alto suma ${HEIGHT_STEP_EUR} €.`,
      `Vivo simple incluido. Vivo doble +${CABECERO_VIVO_DOBLE} €. Tela lateral distinta +${EXTRA_LATERAL_DIFERENTE} €. Colgador y tapetes incluidos.`,
    ],
  },
  banco: {
    columna: "Largo del banco",
    filas: fila(BANCO_BASE, BANCO_PREMIUM, (k) => `Oyambre ${k} cm`),
    notas: ["Alto 45 cm y fondo 33 cm en todas las medidas.", `Vivo +${BANCO_VIVO} €.`],
  },
  puf: {
    columna: "Modelo y medida",
    filas: fila(PUF_BASE, PUF_PREMIUM, (k) =>
      k.startsWith("cuadrado-") ? `Patos cuadrado ${k.slice(9)} × ${k.slice(9)} cm` : `Monteferro redondo Ø ${k.slice(8)} cm`),
    notas: ["Alto 40 cm en todas las medidas.", `Vivo +${PUF_VIVO} €.`],
  },
  mesa: {
    columna: "Medida de la tapa",
    filas: fila(MESA_BASE, MESA_PREMIUM, (k) => `Cabo de Palos ${k.replace("x", " × ")} cm`),
    notas: ["Alto 40 cm.", `Vivo +${MESA_VIVO} €. Tapa de metacrilato +${EXTRA_METACRILATO} €. Tapa de cristal +${EXTRA_CRISTAL} €.`],
  },
  cojin: {
    columna: "Modelo y medida",
    filas: fila(COJIN_BASE, COJIN_PREMIUM, (k) => {
      const [modelo, medida] = k.split("-");
      const nombre = { rodiles: "Rodiles cuadrado", covadonga: "Covadonga rectangular", gulpiyuri: "Gulpiyuri rulo" }[modelo] ?? modelo;
      return `${nombre} ${medida.replace("x", " × ")} cm`;
    }),
    notas: [`Ribete incluido; ribete en tela distinta +${EXTRA_VIVO_DIFERENTE} €.`],
  },
  pantalla: {
    columna: "Forma y medida",
    filas: fila(PANTALLA_BASE, PANTALLA_PREMIUM, (k) =>
      k.replace("cilindro-", "Almanzor cilíndrica ").replace("cuadrado-", "Tormes cuadrada ").replace("rectangulo-", "La Serrota rectangular ")),
    notas: [],
  },
};

const eur = (n: number) => `${n} €`;

const PreciosOrientativos = ({ category, className = "" }: { category: Category; className?: string }) => {
  const t = TABLAS[category];
  if (!t) return null;
  return (
    <AnimatedSection delay={0.25} className={className}>
      <section aria-labelledby={`precios-${category}`} className="max-w-3xl mx-auto border-t border-border/40 pt-10">
        <h2 id={`precios-${category}`} className="font-serif text-2xl md:text-3xl font-light text-foreground text-center">
          Precios orientativos
        </h2>
        <span className="section-line" />
        <p className="mt-6 text-sm md:text-base text-muted-foreground font-light leading-relaxed text-center">
          Precio final con IVA por medida estándar. Con tela Básica va incluida; con tela Premium se suma un recargo fijo según la medida. Cualquier otra medida, en el configurador o consultándonos.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="text-left text-[10px] tracking-[0.18em] uppercase text-muted-foreground border-b border-border">
                <th scope="col" className="py-2 pr-4 font-medium">{t.columna}</th>
                <th scope="col" className="py-2 pr-4 font-medium text-right">Tela básica</th>
                <th scope="col" className="py-2 font-medium text-right">Tela premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {t.filas.map((f) => (
                <tr key={f.label}>
                  <th scope="row" className="py-2.5 pr-4 font-light text-foreground text-left">{f.label}</th>
                  <td className="py-2.5 pr-4 text-right text-foreground">desde {eur(f.basica)}</td>
                  <td className="py-2.5 text-right text-muted-foreground">desde {eur(f.premium)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-5 space-y-1 text-xs text-muted-foreground font-light leading-relaxed">
          {t.notas.map((n) => <li key={n}>{n}</li>)}
          <li>Envío en la Comunidad de Madrid {SHIPPING_MADRID} €; resto de la península según destino, confirmado antes de cerrar el pedido.</li>
          <li>Plazo de entrega habitual: 20 días naturales.</li>
        </ul>
        <p className="mt-6 text-center">
          <Link to={`/configurador?tipo=${category}`} className="underline underline-offset-4 text-sm text-foreground hover:text-accent-warm transition-colors">
            Calcula el precio exacto de tu medida en el configurador →
          </Link>
        </p>
      </section>
    </AnimatedSection>
  );
};

export default PreciosOrientativos;
