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
    id: 'mesitas',
    name: 'Mesitas de noche',
    tagline: 'El rincón que más tocas — que también sea bonito',
    image: 'https://images.unsplash.com/photo-1586798271654-0471bb1b0517?w=600&q=80&fit=crop&crop=center',
    alt: 'Mesita de noche entelada en dormitorio elegante',
    link: '/productos/mesitas',
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
];

const ProductsPreview = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Lo que hacemos</h2>
        <span className="section-line" />
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        {PRODUCTS_DATA.map((product, i) => (
          <AnimatedSection
            key={product.id}
            delay={i * 0.1}
            className={i === PRODUCTS_DATA.length - 1 && PRODUCTS_DATA.length % 3 === 2 ? "" : i >= 3 && PRODUCTS_DATA.length === 5 ? "lg:col-span-1" : ""}
          >
            <Link to={product.link} className="group block">
              <div className="overflow-hidden border border-border/40 rounded">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full aspect-[3/4] object-cover max-h-72 md:max-h-72 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="mt-5 p-1">
                <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground font-light italic">
                  "{product.tagline}"
                </p>
                <span className="mt-3 inline-block text-xs tracking-extra-wide uppercase text-foreground border-b border-foreground pb-0.5 group-hover:border-accent-warm group-hover:text-accent-warm transition-colors">
                  Explorar
                </span>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsPreview;
