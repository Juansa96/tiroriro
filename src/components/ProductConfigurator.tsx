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
import { ChevronDown } from "lucide-react";

// --- Fabric data ---
const FABRIC_GROUPS = [
  {
    label: "Linos",
    collection: "Colección Essential",
    fabrics: [
      { id: "lino-natural", name: "Lino Natural", hex: "#D4C5A9" },
      { id: "lino-crudo", name: "Lino Crudo", hex: "#E8DCC8" },
      { id: "lino-gris-perla", name: "Lino Gris Perla", hex: "#C8C4BC" },
      { id: "lino-azul-marino", name: "Lino Azul Marino", hex: "#2C3E50" },
      { id: "lino-verde-salvia", name: "Lino Verde Salvia", hex: "#7D9B76" },
    ],
  },
  {
    label: "Terciopelos",
    collection: "Colección Premium",
    fabrics: [
      { id: "terciopelo-esmeralda", name: "Terciopelo Esmeralda", hex: "#1B4D3E" },
      { id: "terciopelo-burdeos", name: "Terciopelo Burdeos", hex: "#6D1A36" },
      { id: "terciopelo-camel", name: "Terciopelo Camel", hex: "#C19A6B" },
      { id: "terciopelo-negro", name: "Terciopelo Negro", hex: "#1C1C1C" },
      { id: "terciopelo-gris-marengo", name: "Terciopelo Gris Marengo", hex: "#4A4A4A" },
    ],
  },
  {
    label: "Bouclé",
    collection: "Colección Bouclé",
    fabrics: [
      { id: "boucle-blanco-roto", name: "Bouclé Blanco Roto", hex: "#F5F0E8" },
      { id: "boucle-beige", name: "Bouclé Beige", hex: "#D4B896" },
      { id: "boucle-arena", name: "Bouclé Arena", hex: "#C4A882" },
    ],
  },
];

const ALL_FABRICS = FABRIC_GROUPS.flatMap(g => g.fabrics.map(f => ({ ...f, group: g.label, collection: g.collection })));

const FINISHES = [
  { id: "liso", name: "Sin acabado", desc: "Tapizado liso, sin costuras decorativas" },
  { id: "vivo-simple", name: "Vivo simple", desc: "Un ribete en el perímetro, mismo color o contraste", extra: 15 },
  { id: "vivo-doble", name: "Vivo doble", desc: "Dos líneas de ribete, más elaborado", extra: 25 },
  { id: "botonadura", name: "Botonadura", desc: "Botones tapizados distribuidos uniformemente", extra: 30 },
];

const HEADBOARD_SHAPES = [
  { id: "rectangular", name: "Recto Clásico", svgPreview: "M 5 35 L 5 5 L 55 5 L 55 35 Z" },
  { id: "semicirculo", name: "Arco Suave", svgPreview: "M 5 35 L 5 18 Q 30 0 55 18 L 55 35 Z" },
  { id: "corona-simple", name: "Corona Simple", svgPreview: "M 5 35 L 5 12 Q 18 2 30 12 Q 42 2 55 12 L 55 35 Z" },
  { id: "corona-doble", name: "Corona Doble", svgPreview: "M 5 35 L 5 12 Q 12 2 20 12 Q 28 2 35 12 Q 42 2 50 12 L 55 12 L 55 35 Z" },
];

// --- Types ---
type Step = "type" | "measures" | "fabric" | "finish" | "extras";
const STEPS: Step[] = ["type", "measures", "fabric", "finish", "extras"];
const STEP_LABELS: Record<Step, string> = {
  type: "¿Qué quieres?",
  measures: "Medidas",
  fabric: "Tela y color",
  finish: "Acabado",
  extras: "Extras",
};

