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
    id: "pufs",
    name: "Pufs",
    tagline: "Tapizados a medida · Colección Galicia",
    image: "/productos-fotos/puff/puff-nuevo.webp",
    priceLabel: "Desde 125€",
    comingSoon: false,
  },
  {
    id: "mesas-centro",
    name: "Mesas de centro",
    tagline: "Cabo de Palos · Colección Murcia",
    image: "/productos-fotos/mesas-centro/cabo-de-palos.webp",
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
    id: "cojines",
    name: "Almohadones",
    tagline: "Colección Asturias · Próximamente",
    image: "",
    priceLabel: "",
    comingSoon: true,
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

const COMING_SOON_ICONS: Record<string, JSX.Element> = {
  cojines: (
    <svg viewBox="0 0 48 32" className="w-10 h-7 text-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="4" width="42" height="24" rx="4" />
      <line x1="3" y1="16" x2="45" y2="16" strokeDasharray="3 3" />
    </svg>
  ),
  bancos: (
    <svg viewBox="0 0 56 36" className="w-12 h-8 text-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="4" y="8" width="48" height="16" rx="2" />
      <line x1="10" y1="24" x2="10" y2="33" />
      <line x1="46" y1="24" x2="46" y2="33" />
    </svg>
  ),
  percheros: (
    <svg viewBox="0 0 48 44" className="w-10 h-9 text-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M 24 12 Q 24 5 30 5 Q 38 5 38 12 Q 38 18 24 24" />
      <path d="M 24 24 L 4 38 M 24 24 L 44 38" />
      <line x1="2" y1="38" x2="46" y2="38" />
    </svg>
  ),
};

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

const ComingSoonCard = ({ cat, index }: { cat: typeof CATEGORIES[number]; index: number }) => (
  <AnimatedSection delay={index * 0.08 + 0.1}>
    <div className="cursor-default flex flex-col items-center gap-3 py-5 px-4 border border-border/40 rounded-lg bg-muted/10">
      <div className="w-14 h-14 rounded-full bg-muted/30 flex items-center justify-center">
        {COMING_SOON_ICONS[cat.id]}
      </div>
      <div className="text-center">
        <h3 className="font-serif text-base font-medium text-foreground/50 leading-tight">{cat.name}</h3>
        <span className="inline-flex items-center gap-1 text-[9px] tracking-[0.18em] uppercase font-medium px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/35 mt-1.5">
          <Clock size={8} />
          Próximamente
        </span>
      </div>
    </div>
  </AnimatedSection>
);

const availableCategories = CATEGORIES.filter(c => !c.comingSoon);
const comingSoonCategories = CATEGORIES.filter(c => c.comingSoon);

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
          {availableCategories.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>

        {comingSoonCategories.length > 0 && (
          <AnimatedSection className="max-w-4xl mx-auto mt-12" delay={0.12}>
            <div className="border-t border-border/40 pt-8">
              <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground/60 font-medium text-center mb-5">
                Próximamente
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {comingSoonCategories.map((cat, i) => (
                  <ComingSoonCard key={cat.id} cat={cat} index={i} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

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
