import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const PRODUCTS_DATA = [
  {
    id: 'cabeceros',
    name: 'Cabeceros tapizados',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&fit=crop&crop=center',
    alt: 'Cabecero tapizado en lino natural sobre cama de matrimonio',
    link: '/productos/cabeceros',
  },
  {
    id: 'bancos',
    name: 'Bancos entelados',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80&fit=crop&crop=center',
    alt: 'Banco entelado al pie de cama en tela beige',
    link: '/productos/bancos',
  },
  {
    id: 'cojines',
    name: 'Cojines y almohadones',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80&fit=crop&crop=center',
    alt: 'Cojines y almohadones decorativos en tonos neutros sobre cama',
    link: '/productos/cojines',
  },
  {
    id: 'puffs',
    name: 'Puffs y mesas de centro',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80&fit=crop&crop=center',
    alt: 'Puff tapizado elegante en salón con luz natural',
    link: '/productos/puffs',
  },
];

const ProductCard = ({ product, index }: { product: typeof PRODUCTS_DATA[number]; index: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <AnimatedSection delay={index * 0.1}>
      <Link
        to={product.link}
        className="block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden border border-border/40 rounded">
          <img
            src={product.image}
            alt={product.alt}
            className="w-full aspect-[3/4] object-cover max-h-72 md:max-h-72"
            style={{
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
            loading="lazy"
            decoding="async"
          />
          <div
            style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none"
          >
            <span className="text-white text-sm tracking-widest uppercase">Explorar →</span>
          </div>
        </div>
        <div className="mt-4 p-1 h-12 flex items-start">
          <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-tight">
            {product.name}
          </h3>
        </div>
      </Link>
    </AnimatedSection>
  );
};

const ProductsPreview = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h2>
        <span className="section-line" />
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mt-12">
        {PRODUCTS_DATA.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default ProductsPreview;
