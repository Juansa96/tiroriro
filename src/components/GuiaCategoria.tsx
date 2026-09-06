import AnimatedSection from "@/components/AnimatedSection";
import { GUIAS } from "@/data/guias";

// Guía de compra al final de una página de categoría (o de telas). El texto
// vive en src/data/guias.ts. Estructura semántica (h2 / h3 / listas) para que
// buscadores y asistentes de IA la lean como una guía y no como decoración.
const GuiaCategoria = ({ guiaKey, className = "" }: { guiaKey: string; className?: string }) => {
  const guia = GUIAS[guiaKey];
  if (!guia) return null;
  return (
    <AnimatedSection delay={0.3} className={className}>
      <section aria-labelledby={`guia-${guiaKey}`} className="max-w-3xl mx-auto border-t border-border/40 pt-10">
        <h2 id={`guia-${guiaKey}`} className="font-serif text-2xl md:text-3xl font-light text-foreground text-center">
          {guia.titulo}
        </h2>
        <span className="section-line" />
        <p className="mt-6 text-base text-muted-foreground font-light leading-relaxed text-center">{guia.intro}</p>
        <div className="mt-10 space-y-8">
          {guia.bloques.map((b) => (
            <div key={b.titulo}>
              <h3 className="font-serif text-lg md:text-xl text-foreground">{b.titulo}</h3>
              {b.parrafos.map((p, i) => (
                <p key={i} className="mt-2 text-sm md:text-base text-muted-foreground font-light leading-relaxed">{p}</p>
              ))}
              {b.lista && (
                <ul className="mt-3 space-y-1.5 text-sm md:text-base text-muted-foreground font-light leading-relaxed list-disc pl-5 marker:text-accent-warm">
                  {b.lista.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </AnimatedSection>
  );
};

export default GuiaCategoria;
