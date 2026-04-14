import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { PRODUCTS, type ProductType } from "@/lib/products";

const ALL_PRODUCTS = [
  ...PRODUCTS,
  {
    id: 'cojin-almohadon',
    type: 'cojin' as ProductType,
    name: 'Cojines y almohadones',
    tagline: 'El detalle final que lo cambia todo',
    basePrice: 45,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
  },
];

type SortOption = 'default' | 'price-asc' | 'price-desc';

const ProductsPage = () => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (filter !== 'all') list = list.filter((p) => p.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q));
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    return list;
  }, [filter, search, sort]);

  const inputClass = "bg-transparent border-b border-border py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors font-light";

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h1>
          </AnimatedSection>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-12 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="all">Todos</option>
              <option value="cabecero">Cabeceros</option>
              <option value="banco">Bancos</option>
              <option value="mesita">Mesitas</option>
              <option value="cojin">Cojines</option>
              <option value="puff">Puffs</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="default">Ordenar</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <AnimatedSection key={product.id} delay={i * 0.08}>
                <div className="group">
                  <div className="overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-serif text-xl font-medium text-foreground">{product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground font-light italic">"{product.tagline}"</p>
                    <p className="mt-2 text-sm text-foreground">Desde {product.basePrice}€</p>
                    <Link
                      to="/configurador"
                      className="mt-3 inline-block text-xs tracking-extra-wide uppercase text-foreground border-b border-foreground pb-0.5 hover:border-muted-foreground transition-colors"
                    >
                      Personalizar
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground font-light mt-12">No se han encontrado productos.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;
