import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const FABRICS = [
  { name: "Lino Natural", coleccion: "Linos", hex: "#D4C5A9", image: "/telas/tela-01.webp", descripcion: "Tono tierra cálido y natural. Versátil, combina con madera clara y tonos neutros." },
  { name: "Lino Crudo", coleccion: "Linos", hex: "#E8DCC8", image: "/telas/tela-02.jpg", descripcion: "El más luminoso de los linos. Ideal para espacios nórdicos y minimalistas." },
  { name: "Gris Perla", coleccion: "Linos", hex: "#C8C4BC", image: "/telas/tela-03.webp", descripcion: "Gris suave con matiz cálido. El favorito para dormitorios contemporáneos." },
  { name: "Azul Marino", coleccion: "Linos", hex: "#2C3E50", image: "/telas/tela-04.jpg", descripcion: "Profundo y elegante. Aporta personalidad a cualquier pieza tapizada." },
  { name: "Verde Salvia", coleccion: "Linos", hex: "#7D9B76", image: "/telas/tela-05.jpg", descripcion: "Verde apagado con matiz gris. Tendencia en interiorismo sostenible." },
  { name: "Esmeralda", coleccion: "Terciopelos", hex: "#1B4D3E", image: "/telas/tela-06.png", descripcion: "Terciopelo con profundidad cromática única. Lujoso y atemporal." },
  { name: "Burdeos", coleccion: "Terciopelos", hex: "#6D1A36", image: "/telas/tela-07.png", descripcion: "Color intenso y envolvente. Crea una atmósfera cálida y sofisticada." },
  { name: "Camel", coleccion: "Terciopelos", hex: "#C19A6B", image: "/telas/tela-08.png", descripcion: "Tono dorado suave. Armoniza con madera oscura y metales dorados." },
  { name: "Negro", coleccion: "Terciopelos", hex: "#1C1C1C", image: "/telas/tela-09.jpg", descripcion: "Clásico atemporal. Da un carácter definido a cabeceros y bancos." },
  { name: "Bouclé", coleccion: "Bouclé", hex: "#F5F0E8", image: "/telas/tela-10.jpg", descripcion: "Textura rizada con calidez artesanal. La más táctil de nuestra colección." },
];

const COLECCIONES = ["Linos", "Terciopelos", "Bouclé"];

const WHATSAPP_URL = "https://wa.me/34645363323?text=" + encodeURIComponent("Hola, me gustaría pedir muestras de tela sin compromiso.");

const TelasPage = () => (
  <>
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
              Linos naturales, terciopelos italianos y bouclé artesanal. Todas nuestras telas son resistentes, lavables y vienen disponibles en 10 colores para personalizar tu pieza.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {COLECCIONES.map((c) => (
                <span key={c} className="px-4 py-1.5 border border-border rounded-full text-xs tracking-widest uppercase text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Fabric grid */}
      {COLECCIONES.map((col) => {
        const items = FABRICS.filter((f) => f.coleccion === col);
        return (
          <section key={col} className="py-14 md:py-20 px-6">
            <div className="container mx-auto max-w-6xl">
              <AnimatedSection className="mb-10">
                <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground">{col}</h2>
                <div className="w-10 h-px bg-accent-warm mt-3" />
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
                          <p className="text-xs text-muted-foreground font-light mt-1 leading-relaxed">{fabric.descripcion}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Muestras CTA */}
      <section className="bg-[#10262e] py-16 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-3">Sin compromiso</p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-white mb-4">
              Pide muestras a casa
            </h2>
            <p className="text-sm text-white/60 font-light mb-8 leading-relaxed">
              Recibe muestras físicas de las telas que más te gusten antes de decidir. Tocas la calidad en tu mano y las ves con la luz de tu espacio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sweep btn-unir inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-light"
                style={{
                  "--btn-bg": "transparent",
                  "--btn-fg": "#ffffff",
                  "--btn-border": "rgba(255,255,255,0.65)",
                  "--btn-hover-bg": "rgba(255,255,255,0.1)",
                  "--btn-hover-fg": "#ffffff",
                  "--btn-hover-border": "rgba(255,255,255,0.65)",
                } as React.CSSProperties}
              >
                <MessageCircle size={14} className="relative z-10" />
                <span className="relative z-10">Pedir muestras por WhatsApp</span>
              </a>
              <Link
                to="/configurador"
                className="btn-sweep btn-unir inline-flex items-center justify-center px-7 py-3 text-xs font-light"
                style={{
                  "--btn-bg": "transparent",
                  "--btn-fg": "#ffffff",
                  "--btn-border": "rgba(255,255,255,0.65)",
                  "--btn-hover-bg": "rgba(255,255,255,0.1)",
                  "--btn-hover-fg": "#ffffff",
                  "--btn-hover-border": "rgba(255,255,255,0.65)",
                } as React.CSSProperties}
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
