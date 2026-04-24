import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const REASONS = [
  { num: "01", title: "Nació de una necesidad real", text: "Dos amigas, dos casas nuevas, ninguna web con lo que buscaban para que encajara de verdad. Así empezó Tiroriro — y ese problema sigue siendo la razón por la que existimos." },
  { num: "02", title: "Hecho para ti, no para un catálogo", text: "Si vas a ver ese cabecero cada noche durante diez años, merece ser exactamente el que querías. Tú eliges la tela, el tamaño y el acabado — nosotros lo construimos a mano." },
  { num: "03", title: "Tú solo abres la puerta", text: "Sin buscar tapiceros, sin pedir presupuestos, sin coordinar entregas. Nuestro equipo gestiona todo para que el resultado llegue listo a tu casa en 15 días." },
];

const WhyTiroRiro = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Por qué Tiroriro</h2>
        <span className="section-line" />
      </AnimatedSection>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        <AnimatedSection className="relative overflow-hidden min-h-[420px] lg:min-h-[580px]">
          <img
            src="/hero-why-tiroriro.jpg"
            alt="Manos artesanas trabajando en tapicería de muebles"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </AnimatedSection>
        <div className="flex flex-col justify-center">
          {REASONS.map((r, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className={`flex gap-5 py-8 ${i < REASONS.length - 1 ? "border-b border-border" : ""}`}>
                <span className="font-serif text-3xl md:text-4xl font-light leading-none shrink-0 text-accent-warm">{r.num}</span>
                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">{r.title}</h3>
                  <p className="mt-2 text-base text-muted-foreground font-light leading-relaxed">{r.text}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      <AnimatedSection delay={0.2} className="mt-12 text-center">
        <Link
          to="/configurador"
          className="btn-sweep btn-unir btn-unir-outline inline-flex items-center px-8 py-3 text-xs font-light"
        >
          <span className="relative z-10">Diseña el tuyo</span>
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default WhyTiroRiro;
