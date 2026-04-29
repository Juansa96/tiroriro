import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const PRODUCTS_DATA = [
  {
    id: "cabeceros",
    name: "Cabeceros tapizados",
    badge: "Hecho a mano",
    price: "desde 225€",
    image: "/productos-fotos/cabeceros/pregonda-02.webp",
    alt: "Cabecero tapizado artesanal de Tiroriro",
    link: "/productos/cabeceros",
    comingSoon: false,
  },
  {
    id: "cojines",
    name: "Almohadones",
    badge: "Artesanal",
    price: "desde 50€",
    image: "/productos-fotos/almohadones/covadonga-01.webp",
    alt: "Cojines y almohadones artesanales de Tiroriro",
    link: "/productos/cojines",
    comingSoon: false,
  },
  {
    id: "pufs",
    name: "Pufs",
    badge: "A tu medida",
    price: "desde 125€",
    image: "/productos-fotos/puff/patos-card.webp",
    alt: "Pufs tapizados a medida de Tiroriro",
    link: "/productos/pufs",
    comingSoon: false,
  },
  {
    id: "mesas-centro",
    name: "Mesas de centro",
    badge: "Tapizado único",
    price: "desde 280€",
    image: "/productos-fotos/mesas/calblanque-01.webp",
    alt: "Mesa de centro tapizada de Tiroriro",
    link: "/productos/mesas-centro",
    comingSoon: false,
  },
  {
    id: "pantallas-lampara",
    name: "Pantallas de lámpara",
    badge: "Nuevo",
    price: "desde 25€",
    image: "/productos-fotos/pantallas/almanzor-01.webp",
    alt: "Pantallas de lámpara tapizadas de Tiroriro",
    link: "/productos/pantallas-lampara",
    comingSoon: false,
  },
];

const FABRIC_STRIP = [
  { name: "Arequipa Beige", hex: "#D4C5A9", image: "/telas/basicas/arequipa-beige.webp" },
  { name: "Lino Natural", hex: "#E8DCC8", image: "/telas/basicas/liso-natural-01.webp" },
  { name: "Lino Gris Perla", hex: "#C8C4BC", image: "/telas/basicas/liso-natural-02.webp" },
  { name: "Flor Azul Protea", hex: "#6B8FAA", image: "/telas/basicas/flor-azul-protea.webp" },
  { name: "Ikat Natural", hex: "#C4A882", image: "/telas/basicas/ikat.webp" },
  { name: "Mil Rayas Gris", hex: "#A0A0A0", image: "/telas/basicas/mil-rayas-gris.webp" },
  { name: "Mil Rayas Azul", hex: "#2C3E50", image: "/telas/basicas/mil-rayas-azul.webp" },
  { name: "Baqueira", hex: "#5B4B3A", image: "/telas/premium/baqueira.webp" },
  { name: "Lola Gris", hex: "#6D6D6D", image: "/telas/premium/lola-gris.webp" },
  { name: "Lino Verde Botella", hex: "#2D4A2D", image: "/telas/premium/lino-verde-botella.webp" },
  { name: "Vichy Denim", hex: "#2C3E50", image: "/telas/premium/vichy-denim.webp" },
  { name: "Flores Gardenia", hex: "#6B8FAA", image: "/telas/premium/flores-gardenia.webp" },
];

