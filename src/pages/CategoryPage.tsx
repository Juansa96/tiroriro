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

const CATEGORIES: Record<string, { title: string; subtitle: string; models: Model[]; comingSoon?: boolean }> = {
  cabeceros: {
    title: "Cabeceros tapizados",
    subtitle: "El punto de partida de cualquier dormitorio que merece la pena.",
    models: [
      {
        name: "Calobra",
        photos: [
          "/productos-fotos/cabeceros/IMG_2502.webp",
          "/productos-fotos/cabeceros/IMG_2851.webp",
          "/productos-fotos/cabeceros/IMG_2901.webp",
        ],
        desc: "Forma recta y líneas limpias. El más versátil: encaja en cualquier estilo.",
        priceLabel: "Desde xx€",
        configParam: "recto",
      },
      {
        name: "Pregonda",
        photos: [
          "/productos-fotos/cabeceros/IMG_2218.webp",
          "/productos-fotos/cabeceros/IMG_2555.webp",
        ],
        desc: "Remate en arco suave. Aporta calidez sin renunciar a la elegancia.",
        priceLabel: "Desde xx€",
        configParam: "semicirculo",
      },
      {
        name: "Macarella",
        photos: [
          "/productos-fotos/cabeceros/IMG_2652.webp",
          "/productos-fotos/cabeceros/IMG_2869.webp",
          "/productos-fotos/cabeceros/IMG_2886.webp",
        ],
        desc: "Corona simple con una ondulación central. Carácter escultórico y elegante.",
        priceLabel: "Desde xx€",
        configParam: "corona-simple",
      },
      {
        name: "Conta",
        photos: [
          "/productos-fotos/cabeceros/IMG_2535.webp",
          "/productos-fotos/cabeceros/IMG_2653.webp",
          "/productos-fotos/cabeceros/IMG_2858.webp",
          "/productos-fotos/cabeceros/IMG_2866.webp",
          "/productos-fotos/cabeceros/IMG_2891.webp",
        ],
        desc: "Corona doble con dos niveles escalonados. Más elaborada y con mayor presencia.",
        priceLabel: "Desde xx€",
        configParam: "corona-doble",
      },
      {
        name: "Barbaria",
        photos: [
          "/productos-fotos/cabeceros/IMG_2654.webp",
        ],
        desc: "Corona triple. Tres niveles de ondulación para una silueta espectacular.",
        priceLabel: "Desde xx€",
        configParam: "corona-triple",
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
          "/productos-fotos/bancos/IMG_2760.webp",
          "/productos-fotos/bancos/IMG_2761.webp",
          "/productos-fotos/bancos/IMG_2491.webp",
        ],
        desc: "Banco entelado de pie de cama. De 80 a 160 cm.",
        priceLabel: "Desde xx€",
        comingSoon: true,
      },
      {
        name: "Gerra",
        photos: [],
        desc: "Con patas. Más compacto, perfecto para el recibidor.",
        priceLabel: "Desde xx€",
        comingSoon: true,
      },
      {
        name: "Ris",
        photos: [],
        desc: "Baúl con tapa abatible y espacio interior.",
        priceLabel: "Desde xx€",
        comingSoon: true,
      },
    ],
  },
  cojines: {
    title: "Cojines y almohadones",
    subtitle: "Tapizados a medida para camas, bancos o sofás.",
    models: [
      {
        name: "Rodiles — Cuadrado",
        photos: [
          "/productos-fotos/almohadones/IMG_2486.webp",
          "/productos-fotos/almohadones/IMG_2523.webp",
        ],
        desc: "40×40 · 45×45 · 50×50 cm",
        priceLabel: "Desde xx€",
        configParam: "rodiles",
      },
      {
        name: "Covadonga — Rectangular",
        photos: [
          "/productos-fotos/almohadones/IMG_2514.webp",
          "/productos-fotos/almohadones/IMG_2539.webp",
          "/productos-fotos/almohadones/IMG_2545.webp",
        ],
        desc: "50×30 · 60×40 cm",
        priceLabel: "Desde xx€",
        configParam: "covadonga",
      },
      {
        name: "Set de 2 coordinados",
        photos: [
          "/productos-fotos/almohadones/IMG_2523.webp",
          "/productos-fotos/almohadones/IMG_2514.webp",
        ],
        desc: "Dos cojines en la misma tela.",
        priceLabel: "Desde xx€",
      },
      {
        name: "Cojín con vivo",
        photos: [
          "/productos-fotos/almohadones/IMG_2539.webp",
        ],
        desc: "Ribete que convierte el cojín en una pieza de autor.",
        priceLabel: "Desde xx€",
      },
      {
        name: "Gulpiyuri — Rulo",
        photos: [
          "/productos-fotos/almohadones/IMG_2524.webp",
          "/productos-fotos/almohadones/IMG_2525.webp",
        ],
        desc: "13×90 cm · Combinable con cabecero o banco.",
        priceLabel: "Desde xx€",
        configParam: "gulpiyuri",
      },
      {
        name: "Torimbia — Redondo",
        photos: [],
        desc: "Cojín circular tapizado a mano.",
        priceLabel: "Desde xx€",
        comingSoon: true,
      },
    ],
  },
  puffs: {
    title: "Puffs",
    subtitle: "Tapizados a medida, versátiles y fáciles de mover.",
    models: [
      {
        name: "Patos",
        photos: [
          "/productos-fotos/puff/IMG_2497.webp",
        ],
        desc: "Cúbico · Colección Galicia.",
        priceLabel: "Desde xx€",
        configParam: "cuadrado",
      },
      {
        name: "Monteferro",
        photos: [],
        desc: "Redondo · Colección Galicia.",
        priceLabel: "Desde xx€",
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
        name: "Cabo de Palos",
        photos: [
          "/productos-fotos/crops/puff-2497-1-tight.png",
        ],
        desc: "Sin patas · Colección Murcia.",
        priceLabel: "Desde xx€",
        configParam: "tipo-puff",
      },
      {
        name: "Calblanque",
        photos: [
          "/productos-fotos/crops/puff-2497-tight.png",
        ],
        desc: "Con patas · Colección Murcia.",
        priceLabel: "Desde xx€",
        configParam: "tipo-banco",
      },
    ],
  },
  "pantallas-lampara": {
    title: "Pantallas de lámpara",
    subtitle: "Tapizadas a mano en lino, terciopelo o bouclé.",
    models: [
      { name: "Gredos", photos: [], desc: "Cónica · Colección Ávila.", priceLabel: "Desde xx€", configParam: "cono" },
      { name: "Almanzor", photos: [], desc: "Cilíndrica · Colección Ávila.", priceLabel: "Desde xx€", configParam: "cilindro" },
      { name: "La Galana", photos: [], desc: "Pirámide · Colección Ávila.", priceLabel: "Desde xx€", configParam: "piramide" },
      { name: "La Serrota", photos: [], desc: "Rectangular · Colección Ávila.", priceLabel: "Desde xx€", configParam: "rectangulo" },
      { name: "Tormes", photos: [], desc: "Cuadrada · Colección Ávila.", priceLabel: "Desde xx€", configParam: "cuadrado" },
      { name: "La Paramera", photos: [], desc: "Ovalada · Colección Ávila.", priceLabel: "Desde xx€", configParam: "ovalado" },
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
  puffs: "puff",
  "mesas-centro": "mesa",
  "pantallas-lampara": "pantalla",
  percheros: "perchero",
};

const imagePosition = (category: string) => {
  if (category === "puffs" || category === "mesas-centro") return "center center";
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
    if (photos.length <= 1) return;
    if (hovered) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % photos.length), 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos.length, hovered]);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-[4/3] flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#F0EDE8' }}>
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
      className="relative overflow-hidden w-full aspect-[4/3]"
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
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 pointer-events-none flex items-center justify-center">
          <span className="text-white text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Personalizar →</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-medium text-foreground">{model.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground font-light flex-1">{model.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-base text-foreground font-medium">{model.priceLabel}</p>
          <span className="text-xs tracking-extra-wide uppercase text-accent-warm border-b border-accent-warm pb-0.5 group-hover:opacity-80 transition-opacity">
            Personalizar
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
