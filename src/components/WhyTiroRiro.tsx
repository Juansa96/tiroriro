import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { POR_QUE_TIRORIRO } from "@/data/narrativa";

// El texto vive en src/data/narrativa.ts (misma fuente que /nosotros y llms-full.txt).
const { kicker, titulo, intro, razones, cita } = POR_QUE_TIRORIRO;

const WhyTiroRiro = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <p className="text-[10px] tracking-[0.22em] uppercase text-accent-warm font-medium mb-4">{kicker}</p>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">{titulo}</h2>
        <span className="section-line" />
        <p className="mt-5 text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">{intro}</p>
      </AnimatedSection>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        <AnimatedSection className="relative overflow-hidden min-h-[420px] lg:min-h-[580px]">
          <img
            src="/hero-why-tiroriro.webp"
            alt="Manos artesanas trabajando en tapicería de muebles"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </AnimatedSection>
        <div className="flex flex-col justify-center">
          {razones.map((r, i) => (
            <AnimatedSection key={r.num} delay={i * 0.08}>
              <div className={`flex gap-5 py-8 ${i < razones.length - 1 ? "border-b border-border" : ""}`}>
                <span className="font-serif text-3xl md:text-4xl font-light leading-none shrink-0 text-accent-warm">{r.num}</span>
                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">{r.titulo}</h3>
                  <p className="mt-2 text-base text-muted-foreground font-light leading-relaxed">{r.texto}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      <AnimatedSection delay={0.15} className="mt-14 text-center">
        <blockquote className="max-w-2xl mx-auto">
          <p className="font-serif text-xl md:text-2xl font-light italic text-foreground leading-relaxed">«{cita.texto}»</p>
          <footer className="mt-3 text-xs tracking-[0.18em] uppercase text-muted-foreground">{cita.autor}</footer>
        </blockquote>
      </AnimatedSection>
      <AnimatedSection delay={0.2} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <Link
          to="/configurador"
          className="btn-sweep btn-unir btn-unir-outline inline-flex items-center px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
        >
          <span className="relative z-10">Diseña el tuyo →</span>
        </Link>
        <Link
          to="/nosotros"
          className="text-xs tracking-[0.18em] uppercase font-light text-foreground/80 underline underline-offset-4 decoration-border hover:text-foreground hover:decoration-accent-warm transition-colors"
        >
          Conócenos →
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default WhyTiroRiro;
