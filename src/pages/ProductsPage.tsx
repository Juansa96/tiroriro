import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const CATEGORIES = [
  { id: 'cabeceros', name: 'Cabeceros tapizados', tagline: 'El punto de partida de cualquier dormitorio', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&fit=crop&crop=center', price: 180 },
  { id: 'bancos', name: 'Bancos entelados', tagline: 'Para el pie de la cama o la entrada', image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80&fit=crop&crop=center', price: 95 },
  { id: 'mesitas', name: 'Mesitas de noche', tagline: 'El rincón que más tocas', image: 'https://images.unsplash.com/photo-1586798271654-0471bb1b0517?w=600&q=80&fit=crop&crop=center', price: 85 },
  { id: 'cojines', name: 'Cojines y almohadones', tagline: 'Los detalles que lo cambian todo', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80&fit=crop&crop=center', price: 30 },
  { id: 'puffs', name: 'Puffs elegantes', tagline: 'Asiento, reposapiés, escultura', image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80&fit=crop&crop=center', price: 95 },
];

const ProductsPage = () => (
  <>
    <Navbar />
    <main className="pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h1>
          <span className="section-line" />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {CATEGORIES.map((cat, i) => (
            <AnimatedSection key={cat.id} delay={i * 0.08}>
              <Link to={`/productos/${cat.id}`} className="group block">
                <div className="overflow-hidden border border-border/40 rounded">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full aspect-[3/4] object-cover max-h-72 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-xl font-medium text-foreground">{cat.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground font-light italic">"{cat.tagline}"</p>
                  <p className="mt-2 text-sm text-foreground">Desde {cat.price}€</p>
                  <span className="mt-3 inline-block text-xs tracking-extra-wide uppercase text-accent-warm border-b border-accent-warm pb-0.5 group-hover:opacity-80 transition-opacity">
                    Ver modelos
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default ProductsPage;
