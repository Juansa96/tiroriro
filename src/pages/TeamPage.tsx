import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import SEO from "@/components/SEO";
import { QUIENES_SOMOS } from "@/data/narrativa";
import AnimatedSection from "@/components/AnimatedSection";

const FACTS = [
  { label: "Origen", value: "Hecho a mano en la Comunidad de Madrid, España" },
  { label: "Catálogo", value: "Cabeceros, pufs, mesas de centro y pantallas de lámpara" },
  { label: "Telas", value: "Más de 60 referencias entre básicas y premium" },
  { label: "Plazo de entrega", value: "20 días naturales desde la confirmación" },
  { label: "Envío", value: "Toda la península ibérica · Baleares y Canarias bajo consulta" },
  { label: "Pago", value: "Bizum, Stripe y transferencia bancaria · sin anticipo hasta confirmar" },
  { label: "Garantía", value: "Defectos de fabricación cubiertos · sin devoluciones por cambio de opinión (productos personalizados)" },
  { label: "Contacto", value: "info@tirorirohome.com · 660 786 453 · @tirorirohome" },
];

const TeamPage = () => (
  <>
    <SEO
      title="Quiénes somos | Tiroriro · Dos familias contra la indiferencia en casa"
      description="Tiroriro lo fundaron dos parejas en Boadilla del Monte. Hacemos a mano cabeceros, bancos, pufs y pantallas: los sitios donde una familia se encuentra y habla."
      canonical="https://tirorirohome.com/nosotros"
    />
    <Navbar />
    <main className="pt-20 md:pt-24">
      {/* Narrativa de marca (src/data/narrativa.ts): la familia y la indiferencia en casa */}
      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <AnimatedSection className="text-center">
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-4">Dos familias</p>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-foreground">{QUIENES_SOMOS.titulo}</h1>
            <span className="section-line" />
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="mt-8 space-y-5">
            {QUIENES_SOMOS.origen.map((p) => (
              <p key={p} className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">{p}</p>
            ))}
          </AnimatedSection>
          <AnimatedSection delay={0.15} className="mt-14">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground">{QUIENES_SOMOS.combatimosTitulo}</h2>
            <div className="w-10 h-px bg-accent-warm mt-3" />
            <div className="mt-6 space-y-5">
              {QUIENES_SOMOS.combatimos.map((p) => (
                <p key={p} className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">{p}</p>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-14">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground">{QUIENES_SOMOS.equipoTitulo}</h2>
            <div className="w-10 h-px bg-accent-warm mt-3" />
            <p className="mt-6 text-base md:text-lg text-muted-foreground font-light leading-relaxed">{QUIENES_SOMOS.equipo}</p>
          </AnimatedSection>
        </div>
      </section>
      <TeamSection />
      <section className="py-16 md:py-24 px-6 bg-secondary">
        <div className="container mx-auto max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">Datos clave de Tiroriro</h2>
            <span className="section-line" />
            <p className="mt-4 text-muted-foreground font-light italic text-base">
              Tiroriro es un taller artesanal con sede en la Comunidad de Madrid, especializado en mobiliario tapizado a medida. Fabricamos cada pieza a mano bajo pedido.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <dl className="divide-y divide-border border-y border-border">
              {FACTS.map((f) => (
                <div key={f.label} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 py-4">
                  <dt className="text-xs tracking-[0.18em] uppercase text-muted-foreground font-medium">{f.label}</dt>
                  <dd className="text-base text-foreground font-light leading-relaxed">{f.value}</dd>
                </div>
              ))}
            </dl>
          </AnimatedSection>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default TeamPage;
