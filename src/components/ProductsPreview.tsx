import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const PRODUCTS_DATA = [
  {
    id: 'cabeceros',
    name: 'Cabeceros tapizados',
    tagline: 'El punto de partida de cualquier dormitorio que merece la pena',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&fit=crop&crop=center',
    alt: 'Cabecero tapizado en lino natural sobre cama de matrimonio',
    link: '/productos/cabeceros',
  },
  {
    id: 'bancos',
    name: 'Bancos entelados',
    tagline: 'Para el pie de la cama, la entrada o donde quieras que aterrice la vista',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80&fit=crop&crop=center',
    alt: 'Banco entelado al pie de cama en tela beige',
    link: '/productos/bancos',
  },
  {
    id: 'cojines',
    name: 'Cojines y almohadones',
    tagline: 'Los últimos detalles que convierten una cama en la tuya',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80&fit=crop&crop=center',
    alt: 'Cojines y almohadones decorativos en tonos neutros sobre cama',
    link: '/productos/cojines',
  },
  {
    id: 'puffs',
    name: 'Puffs elegantes',
    tagline: 'Asiento, reposapiés, escultura — según cómo lo mires',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80&fit=crop&crop=center',
    alt: 'Puff tapizado elegante en salón con luz natural',
    link: '/productos/puffs',
  },
  {
    id: 'mesas',
    name: 'Mesas de centro',
    tagline: 'Tapizadas a medida, con estructura artesanal. Elige tela, forma y medidas.',
    image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600&q=80&fit=crop&crop=center',
    alt: 'Mesa de centro tapizada artesanal en salón',
    link: '/productos/mesas',
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
            className="absolute inset-0 bg-black/15 flex items-center justify-center pointer-events-none"
          >
            <span className="text-white text-sm tracking-widest uppercase">Explorar →</span>
          </div>
        </div>
        <div className="mt-5 p-1">
          <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">
            {product.name}
          </h3>
          <p className="mt-1.5 text-base text-muted-foreground font-light italic">
            "{product.tagline}"
          </p>
          <span
            className="mt-3 inline-block text-xs tracking-extra-wide uppercase text-foreground border-b border-foreground pb-0.5 transition-colors"
            style={{
              color: hovered ? 'hsl(var(--accent-warm))' : undefined,
              borderColor: hovered ? 'hsl(var(--accent-warm))' : undefined,
            }}
          >
            Explorar
          </span>
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
        <p className="font-light italic text-muted-foreground text-base max-w-2xl mx-auto text-center mt-6 leading-relaxed">
          Cada pieza que sale de nuestro taller ha pasado por las manos de alguien que sabe lo que hace. Elegimos los materiales con cuidado, cortamos y tapizamos a medida, y embalamos con la misma atención que pondríamos si fuera para nuestra propia casa. Porque creemos que los detalles se notan — y que una pieza bien hecha dura toda la vida.
        </p>
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