const ProductsPreview = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    const autoplay = window.setInterval(() => api.scrollNext(), 3500);
    return () => {
      window.clearInterval(autoplay);
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <>
      {/* ── Carousel de productos ── */}
      <section id="productos-home" className="pt-8 pb-10 md:py-32 md:px-6">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h2>
            <span className="section-line" />
          </AnimatedSection>

          <div className="relative max-w-6xl mx-auto">
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Anterior"
              className="hidden md:flex absolute -left-14 top-[45%] z-10 h-10 w-10 items-center justify-center rounded-full border border-[#1a4b5b] bg-white text-[#1a4b5b] transition-colors duration-200 hover:bg-[#f6f3ee]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Siguiente"
              className="hidden md:flex absolute -right-14 top-[45%] z-10 h-10 w-10 items-center justify-center rounded-full border border-[#1a4b5b] bg-white text-[#1a4b5b] transition-colors duration-200 hover:bg-[#f6f3ee]"
            >
              <ChevronRight size={18} />
            </button>

            <Carousel
              setApi={setApi}
              opts={{ align: "center", loop: true, skipSnaps: false }}
              className="px-4 md:px-0"
            >
              <CarouselContent className="-ml-3 md:-ml-6">
                {PRODUCTS_DATA.map((product, idx) => (
                  <CarouselItem key={product.id} className="pl-3 basis-[80%] md:pl-6 md:basis-1/3">
                    <Link to={product.link} className="block group h-full">
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={product.image}
                          alt={product.alt}
                          className="w-full aspect-[3/5] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={idx === 0 ? "high" : "low"}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                        {/* Coming soon overlay */}
                        {product.comingSoon && (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 pointer-events-none">
                            <span className="text-white text-xs tracking-[0.22em] uppercase font-medium border border-white/60 px-4 py-2">
                              Próximamente
                            </span>
                            <span className="text-white/70 text-[11px] font-light tracking-wide">
                              Muy pronto disponible
                            </span>
                          </div>
                        )}

                        {/* Badge top-left */}
                        <span className={`absolute top-3.5 left-3.5 text-[9px] font-medium tracking-[0.18em] uppercase px-3 py-1.5 rounded-full ${product.comingSoon ? 'bg-[#1a4b5b] text-white' : 'bg-white/90 text-[#1a4b5b]'}`}>
                          {product.badge}
                        </span>

                        {/* Text bottom */}
                        {!product.comingSoon && (
                          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                            <h3 className="font-serif text-[22px] font-light text-white leading-tight">{product.name}</h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[10px] text-white/70 tracking-[0.15em] uppercase border-b border-white/30 pb-0.5">
                                Personaliza el tuyo →
                              </span>
                            </div>
                          </div>
                        )}
                        {product.comingSoon && (
                          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                            <h3 className="font-serif text-[22px] font-light text-white leading-tight">{product.name}</h3>
                          </div>
                        )}

                        {/* Hover overlay */}
                        {!product.comingSoon && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-400 pointer-events-none" />
                        )}
                      </div>
                      {/* Desktop: name below */}
                      <div className="mt-4 hidden md:block">
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">{product.name}</h3>
                        </div>
                        {product.comingSoon && (
                          <p className="text-xs text-muted-foreground font-light mt-0.5 tracking-wider uppercase">Próximamente</p>
                        )}
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {PRODUCTS_DATA.map((product, i) => (
              <button
                key={product.id}
                onClick={() => api?.scrollTo(i)}
                aria-label={`Ver ${product.name}`}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${i === current ? "bg-foreground" : "bg-foreground/20"}`}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              to="/productos"
              className="btn-sweep btn-unir btn-unir-outline inline-flex items-center px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
            >
              <span className="relative z-10">Ver todos los productos →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Franja de telas ── */}
      <section className="bg-[#1a4b5b] py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/55 mb-3">Colecciones disponibles</p>
          <h3 className="font-serif text-2xl md:text-3xl font-light text-white mb-6">
            Básicas · Premium
          </h3>
          <div className="flex justify-center gap-3 mb-5 flex-wrap">
            {FABRIC_STRIP.map((f) => (
              <div
                key={f.name}
                title={f.name}
                className="w-9 h-9 rounded-full border-2 border-white/25 overflow-hidden flex-shrink-0"
                style={{ backgroundColor: f.hex }}
              >
                {f.image && (
                  <img src={f.image} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-white/55 font-light mb-6">13 colores · Pide muestras a casa sin compromiso</p>
          <Link
            to="/telas"
            className="btn-sweep btn-unir inline-flex items-center px-7 py-3 text-xs font-light"
            style={{
              "--btn-bg": "transparent",
              "--btn-fg": "#ffffff",
              "--btn-border": "rgba(255,255,255,0.65)",
              "--btn-hover-bg": "rgba(255,255,255,0.12)",
              "--btn-hover-fg": "#ffffff",
              "--btn-hover-border": "rgba(255,255,255,0.65)",
            } as React.CSSProperties}
          >
            <span className="relative z-10">Ver todas las telas →</span>
          </Link>
        </div>
      </section>
    </>
  );
};

export default ProductsPreview;
