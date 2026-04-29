import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductSVGPreview, { darken } from "./ProductSVGPreview";
import { Switch } from "@/components/ui/switch";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductType, PRODUCTS, calculatePrice, buildConfigSummary } from "@/lib/products";
import { ChevronDown, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const FABRIC_GROUPS = [
  {
    label: "Básicas",
    collection: "Colección Básica",
    fabrics: [
      // Lisas
      { id: "basica-arequipa", name: "Arequipa Beige", hex: "#D4C5A9", image: "/telas/basicas/arequipa-beige.webp", pattern: "liso" },
      // Flores
      { id: "basica-flor-azul", name: "Flor Azul Protea", hex: "#6B8FAA", image: "/telas/basicas/flor-azul-protea.webp", pattern: "estampado" },
      { id: "basica-flor-01", name: "Floral Natural", hex: "#8B7355", image: "/telas/basicas/flor-01.webp", pattern: "estampado" },
      // Geométricas
      { id: "basica-ikat", name: "Ikat Natural", hex: "#C4A882", image: "/telas/basicas/ikat.webp", pattern: "estampado" },
      { id: "basica-ikat-verde", name: "Ikat Verde Agua", hex: "#7D9B76", image: "/telas/basicas/ikat-verde.webp", pattern: "estampado" },
      { id: "basica-kasbah", name: "Árbol Kasbah", hex: "#8B6554", image: "/telas/basicas/arbol-kasbah.webp", pattern: "estampado" },
      { id: "basica-kuwait", name: "Geométrica Kuwait", hex: "#8B7355", image: "/telas/basicas/geometrica-kuwait.webp", pattern: "estampado" },
      { id: "basica-takada", name: "Takada Verde", hex: "#5B7355", image: "/telas/basicas/takada-verde.webp", pattern: "estampado" },
      // Rayas
      { id: "basica-rayas-gris", name: "Mil Rayas Gris", hex: "#A0A0A0", image: "/telas/basicas/mil-rayas-gris.webp", pattern: "estampado" },
      { id: "basica-rayas-arena", name: "Rayas Arena", hex: "#C4A882", image: "/telas/basicas/rayas-arena.webp", pattern: "estampado" },
      { id: "basica-rayas-azul", name: "Mil Rayas Azul", hex: "#2C3E50", image: "/telas/basicas/mil-rayas-azul.webp", pattern: "estampado" },
      { id: "basica-raya-indigo", name: "Raya Índigo", hex: "#4A6FA5", image: "/telas/basicas/raya-indigo.webp", pattern: "estampado" },
      { id: "basica-rayas-tevere", name: "Rayas Tévere", hex: "#8B7355", image: "/telas/basicas/rayas-tevere.webp", pattern: "estampado" },
      { id: "basica-coral", name: "Coral Costero", hex: "#E8A87C", image: "/telas/basicas/coral-costero.webp", pattern: "estampado" },
      { id: "basica-harvest", name: "Raya Harvest", hex: "#C19A6B", image: "/telas/basicas/raya-harvest.webp", pattern: "estampado" },
      // Otras
      { id: "basica-toile", name: "Toile de Jouy Azul", hex: "#6B8FAA", image: "/telas/basicas/toile-jouy-azul.webp", pattern: "estampado" },
    ],
  },
  {
    label: "Premium",
    collection: "Colección Premium",
    fabrics: [
      { id: "premium-baqueira", name: "Baqueira", hex: "#5B4B3A", image: "/telas/premium/baqueira.webp", pattern: "liso" },
      { id: "premium-cerler", name: "Cérler", hex: "#8B7355", image: "/telas/premium/cerler.webp", pattern: "liso" },
      { id: "premium-lola-gris", name: "Lola Gris", hex: "#6D6D6D", image: "/telas/premium/lola-gris.webp", pattern: "liso" },
      { id: "premium-rocio", name: "Rocío", hex: "#D4B896", image: "/telas/premium/rocio.webp", pattern: "liso" },
      { id: "premium-artesano", name: "Artesano Beige", hex: "#D4C5A9", image: "/telas/premium/artesano-beige.webp", pattern: "liso" },
      { id: "premium-verde-botella", name: "Lino Verde Botella", hex: "#2D4A2D", image: "/telas/premium/lino-verde-botella.webp", pattern: "liso" },
      { id: "premium-lino-verde", name: "Lino Verde", hex: "#4A6B4A", image: "/telas/premium/lino-verde.webp", pattern: "liso" },
      { id: "premium-guell", name: "Güell Lamadrid", hex: "#8B7355", image: "/telas/premium/guell-lamadrid.webp", pattern: "estampado" },
      { id: "premium-rayas-sage", name: "Rayas Verde Sage", hex: "#7D9B76", image: "/telas/premium/rayas-verde-sage.webp", pattern: "estampado" },
      { id: "premium-azul-provenzal", name: "Lino Azul Provenzal", hex: "#4A6FA5", image: "/telas/premium/lino-azul-provenzal.webp", pattern: "estampado" },
      { id: "premium-vichy", name: "Vichy Denim", hex: "#2C3E50", image: "/telas/premium/vichy-denim.webp", pattern: "estampado" },
      { id: "premium-ramas-siena", name: "Ramas Siena Azul", hex: "#5B6B8B", image: "/telas/premium/ramas-siena.webp", pattern: "estampado" },
      { id: "premium-gardenia", name: "Flores Gardenia", hex: "#6B8FAA", image: "/telas/premium/flores-gardenia.webp", pattern: "estampado" },
    ],
  },
];

const ALL_FABRICS = FABRIC_GROUPS.flatMap(g => g.fabrics.map(f => ({ ...f, group: g.label, collection: g.collection })));

// Cabecero: vivo-simple incluido (0€), vivo-doble +10€
// Resto: vivo-simple incluido (0€) cuando aplica
const FINISHES = [
  { id: "liso", name: "Sin acabado", desc: "Sin costuras decorativas", extra: 0 },
  { id: "vivo-simple", name: "Vivo simple", desc: "Un ribete en el perímetro — incluido en el precio", extra: 0, extraLabel: "Incluido" },
  { id: "vivo-doble", name: "Vivo doble", desc: "Dos líneas de ribete, más elaborado", extra: 10, extraLabel: "+10€" },
];

const HEADBOARD_SHAPES = [
  { id: "recto", name: "Calobra", svgPreview: "M 5 35 L 5 8 L 55 8 L 55 35 Z" },
  { id: "semicirculo", name: "Pregonda", svgPreview: "M 5 35 L 5 22 Q 30 2 55 22 L 55 35 Z" },
  { id: "corona-simple", name: "Macarella", svgPreview: "M 3 37 L 3 24 C 13.6 24 18 20 18.8 16.8 A 11.2 3.2 0 0 1 41.2 16.8 C 42 20 46.4 24 57 24 L 57 37 Z" },
  { id: "corona-doble", name: "Conta", svgPreview: "M 3 37 L 3 24 Q 11.4 24 11.4 19.8 Q 19.8 19.8 19.8 15.6 A 10.2 4.4 0 0 1 40.2 15.6 Q 40.2 19.8 48.6 19.8 Q 48.6 24 57 24 L 57 37 Z" },
  { id: "ondas", name: "Barbaria", svgPreview: "M 3 37 L 3 26 Q 8.4 12 13.8 26 Q 19.2 12 24.6 26 Q 30 12 35.4 26 Q 40.8 12 46.2 26 Q 51.6 12 57 26 L 57 37 Z" },
];

// Colección Ávila — solo cilindro, cuadrado y rectangulo activos (el resto próximamente)
const LAMPSHADE_SHAPES: Array<{ id: string; name: string; subtitle: string; svgContent: React.ReactNode; comingSoon?: boolean }> = [
  {
    id: "cilindro", name: "Almanzor", subtitle: "Cilíndrico",
    svgContent: (
      <>
        <rect x="8" y="12" width="44" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="30" cy="12" rx="22" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="30" cy="32" rx="22" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    id: "cuadrado", name: "Tormes", subtitle: "Cuadrado",
    svgContent: (
      <rect x="13" y="8" width="34" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
    ),
  },
  {
    id: "rectangulo", name: "La Serrota", subtitle: "Rectangular",
    svgContent: (
      <rect x="5" y="12" width="50" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    ),
  },
  {
    id: "cono", name: "Gredos", subtitle: "Cónico", comingSoon: true,
    svgContent: (
      <>
        <path d="M 20 14 L 40 14 L 52 36 L 8 36 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="30" cy="14" rx="10" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    id: "piramide", name: "La Galana", subtitle: "Pirámide", comingSoon: true,
    svgContent: (
      <path d="M 16 8 L 44 8 L 52 36 L 8 36 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    ),
  },
  {
    id: "ovalado", name: "La Paramera", subtitle: "Ovalado", comingSoon: true,
    svgContent: (
      <>
        <ellipse cx="30" cy="14" rx="18" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="14" x2="12" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="48" y1="14" x2="48" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="30" cy="32" rx="18" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
];

// Medidas y precios reales por forma de pantalla (key = "<shape>-<medida>" para el lookup)
const LAMP_SIZES: Record<string, string[]> = {
  cilindro:   ["Ø15×20cm", "Ø25×25cm", "Ø40×40cm"],
  cuadrado:   ["20×20cm"],
  rectangulo: ["20×40cm"],
};

// Ribete incluido en el precio — no se muestra como opción separada
const PANTALLA_FINISHES = [
  { id: "vivo-simple", name: "Ribete incluido", desc: "Ribete en el borde superior e inferior — sin coste adicional" },
];

const CUSHION_SHAPES = [
  {
    id: "rodiles", name: "Rodiles", subtitle: "Cuadrado",
    svgPath: <rect x="10" y="10" width="40" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    sizes: ["40×40 cm", "45×45 cm", "50×50 cm"],
    getDetails: (sz: string) => {
      if (sz.includes("50")) return { shape: "cuadrada", widthCm: 50, heightCm: 50 };
      if (sz.includes("45")) return { shape: "cuadrada", widthCm: 45, heightCm: 45 };
      return { shape: "cuadrada", widthCm: 40, heightCm: 40 };
    },
  },
  {
    id: "covadonga", name: "Covadonga", subtitle: "Rectangular",
    svgPath: <rect x="4" y="14" width="52" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    sizes: ["50×30 cm", "60×40 cm"],
    getDetails: (sz: string) => {
      if (sz.includes("60")) return { shape: "rectangular", widthCm: 60, heightCm: 40 };
      return { shape: "rectangular", widthCm: 50, heightCm: 30 };
    },
  },
  {
    id: "gulpiyuri", name: "Gulpiyuri", subtitle: "Rulo",
    svgPath: <><rect x="4" y="20" width="52" height="20" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" /><ellipse cx="4" cy="30" rx="5" ry="10" fill="none" stroke="currentColor" strokeWidth="1.5" /></>,
    sizes: ["13×90 cm"],
    getDetails: (_sz: string) => ({ shape: "cilindro", widthCm: 90, heightCm: 13 }),
  },
];

type Step = "type" | "measures" | "fabric" | "finish" | "extras";
const STEPS: Step[] = ["type", "measures", "fabric", "finish", "extras"];
const STEP_LABELS: Record<Step, string> = {
  type: "¿Qué quieres?",
  measures: "Medidas",
  fabric: "Tela y color",
  finish: "Acabado",
  extras: "Extras",
};

const ProductIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'cabecero':
      return <svg viewBox="0 0 40 30" className="w-8 h-6"><rect x="2" y="4" width="36" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'banco':
      return <svg viewBox="0 0 40 24" className="w-8 h-5"><rect x="2" y="4" width="36" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="6" y1="16" x2="6" y2="22" stroke="currentColor" strokeWidth="2" /><line x1="34" y1="16" x2="34" y2="22" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'puf':
      return <svg viewBox="0 0 40 30" className="w-8 h-6"><rect x="8" y="5" width="24" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'cojin':
      return <svg viewBox="0 0 40 24" className="w-8 h-5"><rect x="3" y="4" width="34" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'mesa':
      return <svg viewBox="0 0 42 30" className="w-8 h-6"><rect x="5" y="5" width="32" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="10" y1="15" x2="10" y2="25" stroke="currentColor" strokeWidth="2" /><line x1="32" y1="15" x2="32" y2="25" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'pantalla':
      return <svg viewBox="0 0 40 32" className="w-8 h-6"><path d="M 14 4 L 26 4 L 34 28 L 6 28 Z" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    default:
      return null;
  }
};

const BENCH_VARIANTS = [
  { id: "madera", name: "Patas de madera" },
  { id: "enteladas", name: "Patas enteladas" },
  { id: "baul", name: "Estilo baúl" },
];

const selectClass = "w-full bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-2 appearance-none cursor-pointer pr-8";

const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <ChevronDown size={14} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  </div>
);

function parseCm(selectVal: string): number | undefined {
  if (!selectVal) return undefined;
  const n = parseInt(selectVal);
  return isNaN(n) ? undefined : n;
}

function parseLampSize(sz: string): { widthCm: number; heightCm: number } {
  const diameter = sz.match(/Ø(\d+)/);
  if (diameter) { const d = parseInt(diameter[1]); return { widthCm: d, heightCm: d }; }
  const dims = sz.match(/(\d+)[×x](\d+)/);
  if (dims) return { widthCm: parseInt(dims[1]), heightCm: parseInt(dims[2]) };
  return { widthCm: 30, heightCm: 30 };
}

function parseCushionDetails(cushionShape: string, cushionSize: string): { shape: string; widthCm: number; heightCm: number } {
  const shapeObj = CUSHION_SHAPES.find(s => s.id === cushionShape);
  if (shapeObj && cushionSize) return shapeObj.getDetails(cushionSize);
  return { shape: 'cuadrada', widthCm: 45, heightCm: 45 };
}

const RenderNotice = () => (
  <p className="text-[11px] text-muted-foreground text-center mt-3 italic leading-relaxed px-2">
    Render de simulación — los colores pueden variar. ¿Quieres ver la tela antes de decidir? Te enviamos muestras a casa.
  </p>
);

// Fabric swatch panel shown next to the render
// Order: tela principal → tela laterales → vivo
const FabricSwatchPanel = ({
  fabric,
  vivoFabric,
  lateralFabric,
  showLateral = true,
}: {
  fabric?: { name: string; hex: string; image?: string };
  vivoFabric?: { name: string; hex: string; image?: string };
  lateralFabric?: { name: string; hex: string; image?: string };
  showLateral?: boolean;
}) => (
  <div className="flex flex-col gap-3 justify-center">
    {/* 1. Tela elegida */}
    <div className="flex flex-col gap-1">
      <p className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground font-medium">Tela</p>
      <div
        className="w-full h-14 rounded-md border border-border/40 overflow-hidden"
        style={{ backgroundColor: fabric?.hex || '#E8E4DC' }}
      >
        {fabric?.image && (
          <img src={fabric.image} alt={fabric.name} className="w-full h-full object-cover" loading="lazy" />
        )}
      </div>
      <p className="text-[10px] text-muted-foreground font-light leading-tight">{fabric?.name || '—'}</p>
    </div>

    {/* 2. Tela laterales */}
    {showLateral && (
      <div className="flex flex-col gap-1">
        <p className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground font-medium">Laterales</p>
        <div
          className="w-full h-14 rounded-md border border-border/40 overflow-hidden"
          style={{ backgroundColor: lateralFabric?.hex || fabric?.hex || '#E8E4DC' }}
        >
          {(lateralFabric?.image || fabric?.image) && (
            <img src={lateralFabric?.image || fabric?.image} alt={lateralFabric?.name || fabric?.name} className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
        <p className="text-[10px] text-muted-foreground font-light leading-tight">{lateralFabric?.name || fabric?.name || '—'}</p>
      </div>
    )}

    {/* 3. Vivo elegido */}
    {vivoFabric && (
      <div className="flex flex-col gap-1">
        <p className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground font-medium">Vivo</p>
        <div
          className="w-full h-9 rounded-md border border-border/40 overflow-hidden"
          style={{ backgroundColor: vivoFabric.hex }}
        >
          {vivoFabric.image && (
            <img src={vivoFabric.image} alt={vivoFabric.name} className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
        <p className="text-[10px] text-muted-foreground font-light leading-tight">{vivoFabric.name}</p>
      </div>
    )}
  </div>
);

const ProductConfigurator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const [productType, setProductType] = useState<ProductType | null>(null);
  const [shape, setShape] = useState("recto");
  const [bedWidth, setBedWidth] = useState("");
  const [bedHeight, setBedHeight] = useState("");
  const [benchLength, setBenchLength] = useState("");
  const [benchDepth, setBenchDepth] = useState("");
  const [benchHeight, setBenchHeight] = useState("");
  const [puffDiameter, setPuffDiameter] = useState("");
  const [puffHeight, setPuffHeight] = useState("");
  const [cushionShape, setCushionShape] = useState("");
  const [cushionSize, setCushionSize] = useState("");
  const [lampDiameter, setLampDiameter] = useState("");
  const [lampHeight, setLampHeight] = useState("");
  const [fabricId, setFabricId] = useState("");
  const [lateralFabricId, setLateralFabricId] = useState("");
  const [finish, setFinish] = useState("");
  const [vivoColorId, setVivoColorId] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  const [puffQuantity, setPuffQuantity] = useState("1");

  const [extraPatas, setExtraPatas] = useState(false);
  const [extraRelleno, setExtraRelleno] = useState(false);
  const [extraExpress, setExtraExpress] = useState(false);
  const [extraTopMaterial, setExtraTopMaterial] = useState("nada");

  // Siempre string — un único acordeón type="single" en mobile y desktop
  const [openAccordion, setOpenAccordion] = useState<string>("type");

  useEffect(() => {
    localStorage.setItem('tiro_configurador_visited', 'true');
    localStorage.setItem('configurador_visitado', 'true');
  }, []);

  useEffect(() => {
    const tipo = searchParams.get('tipo');
    const forma = searchParams.get('forma');
    if (tipo && ['cabecero', 'banco', 'cojin', 'puf', 'mesa', 'pantalla'].includes(tipo)) {
      setProductType(tipo as ProductType);
      if (tipo === 'puf' && !forma) setShape('cuadrado');
      if (tipo === 'banco' && !forma) setShape('madera');
      if (tipo === 'mesa' && !forma) setShape('tipo-puf');
      if (tipo === 'pantalla' && !forma) setShape('cilindro');
      setOpenAccordion('measures');
    }
    if (forma) setShape(forma);
  }, [searchParams, isMobile]);

  const resetConfiguracion = (newType?: ProductType) => {
    const defaultShape = newType === 'puf' ? 'cuadrado'
      : newType === 'banco' ? 'madera'
      : newType === 'mesa' ? 'tipo-puf'
      : newType === 'pantalla' ? 'cilindro'
      : 'recto';
    setShape(defaultShape);
    setBedWidth('');
    setBedHeight('');
    setBenchLength('');
    setBenchDepth('');
    setBenchHeight('');
    setPuffDiameter('');
    setPuffHeight('');
    setCushionShape('');
    setCushionSize('');
    setLampDiameter('');
    setLampHeight('');
    setFabricId('');
    setLateralFabricId('');
    setFinish(type === 'pantalla' ? 'vivo-simple' : '');
    setVivoColorId('');
    setCustomWidth('');
    setCustomHeight('');
    setPuffQuantity('1');
    setExtraPatas(false);
    setExtraRelleno(false);
    setExtraExpress(false);
    setExtraTopMaterial('nada');
  };

  const handleProductChange = (type: ProductType) => {
    if (type !== productType) {
      resetConfiguracion(type);
    }
    setProductType(type);
    setOpenAccordion('measures');
  };

  const fabric = ALL_FABRICS.find(f => f.id === fabricId);
  const lateralFabric = ALL_FABRICS.find(f => f.id === lateralFabricId);
  const vivoFabric = ALL_FABRICS.find(f => f.id === vivoColorId);
  const fillColor = fabric?.hex || "#D4C5A9";
  const fabricImage = (fabric as { image?: string })?.image || undefined;
  const lateralFabricImage = (lateralFabric as { image?: string })?.image || undefined;
  const vivoColor = vivoFabric?.hex || darken(fillColor);

  // Cushion details parsed from shape + size
  const cushionDetails = productType === 'cojin' && cushionShape && cushionSize
    ? parseCushionDetails(cushionShape, cushionSize)
    : null;

  const lampSizeParsed = productType === 'pantalla' && lampDiameter ? parseLampSize(lampDiameter) : null;

  const widthCm = productType === 'cabecero' ? parseCm(bedWidth) ?? (customWidth ? parseInt(customWidth) : undefined)
    : productType === 'banco' ? parseCm(benchLength)
    : productType === 'mesa' ? parseCm(benchLength)
    : productType === 'puf' ? (parseCm(puffDiameter) ?? 60)
    : productType === 'cojin' ? cushionDetails?.widthCm
    : productType === 'pantalla' ? (lampSizeParsed?.widthCm ?? 30)
    : undefined;

  // For puf cuadrado (Patos): height = width to make it perfectly cubic
  const heightCm = productType === 'cabecero' ? parseCm(bedHeight) ?? (customHeight ? parseInt(customHeight) : undefined)
    : productType === 'banco' ? parseCm(benchHeight)
    : productType === 'mesa' ? parseCm(benchHeight)
    : productType === 'puf' ? (shape === 'cuadrado' ? widthCm : parseCm(puffHeight))
    : productType === 'cojin' ? cushionDetails?.heightCm
    : productType === 'pantalla' ? (lampSizeParsed?.heightCm ?? 30)
    : undefined;

  const depthCm = productType === 'mesa' ? parseCm(benchDepth) : undefined;

  // For cojin, derive svgForma directly from cushionShape (immediate, no wait for size)
  const cushionShapeToForma: Record<string, string> = {
    rodiles: 'cuadrada',
    covadonga: 'rectangular',
    gulpiyuri: 'cilindro',
    torimbia: 'circular',
  };
  const svgForma = productType === 'cojin'
    ? (cushionShape ? cushionShapeToForma[cushionShape] || 'cuadrada' : 'cuadrada')
    : shape;

  // Derivar el grupo de tela (Básicas / Premium) desde fabricId
  const fabricGroup = ALL_FABRICS.find(f => f.id === fabricId)?.group ?? '';

  // Clave de cushion: "rodiles-40x40" desde shape="rodiles" + size="40×40 cm"
  const cushionKey = cushionShape && cushionSize
    ? `${cushionShape}-${cushionSize.replace(/[×x]/g, 'x').replace(/ cm/g, '').replace(/ /g, '')}`
    : '';

  // Clave de pantalla: "cilindro-Ø15×20cm"
  const pantallaSizeKey = lampDiameter ? `${shape}-${lampDiameter}` : '';

  // Preset de mesa: "120x45x60" o "80x45x80"
  const mesaPreset = benchLength.includes('120') ? '120x45x60'
    : benchLength.includes('80') ? '80x45x80'
    : '';

  // Ancho en cm (solo el número) para cabeceros
  const bedWidthCm = bedWidth === 'custom' ? customWidth : bedWidth.replace(' cm', '');
  // Alto en cm para cabeceros
  const bedHeightCm = bedHeight === 'custom' ? customHeight
    : bedHeight.includes('100') ? '100'
    : bedHeight.includes('120') ? '120'
    : bedHeight.replace(' cm', '');

  const options = useMemo(() => {
    const o: Record<string, string> = {};
    o.fabricGroup = fabricGroup;
    o.finish      = finish;

    if (productType === 'cabecero') {
      o.shape      = shape;
      o.bedWidthCm = bedWidth === 'custom' ? customWidth : bedWidth.replace(' cm', '');
      o.bedHeightCm = bedHeight === 'custom' ? customHeight
        : bedHeight.includes('100') ? '100'
        : bedHeight.includes('120') ? '120'
        : bedHeight.replace(' cm', '');
      o.shapeLabel = HEADBOARD_SHAPES.find(s => s.id === shape)?.name ?? shape;
      if (extraPatas) o.colgador = 'true';
    }

    if (productType === 'puf') {
      o.pufSizeCm   = puffDiameter.includes('40') ? '40' : puffDiameter.includes('50') ? '50' : '';
      o.pufQuantity = puffQuantity;
    }

    if (productType === 'mesa') {
      o.mesaPreset = benchLength.includes('120') ? '120x45x60'
        : benchLength.includes('80') ? '80x45x80' : '';
      o.surface = extraTopMaterial !== 'nada' ? extraTopMaterial : '';
    }

    if (productType === 'cojin') {
      o.cushionKey = cushionShape && cushionSize
        ? `${cushionShape}-${cushionSize.replace(/[×x]/g, 'x').replace(/ cm/g, '').replace(/ /g, '')}`
        : '';
    }

    if (productType === 'pantalla') {
      o.pantallaSizeKey = lampDiameter ? `${shape}-${lampDiameter}` : '';
    }

    if (productType === 'banco') o.benchLength = benchLength;

    if (extraRelleno) o.relleno = 'true';
    return o;
  }, [productType, shape, bedWidth, bedHeight, benchLength, cushionShape, cushionSize,
      puffDiameter, puffQuantity, lampDiameter, finish, fabricGroup, fabricId,
      extraPatas, extraRelleno, extraTopMaterial, customWidth, customHeight]);

  const price = useMemo(() => {
    if (!productType) return 0;
    return calculatePrice(productType, options);
  }, [productType, options]);

  const stepComplete: Record<Step, boolean> = {
    type: !!productType,
    measures: productType === 'cabecero' ? !!(bedWidth || customWidth) && !!(bedHeight || customHeight)
      : productType === 'banco' ? !!benchLength
      : productType === 'mesa' ? !!benchLength
      : productType === 'puf' ? !!puffDiameter
      : productType === 'cojin' ? !!cushionShape && !!cushionSize
      : productType === 'pantalla' ? !!lampDiameter
      : false,
    fabric: !!fabricId,
    finish: productType === 'pantalla' ? !!lampDiameter : !!finish,
    extras: !productType || !['cabecero', 'banco'].includes(productType),
  };

  const currentStep = isMobile ? (typeof openAccordion === 'string' ? openAccordion : 'type') : (Array.isArray(openAccordion) ? openAccordion[0] || 'type' : openAccordion);
  const activeStepIndex = STEPS.indexOf(currentStep as Step);

  // El precio es "en progreso" cuando no hay precio calculado aún (medidas no elegidas)
  const priceIsKnown = price > 0;
  const basePrice = productType ? (PRODUCTS.find(p => p.type === productType)?.basePrice || 0) : 0;
  const isIncomplete = !productType || !fabricId || (productType !== 'pantalla' && !finish);

  const chips: string[] = [];
  if (productType) {
    const pName = PRODUCTS.find(p => p.type === productType)?.name || '';
    chips.push(pName.split(' ')[0]);
  }
  if (productType === 'cabecero') {
    chips.push(bedWidth || customWidth ? (bedWidth || `${customWidth} cm`) : "—");
    chips.push(bedHeight || customHeight ? (bedHeight || `${customHeight} cm`) : "—");
  }
  if (productType === 'banco') chips.push(benchLength || "—");
  if (productType === 'puf') chips.push(puffDiameter || "—");
  if (productType === 'cojin') chips.push(cushionSize || "—");
  if (productType === 'pantalla') chips.push(lampDiameter || "—");
  chips.push(fabric?.name || "—");
  const finishObj = FINISHES.find(f => f.id === finish);
  if (finishObj) chips.push(finishObj.name);
  else chips.push("—");

  const previewLabel = [
    productType ? (PRODUCTS.find(p => p.type === productType)?.name.split(' ')[0] || '') : '',
    productType === 'cabecero' ? (bedWidth || (customWidth ? `${customWidth} cm` : '')) : '',
    fabric?.name || '',
  ].filter(Boolean).join(' · ') || 'Tu pieza aparecerá aquí';

  const advanceTo = (next: Step) => {
    setOpenAccordion(next);
  };

  const buildOrderUrl = () => {
    if (!productType) return '/#contacto';
    const product = PRODUCTS.find(p => p.type === productType);
    const summary = buildConfigSummary(productType, options);
    const params = new URLSearchParams({
      product: product?.name || '',
      config: `Me interesa: ${summary}`,
      previewType: productType,
      previewForma: svgForma || '',
      previewColor: fillColor,
      previewTexture: fabricImage || '',
      previewLateralTexture: lateralFabricImage || '',
      previewFinish: finish,
      previewVivo: vivoFabric?.hex || '',
      previewVivoName: vivoFabric?.name || '',
      previewVivoImage: (vivoFabric as { image?: string })?.image || '',
      previewFabricName: fabric?.name || '',
      previewLateralHex: lateralFabric?.hex || fabric?.hex || fillColor,
      previewLateralImage: lateralFabricImage || fabricImage || '',
      previewLateralName: lateralFabric?.name || fabric?.name || '',
      previewWidth: widthCm?.toString() || '',
      previewHeight: heightCm?.toString() || '',
      previewDepth: depthCm?.toString() || '',
    });
    if (extraExpress) params.set('express', 'true');
    return `/?${params.toString()}#contacto`;
  };

  const handleOrder = () => {
    if (!productType) return;
    navigate(buildOrderUrl());
  };

  const selectionLabel = (step: Step): React.ReactNode => {
    switch (step) {
      case 'type':
        return productType ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {PRODUCTS.find(p => p.type === productType)?.name}</span> : <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'measures':
        if (!stepComplete.measures) return <span className="text-muted-foreground italic">Elige una opción</span>;
        if (productType === 'cabecero') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {bedWidth || `${customWidth} cm`} × {bedHeight || `${customHeight} cm`}</span>;
        if (productType === 'banco') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {benchLength}</span>;
        if (productType === 'puf') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {puffDiameter}</span>;
        if (productType === 'cojin') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {CUSHION_SHAPES.find(s => s.id === cushionShape)?.name || ''} {cushionSize}</span>;
        if (productType === 'pantalla') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {lampDiameter} / {lampHeight}</span>;
        return <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'fabric':
        return fabric ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {fabric.name}</span> : <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'finish':
        return finishObj ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {finishObj.name}</span> : <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'extras': {
        const extras = [
          extraPatas && (productType === 'cabecero' ? 'Colgador' : 'Patas'),
          extraRelleno && 'Relleno',
          extraExpress && 'Express',
          extraTopMaterial !== 'nada' && (extraTopMaterial === 'metacrilato' ? 'Metacrilato' : 'Cristal'),
        ].filter(Boolean);
        return extras.length > 0 ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {extras.join(', ')}</span> : <span className="text-muted-foreground italic">Opcional</span>;
      }
    }
  };

  const showExtrasStep = !productType || ['cabecero', 'banco'].includes(productType);
  const visibleSteps = showExtrasStep ? STEPS : STEPS.filter(s => s !== 'extras');
  const visibleStepIndex = visibleSteps.indexOf(currentStep as Step);

  const ProgressBar = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      <div className="flex gap-1">
        {visibleSteps.map((s) => (
          <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: stepComplete[s] ? '100%' : '0%',
                backgroundColor: 'hsl(var(--accent-warm))',
              }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-light mt-2">
        Paso {Math.max(1, visibleStepIndex + 1)} de {visibleSteps.length} · {STEP_LABELS[currentStep as Step] || STEP_LABELS.type}
      </p>
    </div>
  );

  const needsVivo = finish === 'vivo-simple' || finish === 'vivo-doble';

  const productCard = (type: ProductType, label: string, blocked = false) => (
    blocked ? (
      <div
        key={type}
        className="border border-border rounded-md p-4 text-center flex flex-col items-center gap-2 opacity-40 cursor-not-allowed relative"
      >
        <ProductIcon type={type} />
        <span className="text-sm font-light text-foreground">{label}</span>
        <span className="text-[9px] tracking-wide uppercase text-muted-foreground">Próximamente</span>
      </div>
    ) : (
      <button
        key={type}
        onClick={() => handleProductChange(type)}
        className={`border rounded-md p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
          productType === type ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"
        }`}
      >
        <ProductIcon type={type} />
        <span className="text-sm font-light text-foreground">{label}</span>
      </button>
    )
  );

  // Siempre string — acordeón tipo single en todas las vistas
  const accordionValue = openAccordion;
  const handleAccordionChange = (val: string) => {
    setOpenAccordion(val || '');
  };

  const sharedAccordionProps = {
    openAccordion: accordionValue,
    selectionLabel,
    productType, productCard,
    shape, setShape,
    bedWidth, setBedWidth: (v: string) => { setBedWidth(v); if (v) advanceTo('fabric'); },
    bedHeight, setBedHeight,
    benchLength, setBenchLength: (v: string) => { setBenchLength(v); advanceTo('fabric'); },
    benchDepth, setBenchDepth, benchHeight, setBenchHeight,
    puffDiameter, setPuffDiameter: (v: string) => { setPuffDiameter(v); if (v && v !== 'custom') advanceTo('fabric'); },
    puffHeight, setPuffHeight,
    cushionShape, setCushionShape,
    cushionSize, setCushionSize: (v: string) => { setCushionSize(v); advanceTo('fabric'); },
    lampDiameter, setLampDiameter: (v: string) => { setLampDiameter(v); advanceTo('fabric'); },
    lampHeight, setLampHeight,
    fabricId, setFabricId: (id: string) => { setFabricId(id); advanceTo('finish'); },
    lateralFabricId, setLateralFabricId,
    finish, setFinish: (f: string) => { setFinish(f); },
    vivoColorId, setVivoColorId,
    customWidth, setCustomWidth, customHeight, setCustomHeight,
    puffQuantity, setPuffQuantity,
    extraPatas, setExtraPatas, extraRelleno, setExtraRelleno,
    extraExpress, setExtraExpress,
    extraTopMaterial, setExtraTopMaterial,
    advanceTo, needsVivo,
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-3">Diseña el tuyo</h1>
        <p className="text-sm text-muted-foreground font-light">
          Elige el producto, las medidas y la tela — el precio se actualiza en tiempo real.
        </p>
      </div>

      <div className="md:hidden sticky top-16 z-30" style={{ backgroundColor: '#F0EDE8' }}>
        <div className="px-4 py-3 flex flex-col items-center">
          {/* Precio arriba-derecha en mobile también */}
          <div className="w-full flex items-start justify-between mb-1">
            <p className="font-serif text-sm text-muted-foreground truncate max-w-[65%]">{previewLabel}</p>
            {productType && (
              <div className="text-right flex-shrink-0">
                <p className="text-[9px] text-foreground/50 uppercase tracking-widest">Precio</p>
                <p className="font-serif text-lg font-light text-foreground leading-none">
                  {priceIsKnown ? `${price}€` : `desde ${basePrice}€`}
                </p>
              </div>
            )}
          </div>
          {/* SVG + fabric swatches side-by-side on mobile */}
          <div className="flex w-full gap-3 items-center justify-center min-h-[160px]">
            <div className="flex-1 flex items-center justify-center">
              <ProductSVGPreview type={productType} color={fillColor} fabricImage={fabricImage} lateralFabricImage={lateralFabricImage} finish={finish} vivoColor={vivoColor} forma={svgForma} widthCm={widthCm} heightCm={heightCm} depthCm={depthCm} />
            </div>
            {fabricId && (
              <div className="w-20 flex-shrink-0 border-l border-border/30 pl-3">
                <FabricSwatchPanel
                  fabric={fabric}
                  vivoFabric={needsVivo ? vivoFabric : undefined}
                  lateralFabric={lateralFabric || undefined}
                  showLateral={productType === 'cabecero'}
                />
              </div>
            )}
          </div>
          {productType === 'banco' && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground border border-border/40 rounded-full px-3 py-1">
              <Clock size={11} />
              <span>Próximamente disponible</span>
            </div>
          )}
          <RenderNotice />
          <div className="mt-2 w-full">
            <ProgressBar />
          </div>
        </div>
      </div>

      <div className="hidden md:flex container mx-auto px-6 py-8 gap-10 lg:gap-14">
        {/* Left column: render + fabric swatches + actions */}
        <div className="w-[45%] lg:w-1/2 sticky top-20 self-start" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <div className="rounded-lg p-5 flex gap-4" style={{ backgroundColor: '#F0EDE8' }}>

            {/* SVG render */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[320px]">
              <p className="font-serif text-sm text-muted-foreground mb-4 text-center">{previewLabel}</p>
              <div className="flex-1 flex items-center justify-center w-full">
                <ProductSVGPreview type={productType} color={fillColor} fabricImage={fabricImage} lateralFabricImage={lateralFabricImage} finish={finish} vivoColor={vivoColor} forma={svgForma} widthCm={widthCm} heightCm={heightCm} depthCm={depthCm} />
              </div>
              {!productType && (
                <p className="text-xs text-muted-foreground text-center mt-2">Tu pieza aparecerá aquí</p>
              )}
              {productType === 'banco' && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1.5">
                  <Clock size={12} />
                  <span>Producto próximamente disponible — puedes explorar el configurador</span>
                </div>
              )}
              <RenderNotice />
            </div>

            {/* Fabric swatch panel — only when fabric is selected */}
            {fabricId && (
              <div className="w-28 flex-shrink-0 border-l border-border/30 pl-4">
                <FabricSwatchPanel
                  fabric={fabric}
                  vivoFabric={needsVivo ? vivoFabric : undefined}
                  lateralFabric={lateralFabric || undefined}
                  showLateral={productType === 'cabecero'}
                />
              </div>
            )}
          </div>

          {productType && (
            <div className="mt-4 flex items-baseline justify-between px-1">
              <div>
                <p className="text-[10px] text-foreground/50 uppercase tracking-[0.18em] font-medium">Precio estimado</p>
                <p className="font-serif text-3xl font-light text-foreground leading-none mt-0.5">
                  {priceIsKnown ? `${price} €` : `desde ${basePrice} €`}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground font-light">IVA incl.</p>
            </div>
          )}
          <div className="mt-2 px-1">
            <p className="text-xs text-muted-foreground font-light text-center">Envío Comunidad de Madrid · Resto bajo consulta</p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {productType === 'banco' ? (
              <div className="w-full px-6 py-3.5 bg-muted text-muted-foreground text-sm tracking-wide uppercase text-center font-medium rounded-sm cursor-not-allowed flex items-center justify-center gap-2">
                <Clock size={14} />
                Próximamente — no disponible aún
              </div>
            ) : (
              <button
                onClick={handleOrder}
                disabled={!productType}
                className="w-full px-6 py-3.5 bg-foreground text-background text-sm tracking-wide uppercase text-center font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40"
              >
                Lo quiero — solicitar presupuesto
              </button>
            )}
          </div>
        </div>

        <div className="w-[55%] lg:w-1/2">
          <div className="mb-6">
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-foreground">Configura tu pieza</h2>
            <p className="mt-2 text-base text-muted-foreground font-light">Elige la forma, el tamaño y el acabado. El precio se actualiza en tiempo real.</p>
          </div>
          <ProgressBar className="mb-6" />
          <ConfigAccordionsSingle
            openAccordion={accordionValue}
            setOpenAccordion={handleAccordionChange}
            {...sharedAccordionProps}
          />
        </div>
      </div>

      <div className="md:hidden px-4 pb-28 pt-4">
        <div className="mb-4">
          <h2 className="font-serif text-2xl font-light text-foreground">Configura tu pieza</h2>
        </div>
        <ConfigAccordionsSingle
          openAccordion={accordionValue}
          setOpenAccordion={handleAccordionChange}
          {...sharedAccordionProps}
        />
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {productType ? (
              <>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Precio</p>
                <p className="font-serif text-xl font-light text-foreground">
                  {priceIsKnown ? `${price}€` : `desde ${basePrice}€`}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground font-light">Elige un producto para ver el precio</p>
            )}
          </div>
          {productType === 'banco' ? (
            <div className="bg-muted text-muted-foreground px-4 py-3 text-xs tracking-wide font-medium text-center flex items-center gap-1.5 cursor-not-allowed">
              <Clock size={12} />
              Próximamente
            </div>
          ) : (
            <button
              onClick={handleOrder}
              disabled={!productType}
              className="bg-foreground text-background px-6 py-3 text-sm tracking-wide font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Lo quiero →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface AccordionContentSharedProps {
  openAccordion: string;
  selectionLabel: (step: Step) => React.ReactNode;
  productType: ProductType | null;
  productCard: (type: ProductType, label: string) => React.ReactNode;
  shape: string; setShape: (v: string) => void;
  bedWidth: string; setBedWidth: (v: string) => void;
  bedHeight: string; setBedHeight: (v: string) => void;
  benchLength: string; setBenchLength: (v: string) => void;
  benchDepth: string; setBenchDepth: (v: string) => void;
  benchHeight: string; setBenchHeight: (v: string) => void;
  puffDiameter: string; setPuffDiameter: (v: string) => void;
  puffHeight: string; setPuffHeight: (v: string) => void;
  puffQuantity: string; setPuffQuantity: (v: string) => void;
  cushionShape: string; setCushionShape: (v: string) => void;
  cushionSize: string; setCushionSize: (v: string) => void;
  lampDiameter: string; setLampDiameter: (v: string) => void;
  lampHeight: string; setLampHeight: (v: string) => void;
  fabricId: string; setFabricId: (v: string) => void;
  lateralFabricId: string; setLateralFabricId: (v: string) => void;
  finish: string; setFinish: (v: string) => void;
  vivoColorId: string; setVivoColorId: (v: string) => void;
  customWidth: string; setCustomWidth: (v: string) => void;
  customHeight: string; setCustomHeight: (v: string) => void;
  extraPatas: boolean; setExtraPatas: (v: boolean) => void;
  extraRelleno: boolean; setExtraRelleno: (v: boolean) => void;
  extraExpress: boolean; setExtraExpress: (v: boolean) => void;
  extraTopMaterial: string; setExtraTopMaterial: (v: string) => void;
  advanceTo: (step: Step) => void;
  needsVivo: boolean;
}

const AccordionItems = (props: AccordionContentSharedProps) => {
  const {
    openAccordion,
    selectionLabel,
    productType, productCard,
    shape, setShape,
    bedWidth, setBedWidth, bedHeight, setBedHeight,
    benchLength, setBenchLength, benchDepth, setBenchDepth, benchHeight, setBenchHeight,
    puffDiameter, setPuffDiameter,
    puffQuantity, setPuffQuantity,
    cushionShape, setCushionShape,
    cushionSize, setCushionSize,
    lampDiameter, setLampDiameter, lampHeight, setLampHeight,
    fabricId, setFabricId,
    lateralFabricId, setLateralFabricId,
    finish, setFinish,
    vivoColorId, setVivoColorId,
    customWidth, setCustomWidth, customHeight, setCustomHeight,
    extraPatas, setExtraPatas, extraRelleno, setExtraRelleno, extraExpress, setExtraExpress,
    extraTopMaterial, setExtraTopMaterial,
    advanceTo, needsVivo,
  } = props;

  const productSelected = !!productType;
  const disabledClass = productSelected ? '' : 'opacity-40 pointer-events-none';

  return (
    <>
      <AccordionItem value="type" className="border-b border-border">
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">1. {STEP_LABELS.type}</span>
            <span className="text-xs mt-0.5">{selectionLabel('type')}</span>
          </div>
        </AccordionTrigger>
        {openAccordion === 'type' && (
          <div className="pb-6 bg-muted/30 px-4 rounded-b-md">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {productCard('cabecero', 'Cabecero')}
              {productCard('banco', 'Banco entelado', true)}
              {productCard('puf', 'Pufs')}
              {productCard('cojin', 'Almohadones')}
              {productCard('mesa', 'Mesa de centro')}
              {productCard('pantalla', 'Pantalla lámpara')}
            </div>
          </div>
        )}
      </AccordionItem>

      <AccordionItem value="measures" className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">2. {STEP_LABELS.measures}</span>
            <span className="text-xs mt-0.5">{selectionLabel('measures')}</span>
          </div>
        </AccordionTrigger>
        {openAccordion === 'measures' && (
          <div className="pb-6 space-y-6 bg-muted/30 px-4 rounded-b-md pt-2">
          {productType === 'cabecero' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {HEADBOARD_SHAPES.map(s => (
                    <button key={s.id} onClick={() => setShape(s.id)} className={`border rounded p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${shape === s.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                      <svg viewBox="0 0 60 40" className="w-12 h-8">
                        <path d={s.svgPreview} fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <span className="text-xs font-light">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Ancho de cama</p>
                <div className="flex flex-wrap gap-2">
                  {['90 cm', '105 cm', '135 cm', '150 cm', '160 cm', '180 cm', '200 cm'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => { setBedWidth(sz); setCustomWidth(''); }}
                      className={`border rounded-md px-3 py-2 text-xs transition-all ${bedWidth === sz ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                    >
                      {sz}
                    </button>
                  ))}
                  <button
                    onClick={() => { setBedWidth('custom'); }}
                    className={`border rounded-md px-3 py-2 text-xs transition-all ${bedWidth === 'custom' ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                  >
                    Otra medida
                  </button>
                </div>
                {bedWidth === 'custom' && (
                  <div className="mt-3 flex items-center gap-2">
                    <input type="number" min={60} max={300} placeholder="Introduce los cm" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-40 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                    <span className="text-xs text-muted-foreground">cm</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto del cabecero</p>
                <SelectWrapper>
                  <select value={bedHeight} onChange={(e) => { setBedHeight(e.target.value); if (e.target.value !== 'custom') setCustomHeight(''); }} className={selectClass}>
                    <option value="">Seleccionar alto...</option>
                    <option value="100 cm">100 cm — Medida estándar</option>
                    <option value="120 cm">120 cm</option>
                    <option value="custom">Otra medida</option>
                  </select>
                </SelectWrapper>
                {bedHeight === 'custom' && (
                  <div className="mt-3 flex items-center gap-2">
                    <input type="number" min={40} max={200} placeholder="Introduce los cm" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} className="w-40 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                    <span className="text-xs text-muted-foreground">cm</span>
                  </div>
                )}
              </div>
            </>
          )}

          {productType === 'banco' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tipo de banco</p>
                <div className="grid grid-cols-3 gap-2">
                  {BENCH_VARIANTS.map(v => (
                    <button key={v.id} onClick={() => setShape(v.id)} className={`border rounded-md p-3 text-center cursor-pointer transition-all ${shape === v.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                      <span className="text-xs font-light">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Largo</p>
                <SelectWrapper>
                  <select value={benchLength} onChange={(e) => setBenchLength(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar largo...</option>
                    <option value="80 cm">80 cm</option>
                    <option value="100 cm">100 cm</option>
                    <option value="120 cm">120 cm</option>
                    <option value="140 cm">140 cm</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Fondo</p>
                <SelectWrapper>
                  <select value={benchDepth} onChange={(e) => setBenchDepth(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar fondo...</option>
                    <option value="35 cm">35 cm</option>
                    <option value="40 cm">40 cm</option>
                    <option value="45 cm">45 cm</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto</p>
                <SelectWrapper>
                  <select value={benchHeight} onChange={(e) => setBenchHeight(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar alto...</option>
                    <option value="40 cm">40 cm</option>
                    <option value="45 cm">45 cm</option>
                  </select>
                </SelectWrapper>
              </div>
            </>
          )}

          {productType === 'puf' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma · Colección Galicia</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShape('cuadrado')}
                    className={`border rounded p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${shape === 'cuadrado' ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}
                  >
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <rect x="6" y="6" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <div>
                      <span className="text-xs font-medium block">Patos</span>
                      <span className="text-[10px] text-muted-foreground">Cúbico · Galicia</span>
                    </div>
                  </button>
                  <div className="border border-border rounded p-3 text-center flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <div>
                      <span className="text-xs font-medium block">Monteferro</span>
                      <span className="text-[10px] text-muted-foreground">Próximamente</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tamaño</p>
                <div className="flex flex-wrap gap-2">
                  {['40 cm', '50 cm'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setPuffDiameter(sz)}
                      className={`border rounded-md px-4 py-2 text-xs transition-all ${puffDiameter === sz ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                    >
                      {sz}
                    </button>
                  ))}
                  <button
                    onClick={() => setPuffDiameter('custom')}
                    className={`border rounded-md px-4 py-2 text-xs transition-all ${puffDiameter === 'custom' ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                  >
                    Otra medida
                  </button>
                </div>
                {puffDiameter === 'custom' && (
                  <div className="mt-3 flex items-center gap-2">
                    <input type="number" min={30} max={120} placeholder="Introduce los cm" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-40 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                    <span className="text-xs text-muted-foreground">cm</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Cantidad</p>
                <div className="flex gap-2">
                  {['1', '2'].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setPuffQuantity(qty)}
                      className={`border rounded-md px-5 py-2 text-xs transition-all ${puffQuantity === qty ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                    >
                      {qty === '1' ? '1 puf' : '2 pufs (pareja)'}
                    </button>
                  ))}
                </div>
                {puffQuantity === '2' && (
                  <p className="text-xs text-muted-foreground font-light mt-2 italic">Pareja: precio especial aplicado</p>
                )}
              </div>
            </>
          )}

          {productType === 'mesa' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tipo de mesa · Colección Murcia</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShape('tipo-puf')} className={`border rounded p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${shape === 'tipo-puf' ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                    <svg viewBox="0 0 42 28" className="w-8 h-6"><rect x="4" y="4" width="34" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                    <div>
                      <span className="text-xs font-medium block">Cabo de Palos</span>
                      <span className="text-[10px] text-muted-foreground">Sin patas</span>
                    </div>
                  </button>
                  <div className="border border-border rounded p-3 text-center flex flex-col items-center gap-2 opacity-45 cursor-not-allowed">
                    <svg viewBox="0 0 42 28" className="w-8 h-6"><rect x="4" y="4" width="34" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="18" x2="8" y2="26" stroke="currentColor" strokeWidth="1.5" /><line x1="34" y1="18" x2="34" y2="26" stroke="currentColor" strokeWidth="1.5" /></svg>
                    <div>
                      <span className="text-xs font-medium block">Calblanque</span>
                      <span className="text-[10px] text-muted-foreground">Próximamente</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tamaño (largo × alto × fondo)</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '120 × 45 × 60 cm', w: '120', h: '45', d: '60' },
                    { label: '80 × 45 × 80 cm', w: '80', h: '45', d: '80' },
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => { setBenchLength(opt.w + ' cm'); setBenchHeight(opt.h + ' cm'); setBenchDepth(opt.d + ' cm'); }}
                      className={`border rounded-md px-4 py-2 text-xs transition-all ${benchLength === opt.w + ' cm' && benchHeight === opt.h + ' cm' ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <button
                    onClick={() => { setBenchLength('custom'); setBenchHeight(''); setBenchDepth(''); }}
                    className={`border rounded-md px-4 py-2 text-xs transition-all ${benchLength === 'custom' ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                  >
                    Otra medida
                  </button>
                </div>
                {benchLength === 'custom' && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">Largo (cm)</p>
                      <input type="number" min={40} max={300} placeholder="cm" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-full bg-transparent border-b border-border text-sm font-light focus:outline-none focus:border-foreground py-1" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">Alto (cm)</p>
                      <input type="number" min={20} max={100} placeholder="cm" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} className="w-full bg-transparent border-b border-border text-sm font-light focus:outline-none focus:border-foreground py-1" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">Fondo (cm)</p>
                      <input type="number" min={20} max={150} placeholder="cm" value={benchDepth} onChange={(e) => setBenchDepth(e.target.value)} className="w-full bg-transparent border-b border-border text-sm font-light focus:outline-none focus:border-foreground py-1" />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {productType === 'cojin' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma · Colección Asturias</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CUSHION_SHAPES.map(s => (
                    (s as { comingSoon?: boolean }).comingSoon ? (
                      <div key={s.id} className="border border-border rounded p-3 text-center flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                        <svg viewBox="0 0 60 60" className="w-10 h-10">{s.svgPath}</svg>
                        <div>
                          <span className="text-xs font-medium block">{s.name}</span>
                          <span className="text-[10px] text-muted-foreground">Próximamente</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        key={s.id}
                        onClick={() => { setCushionShape(s.id); setCushionSize(''); }}
                        className={`border rounded p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${cushionShape === s.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}
                      >
                        <svg viewBox="0 0 60 60" className="w-10 h-10">{s.svgPath}</svg>
                        <div>
                          <span className="text-xs font-medium block">{s.name}</span>
                          <span className="text-[10px] text-muted-foreground">{s.subtitle}</span>
                        </div>
                      </button>
                    )
                  ))}
                </div>
              </div>
              {cushionShape && (
                <div>
                  <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tamaño</p>
                  <div className="flex flex-wrap gap-2">
                    {(CUSHION_SHAPES.find(s => s.id === cushionShape)?.sizes || []).map(sz => (
                      <button
                        key={sz}
                        onClick={() => setCushionSize(sz)}
                        className={`border rounded-md px-4 py-2 text-xs transition-all ${cushionSize === sz ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {productType === 'pantalla' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma · Colección Ávila</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {LAMPSHADE_SHAPES.map(s =>
                    s.comingSoon ? (
                      <div
                        key={s.id}
                        className="border border-border rounded p-3 text-center flex flex-col items-center gap-2 opacity-45 cursor-not-allowed"
                      >
                        <svg viewBox="0 0 60 44" className="w-12 h-9">
                          {s.svgContent}
                        </svg>
                        <div>
                          <span className="text-xs font-medium block">{s.name}</span>
                          <span className="text-[10px] text-muted-foreground">Próximamente</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        key={s.id}
                        onClick={() => { setShape(s.id); setLampDiameter(''); }}
                        className={`border rounded p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${shape === s.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}
                      >
                        <svg viewBox="0 0 60 44" className="w-12 h-9">
                          {s.svgContent}
                        </svg>
                        <div>
                          <span className="text-xs font-medium block">{s.name}</span>
                          <span className="text-[10px] text-muted-foreground">{s.subtitle}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Medida</p>
                <div className="flex flex-wrap gap-2">
                  {(LAMP_SIZES[shape] || []).map(sz => (
                    <button
                      key={sz}
                      onClick={() => setLampDiameter(sz)}
                      className={`border rounded-md px-4 py-2 text-xs transition-all ${lampDiameter === sz ? "border-foreground bg-foreground/5 font-medium" : "border-border hover:border-foreground/60 font-light"}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!productType && (
            <p className="text-base text-muted-foreground font-light italic">Primero elige un tipo de producto</p>
          )}
          </div>
        )}
      </AccordionItem>

      <AccordionItem value="fabric" className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">3. {STEP_LABELS.fabric}</span>
            <span className="text-xs mt-0.5">{selectionLabel('fabric')}</span>
          </div>
        </AccordionTrigger>
        {openAccordion === 'fabric' && (
          <div className="pb-6 space-y-6 bg-muted/30 px-4 rounded-b-md pt-2">
          {FABRIC_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">{group.label}</p>
              <div className="flex flex-wrap gap-3">
                {group.fabrics.map(f => (
                  <button key={f.id} onClick={() => setFabricId(f.id)} className="flex flex-col items-center gap-1.5" title={f.name}>
                    <div
                      className={`w-10 h-10 rounded-full transition-all overflow-hidden outline outline-2 outline-offset-2 ${fabricId === f.id ? "outline-foreground" : "outline-transparent hover:outline-foreground/30"}`}
                      style={{ backgroundColor: f.hex }}
                    >
                      {(f as { image?: string }).image && (
                        <img src={(f as { image?: string }).image} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-light max-w-[60px] text-center leading-tight">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {fabricId && (
            <p className="text-xs text-muted-foreground font-light">
              {ALL_FABRICS.find(f => f.id === fabricId)?.name} · {ALL_FABRICS.find(f => f.id === fabricId)?.collection}
            </p>
          )}

          {/* Tela de laterales — cabeceros y Gulpiyuri, después de elegir tela principal */}
          {(productType === 'cabecero' || (productType === 'cojin' && cushionShape === 'gulpiyuri')) && fabricId && (
            <div className="pt-4 border-t border-border/30">
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-1 font-light">Tela de los laterales <span className="text-muted-foreground/60 normal-case">(opcional)</span></p>
              <p className="text-xs text-muted-foreground/70 font-light mb-3 italic">Por defecto igual que la principal.</p>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-2">Básicas</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setLateralFabricId('')} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center text-[9px] font-medium ${!lateralFabricId ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/40"}`}>
                        =
                      </div>
                      <span className="text-[9px] text-muted-foreground font-light">Igual</span>
                    </button>
                    {FABRIC_GROUPS[0].fabrics.map(f => (
                      <button key={f.id} onClick={() => setLateralFabricId(f.id)} className="flex flex-col items-center gap-1.5" title={f.name}>
                        <div
                          className={`w-8 h-8 rounded-full transition-all overflow-hidden outline outline-2 outline-offset-1 ${lateralFabricId === f.id ? "outline-foreground" : "outline-transparent hover:outline-foreground/30"}`}
                          style={{ backgroundColor: f.hex }}
                        >
                          {f.image && <img src={f.image} alt={f.name} className="w-full h-full object-cover" loading="lazy" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-2">Premium</p>
                  <div className="flex flex-wrap gap-2">
                    {FABRIC_GROUPS[1].fabrics.map(f => (
                      <button key={f.id} onClick={() => setLateralFabricId(f.id)} className="flex flex-col items-center gap-1.5" title={f.name}>
                        <div
                          className={`w-8 h-8 rounded-full transition-all overflow-hidden outline outline-2 outline-offset-1 ${lateralFabricId === f.id ? "outline-foreground" : "outline-transparent hover:outline-foreground/30"}`}
                          style={{ backgroundColor: f.hex }}
                        >
                          {f.image && <img src={f.image} alt={f.name} className="w-full h-full object-cover" loading="lazy" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        )}
      </AccordionItem>

      <AccordionItem value="finish" className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">4. {STEP_LABELS.finish}</span>
            <span className="text-xs mt-0.5">{selectionLabel('finish')}</span>
          </div>
        </AccordionTrigger>
        {openAccordion === 'finish' && (
          <div className="pb-6 space-y-3 bg-muted/30 px-4 rounded-b-md pt-2">
          {(productType === 'pantalla' ? PANTALLA_FINISHES : FINISHES.filter(f => {
            if (productType === 'cabecero') return f.id === 'vivo-simple' || f.id === 'vivo-doble';
            if (productType === 'banco' || productType === 'cojin' || productType === 'mesa') return f.id === 'liso' || f.id === 'vivo-simple';
            if (productType === 'puf') return f.id === 'liso' || f.id === 'vivo-simple';
            return true;
          })).map(f => (
            <button
              key={f.id}
              onClick={() => setFinish(f.id)}
              className={`w-full text-left px-5 py-4 border rounded-md transition-all ${finish === f.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}
            >
              <span className="text-sm font-medium text-foreground">{f.name}</span>
              {f.extra > 0 && <span className="text-xs text-accent-warm ml-2">{(f as { extraLabel?: string }).extraLabel || `+${f.extra}€`}</span>}
              <span className="block text-xs text-muted-foreground font-light italic mt-0.5">{f.desc}</span>
            </button>
          ))}
          {needsVivo && (
            <div className="pt-3">
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-2 font-light">Estampados</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {ALL_FABRICS.filter(f => (f as { pattern?: string }).pattern === 'estampado').map(f => (
                  <button key={f.id} onClick={() => setVivoColorId(f.id)} title={f.name}>
                    <div
                      className={`w-7 h-7 rounded-full transition-all overflow-hidden outline outline-2 outline-offset-1 ${vivoColorId === f.id ? "outline-foreground" : "outline-transparent hover:outline-foreground/30"}`}
                      style={{ backgroundColor: f.hex }}
                    >
                      {(f as { image?: string }).image && (
                        <img src={(f as { image?: string }).image} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-2 font-light">Lisos</p>
              <div className="flex flex-wrap gap-2">
                {ALL_FABRICS.filter(f => (f as { pattern?: string }).pattern === 'liso').map(f => (
                  <button key={f.id} onClick={() => setVivoColorId(f.id)} title={f.name}>
                    <div
                      className={`w-7 h-7 rounded-full transition-all overflow-hidden outline outline-2 outline-offset-1 ${vivoColorId === f.id ? "outline-foreground" : "outline-transparent hover:outline-foreground/30"}`}
                      style={{ backgroundColor: f.hex }}
                    >
                      {(f as { image?: string }).image && (
                        <img src={(f as { image?: string }).image} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>
        )}
      </AccordionItem>

      {(!productType || ['cabecero', 'banco'].includes(productType)) && (
      <AccordionItem value="extras" className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">5. {STEP_LABELS.extras}</span>
            <span className="text-xs mt-0.5">{selectionLabel('extras')}</span>
          </div>
        </AccordionTrigger>
        {openAccordion === 'extras' && (
          <div className="pb-6 space-y-4 bg-muted/30 px-4 rounded-b-md">
          {productType === 'cabecero' && (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-base text-foreground font-light">Colgador</p>
                <p className="text-xs text-muted-foreground">+5€</p>
              </div>
              <Switch checked={extraPatas} onCheckedChange={setExtraPatas} />
            </div>
          )}
          {productType === 'banco' && (
            <>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-base text-foreground font-light">Patas de madera</p>
                  <p className="text-xs text-muted-foreground">Consultar precio</p>
                </div>
                <Switch checked={extraPatas} onCheckedChange={setExtraPatas} />
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-base text-foreground font-light">Relleno extra firmeza</p>
                  <p className="text-xs text-muted-foreground">Consultar precio</p>
                </div>
                <Switch checked={extraRelleno} onCheckedChange={setExtraRelleno} />
              </div>
            </>
          )}
          {productType === 'mesa' && (
            <div className="py-2">
              <p className="text-base text-foreground font-light mb-1">Superficie encima de la mesa</p>
              <p className="text-xs text-muted-foreground mb-3">Añade una superficie rígida sobre el tapizado</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'nada', label: 'Sin superficie', price: null },
                  { id: 'metacrilato', label: 'Metacrilato 5mm', price: '+50€', note: 'Puede retrasar el envío' },
                  { id: 'cristal', label: 'Cristal 6mm', price: '+100€', note: 'Puede retrasar el envío' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setExtraTopMaterial(opt.id)}
                    className={`border rounded p-3 text-center text-xs transition-all ${extraTopMaterial === opt.id ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/60'}`}
                  >
                    <span className="block font-light text-foreground">{opt.label}</span>
                    {opt.price && <span className="block text-accent-warm mt-0.5">{opt.price}</span>}
                    {'note' in opt && opt.note && <span className="block text-muted-foreground/70 mt-0.5 text-[10px] leading-tight">{opt.note}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!['cojin', 'puf', 'pantalla', 'cabecero', 'banco', 'mesa'].includes(productType || '') && (
            <p className="text-sm text-muted-foreground font-light italic">Sin opciones adicionales para este producto.</p>
          )}
          </div>
        )}
      </AccordionItem>
      )}
    </>
  );
};

interface SingleAccordionProps extends AccordionContentSharedProps {
  setOpenAccordion: (v: string) => void;
}

const ConfigAccordionsSingle = (props: SingleAccordionProps) => {
  const { setOpenAccordion, ...rest } = props;
  return (
    <Accordion type="single" collapsible value={rest.openAccordion} onValueChange={(v) => setOpenAccordion(v || '')}>
      <AccordionItems {...rest} />
    </Accordion>
  );
};

export default ProductConfigurator;
