import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const PRODUCTS_DATA = [
  {
    id: 'cabeceros',
    name: 'Cabeceros tapizados',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80&fit=crop&crop=center',
    alt: 'Cabecero tapizado en lino natural sobre cama de matrimonio',
    link: '/productos/cabeceros',
  },
  {
    id: 'bancos',
    name: 'Bancos entelados',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80&fit=crop&crop=center',
    alt: 'Banco entelado al pie de cama en tela beige',
    link: '/productos/bancos',
  },
  {
    id: 'cojines',
    name: 'Cojines y almohadones',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80&fit=crop&crop=center',
    alt: 'Cojines y almohadones decorativos en tonos neutros sobre cama',
    link: '/productos/cojines',
  },
  {
    id: 'puffs',
    name: 'Puffs y mesas de centro',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80&fit=crop&crop=center',
    alt: 'Puff tapizado elegante en salón con luz natural',
    link: '/productos/puffs',
  },
];

const VISIBLE_DESKTOP = 3;

const ProductsPreview = () => {
  const [current, setCurrent] = useState(0);
  const total = PRODUCTS_DATA.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const desktopItems = Array.from({ length: VISIBLE_DESKTOP }, (_, i) =>
    PRODUCTS_DATA[(current + i) % total]
  );

  return (
    <section className="pt-8 pb-20 md:py-32 px-6">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h2>
          <span className="section-line" />
        </AnimatedSection>

        <div className="relative max-w-5xl mx-auto">
          {/* Flechas */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute -left-4 md:-left-10 top-[40%] z-10 w-10 h-10 bg-background border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors duration-200"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute -right-4 md:-right-10 top-[40%] z-10 w-10 h-10 bg-background border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors duration-200"
          >
            <ChevronRight size={18} />
          </button>

          {/* Desktop: 3 tarjetas */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {desktopItems.map((product, idx) => (
              <Link key={`${product.id}-${idx}`} to={product.link} className="block group">
                <div className="relative overflow-hidden border border-border/40">
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorar →</span>
                  </div>
                </div>
                <div className="mt-4 h-12 flex items-start">
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-tight">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Móvil: 1 tarjeta */}
          <div className="md:hidden">
            <Link to={PRODUCTS_DATA[current].link} className="block group">
              <div className="relative overflow-hidden border border-border/40">
                <img
                  src={PRODUCTS_DATA[current].image}
                  alt={PRODUCTS_DATA[current].alt}
                  className="w-full aspect-[3/4] object-cover max-h-80"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                  <span className="text-white text-sm tracking-widest uppercase">Explorar →</span>
                </div>
              </div>
              <div className="mt-4 h-12 flex items-start">
                <h3 className="font-serif text-xl font-medium text-foreground leading-tight">{PRODUCTS_DATA[current].name}</h3>
              </div>
            </Link>
          </div>
        </div>

        {/* Puntos de navegación */}
        <div className="flex justify-center gap-2 mt-8">
          {PRODUCTS_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ver ${PRODUCTS_DATA[i].name}`}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                i === current ? 'bg-foreground' : 'bg-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
