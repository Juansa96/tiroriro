import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { ChevronRight, ChevronLeft, Clock } from "lucide-react";

interface Model {
  name: string;
  photos: string[];
  desc: string;
  priceLabel: string;
  configParam?: string;
  comingSoon?: boolean;
}

// Pequeño círculo con la silueta de la forma del producto
const ShapeCircle = ({ configParam, category }: { configParam?: string; category: string }) => {
  const getPath = () => {
    if (category === 'cabeceros') {
      switch (configParam) {
        case 'recto': return <rect x="4" y="6" width="24" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />;
        case 'semicirculo': return <path d="M 4 22 L 4 14 Q 16 4 28 14 L 28 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
        case 'corona-simple': return <path d="M 2 22 L 2 14 C 8 14 10 11 10.4 9.2 A 5.6 1.6 0 0 1 21.6 9.2 C 22 11 24 14 30 14 L 30 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
        case 'corona-doble': return <path d="M 2 22 L 2 14 Q 7 14 7 11.5 Q 12 11.5 12 9 A 4 2 0 0 1 20 9 Q 20 11.5 25 11.5 Q 25 14 30 14 L 30 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
        case 'ondas': return <path d="M 2 22 L 2 14 Q 6 9 10 14 Q 14 19 18 14 Q 22 9 26 14 Q 29 17 30 14 L 30 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
      }
    }
    if (category === 'cojines') {
      switch (configParam) {
        case 'rodiles': return <rect x="6" y="6" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
        case 'covadonga': return <rect x="3" y="9" width="26" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
        case 'gulpiyuri': return <><rect x="3" y="12" width="26" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="3" cy="16" rx="2" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" /></>;
      }
    }
    if (category === 'pufs') {
      return <rect x="6" y="6" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
    }
    if (category === 'mesas-centro') {
      if (configParam === 'tipo-banco') return <><rect x="3" y="7" width="26" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="6" y1="17" x2="6" y2="25" stroke="currentColor" strokeWidth="1.5" /><line x1="26" y1="17" x2="26" y2="25" stroke="currentColor" strokeWidth="1.5" /></>;
      return <rect x="3" y="10" width="26" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
    }
    if (category === 'pantallas-lampara') {
      switch (configParam) {
        case 'cono': return <><path d="M 12 8 L 20 8 L 27 24 L 5 24 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="16" cy="8" rx="4" ry="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" /></>;
        case 'cilindro': return <><rect x="4" y="8" width="24" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="16" cy="8" rx="12" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="16" cy="24" rx="12" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" /></>;
        case 'rectangulo': return <rect x="4" y="10" width="24" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
        case 'cuadrado': return <rect x="7" y="6" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" />;
        case 'ovalado': return <><ellipse cx="16" cy="10" rx="10" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="16" cy="22" rx="10" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" /></>;
        case 'piramide': return <path d="M 9 8 L 23 8 L 27 24 L 5 24 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
      }
    }
    return null;
  };
  const path = getPath();
  if (!path) return null;
  return (
    <div className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-foreground/70">{path}</svg>
    </div>
  );
};

