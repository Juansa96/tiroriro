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
    tagline: "5 formas · Cualquier medida · Lino, terciopelo o bouclé",
    image: "/productos-fotos/cabeceros/IMG_2555.webp",
    priceLabel: "Desde xx€",
    comingSoon: false,
  },
  {
    id: "bancos",
    name: "Bancos entelados",
    tagline: "Pie de cama · Entrada · Con o sin almacenaje",
    image: "/productos-fotos/bancos/IMG_2552.webp",
    priceLabel: "Desde xx€",
    comingSoon: true,
  },
  {
    id: "cojines",
    name: "Cojines y almohadones",
    tagline: "Cuadrados · Rectangulares · Rulos y redondos",
    image: "/productos-fotos/almohadones/IMG_2514.webp",
    priceLabel: "Desde xx€",
    comingSoon: false,
  },
  {
    id: "puffs",
    name: "Puffs",
    tagline: "Patos (cuadrado) · Monteferro (redondo) · Colección Galicia",
    image: "/productos-fotos/crops/puff-2497-tight.png",
    priceLabel: "Desde xx€",
    comingSoon: false,
  },
  {
    id: "mesas-centro",
    name: "Mesas de centro",
    tagline: "Calblanque · Cabo de Palos · Colección Murcia",
    image: "/productos-fotos/crops/puff-2497-1-tight.png",
    priceLabel: "Desde xx€",
    comingSoon: false,
  },
  {
    id: "pantallas-lampara",
    name: "Pantallas de lámpara",
    tagline: "7 formas · Cónica · Cilíndrica · Cuadrada · Ovalada",
    image: "/productos-fotos/cabeceros/IMG_2502.webp",
    priceLabel: "Desde xx€",
    comingSoon: false,
  },
];

const imagePosition = (id: string) => "center center";

const CategoryCard = ({ cat, index }: { cat: typeof CATEGORIES[number]; index: number }) => {
  const [hovered, setHovered] = useState(false);

  if (cat.comingSoon) {
    return (
      <AnimatedSection delay={index * 0.08}>
        <div className="block opacity-80">
          <div className="relative overflow-hidden border border-border/40 rounded-lg">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full aspect-[3/4] object-cover max-h-72 grayscale"
              style={{ objectPosition: imagePosition(cat.id) }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-foreground/35 flex flex-col items-center justify-center gap-2">
              <Clock size={22} className="text-white" />
              <span className="text-white text-xs tracking-[0.22em] uppercase font-medium border border-white/50 px-4 py-2">
                Próximamente
              </span>
              <span className="text-white/70 text-[11px] font-light">Muy pronto disponible</span>
            </div>
          </div>
          <div className="mt-4 p-1">
            <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground/50 leading-tight">
              {cat.name}
            </h3>
            <p className="text-xs text-muted-foreground/60 font-light mt-1 tracking-wide">{cat.tagline}</p>
          </div>
        </div>
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

        {/* Intro text */}
        <AnimatedSection className="max-w-2xl mx-auto text-center mb-14" delay={0.05}>
          <p className="text-base text-muted-foreground font-light leading-relaxed">
            Todo tapizado a mano en España, a tu medida y con la tela que eliges.
            Elige la categoría que te interese, explora los modelos disponibles y configura tu pieza desde cero.
            Si tienes dudas, escríbenos — te orientamos sin compromiso.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground/70 font-light tracking-wide">
            <span>✦ Entrega en 15 días</span>
            <span>✦ Hecho a mano en España</span>
            <span>✦ Telas lino · terciopelo · bouclé</span>
            <span>✦ Presupuesto sin compromiso</span>
          </div>
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
