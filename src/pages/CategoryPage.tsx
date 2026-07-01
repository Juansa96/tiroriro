import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { ChevronRight, ChevronLeft, Clock, Instagram, Maximize2 } from "lucide-react";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export interface Model {
  name: string;
  photos: string[];
  desc: string;
  priceLabel: string;
  configParam?: string;
  comingSoon?: boolean;
}

// Pequeño círculo con la silueta de la forma del producto
const getShapePath = (configParam: string | undefined, category: string): React.ReactNode => {
  if (category === 'cabeceros') {
    switch (configParam) {
      case 'recto': return <rect x="4" y="6" width="24" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />;
      case 'semicirculo': return <path d="M 4 22 L 4 14 Q 16 4 28 14 L 28 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
      case 'corona-simple': return <path d="M 2 22 L 2 14 C 8 14 10 11 10.4 9.2 A 5.6 1.6 0 0 1 21.6 9.2 C 22 11 24 14 30 14 L 30 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
      case 'corona-doble': return <path d="M 2 22 L 2 14 Q 7 14 7 11.5 Q 12 11.5 12 9 A 4 2 0 0 1 20 9 Q 20 11.5 25 11.5 Q 25 14 30 14 L 30 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
      case 'ondas': return <path d="M 2 22 L 2 15 Q 5.5 8 9 15 Q 12.5 8 16 15 Q 19.5 8 23 15 Q 26.5 8 30 15 L 30 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />;
    }
  }
  if (category === 'cojines') {
    switch (configParam) {
      case 'rodiles': return <rect x="6" y="6" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
      case 'covadonga': return <rect x="3" y="9" width="26" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
      case 'gulpiyuri': return <><rect x="3" y="12" width="26" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="3" cy="16" rx="2" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" /></>;
    }
  }
  if (category === 'pufs') return <rect x="6" y="6" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
  if (category === 'bancos') return <path d="M 4 9 H 28 V 24 H 24 V 14 H 8 V 24 H 4 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />;
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

const ShapeCircle = ({ configParam, category }: { configParam?: string; category: string }) => {
  const path = getShapePath(configParam, category);
  if (!path) return null;
  return (
    <div className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-foreground/70">{path}</svg>
    </div>
  );
};

export const CATEGORIES: Record<string, { title: string; subtitle: string; models: Model[]; comingSoon?: boolean }> = {
  cabeceros: {
    title: "Cabeceros tapizados",
    subtitle: "El punto de partida de cualquier dormitorio que merece la pena.",
    models: [
      {
        name: "Calobra",
        photos: [
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
        ],
        desc: "Remate en arco suave. Aporta calidez sin renunciar a la elegancia.",
        priceLabel: "",
        configParam: "semicirculo",
      },
      {
        name: "Macarella",
        photos: [
          "/productos-fotos/cabeceros/macarella-01.webp",
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
          "/productos-fotos/cabeceros/conta-03.webp",
          "/productos-fotos/cabeceros/conta-04.webp",
        ],
        desc: "Corona doble con dos niveles escalonados. Más elaborada y con mayor presencia.",
        priceLabel: "",
        configParam: "corona-doble",
      },
      {
        name: "Barbaria",
        photos: [
          "/productos-fotos/cabeceros/barbaria-01.webp",
          "/productos-fotos/cabeceros/barbaria-02.webp",
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
    models: [
      {
        name: "Oyambre",
        photos: [
          "/productos-fotos/bancos/oyambre-nuevo.webp",
          "/productos-fotos/bancos/IMG_2760.webp",
          "/productos-fotos/bancos/oyambre-01.webp",
          "/productos-fotos/bancos/oyambre-03.webp",
        ],
        desc: "Banco entelado de pie de cama estilo cascada, sin respaldo ni reposabrazos. Tres medidas: 150, 120 y 90 cm de largo (alto 45 · fondo 33).",
        priceLabel: "Desde 180€",
        configParam: "cascada",
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
    comingSoon: true,
    models: [
      {
        name: "Rodiles — Cuadrado",
        photos: [],
        desc: "Clásico y versátil. Queda perfecto en camas, sofás o sillones.",
        priceLabel: "",
        configParam: "rodiles",
        comingSoon: true,
      },
      {
        name: "Covadonga — Rectangular",
        photos: [],
        desc: "La forma alargada que siempre queda bien. Ideal para el cabecero de la cama o el respaldo del sofá.",
        priceLabel: "",
        configParam: "covadonga",
        comingSoon: true,
      },
      {
        name: "Gulpiyuri — Rulo",
        photos: [],
        desc: "Un toque diferente y muy nórdico. Combina a la perfección con cabeceros tapizados.",
        priceLabel: "",
        configParam: "gulpiyuri",
        comingSoon: true,
      },
      {
        name: "Torimbia — Redondo",
        photos: [],
        desc: "Almohadón circular tapizado a mano.",
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
          "/productos-fotos/puff/puff-nuevo.webp",
          "/productos-fotos/puff/patos-02.webp",
          "/productos-fotos/puff/patos-03.webp",
          "/productos-fotos/puff/patos-04.webp",
        ],
        desc: "Cúbico, tapizado a mano y a tu medida. Úsalo de asiento, reposapiés o mesa improvisada.",
        priceLabel: "",
        configParam: "cuadrado",
      },
      {
        name: "Monteferro",
        photos: [
          "/productos-fotos/puff/monteferro-01.webp",
          "/productos-fotos/puff/monteferro-02.webp",
        ],
        desc: "Redondo, tapizado a mano y a tu medida. Cómodo, mullido y perfecto para sumar asiento extra en cualquier rincón.",
        priceLabel: "",
        configParam: "circular",
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
          "/productos-fotos/mesas-centro/cabo-de-palos.webp",
        ],
        desc: "Mesa cúbica tapizada sin patas. Versátil y con mucha presencia en el salón.",
        priceLabel: "",
        configParam: "tipo-puf",
      },
      {
        name: "Calblanque",
        photos: [],
        desc: "Mesa de centro tapizada con patas. Próximamente.",
        priceLabel: "",
        configParam: "tipo-banco",
        comingSoon: true,
      },
    ],
  },
  "pantallas-lampara": {
    title: "Pantallas de lámpara",
    subtitle: "Tapizadas a mano en telas básicas y premium.",
    models: [
      { name: "Almanzor", photos: ["/productos-fotos/pantallas/almanzor-01.webp", "/productos-fotos/pantallas/almanzor-02.webp", "/productos-fotos/pantallas/almanzor-03.webp"], desc: "Cilíndrica. La más clásica y versátil. Transforma cualquier lámpara con un toque artesanal.", priceLabel: "", configParam: "cilindro" },
      { name: "Tormes", photos: ["/productos-fotos/pantallas/tormes-01.webp"], desc: "Cuadrada. Líneas limpias para espacios modernos y contemporáneos.", priceLabel: "", configParam: "cuadrado" },
      { name: "Gredos", photos: ["/productos-fotos/pantallas/gredos-01.webp"], desc: "Cónica. Elegante y con carácter. Ideal para lámparas de pie y de sobremesa.", priceLabel: "", configParam: "cono", comingSoon: true },
      { name: "La Serrota", photos: ["/productos-fotos/pantallas/serrota-01.webp"], desc: "Rectangular. Perfecta para apliques de pared y lámparas de diseño.", priceLabel: "", configParam: "rectangulo" },
      { name: "La Paramera", photos: ["/productos-fotos/pantallas/paramera-01.webp"], desc: "Ovalada. Suave y sofisticada. Da una luz difusa y muy cálida.", priceLabel: "", configParam: "ovalado", comingSoon: true },
      { name: "La Galana", photos: ["/productos-fotos/pantallas/galana-01.webp"], desc: "Pirámide. Forma original con mucha personalidad. Un objeto decorativo en sí mismo.", priceLabel: "", configParam: "piramide", comingSoon: true },
    ],
  },
  percheros: {
    title: "Percheros",
    subtitle: "Próximamente.",
    comingSoon: true,
    models: [],
  },
};

export const productTypeMap: Record<string, string> = {
  cabeceros: "cabecero",
  bancos: "banco",
  cojines: "cojin",
  pufs: "puf",
  "mesas-centro": "mesa",
  "pantallas-lampara": "pantalla",
  percheros: "perchero",
};

// Texto descriptivo corto para alt de imágenes ("Cabecero tapizado Pregonda — foto 2 | Tiroriro")
export const categoryAltLabel: Record<string, string> = {
  cabeceros:           "Cabecero tapizado a medida hecho a mano en España",
  bancos:              "Banco entelado a medida hecho a mano en España",
  cojines:             "Almohadón tapizado a medida hecho a mano en España",
  pufs:                "Puf tapizado a medida hecho a mano en España",
  "mesas-centro":      "Mesa de centro tapizada a medida hecha a mano en España",
  "pantallas-lampara": "Pantalla de lámpara tapizada a mano en España",
  percheros:           "Perchero tapizado a medida hecho a mano en España",
};

// SEO por categoría: title + description + canonical únicos
export const CATEGORY_SEO: Record<string, { title: string; description: string; canonical: string; ogImage: string }> = {
  cabeceros: {
    title: "Cabeceros tapizados a medida | 5 formas | Tiroriro",
    description: "Cabeceros tapizados a medida en 5 formas: recto, arco, corona y ondas. Más de 60 telas. Desde 225 €. Hecho a mano en España en 20 días.",
    canonical: "https://tirorirohome.com/productos/cabeceros",
    ogImage: "https://tirorirohome.com/productos-fotos/cabeceros/IMG_2218.webp",
  },
  bancos: {
    title: "Bancos entelados a medida | Tiroriro",
    description: "Banco Oyambre tapizado a medida en 3 largos: 150, 120 y 90 cm. Alto 45 · fondo 33. Desde 180 €. Hecho a mano en España.",
    canonical: "https://tirorirohome.com/productos/bancos",
    ogImage: "https://tirorirohome.com/productos-fotos/bancos/IMG_2491.webp",
  },
  cojines: {
    title: "Almohadones tapizados a medida | Tiroriro",
    description: "Almohadones tapizados a medida en distintas formas: cuadrado, rectangular y rulo. Más de 60 telas. Desde 50 €. Hecho a mano en España.",
    canonical: "https://tirorirohome.com/productos/cojines",
    ogImage: "https://tirorirohome.com/productos-fotos/almohadones/IMG_2486.webp",
  },
  pufs: {
    title: "Pufs tapizados a medida | Solos o en pareja | Tiroriro",
    description: "Pufs cúbicos tapizados a medida, solos o en pareja. Más de 60 telas disponibles. Desde 125 €. Hecho a mano en España.",
    canonical: "https://tirorirohome.com/productos/pufs",
    ogImage: "https://tirorirohome.com/productos-fotos/puff/monteferro-01.webp",
  },
  "mesas-centro": {
    title: "Mesas de centro tapizadas a medida | Tiroriro",
    description: "Mesas de centro tapizadas, sin patas y con opción de superficie de cristal o metacrilato. Desde 280 €. Diseño único, hecho a mano en España.",
    canonical: "https://tirorirohome.com/productos/mesas-centro",
    ogImage: "https://tirorirohome.com/productos-fotos/mesas-centro/cabo-de-palos.webp",
  },
  "pantallas-lampara": {
    title: "Pantallas de lámpara tapizadas a mano | Tiroriro",
    description: "Pantallas de lámpara tapizadas a mano en más de 60 telas básicas y premium. Transforma cualquier lámpara en una pieza única. Desde 25 €.",
    canonical: "https://tirorirohome.com/productos/pantallas-lampara",
    ogImage: "https://tirorirohome.com/productos-fotos/pantallas/almanzor-01.webp",
  },
};

// Precio "desde" por categoría — usado para JSON-LD Product y AggregateOffer (GEO)
export const CATEGORY_PRICE_FROM: Record<string, number> = {
  cabeceros: 225,
  bancos: 180,
  pufs: 125,
  "mesas-centro": 280,
  "pantallas-lampara": 25,
  cojines: 50,
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
  const [zoomOpen, setZoomOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const buildSrcSet = (src: string) => {
    // Asume variantes generadas: <stem>-480.webp y <stem>-800.webp en el mismo directorio
    const m = src.match(/^(.*)\.(webp|jpe?g|png)$/i);
    if (!m) return undefined;
    const stem = m[1];
    return `${stem}-480.webp 480w, ${stem}-800.webp 800w, ${src} 1600w`;
  };

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

  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative overflow-hidden w-full aspect-[3/4] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {photos.map((src, i) => (
        <img
          key={src}
          src={src}
          srcSet={buildSrcSet(src)}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px"
          alt={`${categoryAltLabel[category] || "Producto tapizado"} ${name}${photos.length > 1 ? ` — foto ${i + 1}` : ""} | Tiroriro`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === idx ? 1 : 0, objectPosition: imagePosition(category) }}
          loading="lazy"
          decoding="async"
        />
      ))}
      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Ir a la foto ${i + 1}`}
                aria-current={i === idx ? "true" : undefined}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
      {/* Lightbox: ampliar la foto sin salir de la página */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setZoomOpen(true); }}
            aria-label="Ampliar foto"
            className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <Maximize2 size={14} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 bg-transparent border-0 shadow-none">
          <img
            src={photos[idx]}
            alt={`${categoryAltLabel[category] || "Producto tapizado"} ${name} — vista ampliada`}
            className="w-full h-auto max-h-[90vh] object-contain rounded"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ModelCard = ({ model, category }: { model: Model; category: string }) => {
  const configHref = `/configurador?tipo=${productTypeMap[category] || category}${model.configParam ? `&forma=${model.configParam}` : ""}`;
  const slug = model.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/—/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const detailHref = `/productos/${category}/${slug}`;

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
    <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden">
      <Link to={detailHref} className="relative overflow-hidden block" aria-label={`Ver detalles de ${model.name}`}>
        <PhotoSlider photos={model.photos} category={category} name={model.name} />
        {category !== 'pantallas-lampara' && (
          <ShapeCircle configParam={model.configParam} category={category} />
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-medium text-foreground">
          <Link to={detailHref} className="hover:text-accent-warm transition-colors">{model.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground font-light flex-1">{model.desc}</p>
        <div className="mt-4 space-y-2">
          <Link
            to={configHref}
            className="btn-sweep btn-unir btn-unir-outline inline-flex items-center justify-center w-full px-6 py-3 text-xs uppercase tracking-[0.20em]"
          >
            <span className="relative z-10">Diseña el tuyo →</span>
          </Link>
          <Link
            to={detailHref}
            className="block text-center text-[11px] tracking-[0.20em] uppercase text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Más info
          </Link>
        </div>
      </div>
    </div>
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

  const activeModels = cat.models.filter(m => !m.comingSoon);
  const comingSoonModels = cat.models.filter(m => m.comingSoon);
  const seo = CATEGORY_SEO[category];
  const priceFrom = CATEGORY_PRICE_FROM[category];
  const productJsonLd = seo && priceFrom
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: cat.title,
        description: seo.description,
        brand: { "@type": "Brand", name: "Tiroriro" },
        category: cat.title,
        image: activeModels[0]?.photos[0]
          ? `https://tirorirohome.com${activeModels[0].photos[0]}`
          : "https://tirorirohome.com/hero-poster.webp",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: priceFrom,
          offerCount: activeModels.length || 1,
          availability: "https://schema.org/InStock",
          areaServed: "ES",
          seller: { "@type": "Organization", name: "Tiroriro", url: "https://tirorirohome.com" },
        },
      }
    : null;
  const breadcrumbJsonLd = seo
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://tirorirohome.com/" },
          { "@type": "ListItem", position: 2, name: "Productos", item: "https://tirorirohome.com/productos" },
          { "@type": "ListItem", position: 3, name: cat.title, item: seo.canonical },
        ],
      }
    : null;
  const itemListJsonLd = seo && activeModels.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: cat.title,
        itemListElement: activeModels.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: `${cat.title.replace(/s$/, "")} ${m.name}`,
            sku: `tiroriro-${category}-${m.name.toLowerCase().replace(/\s+/g, "-")}`,
            description: m.desc,
            image: m.photos[0] ? `https://tirorirohome.com${m.photos[0]}` : undefined,
            brand: { "@type": "Brand", name: "Tiroriro" },
            category: cat.title,
            url: m.configParam
              ? `${seo.canonical}#${m.configParam}`
              : seo.canonical,
            ...(priceFrom
              ? {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "EUR",
                    price: priceFrom,
                    availability: "https://schema.org/InStock",
                    areaServed: "ES",
                    seller: { "@type": "Organization", name: "Tiroriro" },
                  },
                }
              : {}),
          },
        })),
      }
    : null;

  return (
    <>
      {seo && (
        <SEO title={seo.title} description={seo.description} canonical={seo.canonical} ogImage={seo.ogImage} />
      )}
      {(productJsonLd || breadcrumbJsonLd || itemListJsonLd) && (
        <Helmet>
          {productJsonLd && (
            <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
          )}
          {breadcrumbJsonLd && (
            <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
          )}
          {itemListJsonLd && (
            <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
          )}
        </Helmet>
      )}
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
            {category === 'cabeceros' && (
              <p className="mt-3 text-sm text-muted-foreground font-light">
                <Link to="/guia-medidas-cabeceros" className="underline underline-offset-4 hover:text-accent-warm transition-colors">
                  ¿No sabes qué medida elegir? Consulta nuestra guía
                </Link>
              </p>
            )}
            {cat.comingSoon && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-full">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider uppercase">Próximamente disponibles</span>
              </div>
            )}
            <span className="section-line" />
          </AnimatedSection>
          {activeModels.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeModels.map((model, i) => (
                <AnimatedSection key={model.name} delay={i * 0.08} className="h-full">
                  <div className="h-full">
                    <ModelCard model={model} category={category} />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Próximamente — grouped at the bottom without photos */}
          {comingSoonModels.length > 0 && (
            <AnimatedSection delay={0.3} className="mt-14">
              <div className="border-t border-border/40 pt-8">
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={13} className="text-muted-foreground/70" />
                  <span className="text-[10px] tracking-[0.20em] uppercase text-muted-foreground/70 font-medium">Próximamente</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {comingSoonModels.map(model => {
                    const shapePath = getShapePath(model.configParam, category);
                    return (
                      <div
                        key={model.name}
                        className="flex items-center gap-3 px-4 py-3 border border-border/40 rounded-lg bg-muted/20"
                      >
                        {shapePath && (
                          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <svg viewBox="0 0 32 32" className="w-5 h-5 text-foreground/40">{shapePath}</svg>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground/50 font-serif">{model.name}</p>
                          <p className="text-[10px] text-muted-foreground/60 font-light tracking-wide uppercase">Próximamente</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* CTA: Ver más en Instagram */}
          <AnimatedSection delay={0.4} className="mt-16">
            <div className="max-w-2xl mx-auto text-center border-t border-border/40 pt-10">
              <div className="inline-flex items-center gap-2 mb-3 text-muted-foreground">
                <Instagram size={16} strokeWidth={1.5} />
                <span className="text-[10px] tracking-[0.24em] uppercase font-medium">Instagram</span>
              </div>
              <p className="font-serif text-xl md:text-2xl font-light text-foreground">
                Mira más piezas en nuestro Instagram
              </p>
              <p className="mt-2 text-sm text-muted-foreground font-light italic">
                Novedades, procesos y proyectos reales de clientes.
              </p>
              <a
                href="https://www.instagram.com/tirorirohome/?utm_source=web&utm_medium=category_cta&utm_campaign=to_instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 border border-foreground text-xs uppercase tracking-[0.20em] text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <Instagram size={14} />
                Ver más en @tirorirohome
              </a>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryPage;