const CATEGORIES: Record<string, { title: string; subtitle: string; models: Model[]; comingSoon?: boolean }> = {
  cabeceros: {
    title: "Cabeceros tapizados",
    subtitle: "El punto de partida de cualquier dormitorio que merece la pena.",
    models: [
      {
        name: "Calobra",
        photos: [
          "/productos-fotos/cabeceros/calobra-01.webp",
          "/productos-fotos/cabeceros/calobra-02.webp",
          "/productos-fotos/cabeceros/calobra-03.webp",
        ],
        desc: "Forma recta y líneas limpias. El más versátil: encaja en cualquier estilo.",
        priceLabel: "",
        configParam: "recto",
      },
      {
        name: "Pregonda",
        photos: [
          "/productos-fotos/cabeceros/pregonda-01.webp",
          "/productos-fotos/cabeceros/pregonda-02.webp",
        ],
        desc: "Remate en arco suave. Aporta calidez sin renunciar a la elegancia.",
        priceLabel: "",
        configParam: "semicirculo",
      },
      {
        name: "Macarella",
        photos: [
          "/productos-fotos/cabeceros/macarella-02.webp",
        ],
        desc: "Corona simple con una ondulación central. Carácter escultórico y elegante.",
        priceLabel: "",
        configParam: "corona-simple",
      },
      {
        name: "Conta",
        photos: [
          "/productos-fotos/cabeceros/conta-01.webp",
        ],
        desc: "Corona doble con dos niveles escalonados. Más elaborada y con mayor presencia.",
        priceLabel: "",
        configParam: "corona-doble",
      },
      {
        name: "Barbaria",
        photos: [
          "/productos-fotos/cabeceros/barbaria-01.webp",
        ],
        desc: "Corona quíntuple con cinco arcos. Movimiento escultórico y mucha presencia.",
        priceLabel: "",
        configParam: "ondas",
      },
    ],
  },
  bancos: {
    title: "Bancos entelados",
    subtitle: "Para el pie de la cama, la entrada o donde quieras que aterrice la vista.",
    comingSoon: true,
    models: [
      {
        name: "Oyambre",
        photos: [
          "/productos-fotos/bancos/oyambre-01.webp",
          "/productos-fotos/bancos/oyambre-02.webp",
          "/productos-fotos/bancos/oyambre-03.webp",
        ],
        desc: "Banco entelado de pie de cama. De 80 a 160 cm.",
        priceLabel: "",
        comingSoon: true,
      },
      {
        name: "Gerra",
        photos: [],
        desc: "Con patas. Más compacto, perfecto para el recibidor.",
        priceLabel: "",
        comingSoon: true,
      },
      {
        name: "Ris",
        photos: [],
        desc: "Baúl con tapa abatible y espacio interior.",
        priceLabel: "",
        comingSoon: true,
      },
    ],
  },
  cojines: {
    title: "Almohadones",
    subtitle: "Tapizados a medida para camas, bancos o sofás.",
    models: [
      {
        name: "Rodiles — Cuadrado",
        photos: [
          "/productos-fotos/almohadones/rodiles-01.webp",
          "/productos-fotos/almohadones/rodiles-02.webp",
        ],
        desc: "Clásico y versátil. Queda perfecto en camas, sofás o sillones. Elige tu tela favorita y dale vida.",
        priceLabel: "",
        configParam: "rodiles",
      },
      {
        name: "Covadonga — Rectangular",
        photos: [
          "/productos-fotos/almohadones/covadonga-01.webp",
          "/productos-fotos/almohadones/covadonga-02.webp",
          "/productos-fotos/almohadones/covadonga-03.webp",
        ],
        desc: "La forma alargada que siempre queda bien. Ideal para el cabecero de la cama o el respaldo del sofá.",
        priceLabel: "",
        configParam: "covadonga",
      },
      {
        name: "Gulpiyuri — Rulo",
        photos: [
          "/productos-fotos/almohadones/gulpiyuri-01.webp",
          "/productos-fotos/almohadones/gulpiyuri-02.webp",
        ],
        desc: "Un toque diferente y muy nórdico. Combina a la perfección con cabeceros tapizados.",
        priceLabel: "",
        configParam: "gulpiyuri",
      },
      {
        name: "Torimbia — Redondo",
        photos: [],
        desc: "Próximamente. Almohadón circular tapizado a mano.",
        priceLabel: "",
        comingSoon: true,
      },
    ],
  },
  pufs: {
    title: "Pufs",
    subtitle: "Tapizados a medida, versátiles y fáciles de mover.",
    models: [
      {
        name: "Patos",
        photos: [
          "/productos-fotos/puff/patos-card.webp",
          "/productos-fotos/puff/patos-01.webp",
          "/productos-fotos/puff/IMG_2497.webp",
        ],
        desc: "Cúbico, tapizado a mano y a tu medida. Úsalo de asiento, reposapiés o mesa improvisada.",
        priceLabel: "",
        configParam: "cuadrado",
      },
      {
        name: "Monteferro",
        photos: [],
        desc: "Redondo · Próximamente.",
        priceLabel: "",
        configParam: "circular",
        comingSoon: true,
      },
    ],
  },
  "mesas-centro": {
    title: "Mesas de centro",
    subtitle: "Volúmenes tapizados a medida para el salón.",
    models: [
      {
        name: "Calblanque",
        photos: [
          "/productos-fotos/mesas/calblanque-01.webp",
          "/productos-fotos/mesas/calblanque-02.webp",
        ],
        desc: "Mesa de centro tapizada con patas. Un elemento escultórico para el salón.",
        priceLabel: "",
        configParam: "tipo-banco",
      },
      {
        name: "Cabo de Palos",
        photos: [],
        desc: "Sin patas · Próximamente.",
        priceLabel: "",
        configParam: "tipo-puf",
        comingSoon: true,
      },
    ],
  },
  "pantallas-lampara": {
    title: "Pantallas de lámpara",
    subtitle: "Tapizadas a mano en telas básicas y premium.",
    models: [
      { name: "Almanzor", photos: ["/productos-fotos/pantallas/almanzor-01.webp", "/productos-fotos/pantallas/almanzor-02.webp", "/productos-fotos/pantallas/almanzor-03.webp"], desc: "Cilíndrica. La más clásica y versátil. Transforma cualquier lámpara con un toque artesanal.", priceLabel: "", configParam: "cilindro" },
      { name: "Tormes", photos: ["/productos-fotos/pantallas/tormes-01.webp", "/productos-fotos/pantallas/tormes-02.webp"], desc: "Cuadrada. Líneas limpias para espacios modernos y contemporáneos.", priceLabel: "", configParam: "cuadrado" },
      { name: "Gredos", photos: ["/productos-fotos/pantallas/gredos-01.webp"], desc: "Cónica. Elegante y con carácter. Ideal para lámparas de pie y de sobremesa.", priceLabel: "", configParam: "cono" },
      { name: "La Serrota", photos: ["/productos-fotos/pantallas/serrota-01.webp"], desc: "Rectangular. Perfecta para apliques de pared y lámparas de diseño.", priceLabel: "", configParam: "rectangulo" },
      { name: "La Paramera", photos: ["/productos-fotos/pantallas/paramera-01.webp"], desc: "Ovalada. Suave y sofisticada. Da una luz difusa y muy cálida.", priceLabel: "", configParam: "ovalado" },
      { name: "La Galana", photos: ["/productos-fotos/pantallas/galana-01.webp"], desc: "Pirámide. Forma original con mucha personalidad. Un objeto decorativo en sí mismo.", priceLabel: "", configParam: "piramide" },
    ],
  },
  percheros: {
    title: "Percheros",
    subtitle: "Próximamente.",
    comingSoon: true,
    models: [],
  },
};

