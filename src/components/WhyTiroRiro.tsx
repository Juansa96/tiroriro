import AnimatedSection from "./AnimatedSection";

const REASONS = [
  { num: "01", title: "El origen", text: "Dos amigas de toda la vida, dos bebés casi a la vez, dos casas nuevas que decorar — y ninguna web que tuviera lo que buscaban sin costar una fortuna o parecer el catálogo de un hotel de aeropuerto." },
  { num: "02", title: "La filosofía", text: "Hay piezas que no deberían ser iguales en todos los hogares — y si vas a ver ese cabecero cada noche durante diez años, merece que sea exactamente el que querías desde el principio." },
  { num: "03", title: "Sin complicaciones", text: "Decorar bien no debería requerir saber de obras, de proveedores ni de montar nada — solo tener claro lo que te gusta y dejar que nuestro equipo haga el resto." },
  { num: "04", title: "Lo que no encuentras en otro sitio", text: "Un cabecero tapizado a medida, con la tela que tú eliges y el acabado que tú decides, no lo tiene ningún catálogo masivo — y el precio tampoco tiene que ser el de una boutique de lujo." },
  { num: "05", title: "Para quien no tiene tiempo", text: "Tú tienes trabajo, tienes vida y tienes cosas mejores que hacer que buscar tapiceros, pedir presupuestos y coordinar entregas — nuestro equipo hace todo eso para que tú solo tengas que abrir la puerta." },
];

const WhyTiroRiro = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Por qué TIRO·RIRO</h2>
        <span className="section-line" />
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <AnimatedSection>
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80"
            alt="Manos artesanas trabajando en tapicería de muebles"
            className="w-full aspect-[3/4] object-cover"
            loading="lazy"
            decoding="async"
          />
        </AnimatedSection>

        {/* Reasons */}
        <div className="flex flex-col">
          {REASONS.map((r, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className={`flex gap-5 py-8 ${i < REASONS.length - 1 ? "border-b border-border" : ""}`}>
                <span className="font-serif text-3xl md:text-4xl font-light leading-none shrink-0 text-accent-warm">
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

          <AnimatedSection delay={0.5} className="mt-6">
            <button
              onClick={() => document.getElementById('equipo')?.scrollIntoView({ behavior: 'smooth' })}
              className="cta-link"
            >
              Conoce nuestra historia →
            </button>
          </AnimatedSection>
        </div>
      </div>
    </div>
  </section>
);

export default WhyTiroRiro;
