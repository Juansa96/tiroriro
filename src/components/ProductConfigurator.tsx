import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductSVGPreview, { darken } from "./ProductSVGPreview";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductType, PRODUCTS, calculatePrice, buildConfigSummary } from "@/lib/products";

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
  { id: "rectangular", name: "Recto" },
  { id: "semicirculo", name: "Con arco" },
  { id: "corona-simple", name: "Corona simple" },
  { id: "corona-doble", name: "Corona doble" },
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

// --- Component ---
const ProductConfigurator = () => {
  const navigate = useNavigate();
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

  const fabric = ALL_FABRICS.find(f => f.id === fabricId);
  const vivoFabric = ALL_FABRICS.find(f => f.id === vivoColorId);
  const fillColor = fabric?.hex || "#E5E5E5";
  const vivoColor = vivoFabric?.hex || darken(fillColor);

  // Build options for price calc
  const options = useMemo(() => {
    const o: Record<string, string> = {};
    if (productType === 'cabecero') {
      o.shape = shape;
      o.bedSize = bedWidth || customWidth + ' cm';
      o.height = bedHeight || customHeight + ' cm';
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

  // Selection completeness
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

  const completedSteps = STEPS.filter(s => stepComplete[s]).length;
  const activeStepIndex = STEPS.indexOf(openAccordion as Step);
  const allComplete = completedSteps >= 4; // extras always complete

  const isIncomplete = !productType || !fabricId || !finish;
  const priceLabel = isIncomplete ? `desde ${price || (productType ? PRODUCTS.find(p => p.type === productType)?.basePrice || 0 : 180)}` : `${price}`;

  // Chips
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

  // Label
  const previewLabel = [
    productType ? (PRODUCTS.find(p => p.type === productType)?.name.split(' ')[0] || '') : '',
    productType === 'cabecero' ? (bedWidth || (customWidth ? `${customWidth} cm` : '')) : '',
    fabric?.name || '',
  ].filter(Boolean).join(' · ') || 'Tu pieza aparecerá aquí';

  const advanceTo = (next: Step) => {
    setOpenAccordion(next);
  };

  const handleOrder = () => {
    if (!productType) return;
    const summary = buildConfigSummary(productType, options);
    const product = PRODUCTS.find(p => p.type === productType);
    const params = new URLSearchParams({
      product: product?.name || '',
      config: `Me interesa: ${summary} (aprox. ${price}€)`,
    });
    navigate(`/contacto?${params.toString()}`);
  };

  // Btn style
  const sizeBtn = (selected: boolean) =>
    `border rounded px-3 py-2 text-sm font-light cursor-pointer transition-all ${
      selected ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/60"
    }`;

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

  // Progress bar
  const ProgressBar = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      <div className="flex gap-1">
        {STEPS.map((s, i) => (
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
          <AccordionSection
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
            selectionLabel={selectionLabel}
            productType={productType}
            setProductType={(t) => { setProductType(t); advanceTo('measures'); }}
            shape={shape} setShape={setShape}
            bedWidth={bedWidth} setBedWidth={setBedWidth}
            bedHeight={bedHeight} setBedHeight={setBedHeight}
            benchLength={benchLength} setBenchLength={setBenchLength}
            benchDepth={benchDepth} setBenchDepth={setBenchDepth}
            benchHeight={benchHeight} setBenchHeight={setBenchHeight}
            puffDiameter={puffDiameter} setPuffDiameter={setPuffDiameter}
            puffHeight={puffHeight} setPuffHeight={setPuffHeight}
            cushionSize={cushionSize} setCushionSize={setCushionSize}
            fabricId={fabricId} setFabricId={(id) => { setFabricId(id); advanceTo('finish'); }}
            finish={finish} setFinish={(f) => { setFinish(f); advanceTo('extras'); }}
            vivoColorId={vivoColorId} setVivoColorId={setVivoColorId}
            customWidth={customWidth} setCustomWidth={setCustomWidth}
            customHeight={customHeight} setCustomHeight={setCustomHeight}
            extraPatas={extraPatas} setExtraPatas={setExtraPatas}
            extraRelleno={extraRelleno} setExtraRelleno={setExtraRelleno}
            extraExpress={extraExpress} setExtraExpress={setExtraExpress}
            advanceTo={advanceTo}
          />
        </div>
      </div>

      {/* MOBILE: accordion content */}
      <div className="md:hidden px-4 pb-28">
        <div className="mb-4 pt-4">
          <h1 className="font-serif text-2xl font-light text-foreground">Diseña el tuyo</h1>
        </div>
        <AccordionSection
          openAccordion={openAccordion}
          setOpenAccordion={setOpenAccordion}
          selectionLabel={selectionLabel}
          productType={productType}
          setProductType={(t) => { setProductType(t); advanceTo('measures'); }}
          shape={shape} setShape={setShape}
          bedWidth={bedWidth} setBedWidth={setBedWidth}
          bedHeight={bedHeight} setBedHeight={setBedHeight}
          benchLength={benchLength} setBenchLength={setBenchLength}
          benchDepth={benchDepth} setBenchDepth={setBenchDepth}
          benchHeight={benchHeight} setBenchHeight={setBenchHeight}
          puffDiameter={puffDiameter} setPuffDiameter={setPuffDiameter}
          puffHeight={puffHeight} setPuffHeight={setPuffHeight}
          cushionSize={cushionSize} setCushionSize={setCushionSize}
          fabricId={fabricId} setFabricId={(id) => { setFabricId(id); advanceTo('finish'); }}
          finish={finish} setFinish={(f) => { setFinish(f); advanceTo('extras'); }}
          vivoColorId={vivoColorId} setVivoColorId={setVivoColorId}
          customWidth={customWidth} setCustomWidth={setCustomWidth}
          customHeight={customHeight} setCustomHeight={setCustomHeight}
          extraPatas={extraPatas} setExtraPatas={setExtraPatas}
          extraRelleno={extraRelleno} setExtraRelleno={setExtraRelleno}
          extraExpress={extraExpress} setExtraExpress={setExtraExpress}
          advanceTo={advanceTo}
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

// --- Accordion Section (shared between mobile and desktop) ---
interface AccordionSectionProps {
  openAccordion: string;
  setOpenAccordion: (v: string) => void;
  selectionLabel: (step: Step) => React.ReactNode;
  productType: ProductType | null;
  setProductType: (t: ProductType) => void;
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
}

const AccordionSection = (props: AccordionSectionProps) => {
  const {
    openAccordion, setOpenAccordion, selectionLabel,
    productType, setProductType,
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
    advanceTo,
  } = props;

  const sizeBtn = (selected: boolean) =>
    `border rounded px-3 py-2 text-sm font-light cursor-pointer transition-all ${
      selected ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/60"
    }`;

  const productCard = (type: ProductType, label: string, popular: boolean) => (
    <button
      key={type}
      onClick={() => setProductType(type)}
      className={`border rounded p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
        productType === type ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"
      } ${popular ? '' : 'text-sm'}`}
    >
      <ProductIcon type={type} />
      <span className="text-sm font-light text-foreground">{label}</span>
    </button>
  );

  const needsVivo = finish === 'vivo-simple' || finish === 'vivo-doble';

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
            {productCard('cabecero', 'Cabecero', true)}
            {productCard('banco', 'Banco', true)}
            {productCard('puff', 'Puff', true)}
            {productCard('cojin', 'Cojines', false)}
            {productCard('mesita', 'Mesita', false)}
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
              {/* Shape */}
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma</p>
                <div className="flex flex-wrap gap-2">
                  {HEADBOARD_SHAPES.map(s => (
                    <button key={s.id} onClick={() => setShape(s.id)} className={sizeBtn(shape === s.id)}>{s.name}</button>
                  ))}
                </div>
              </div>
              {/* Width */}
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Ancho de cama</p>
                <div className="flex flex-wrap gap-2">
                  {['90cm', '105cm', '135cm', '150cm', '160cm', '180cm'].map(s => (
                    <button key={s} onClick={() => { setBedWidth(s); setCustomWidth(''); }} className={sizeBtn(bedWidth === s)}>{s}</button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min={60}
                    max={220}
                    placeholder="Otra medida"
                    value={customWidth}
                    onChange={(e) => { setCustomWidth(e.target.value); setBedWidth(''); }}
                    className="w-28 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1"
                  />
                  <span className="text-xs text-muted-foreground">cm</span>
                </div>
              </div>
              {/* Height */}
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto del cabecero</p>
                <div className="flex flex-wrap gap-2">
                  {['60cm', '70cm', '80cm', '90cm'].map(h => (
                    <button key={h} onClick={() => { setBedHeight(h); setCustomHeight(''); }} className={sizeBtn(bedHeight === h)}>{h}</button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min={40}
                    max={150}
                    placeholder="Otra medida"
                    value={customHeight}
                    onChange={(e) => { setCustomHeight(e.target.value); setBedHeight(''); }}
                    className="w-28 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1"
                  />
                  <span className="text-xs text-muted-foreground">cm</span>
                </div>
              </div>
            </>
          )}
          {productType === 'banco' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Largo</p>
                <div className="flex flex-wrap gap-2">
                  {['80cm', '100cm', '120cm', '140cm'].map(l => (
                    <button key={l} onClick={() => setBenchLength(l)} className={sizeBtn(benchLength === l)}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Fondo</p>
                <div className="flex flex-wrap gap-2">
                  {['35cm', '40cm', '45cm'].map(d => (
                    <button key={d} onClick={() => setBenchDepth(d)} className={sizeBtn(benchDepth === d)}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto</p>
                <div className="flex flex-wrap gap-2">
                  {['40cm', '45cm'].map(h => (
                    <button key={h} onClick={() => setBenchHeight(h)} className={sizeBtn(benchHeight === h)}>{h}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          {productType === 'puff' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Diámetro</p>
                <div className="flex flex-wrap gap-2">
                  {['40cm', '50cm', '60cm'].map(d => (
                    <button key={d} onClick={() => setPuffDiameter(d)} className={sizeBtn(puffDiameter === d)}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto</p>
                <div className="flex flex-wrap gap-2">
                  {['30cm', '40cm'].map(h => (
                    <button key={h} onClick={() => setPuffHeight(h)} className={sizeBtn(puffHeight === h)}>{h}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          {productType === 'cojin' && (
            <div>
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tamaño</p>
              <div className="flex flex-wrap gap-2">
                {['40×40', '45×45', '50×30 lumbar'].map(s => (
                  <button key={s} onClick={() => setCushionSize(s)} className={sizeBtn(cushionSize === s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {productType === 'mesita' && (
            <div>
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Largo</p>
              <div className="flex flex-wrap gap-2">
                {['80cm', '100cm', '120cm', '140cm', '160cm'].map(l => (
                  <button key={l} onClick={() => setBenchLength(l)} className={sizeBtn(benchLength === l)}>{l}</button>
                ))}
              </div>
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
                  <button
                    key={f.id}
                    onClick={() => setFabricId(f.id)}
                    className="flex flex-col items-center gap-1.5"
                    title={f.name}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        fabricId === f.id ? "border-foreground ring-2 ring-offset-2 ring-foreground/30" : "border-transparent hover:border-foreground/40"
                      }`}
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
            ¿No encuentras tu tela? <a href="https://wa.me/34645363323" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Escríbenos</a> — trabajamos con más de 80 referencias.
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
              className={`w-full text-left px-5 py-4 border rounded transition-all ${
                finish === f.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"
              }`}
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
                  <button
                    key={f.id}
                    onClick={() => setVivoColorId(f.id)}
                    title={f.name}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        vivoColorId === f.id ? "border-foreground ring-1 ring-offset-1 ring-foreground/30" : "border-transparent hover:border-foreground/40"
                      }`}
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
