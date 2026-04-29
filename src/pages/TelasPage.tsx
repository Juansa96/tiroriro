import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const FABRICS = [
  // Básicas — Lisas
  { name: "Arequipa Beige", coleccion: "Básicas", hex: "#D4C5A9", image: "/telas/basicas/arequipa-beige.webp", descripcion: "Lino en tono tierra cálido y natural. Versátil, combina con madera clara y tonos neutros." },
  // Básicas — Flores
  { name: "Flor Azul Protea", coleccion: "Básicas", hex: "#6B8FAA", image: "/telas/basicas/flor-azul-protea.webp", descripcion: "Floral botánico en azul. Perfecto para piezas que quieren protagonismo." },
  { name: "Floral Natural", coleccion: "Básicas", hex: "#8B7355", image: "/telas/basicas/flor-01.webp", descripcion: "Estampado floral en tono natural. Delicado y atemporal." },
  // Básicas — Geométricas
  { name: "Ikat Natural", coleccion: "Básicas", hex: "#C4A882", image: "/telas/basicas/ikat.webp", descripcion: "Tejido ikat en tonos arena. Artesanal con carácter étnico contemporáneo." },
  { name: "Ikat Verde Agua", coleccion: "Básicas", hex: "#7D9B76", image: "/telas/basicas/ikat-verde.webp", descripcion: "Ikat en verde agua refrescante. Tendencia en interiorismo natural." },
  { name: "Árbol Kasbah", coleccion: "Básicas", hex: "#8B6554", image: "/telas/basicas/arbol-kasbah.webp", descripcion: "Estampado árbol en tonos terracota. Bohemio y sofisticado." },
  { name: "Geométrica Kuwait", coleccion: "Básicas", hex: "#8B7355", image: "/telas/basicas/geometrica-kuwait.webp", descripcion: "Geométrico inspirado en la tapicería marroquí. Muy versátil." },
  { name: "Takada Verde", coleccion: "Básicas", hex: "#5B7355", image: "/telas/basicas/takada-verde.webp", descripcion: "Estampado geométrico en verde oliva. Fresco y contemporáneo." },
  // Básicas — Rayas
  { name: "Mil Rayas Gris", coleccion: "Básicas", hex: "#A0A0A0", image: "/telas/basicas/mil-rayas-gris.webp", descripcion: "Rayas finas tejidas en gris. Elegante y atemporal." },
  { name: "Rayas Arena", coleccion: "Básicas", hex: "#C4A882", image: "/telas/basicas/rayas-arena.webp", descripcion: "Raya duplo en tono arena. Natural y fácil de combinar." },
  { name: "Mil Rayas Azul Marino", coleccion: "Básicas", hex: "#2C3E50", image: "/telas/basicas/mil-rayas-azul.webp", descripcion: "Rayas tejidas en azul marino. Clásico náutico con personalidad." },
  { name: "Raya Índigo Acuarela", coleccion: "Básicas", hex: "#4A6FA5", image: "/telas/basicas/raya-indigo.webp", descripcion: "Raya artesanal en índigo acuarela. Efecto pintura único." },
  { name: "Rayas Tévere", coleccion: "Básicas", hex: "#8B7355", image: "/telas/basicas/rayas-tevere.webp", descripcion: "Raya clásica en tono natural. Versátil y resistente." },
  { name: "Coral Costero", coleccion: "Básicas", hex: "#E8A87C", image: "/telas/basicas/coral-costero.webp", descripcion: "Raya en coral y arena. Ideal para ambientes mediterráneos y playeros." },
  { name: "Raya Harvest", coleccion: "Básicas", hex: "#C19A6B", image: "/telas/basicas/raya-harvest.webp", descripcion: "Raya clásica en tonos harvest. Cálida y acogedora." },
  // Básicas — Otras
  { name: "Toile de Jouy Azul", coleccion: "Básicas", hex: "#6B8FAA", image: "/telas/basicas/toile-jouy-azul.webp", descripcion: "Clásico toile en azul. Romántico y con mucho carácter." },
  // Premium
  { name: "Baqueira", coleccion: "Premium", hex: "#5B4B3A", image: "/telas/premium/baqueira.webp", descripcion: "Tapicería premium de alto gramaje. Textura rica y tacto suave al toque." },
  { name: "Cérler", coleccion: "Premium", hex: "#8B7355", image: "/telas/premium/cerler.webp", descripcion: "Tejido premium en tono camel dorado. Lujoso y muy resistente." },
  { name: "Lola Gris", coleccion: "Premium", hex: "#6D6D6D", image: "/telas/premium/lola-gris.webp", descripcion: "Premium en gris marengo. Da carácter y elegancia a cualquier pieza." },
  { name: "Rocío", coleccion: "Premium", hex: "#D4B896", image: "/telas/premium/rocio.webp", descripcion: "Premium en tono arena suave. Luminoso y muy sofisticado." },
  { name: "Artesano Beige", coleccion: "Premium", hex: "#D4C5A9", image: "/telas/premium/artesano-beige.webp", descripcion: "Tejido artesanal en beige natural. Textura visible con acabado impecable." },
  { name: "Lino Verde Botella", coleccion: "Premium", hex: "#2D4A2D", image: "/telas/premium/lino-verde-botella.webp", descripcion: "Lino premium en verde botella intenso. Elegante y muy tendencia." },
  { name: "Lino Verde", coleccion: "Premium", hex: "#4A6B4A", image: "/telas/premium/lino-verde.webp", descripcion: "Lino viscosa en verde fresco. Fluido y de gran caída." },
  { name: "Güell Lamadrid", coleccion: "Premium", hex: "#8B7355", image: "/telas/premium/guell-lamadrid.webp", descripcion: "Tejido exclusivo Güell Lamadrid. Calidad de firma para proyectos especiales." },
  { name: "Rayas Verde Sage", coleccion: "Premium", hex: "#7D9B76", image: "/telas/premium/rayas-verde-sage.webp", descripcion: "Lino a rayas en verde sage. Natural y muy actual." },
  { name: "Lino Azul Provenzal", coleccion: "Premium", hex: "#4A6FA5", image: "/telas/premium/lino-azul-provenzal.webp", descripcion: "Lino en azul provenzal lavado. Evoca el sur de Francia." },
  { name: "Vichy Denim", coleccion: "Premium", hex: "#2C3E50", image: "/telas/premium/vichy-denim.webp", descripcion: "Cuadro vichy en denim. Fresco, clásico y con mucho estilo." },
  { name: "Ramas Siena Azul", coleccion: "Premium", hex: "#5B6B8B", image: "/telas/premium/ramas-siena.webp", descripcion: "Estampado botánico en azul siena. Exclusivo y con personalidad." },
  { name: "Flores Gardenia", coleccion: "Premium", hex: "#6B8FAA", image: "/telas/premium/flores-gardenia.webp", descripcion: "Lino con flores gardenia en turquesa. Romántico y único." },
];

const COLECCIONES = [
  { name: "Básicas", priceBadge: "Sin coste adicional", badgeClass: "bg-green-50 text-green-700 border-green-200" },
  { name: "Premium", priceBadge: "+25€ sobre el precio base", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
];

const WHATSAPP_URL = "https://wa.me/34660786453?text=" + encodeURIComponent("Hola, me gustaría pedir muestras de tela sin compromiso.");

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
              Telas básicas y premium para personalizar cualquier pieza a tu gusto. Todas resistentes, lavables y disponibles en una amplia variedad de colores y estampados.
            </p>
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