// --- Icons for product types ---
const ProductIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'cabecero':
      return <svg viewBox="0 0 40 30" className="w-8 h-6"><rect x="2" y="4" width="36" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'banco':
      return <svg viewBox="0 0 40 24" className="w-8 h-5"><rect x="2" y="4" width="36" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="6" y1="16" x2="6" y2="22" stroke="currentColor" strokeWidth="2" /><line x1="34" y1="16" x2="34" y2="22" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'puff':
      return <svg viewBox="0 0 40 30" className="w-8 h-6"><ellipse cx="20" cy="17" rx="16" ry="11" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'cojin':
      return <svg viewBox="0 0 30 30" className="w-6 h-6"><rect x="3" y="3" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'mesita':
      return <svg viewBox="0 0 30 30" className="w-6 h-6"><rect x="3" y="4" width="24" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="7" y1="16" x2="7" y2="26" stroke="currentColor" strokeWidth="2" /><line x1="23" y1="16" x2="23" y2="26" stroke="currentColor" strokeWidth="2" /></svg>;
    default:
      return null;
  }
};

const selectClass = "w-full bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-2 appearance-none cursor-pointer pr-8";

const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <ChevronDown size={14} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  </div>
);

// --- Component ---
const ProductConfigurator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [shape, setShape] = useState("");
  const [bedWidth, setBedWidth] = useState("");
  const [bedHeight, setBedHeight] = useState("");
  const [benchLength, setBenchLength] = useState("");
  const [benchDepth, setBenchDepth] = useState("");
  const [benchHeight, setBenchHeight] = useState("");
  const [puffDiameter, setPuffDiameter] = useState("");
  const [puffHeight, setPuffHeight] = useState("");
  const [cushionSize, setCushionSize] = useState("");
  const [fabricId, setFabricId] = useState("");
  const [finish, setFinish] = useState("");
  const [vivoColorId, setVivoColorId] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  const [extraPatas, setExtraPatas] = useState(false);
  const [extraRelleno, setExtraRelleno] = useState(false);
  const [extraExpress, setExtraExpress] = useState(false);

  const [openAccordion, setOpenAccordion] = useState<string>("type");

  // Pre-fill from URL params
  useEffect(() => {
    const tipo = searchParams.get('tipo');
    const forma = searchParams.get('forma');
    if (tipo && ['cabecero', 'banco', 'mesita', 'cojin', 'puff'].includes(tipo)) {
      setProductType(tipo as ProductType);
      setOpenAccordion('measures');
    }
    if (forma) setShape(forma);
  }, [searchParams]);

  const fabric = ALL_FABRICS.find(f => f.id === fabricId);
  const vivoFabric = ALL_FABRICS.find(f => f.id === vivoColorId);
  const fillColor = fabric?.hex || "#E5E5E5";
  const vivoColor = vivoFabric?.hex || darken(fillColor);

  const options = useMemo(() => {
    const o: Record<string, string> = {};
    if (productType === 'cabecero') {
      o.shape = shape;
      o.bedSize = bedWidth || (customWidth ? customWidth + ' cm' : '');
      o.height = bedHeight || (customHeight ? customHeight + ' cm' : '');
    }
    if (productType === 'banco') o.length = benchLength;
    if (productType === 'mesita') o.length = benchLength;
    if (productType === 'cojin') o.size = cushionSize;
    if (productType === 'puff') o.puffSize = puffDiameter === '40cm' ? 'Pequeño' : puffDiameter === '50cm' ? 'Mediano' : puffDiameter === '60cm' ? 'Grande' : '';
    if (finish) o.finish = finish;
    if (fabricId) o.color = fabricId;
    if (extraPatas) o.patas = 'true';
    if (extraRelleno) o.relleno = 'true';
    if (extraExpress) o.express = 'true';
    return o;
  }, [productType, shape, bedWidth, bedHeight, benchLength, cushionSize, puffDiameter, finish, fabricId, extraPatas, extraRelleno, extraExpress, customWidth, customHeight]);

  const price = useMemo(() => {
    if (!productType) return 0;
    return calculatePrice(productType, options);
  }, [productType, options]);

  const stepComplete: Record<Step, boolean> = {
    type: !!productType,
    measures: productType === 'cabecero' ? !!(bedWidth || customWidth) && !!(bedHeight || customHeight)
      : productType === 'banco' ? !!benchLength
      : productType === 'puff' ? !!puffDiameter
      : productType === 'cojin' ? !!cushionSize
      : productType === 'mesita' ? !!benchLength
      : false,
    fabric: !!fabricId,
    finish: !!finish,
    extras: true,
  };

  const activeStepIndex = STEPS.indexOf(openAccordion as Step);
  const isIncomplete = !productType || !fabricId || !finish;
  const priceLabel = isIncomplete ? `desde ${price || (productType ? PRODUCTS.find(p => p.type === productType)?.basePrice || 0 : 180)}` : `${price}`;

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
  if (productType === 'puff') chips.push(puffDiameter || "—");
  if (productType === 'cojin') chips.push(cushionSize || "—");
  chips.push(fabric?.name || "—");
  const finishObj = FINISHES.find(f => f.id === finish);
  if (finishObj) chips.push(finishObj.name);
  else chips.push("—");

  const previewLabel = [
    productType ? (PRODUCTS.find(p => p.type === productType)?.name.split(' ')[0] || '') : '',
    productType === 'cabecero' ? (bedWidth || (customWidth ? `${customWidth} cm` : '')) : '',
    fabric?.name || '',
  ].filter(Boolean).join(' · ') || 'Tu pieza aparecerá aquí';

  const advanceTo = (next: Step) => setOpenAccordion(next);

  const handleOrder = () => {
    if (!productType) return;
    const summary = buildConfigSummary(productType, options);
    const product = PRODUCTS.find(p => p.type === productType);
    const params = new URLSearchParams({
      product: product?.name || '',
      config: `Me interesa: ${summary} (aprox. ${price}€)`,
    });
    if (extraExpress) params.set('express', 'true');
    navigate(`/contacto?${params.toString()}`);
  };

  const selectionLabel = (step: Step): React.ReactNode => {
    switch (step) {
      case 'type':
        return productType ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {PRODUCTS.find(p => p.type === productType)?.name}</span> : <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'measures':
        if (!stepComplete.measures) return <span className="text-muted-foreground italic">Elige una opción</span>;
        if (productType === 'cabecero') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {bedWidth || `${customWidth} cm`} × {bedHeight || `${customHeight} cm`}</span>;
        if (productType === 'banco') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {benchLength}</span>;
        if (productType === 'puff') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> Ø{puffDiameter}</span>;
        if (productType === 'cojin') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {cushionSize}</span>;
        return <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'fabric':
        return fabric ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {fabric.name}</span> : <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'finish':
        return finishObj ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {finishObj.name}</span> : <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'extras':
        const extras = [extraPatas && 'Patas', extraRelleno && 'Relleno', extraExpress && 'Express'].filter(Boolean);
        return extras.length > 0 ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {extras.join(', ')}</span> : <span className="text-muted-foreground italic">Opcional</span>;
    }
  };

  const ProgressBar = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      <div className="flex gap-1">
        {STEPS.map((s) => (
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
        Paso {Math.max(1, activeStepIndex + 1)} de {STEPS.length} · {STEP_LABELS[openAccordion as Step] || STEP_LABELS.type}
      </p>
    </div>
  );

  const needsVivo = finish === 'vivo-simple' || finish === 'vivo-doble';

  const productCard = (type: ProductType, label: string) => (
    <button
      key={type}
      onClick={() => { setProductType(type); advanceTo('measures'); }}
      className={`border rounded p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
        productType === type ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"
      }`}
    >
      <ProductIcon type={type} />
      <span className="text-sm font-light text-foreground">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen">
      {/* MOBILE: sticky preview */}
      <div className="md:hidden sticky top-16 z-30 bg-secondary">
        <div className="px-4 py-4 flex flex-col items-center" style={{ height: '220px' }}>
          <p className="font-serif text-sm text-muted-foreground mb-2 text-center truncate max-w-full">{previewLabel}</p>
          <div className="flex-1 flex items-center justify-center w-full">
            <ProductSVGPreview type={productType} color={fillColor} finish={finish} vivoColor={vivoColor} />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center mt-2">
            {chips.map((c, i) => (
              <span key={i} className={`text-xs border rounded-full px-2 py-0.5 ${c === '—' ? 'text-muted-foreground border-border' : 'text-foreground bg-background border-border'}`}>{c}</span>
            ))}
          </div>
        </div>
        <ProgressBar className="px-4 pb-3" />
      </div>

      {/* TABLET + DESKTOP: 2-col layout */}
      <div className="hidden md:flex container mx-auto px-6 py-8 gap-10 lg:gap-14">
        {/* Zone A: Preview */}
        <div className="w-[40%] lg:w-1/2 sticky top-20 self-start" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <div className="bg-secondary rounded-lg p-6 lg:p-10 flex flex-col items-center justify-center min-h-[400px]">
            <p className="font-serif text-sm text-muted-foreground mb-4 text-center">{previewLabel}</p>
            <div className="flex-1 flex items-center justify-center w-full">
              <ProductSVGPreview type={productType} color={fillColor} finish={finish} vivoColor={vivoColor} />
            </div>
            {!productType && (
              <p className="text-xs text-muted-foreground text-center mt-2">Tu pieza aparecerá aquí</p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center mt-4">
            {chips.map((c, i) => (
              <span key={i} className={`text-xs border rounded-full px-2 py-0.5 ${c === '—' ? 'text-muted-foreground border-border' : 'text-foreground bg-background border-border'}`}>{c}</span>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="font-serif text-2xl lg:text-3xl font-light text-foreground transition-opacity duration-150" key={priceLabel}>
              {priceLabel} €
            </p>
            <p className="text-xs text-muted-foreground font-light mt-1">IVA incluido · Envío a toda España</p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleOrder}
              disabled={!productType}
              className="px-10 py-3.5 bg-foreground text-background text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Lo quiero →
            </button>
          </div>
        </div>

        {/* Zone B: Accordions */}
        <div className="w-[60%] lg:w-1/2">
          <div className="mb-6">
            <h1 className="font-serif text-3xl lg:text-4xl font-light text-foreground">Diseña el tuyo</h1>
            <p className="mt-2 text-sm text-muted-foreground font-light">Elige la forma, el tamaño y el acabado. El precio se actualiza en tiempo real.</p>
          </div>
          <ProgressBar className="mb-6" />
          <ConfigAccordions
            openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} selectionLabel={selectionLabel}
            productType={productType} productCard={productCard}
            shape={shape} setShape={setShape}
            bedWidth={bedWidth} setBedWidth={setBedWidth} bedHeight={bedHeight} setBedHeight={setBedHeight}
            benchLength={benchLength} setBenchLength={setBenchLength} benchDepth={benchDepth} setBenchDepth={setBenchDepth} benchHeight={benchHeight} setBenchHeight={setBenchHeight}
            puffDiameter={puffDiameter} setPuffDiameter={setPuffDiameter} puffHeight={puffHeight} setPuffHeight={setPuffHeight}
            cushionSize={cushionSize} setCushionSize={setCushionSize}
            fabricId={fabricId} setFabricId={(id) => { setFabricId(id); advanceTo('finish'); }}
            finish={finish} setFinish={(f) => { setFinish(f); advanceTo('extras'); }}
            vivoColorId={vivoColorId} setVivoColorId={setVivoColorId}
            customWidth={customWidth} setCustomWidth={setCustomWidth} customHeight={customHeight} setCustomHeight={setCustomHeight}
            extraPatas={extraPatas} setExtraPatas={setExtraPatas} extraRelleno={extraRelleno} setExtraRelleno={setExtraRelleno}
            extraExpress={extraExpress} setExtraExpress={setExtraExpress}
            advanceTo={advanceTo} needsVivo={needsVivo}
          />
        </div>
      </div>

      {/* MOBILE: accordion content */}
      <div className="md:hidden px-4 pb-28">
        <div className="mb-4 pt-4">
          <h1 className="font-serif text-2xl font-light text-foreground">Diseña el tuyo</h1>
        </div>
        <ConfigAccordions
          openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} selectionLabel={selectionLabel}
          productType={productType} productCard={productCard}
          shape={shape} setShape={setShape}
          bedWidth={bedWidth} setBedWidth={setBedWidth} bedHeight={bedHeight} setBedHeight={setBedHeight}
          benchLength={benchLength} setBenchLength={setBenchLength} benchDepth={benchDepth} setBenchDepth={setBenchDepth} benchHeight={benchHeight} setBenchHeight={setBenchHeight}
          puffDiameter={puffDiameter} setPuffDiameter={setPuffDiameter} puffHeight={puffHeight} setPuffHeight={setPuffHeight}
          cushionSize={cushionSize} setCushionSize={setCushionSize}
          fabricId={fabricId} setFabricId={(id) => { setFabricId(id); advanceTo('finish'); }}
          finish={finish} setFinish={(f) => { setFinish(f); advanceTo('extras'); }}
          vivoColorId={vivoColorId} setVivoColorId={setVivoColorId}
          customWidth={customWidth} setCustomWidth={setCustomWidth} customHeight={customHeight} setCustomHeight={setCustomHeight}
          extraPatas={extraPatas} setExtraPatas={setExtraPatas} extraRelleno={extraRelleno} setExtraRelleno={setExtraRelleno}
          extraExpress={extraExpress} setExtraExpress={setExtraExpress}
          advanceTo={advanceTo} needsVivo={needsVivo}
        />
      </div>

      {/* MOBILE: fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border flex items-center justify-between px-6 py-4">
        <div>
          <p className="font-serif text-xl text-foreground" key={priceLabel}>{priceLabel} €</p>
          <p className="text-xs text-muted-foreground">IVA incluido</p>
        </div>
        <button
          onClick={handleOrder}
          disabled={!productType}
          className="bg-foreground text-background px-6 py-3 text-sm tracking-wide font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Lo quiero →
        </button>
      </div>
    </div>
  );
};

// --- Config Accordions ---
interface ConfigAccordionsProps {
  openAccordion: string;
  setOpenAccordion: (v: string) => void;
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
  cushionSize: string; setCushionSize: (v: string) => void;
  fabricId: string; setFabricId: (v: string) => void;
  finish: string; setFinish: (v: string) => void;
  vivoColorId: string; setVivoColorId: (v: string) => void;
  customWidth: string; setCustomWidth: (v: string) => void;
  customHeight: string; setCustomHeight: (v: string) => void;
  extraPatas: boolean; setExtraPatas: (v: boolean) => void;
  extraRelleno: boolean; setExtraRelleno: (v: boolean) => void;
  extraExpress: boolean; setExtraExpress: (v: boolean) => void;
  advanceTo: (step: Step) => void;
  needsVivo: boolean;
}

const ConfigAccordions = (props: ConfigAccordionsProps) => {
  const {
    openAccordion, setOpenAccordion, selectionLabel,
    productType, productCard,
    shape, setShape,
    bedWidth, setBedWidth, bedHeight, setBedHeight,
    benchLength, setBenchLength, benchDepth, setBenchDepth, benchHeight, setBenchHeight,
    puffDiameter, setPuffDiameter, puffHeight, setPuffHeight,
    cushionSize, setCushionSize,
    fabricId, setFabricId,
    finish, setFinish,
    vivoColorId, setVivoColorId,
    customWidth, setCustomWidth, customHeight, setCustomHeight,
    extraPatas, setExtraPatas, extraRelleno, setExtraRelleno, extraExpress, setExtraExpress,
    advanceTo, needsVivo,
  } = props;

  return (
    <Accordion type="single" collapsible value={openAccordion} onValueChange={(v) => setOpenAccordion(v || '')}>
      {/* Step 1: Product type */}
      <AccordionItem value="type" className="border-b border-border">
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.type}</span>
            <span className="text-xs mt-0.5">{selectionLabel('type')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {productCard('cabecero', 'Cabecero')}
            {productCard('banco', 'Banco')}
            {productCard('puff', 'Puff')}
            {productCard('cojin', 'Cojines')}
            {productCard('mesita', 'Mesita')}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Step 2: Measures */}
      <AccordionItem value="measures" className="border-b border-border">
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.measures}</span>
            <span className="text-xs mt-0.5">{selectionLabel('measures')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-6">
          {productType === 'cabecero' && (
            <>
              {/* Shape selector */}
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
              {/* Width dropdown */}
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Ancho de cama</p>
                <SelectWrapper>
                  <select
                    value={bedWidth}
                    onChange={(e) => { setBedWidth(e.target.value); setCustomWidth(''); }}
                    className={selectClass}
                  >
                    <option value="">Seleccionar ancho...</option>
                    <option value="90cm">90 cm</option>
                    <option value="105cm">105 cm</option>
                    <option value="135cm">135 cm</option>
                    <option value="150cm">150 cm</option>
                    <option value="160cm">160 cm</option>
                    <option value="180cm">180 cm</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </SelectWrapper>
                {bedWidth === 'custom' && (
                  <div className="mt-3 flex items-center gap-2">
                    <input type="number" min={60} max={220} placeholder="Introduce los cm" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-40 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                    <span className="text-xs text-muted-foreground">cm</span>
                  </div>
                )}
              </div>
              {/* Height dropdown */}
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto del cabecero</p>
                <SelectWrapper>
                  <select
                    value={bedHeight}
                    onChange={(e) => { setBedHeight(e.target.value); setCustomHeight(''); }}
                    className={selectClass}
                  >
                    <option value="">Seleccionar alto...</option>
                    <option value="60cm">60 cm</option>
                    <option value="70cm">70 cm</option>
                    <option value="80cm">80 cm</option>
                    <option value="90cm">90 cm</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </SelectWrapper>
                {bedHeight === 'custom' && (
                  <div className="mt-3 flex items-center gap-2">
                    <input type="number" min={40} max={150} placeholder="Introduce los cm" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} className="w-40 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                    <span className="text-xs text-muted-foreground">cm</span>
                  </div>
                )}
              </div>
            </>
          )}
          {productType === 'banco' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Largo</p>
                <SelectWrapper>
                  <select value={benchLength} onChange={(e) => setBenchLength(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar largo...</option>
                    <option value="80cm">80 cm</option>
                    <option value="100cm">100 cm</option>
                    <option value="120cm">120 cm</option>
                    <option value="140cm">140 cm</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Fondo</p>
                <SelectWrapper>
                  <select value={benchDepth} onChange={(e) => setBenchDepth(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar fondo...</option>
                    <option value="35cm">35 cm</option>
                    <option value="40cm">40 cm</option>
                    <option value="45cm">45 cm</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto</p>
                <SelectWrapper>
                  <select value={benchHeight} onChange={(e) => setBenchHeight(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar alto...</option>
                    <option value="40cm">40 cm</option>
                    <option value="45cm">45 cm</option>
                  </select>
                </SelectWrapper>
              </div>
            </>
          )}
          {productType === 'puff' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Diámetro</p>
                <SelectWrapper>
                  <select value={puffDiameter} onChange={(e) => setPuffDiameter(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar diámetro...</option>
                    <option value="40cm">40 cm</option>
                    <option value="50cm">50 cm</option>
                    <option value="60cm">60 cm</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto</p>
                <SelectWrapper>
                  <select value={puffHeight} onChange={(e) => setPuffHeight(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar alto...</option>
                    <option value="30cm">30 cm</option>
                    <option value="40cm">40 cm</option>
                  </select>
                </SelectWrapper>
              </div>
            </>
          )}
          {productType === 'cojin' && (
            <div>
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tamaño</p>
              <SelectWrapper>
                <select value={cushionSize} onChange={(e) => setCushionSize(e.target.value)} className={selectClass}>
                  <option value="">Seleccionar tamaño...</option>
                  <option value="40×40">40×40 cm</option>
                  <option value="45×45">45×45 cm</option>
                  <option value="50×30 lumbar">50×30 cm lumbar</option>
                </select>
              </SelectWrapper>
            </div>
          )}
          {productType === 'mesita' && (
            <div>
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Largo</p>
              <SelectWrapper>
                <select value={benchLength} onChange={(e) => setBenchLength(e.target.value)} className={selectClass}>
                  <option value="">Seleccionar largo...</option>
                  <option value="80cm">80 cm</option>
                  <option value="100cm">100 cm</option>
                  <option value="120cm">120 cm</option>
                  <option value="140cm">140 cm</option>
                  <option value="160cm">160 cm</option>
                </select>
              </SelectWrapper>
            </div>
          )}
          {!productType && (
            <p className="text-sm text-muted-foreground font-light italic">Primero elige un tipo de producto</p>
          )}
          {productType && (
            <button onClick={() => advanceTo('fabric')} className="mt-2 text-sm text-accent-warm font-light hover:underline">
              Siguiente: Tela y color →
            </button>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Step 3: Fabric */}
      <AccordionItem value="fabric" className="border-b border-border">
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.fabric}</span>
            <span className="text-xs mt-0.5">{selectionLabel('fabric')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-6">
          {FABRIC_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">{group.label}</p>
              <div className="flex flex-wrap gap-3">
                {group.fabrics.map(f => (
                  <button key={f.id} onClick={() => setFabricId(f.id)} className="flex flex-col items-center gap-1.5" title={f.name}>
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all ${fabricId === f.id ? "border-foreground ring-2 ring-offset-2 ring-foreground/30" : "border-transparent hover:border-foreground/40"}`}
                      style={{ backgroundColor: f.hex }}
                    />
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
          <p className="text-xs text-muted-foreground font-light">
            ¿No encuentras tu tela?{" "}<a href={"https://wa.me/34645363323?text=Hola%2C%20me%20interesa%20uno%20de%20vuestros%20productos%20tapizados%20y%20quer%C3%ADa%20m%C3%A1s%20informaci%C3%B3n."} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Escríbenos</a> — trabajamos con más de 80 referencias. <a href="https://wa.me/34645363323?text=Hola%2C%20me%20interesa%20uno%20de%20vuestros%20productos%20tapizados%20y%20quer%C3%ADa%20m%C3%A1s%20informaci%C3%B3n." target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Escríbenos</a> — trabajamos con más de 80 referencias. target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Escríbenos</a> — trabajamos con más de 80 referencias.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* Step 4: Finish */}
      <AccordionItem value="finish" className="border-b border-border">
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.finish}</span>
            <span className="text-xs mt-0.5">{selectionLabel('finish')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-3">
          {FINISHES.map(f => (
            <button
              key={f.id}
              onClick={() => setFinish(f.id)}
              className={`w-full text-left px-5 py-4 border rounded transition-all ${finish === f.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}
            >
              <span className="text-sm font-medium text-foreground">{f.name}</span>
              {f.extra && <span className="text-xs text-accent-warm ml-2">+{f.extra}€</span>}
              <span className="block text-xs text-muted-foreground font-light italic mt-0.5">{f.desc}</span>
            </button>
          ))}
          {needsVivo && (
            <div className="pt-3">
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Color del vivo</p>
              <div className="flex flex-wrap gap-2">
                {ALL_FABRICS.map(f => (
                  <button key={f.id} onClick={() => setVivoColorId(f.id)} title={f.name}>
                    <div
                      className={`w-7 h-7 rounded-full border-2 transition-all ${vivoColorId === f.id ? "border-foreground ring-1 ring-offset-1 ring-foreground/30" : "border-transparent hover:border-foreground/40"}`}
                      style={{ backgroundColor: f.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Step 5: Extras */}
      <AccordionItem value="extras" className="border-b border-border">
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.extras}</span>
            <span className="text-xs mt-0.5">{selectionLabel('extras')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-4">
          {(productType === 'banco' || productType === 'mesita') && (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm text-foreground font-light">Patas de madera</p>
                <p className="text-xs text-muted-foreground">+15€</p>
              </div>
              <Switch checked={extraPatas} onCheckedChange={setExtraPatas} />
            </div>
          )}
          {(productType === 'banco' || productType === 'puff') && (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm text-foreground font-light">Relleno extra firmeza</p>
                <p className="text-xs text-muted-foreground">+20€</p>
              </div>
              <Switch checked={extraRelleno} onCheckedChange={setExtraRelleno} />
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="text-sm text-foreground font-light">Entrega express 7 días</p>
              <p className="text-xs text-muted-foreground">+35€</p>
            </div>
            <Switch checked={extraExpress} onCheckedChange={setExtraExpress} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductConfigurator;
