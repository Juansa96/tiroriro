import AnimatedSection from "./AnimatedSection";

const REASONS = [
  { num: "01", title: "El origen", text: "Dos amigas de toda la vida, dos bebés casi a la vez, dos casas nuevas que decorar — y ninguna web que tuviera lo que buscaban sin costar una fortuna o parecer el catálogo de un hotel de aeropuerto." },
  { num: "02", title: "La filosofía", text: "Hay piezas que no deberían ser iguales en todos los hogares — y si vas a ver ese cabecero cada noche durante diez años, merece que sea exactamente el que querías desde el principio." },
  { num: "03", title: "Sin complicaciones", text: "Decorar bien no debería requerir saber de obras, de proveedores ni de montar nada — solo tener claro lo que te gusta y dejar que nosotras hagamos el resto." },
  { num: "04", title: "Lo que no encuentras en otro sitio", text: "Un cabecero tapizado a medida, con la tela que tú eliges y el acabado que tú decides, no lo tiene ningún catálogo masivo — y el precio tampoco tiene que ser el de una boutique de lujo." },
  { num: "05", title: "Para quien no tiene tiempo", text: "Tú tienes trabajo, tienes vida y tienes cosas mejores que hacer que buscar tapiceros, pedir presupuestos y coordinar entregas — nosotras hacemos todo eso para que tú solo tengas que abrir la puerta." },
];

const STATS = [
  { number: "73%", text: "de las personas que se mudan a casa nueva declaran que la decoración del dormitorio es su primera prioridad", source: "Houzz, 2023" },
  { number: "210%", text: "creció la búsqueda de \"cabecero personalizado\" en España entre 2021 y 2023", source: "Google Trends" },
  { number: "81%", text: "de los compradores de decoración online abandonaron una compra porque no podían visualizar el producto", source: "IKEA Insights" },
  { number: "34%", text: "aumenta la percepción de bienestar en una habitación bien decorada", source: "Universidad de Exeter" },
];

const WhyTiroRiro = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Por qué TIRO·RIRO</h2>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <AnimatedSection>
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80"
            alt="Manos artesanas trabajando en tapicería"
            className="w-full aspect-[3/4] object-cover"
            loading="lazy"
          />
        </AnimatedSection>

        {/* Reasons */}
        <div className="flex flex-col gap-10">
          {REASONS.map((r, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="flex gap-5">
                <span className="font-serif text-3xl md:text-4xl text-earth/40 font-light leading-none shrink-0">
                  {r.num}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-medium text-foreground">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed italic">
                    "{r.text}"
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <AnimatedSection key={i} delay={i * 0.1} className="text-center p-6">
            <span className="font-serif text-4xl md:text-5xl font-light text-foreground">{s.number}</span>
            <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">{s.text}</p>
            <p className="mt-1 text-xs text-muted-foreground/60 italic">{s.source}</p>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default WhyTiroRiro;
