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
  { name: "Hoja Botánica Verde", coleccion: "Básicas", hex: "#7A8B6A", image: "/telas/basicas/hoja-botanica-verde.webp", descripcion: "Estampado de hojas en verde oliva sobre fondo crudo. Natural y muy actual." },
  { name: "Flor Hémera Amarilla", coleccion: "Básicas", hex: "#D4B84A", image: "/telas/basicas/flor-hemera-amarilla.webp", descripcion: "Floral en amarillo cálido. Alegre y luminoso, perfecto para dar vida a cualquier espacio." },
  { name: "Morris Granadas Terracota", coleccion: "Básicas", hex: "#B5604A", image: "/telas/basicas/morris-granadas-terracota.webp", descripcion: "Inspirado en William Morris, granadas en terracota. Clásico con mucho carácter." },
  { name: "Pájaros Louise Azul", coleccion: "Básicas", hex: "#5B7EA6", image: "/telas/basicas/pajaros-louise-azul.webp", descripcion: "Estampado de pájaros en azul. Delicado y con personalidad propia." },
  { name: "Pájaros Louise Rosa", coleccion: "Básicas", hex: "#C48080", image: "/telas/basicas/pajaros-louise-rosa.webp", descripcion: "Estampado de pájaros en rosa empolvado. Romántico y atemporal." },
  { name: "Pájaros Louise Verde", coleccion: "Básicas", hex: "#5B8A6A", image: "/telas/basicas/pajaros-louise-verde.webp", descripcion: "Estampado de pájaros en verde natural. Fresco y lleno de vida." },
  { name: "Floralia Vintage", coleccion: "Básicas", hex: "#8B6B4A", image: "/telas/basicas/floralia-vintage.webp", descripcion: "Floral vintage en tonos tierra. Evoca la tapicería clásica con aire contemporáneo." },
  // Básicas — Geométricas
  { name: "Ikat Natural", coleccion: "Básicas", hex: "#C4A882", image: "/telas/basicas/ikat.webp", descripcion: "Tejido ikat en tonos arena. Artesanal con carácter étnico contemporáneo." },
  { name: "Ikat Verde Agua", coleccion: "Básicas", hex: "#7D9B76", image: "/telas/basicas/ikat-verde.webp", descripcion: "Ikat en verde agua refrescante. Tendencia en interiorismo natural." },
  { name: "Ikat Arena", coleccion: "Básicas", hex: "#C8A878", image: "/telas/basicas/ikat-arena.webp", descripcion: "Ikat en tono arena cálido. Artesanal y muy versátil." },
  { name: "Ikat Arrecife", coleccion: "Básicas", hex: "#6B8B8B", image: "/telas/basicas/ikat-arrecife.webp", descripcion: "Ikat en azul arrecife. Evoca el mar con elegancia." },
  { name: "Ikat Bali Azul", coleccion: "Básicas", hex: "#4A6B8B", image: "/telas/basicas/ikat-bali-azul.webp", descripcion: "Ikat artesanal en azul Bali. Étnico y sofisticado a la vez." },
  { name: "Ikat Yakarta", coleccion: "Básicas", hex: "#8B7A55", image: "/telas/basicas/ikat-yakarta.webp", descripcion: "Lino ikat en tonos naturales. Carácter artesanal con textura visible." },
  { name: "Árbol Kasbah", coleccion: "Básicas", hex: "#8B6554", image: "/telas/basicas/arbol-kasbah.webp", descripcion: "Estampado árbol en tonos terracota. Bohemio y sofisticado." },
  { name: "Geométrica Kuwait", coleccion: "Básicas", hex: "#8B7355", image: "/telas/basicas/geometrica-kuwait.webp", descripcion: "Geométrico inspirado en la tapicería marroquí. Muy versátil." },
  { name: "Takada Verde", coleccion: "Básicas", hex: "#5B7355", image: "/telas/basicas/takada-verde.webp", descripcion: "Estampado geométrico en verde oliva. Fresco y contemporáneo." },
  { name: "Paisley Azul", coleccion: "Básicas", hex: "#4A6B8B", image: "/telas/basicas/paisley-azul.webp", descripcion: "Paisley clásico en azul sobre fondo crudo. Sofisticado y con mucho detalle." },
  { name: "Espiga Agua", coleccion: "Básicas", hex: "#8BA89A", image: "/telas/basicas/espiga-agua.webp", descripcion: "Tejido espiga en tono agua marina. Textura elegante y muy resistente." },
  // Básicas — Rayas
  { name: "Mil Rayas Gris", coleccion: "Básicas", hex: "#A0A0A0", image: "/telas/basicas/mil-rayas-gris.webp", descripcion: "Rayas finas tejidas en gris. Elegante y atemporal." },
  { name: "Rayas Arena", coleccion: "Básicas", hex: "#C4A882", image: "/telas/basicas/rayas-arena.webp", descripcion: "Raya duplo en tono arena. Natural y fácil de combinar." },
  { name: "Mil Rayas Azul Marino", coleccion: "Básicas", hex: "#2C3E50", image: "/telas/basicas/mil-rayas-azul.webp", descripcion: "Rayas tejidas en azul marino. Clásico náutico con personalidad." },
  { name: "Raya Índigo Acuarela", coleccion: "Básicas", hex: "#4A6FA5", image: "/telas/basicas/raya-indigo.webp", descripcion: "Raya artesanal en índigo acuarela. Efecto pintura único." },
  { name: "Rayas Tévere", coleccion: "Básicas", hex: "#8B7355", image: "/telas/basicas/rayas-tevere.webp", descripcion: "Raya clásica en tono natural. Versátil y resistente." },
  { name: "Coral Costero", coleccion: "Básicas", hex: "#E8A87C", image: "/telas/basicas/coral-costero.webp", descripcion: "Raya en coral y arena. Ideal para ambientes mediterráneos y playeros." },
  { name: "Raya Harvest", coleccion: "Básicas", hex: "#C19A6B", image: "/telas/basicas/raya-harvest.webp", descripcion: "Raya clásica en tonos harvest. Cálida y acogedora." },
  { name: "Rayas Laurel Azul", coleccion: "Básicas", hex: "#5B7A9A", image: "/telas/basicas/rayas-laurel-azul.webp", descripcion: "Raya en azul laurel con fondo natural. Fresca y muy combinable." },
  { name: "Lino Greca", coleccion: "Básicas", hex: "#C4B090", image: "/telas/basicas/lino-greca.webp", descripcion: "Lino con motivo greca tejido. Clásico y de gran elegancia." },
  { name: "Raya Rioja", coleccion: "Básicas", hex: "#8B3A3A", image: "/telas/basicas/raya-rioja.webp", descripcion: "Raya en burdeos Rioja. Cálida y con mucha personalidad." },
  { name: "Rayas Espiga Arena", coleccion: "Básicas", hex: "#C8AA82", image: "/telas/basicas/rayas-espiga-arena.webp", descripcion: "Espiga tejida en tono arena. Textura artesanal muy elegante." },
  { name: "Rayas Espiga Azul", coleccion: "Básicas", hex: "#4A6B8A", image: "/telas/basicas/rayas-espiga-azul.webp", descripcion: "Espiga en azul profundo. Clásico, resistente y muy versátil." },
  { name: "Rayas Piave", coleccion: "Básicas", hex: "#7A8B6A", image: "/telas/basicas/rayas-piave.webp", descripcion: "Raya Piave en tonos naturales. Discreta y de gran calidad." },
  { name: "Raya Artesanal Lino", coleccion: "Básicas", hex: "#C8B890", image: "/telas/basicas/raya-artesanal-lino.webp", descripcion: "Raya artesanal en lino natural. Textura visible y acabado cuidado." },
  { name: "Raya Relieve Lino", coleccion: "Básicas", hex: "#D4C8A8", image: "/telas/basicas/raya-relieve-lino.webp", descripcion: "Lino con raya en relieve. Elegante al tacto y a la vista." },
  // Básicas — Otras
  { name: "Toile de Jouy Azul", coleccion: "Básicas", hex: "#6B8FAA", image: "/telas/basicas/toile-jouy-azul.webp", descripcion: "Clásico toile en azul. Romántico y con mucho carácter." },
  { name: "Espiga Azul", coleccion: "Básicas", hex: "#5A7890", image: "/telas/basicas/espiga-azul.webp", descripcion: "Tejido espiga en azul. Elegante y muy resistente al uso." },
  { name: "Morris Granadas Azul", coleccion: "Básicas", hex: "#4A6B8B", image: "/telas/basicas/morris-granadas-azul.webp", descripcion: "Granadas Morris en azul. Clásico inglés con carácter propio." },
  { name: "Pata de Gallo Verde", coleccion: "Básicas", hex: "#5A7A5A", image: "/telas/basicas/pata-de-gallo-verde.webp", descripcion: "Pata de gallo en verde salvia. Sofisticado y muy actual." },
  { name: "Ikat Rojo", coleccion: "Básicas", hex: "#B54A4A", image: "/telas/basicas/ikat-rojo.webp", descripcion: "Ikat en rojo intenso. Vibrante y con mucha energía." },
  // Premium
  { name: "Baqueira", coleccion: "Premium", hex: "#5B4B3A", image: "/telas/premium/baqueira.webp", descripcion: "Tapicería premium de alto gramaje. Textura rica y tacto suave al toque." },
  { name: "Baqueira Roja", coleccion: "Premium", hex: "#8B3A3A", image: "/telas/premium/baqueira-roja.webp", descripcion: "Baqueira en burdeos intenso. Sofisticada y de gran carácter." },
  { name: "Cérler", coleccion: "Premium", hex: "#8B7355", image: "/telas/premium/cerler.webp", descripcion: "Tejido premium en tono camel dorado. Lujoso y muy resistente." },
  { name: "Cérler Azul", coleccion: "Premium", hex: "#4A6B8B", image: "/telas/premium/cerler-azul.webp", descripcion: "Cérler en azul profundo. Elegancia premium con carácter mediterráneo." },
  { name: "Lola Gris", coleccion: "Premium", hex: "#6D6D6D", image: "/telas/premium/lola-gris.webp", descripcion: "Premium en gris marengo. Da carácter y elegancia a cualquier pieza." },
  { name: "Rocío", coleccion: "Premium", hex: "#D4B896", image: "/telas/premium/rocio.webp", descripcion: "Premium en tono arena suave. Luminoso y muy sofisticado." },
  { name: "Artesano Beige", coleccion: "Premium", hex: "#D4C5A9", image: "/telas/premium/artesano-beige.webp", descripcion: "Tejido artesanal en beige natural. Textura visible con acabado impecable." },
  { name: "Oxford", coleccion: "Premium", hex: "#D0C8B8", image: "/telas/premium/oxford.webp", descripcion: "Lino Oxford de alto gramaje. Elegancia atemporal con una textura exquisita." },
  { name: "Lino Verde Botella", coleccion: "Premium", hex: "#2D4A2D", image: "/telas/premium/lino-verde-botella.webp", descripcion: "Lino premium en verde botella intenso. Elegante y muy tendencia." },
  { name: "Lino Verde", coleccion: "Premium", hex: "#4A6B4A", image: "/telas/premium/lino-verde.webp", descripcion: "Lino viscosa en verde fresco. Fluido y de gran caída." },
  { name: "Güell Lamadrid", coleccion: "Premium", hex: "#8B7355", image: "/telas/premium/guell-lamadrid.webp", descripcion: "Tejido exclusivo Güell Lamadrid. Calidad de firma para proyectos especiales." },
  { name: "Rayas Verde Sage", coleccion: "Premium", hex: "#7D9B76", image: "/telas/premium/rayas-verde-sage.webp", descripcion: "Lino a rayas en verde sage. Natural y muy actual." },
  { name: "Lino Azul Provenzal", coleccion: "Premium", hex: "#4A6FA5", image: "/telas/premium/lino-azul-provenzal.webp", descripcion: "Lino en azul provenzal lavado. Evoca el sur de Francia." },
  { name: "Vichy Denim", coleccion: "Premium", hex: "#2C3E50", image: "/telas/premium/vichy-denim.webp", descripcion: "Cuadro vichy en denim. Fresco, clásico y con mucho estilo." },
  { name: "Vichy Verde", coleccion: "Premium", hex: "#4A7A5A", image: "/telas/premium/vichy-verde.webp", descripcion: "Vichy en verde salvia. Clásico con un toque natural muy actual." },
  { name: "Ramas Siena Azul", coleccion: "Premium", hex: "#5B6B8B", image: "/telas/premium/ramas-siena.webp", descripcion: "Estampado botánico en azul siena. Exclusivo y con personalidad." },
  { name: "Flores Gardenia", coleccion: "Premium", hex: "#6B8FAA", image: "/telas/premium/flores-gardenia.webp", descripcion: "Lino con flores gardenia en turquesa. Romántico y único." },
  { name: "Lino Flores Normandía", coleccion: "Premium", hex: "#8BA870", image: "/telas/premium/lino-flores-normandia.webp", descripcion: "Lino con flores en verde Normandía. Romántico y de gran calidad." },
  { name: "Lino Flores Senda", coleccion: "Premium", hex: "#C8A8A0", image: "/telas/premium/lino-flores-senda.webp", descripcion: "Flores delicadas sobre lino natural. Elegante y con mucho detalle." },
  { name: "Bibiana", coleccion: "Premium", hex: "#8B7A8B", image: "/telas/premium/bibiana.webp", descripcion: "Tejido Bibiana con textura única. Sofisticado y de alto gramaje." },
  { name: "Prints Botánicos", coleccion: "Premium", hex: "#5A7A5A", image: "/telas/premium/prints-botanicos.webp", descripcion: "Estampado botánico en lino premium. Exclusivo y lleno de detalle." },
  { name: "Raya Monina", coleccion: "Premium", hex: "#C8B890", image: "/telas/premium/raya-monina.webp", descripcion: "Lino raya Monina de gran finura. Natural y muy elegante." },
  { name: "Rayas Jules Verde", coleccion: "Premium", hex: "#4A7A5A", image: "/telas/premium/rayas-jules-verde.webp", descripcion: "Rayas Jules en verde. Clásico y sofisticado con un toque fresco." },
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
                          <p className="hidden md:block text-xs text-muted-foreground font-light mt-1 leading-relaxed">{fabric.descripcion}</p>
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
