import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const CATEGORIES = [
  { id: 'cabeceros', name: 'Cabeceros tapizados', image: '/productos-fotos/cabeceros/IMG_2555.PNG', price: 180 },
  { id: 'bancos', name: 'Bancos entelados', image: '/productos-fotos/bancos/IMG_2552.PNG', price: 95 },
  { id: 'cojines', name: 'Cojines y almohadones', image: '/productos-fotos/almohadones/IMG_2486.PNG', price: 30 },
  { id: 'puffs', name: 'Puffs', image: '/productos-fotos/puff/IMG_2497.PNG', price: 95 },
];

const CategoryCard = ({ cat, index }: { cat: typeof CATEGORIES[number]; index: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <AnimatedSection delay={index * 0.08}>
      <Link
        to={`/productos/${cat.id}`}
        className="block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden border border-border/40 rounded-2xl">
          <img
            src={cat.image}
            alt={cat.name}
            className={`w-full aspect-[3/4] object-cover max-h-72 ${cat.id === 'puffs' ? 'object-top' : ''}`}
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
        <div className="mt-4 p-1 h-12 flex items-start justify-between">
          <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-tight">
            {cat.name}
          </h3>
          <span className="text-sm text-muted-foreground font-light shrink-0 ml-4 mt-1">Desde {cat.price}€</span>
        </div>
      </Link>
    </AnimatedSection>
  );
};

const ProductsPage = () => (
  <>
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h1>
          <span className="section-line" />
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default ProductsPage;
