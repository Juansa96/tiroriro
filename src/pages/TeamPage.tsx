import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import SEO from "@/components/SEO";
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
      title="Quiénes somos | Tiroriro · Tapizado artesanal"
      description="Conoce el equipo detrás de Tiroriro: artesanos especializados en tapizado a medida, hecho a mano en España con más de 60 telas disponibles."
      canonical="https://tirorirohome.com/nosotros"
    />
    <Navbar />
    <main className="pt-20 md:pt-24">
      <h1 className="sr-only">Quiénes somos · Tiroriro</h1>
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
