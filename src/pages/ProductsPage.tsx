import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Clock } from "lucide-react";

const CATEGORIES = [
  {
    id: "cabeceros",
    name: "Cabeceros tapizados",
    tagline: "5 formas · A tu medida",
    image: "/productos-fotos/cabeceros/pregonda-02.webp",
    priceLabel: "Desde 225€",
    comingSoon: false,
  },
  {
    id: "cojines",
    name: "Almohadones",
    tagline: "3 modelos · Colección Asturias",
    image: "/productos-fotos/almohadones/covadonga-01.webp",
    priceLabel: "Desde 50€",
    comingSoon: false,
  },
  {
    id: "pufs",
    name: "Pufs",
    tagline: "Tapizados a medida · Colección Galicia",
    image: "/productos-fotos/puf/patos-01.webp",
    priceLabel: "Desde 125€",
    comingSoon: false,
  },
  {
    id: "mesas-centro",
    name: "Mesas de centro",
    tagline: "2 modelos · Colección Murcia",
    image: "/productos-fotos/mesas/calblanque-01.webp",
    priceLabel: "Desde 280€",
    comingSoon: false,
  },
  {
    id: "pantallas-lampara",
    name: "Pantallas de lámpara",
    tagline: "6 formas · Colección Ávila",
    image: "/productos-fotos/pantallas/almanzor-01.webp",
    priceLabel: "Desde 25€",
    comingSoon: false,
  },
  {
    id: "bancos",
    name: "Bancos entelados",
    tagline: "Pie de cama · Entrada · Próximamente",
    image: "",
    priceLabel: "",
    comingSoon: true,
  },
  {
    id: "percheros",
    name: "Percheros",
    tagline: "Próximamente",
    image: "",
    priceLabel: "",
    comingSoon: true,
  },
];

const imagePosition = (_id: string) => "center center";

const PLACEHOLDERS: Record<string, JSX.Element> = {
  bancos: (
    <div className="w-full aspect-[3/4] max-h-72 bg-[#F0EDE8] flex flex-col items-center justify-center gap-3">
      <svg viewBox="0 0 120 80" className="w-24 h-16 text-foreground/20" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="10" y="24" width="100" height="32" rx="3" />
        <line x1="20" y1="56" x2="20" y2="70" />
        <line x1="100" y1="56" x2="100" y2="70" />
        <line x1="10" y1="38" x2="110" y2="38" strokeDasharray="4 3" />
      </svg>
    </div>
  ),
  percheros: (
    <div className="w-full aspect-[3/4] max-h-72 bg-[#F0EDE8] flex flex-col items-center justify-center gap-3">
      <svg viewBox="0 0 80 80" className="w-20 h-20 text-foreground/20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M 40 18 Q 40 10 47 10 Q 56 10 56 18 Q 56 25 40 33" />
        <path d="M 40 33 L 8 56 M 40 33 L 72 56" />
        <line x1="6" y1="56" x2="74" y2="56" />
      </svg>
    </div>
  ),
};

const CategoryCard = ({ cat, index }: { cat: typeof CATEGORIES[number]; index: number }) => {
  const [hovered, setHovered] = useState(false);

  if (cat.comingSoon) {
    return (
      <AnimatedSection delay={index * 0.08}>
        <Link to={`/productos/${cat.id}`} className="block">
          <div className="relative overflow-hidden border border-border/40 rounded-lg">
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full aspect-[3/4] object-cover max-h-72 grayscale opacity-70"
                style={{ objectPosition: imagePosition(cat.id) }}
                loading="lazy"
                decoding="async"
              />
            ) : (
              PLACEHOLDERS[cat.id] ?? PLACEHOLDERS.bancos
            )}
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 text-[9px] tracking-[0.18em] uppercase font-medium px-2.5 py-1 rounded-full bg-foreground/75 text-background">
                <Clock size={9} />
                Próximamente
              </span>
            </div>
          </div>
          <div className="mt-4 p-1">
            <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground/55 leading-tight">
              {cat.name}
            </h3>
            <p className="text-xs text-muted-foreground/60 font-light mt-1 tracking-wide">{cat.tagline}</p>
          </div>
        </Link>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection delay={index * 0.08}>
      <Link
        to={`/productos/${cat.id}`}
        className="block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden border border-border/40 rounded-lg">
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full aspect-[3/4] object-cover max-h-72"
            style={{
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.4s ease",
              objectPosition: imagePosition(cat.id),
            }}
            loading="lazy"
            decoding="async"
          />
          <div
            style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none"
          >
            <span className="text-white text-sm tracking-widest uppercase">Explorar →</span>
          </div>
        </div>
        <div className="mt-4 p-1">
          <div className="flex items-start justify-between">
            <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-tight">
              {cat.name}
            </h3>
            <span className="text-sm text-muted-foreground font-light shrink-0 ml-4 mt-1">{cat.priceLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground font-light mt-1 tracking-wide">{cat.tagline}</p>
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
        <AnimatedSection className="text-center mb-6">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h1>
          <span className="section-line" />
        </AnimatedSection>

        <AnimatedSection className="max-w-2xl mx-auto text-center mb-14" delay={0.05}>
          <p className="text-base text-muted-foreground font-light leading-relaxed">
            Todo tapizado a mano en España, a tu medida y con la tela que eliges.
            Elige la categoría, explora los modelos y configura tu pieza desde cero.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>

        <AnimatedSection className="mt-16 flex flex-col items-center gap-4 text-center" delay={0.15}>
          <p className="text-sm text-muted-foreground font-light max-w-md">
            ¿No sabes por cuál empezar? En el configurador puedes explorar todos los productos y ver el resultado en tiempo real.
          </p>
          <Link
            to="/configurador"
            className="btn-sweep btn-unir inline-flex items-center justify-center px-8 py-3 text-xs uppercase tracking-[0.24em]"
          >
            <span>Diseña el tuyo</span>
          </Link>
        </AnimatedSection>
      </div>
    </main>
    <Footer />
  </>
);

export default ProductsPage;
