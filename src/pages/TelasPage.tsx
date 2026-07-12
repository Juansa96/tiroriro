import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { FABRICS } from "@/lib/fabrics";
import SEO from "@/components/SEO";

const COLECCIONES = [
  { name: "Básicas", priceBadge: "Sin coste adicional", badgeClass: "bg-green-50 text-green-700 border-green-200" },
  { name: "Premium", priceBadge: "+25€ sobre el precio base", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
];

const WHATSAPP_URL = "https://wa.me/34660786453?text=" + encodeURIComponent("Hola, tengo dudas sobre las telas y me gustaría orientación.");

const TelasPage = () => (
  <>
    <SEO
      title="Telas para tapizado | Más de 60 opciones | Tiroriro"
      description="Más de 60 telas básicas y premium para tapizar tu pieza a medida: lisas, flores, rayas y geométricas. Consulta disponibilidad de stock."
      canonical="https://tirorirohome.com/telas"
    />
    <Navbar />
    <main className="pt-20 md:pt-24">
      {/* Header */}
      <section className="py-16 md:py-24 px-6 bg-secondary">
        <div className="container mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-4">Colecciones</p>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-foreground">Nuestras telas</h1>
            <span className="section-line" />
            <p className="mt-6 text-base text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
              Telas básicas y premium para personalizar cualquier pieza a tu gusto. Todas resistentes, lavables y disponibles en una amplia variedad de colores y estampados.
            </p>
            <p className="mt-3 text-xs text-muted-foreground/60 font-light italic">Sujeto a disponibilidad de stock.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {COLECCIONES.map((c) => (
                <span key={c.name} className="px-4 py-1.5 border border-border rounded-full text-xs tracking-widest uppercase text-muted-foreground">
                  {c.name}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Fabric grid */}
      {COLECCIONES.map((col) => {
        const items = FABRICS.filter((f) => f.coleccion === col.name);
        return (
          <section key={col.name} className="py-14 md:py-20 px-6">
            <div className="container mx-auto max-w-6xl">
              <AnimatedSection className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground">{col.name}</h2>
                  <div className="w-10 h-px bg-accent-warm mt-3" />
                </div>
                <span className={`self-start sm:self-auto inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium tracking-wide ${col.badgeClass}`}>
                  {col.priceBadge}
                </span>
              </AnimatedSection>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {items.map((fabric, i) => (
                  <AnimatedSection key={fabric.name} delay={i * 0.08}>
                    <div className="group cursor-default">
                      <div className="relative overflow-hidden rounded-xl aspect-square bg-secondary">
                        <img
                          src={fabric.image}
                          alt={`Tela ${fabric.name} para tapizado`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none rounded-xl" />
                      </div>
                      <div className="mt-3 flex items-start gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full border border-border flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: fabric.hex }}
                        />
                        <div>
                          <p className="font-serif text-base font-light text-foreground leading-tight">{fabric.name}</p>
                          <p className="hidden md:block text-xs text-muted-foreground font-light mt-1 leading-relaxed">{fabric.descripcion}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {/* Mensaje más telas */}
              <AnimatedSection className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 rounded-xl border border-border/50 bg-secondary/60">
                <p className="text-sm text-muted-foreground font-light">
                  ¿No encuentras lo que buscas? Tenemos más telas fuera de la web.
                </p>
                <div className="flex gap-3 flex-shrink-0">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground border border-border rounded-full px-4 py-2 hover:border-foreground/60 transition-colors"
                  >
                    <MessageCircle size={13} />
                    WhatsApp
                  </a>
                  <Link
                    to="/#contacto"
                    className="inline-flex items-center text-xs font-medium text-foreground border border-border rounded-full px-4 py-2 hover:border-foreground/60 transition-colors"
                  >
                    Formulario
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </section>
        );
      })}

      {/* CTA final */}
      <section className="bg-[#10262e] py-16 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-3">¿Tienes dudas?</p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-white mb-4">
              Te ayudamos a elegir
            </h2>
            <p className="text-sm text-white/60 font-light mb-8 leading-relaxed">
              Si no sabes cuál encaja mejor con tu espacio, escríbenos por WhatsApp. Te orientamos sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sweep btn-unir btn-unir-light inline-flex items-center justify-center gap-2 px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
              >
                <MessageCircle size={14} className="relative z-10" />
                <span className="relative z-10">Escríbenos por WhatsApp</span>
              </a>
              <Link
                to="/configurador"
                className="btn-sweep btn-unir btn-unir-light inline-flex items-center justify-center px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
              >
                <span className="relative z-10">Diseña tu pieza →</span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default TelasPage;