const productTypeMap: Record<string, string> = {
  cabeceros: "cabecero",
  bancos: "banco",
  cojines: "cojin",
  pufs: "puf",
  "mesas-centro": "mesa",
  "pantallas-lampara": "pantalla",
  percheros: "perchero",
};

const imagePosition = (category: string) => {
  if (category === "pufs" || category === "mesas-centro") return "center center";
  if (category === "bancos") return "center center";
  return undefined;
};

interface CategoryPageProps {
  categoryKey?: string;
}

const PhotoSlider = ({ photos, category, name }: { photos: string[]; category: string; name: string }) => {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Auto-advance disabled — manual navigation only
    if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos.length, hovered]);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#F0EDE8' }}>
        <svg viewBox="0 0 80 100" className="w-14 h-18 text-foreground/25" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M 32 14 L 48 14 L 64 82 L 16 82 Z" />
          <line x1="40" y1="4" x2="40" y2="14" />
          <ellipse cx="40" cy="84" rx="24" ry="4" />
        </svg>
        <span className="text-[10px] tracking-[0.28em] uppercase text-foreground/30 font-medium">Próximamente fotos</span>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden w-full aspect-[3/4]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {photos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${name} ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === idx ? 1 : 0, objectPosition: imagePosition(category) }}
          loading="lazy"
          decoding="async"
        />
      ))}
      {photos.length > 1 && (
        <>
          <button
            onClick={e => { e.preventDefault(); setIdx(i => (i - 1 + photos.length) % photos.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={e => { e.preventDefault(); setIdx(i => (i + 1) % photos.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); setIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ModelCard = ({ model, category }: { model: Model; category: string }) => {
  const configHref = `/configurador?tipo=${productTypeMap[category] || category}${model.configParam ? `&forma=${model.configParam}` : ""}`;

  if (model.comingSoon) {
    return (
      <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden">
        <div className="relative overflow-hidden">
          <PhotoSlider photos={model.photos} category={category} name={model.name} />
          {model.photos.length > 0 && (
            <div className="absolute inset-0 bg-foreground/20 pointer-events-none" />
          )}
          <div className="absolute top-2 right-2 z-10">
            <span className="flex items-center gap-1 text-[9px] tracking-[0.18em] uppercase font-medium px-2.5 py-1 rounded-full bg-foreground/75 text-background">
              <Clock size={9} />
              Próximamente
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-lg font-medium text-foreground/60">{model.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground/60 font-light flex-1">{model.desc}</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={configHref}
      className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <PhotoSlider photos={model.photos} category={category} name={model.name} />
        {category !== 'pantallas-lampara' && (
          <ShapeCircle configParam={model.configParam} category={category} />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 pointer-events-none flex items-center justify-center">
          <span className="text-white text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Personalizar →</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-medium text-foreground">{model.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground font-light flex-1">{model.desc}</p>
        <div className="mt-4 flex items-center justify-end">
          <span className="text-xs tracking-extra-wide uppercase text-accent-warm border-b border-accent-warm pb-0.5 group-hover:opacity-80 transition-opacity">
            Personalizar →
          </span>
        </div>
      </div>
    </Link>
  );
};

const CategoryPage = ({ categoryKey }: CategoryPageProps) => {
  const category = categoryKey || "";
  const cat = CATEGORIES[category];

  if (!cat) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 px-6 text-center">
          <h1 className="font-serif text-3xl font-light text-foreground">Categoría no encontrada</h1>
          <Link to="/productos" className="mt-4 inline-block text-accent-warm underline">
            Volver a productos
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link to="/productos" className="hover:text-foreground transition-colors">Productos</Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{cat.title}</span>
          </div>
          <AnimatedSection className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground">{cat.title}</h1>
            <p className="mt-3 text-muted-foreground font-light italic">{cat.subtitle}</p>
            {cat.comingSoon && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-full">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider uppercase">Próximamente disponibles</span>
              </div>
            )}
            <span className="section-line" />
          </AnimatedSection>
          {cat.models.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.models.map((model, i) => (
                <AnimatedSection key={model.name} delay={i * 0.08} className="h-full">
                  <div className="h-full">
                    <ModelCard model={model} category={category} />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryPage;
