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
import { useIsMobile } from "@/hooks/use-mobile";

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
];

const HEADBOARD_SHAPES = [
  { id: "recto", name: "Recto", svgPreview: "M 5 35 L 5 8 L 55 8 L 55 35 Z" },
  { id: "semicirculo", name: "Semicírculo", svgPreview: "M 5 35 L 5 22 Q 30 2 55 22 L 55 35 Z" },
  { id: "corona-simple", name: "Corona simple", svgPreview: "M 3 37 L 3 24 C 13.6 24 18 20 18.8 16.8 A 11.2 3.2 0 0 1 41.2 16.8 C 42 20 46.4 24 57 24 L 57 37 Z" },
  { id: "corona-doble", name: "Corona doble", svgPreview: "M 3 37 L 3 24 Q 11.4 24 11.4 19.8 Q 19.8 19.8 19.8 15.6 A 10.2 4.4 0 0 1 40.2 15.6 Q 40.2 19.8 48.6 19.8 Q 48.6 24 57 24 L 57 37 Z" },
  { id: "corona-triple", name: "Corona triple", svgPreview: "M 3 37 L 3 24 Q 8.6 24 8.6 21.2 Q 14.2 21.2 14.2 18.4 Q 19.8 18.4 19.8 15.6 A 10.2 4.4 0 0 1 40.2 15.6 Q 40.2 18.4 45.8 18.4 Q 45.8 21.2 51.4 21.2 Q 51.4 24 57 24 L 57 37 Z" },
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
    case 'puff':
      return <svg viewBox="0 0 40 30" className="w-8 h-6"><ellipse cx="20" cy="17" rx="16" ry="11" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    case 'cojin':
      return <svg viewBox="0 0 30 30" className="w-6 h-6"><rect x="3" y="3" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
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

function parseCm(selectVal: string, customVal: string): number | undefined {
  if (selectVal === 'custom') {
    const n = parseInt(customVal);
    return isNaN(n) ? undefined : n;
  }
  if (selectVal) {
    const meterMatch = selectVal.match(/^(\d+)(?:'(\d+))?m$/);
    if (meterMatch) {
      const meters = parseInt(meterMatch[1]);
      const cms = meterMatch[2] ? parseInt(meterMatch[2]) : 0;
      return meters * 100 + cms;
    }
    const n = parseInt(selectVal);
    return isNaN(n) ? undefined : n;
  }
  return undefined;
}

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
  const [puffLength, setPuffLength] = useState("");
  const [puffDepth, setPuffDepth] = useState("");
  const [cushionSize, setCushionSize] = useState("");
  const [fabricId, setFabricId] = useState("");
  const [finish, setFinish] = useState("");
  const [vivoColorId, setVivoColorId] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  const [extraPatas, setExtraPatas] = useState(false);
  const [extraRelleno, setExtraRelleno] = useState(false);
  const [extraExpress, setExtraExpress] = useState(false);

  const [openAccordion, setOpenAccordion] = useState<string | string[]>(isMobile ? "type" : ["type"]);

  useEffect(() => {
    localStorage.setItem('tiro_configurador_visited', 'true');
    localStorage.setItem('configurador_visitado', 'true');
  }, []);

  useEffect(() => {
    if (isMobile) {
      setOpenAccordion(prev => Array.isArray(prev) ? (prev[0] || 'type') : prev);
    } else {
      setOpenAccordion(prev => typeof prev === 'string' ? [prev] : prev);
    }
  }, [isMobile]);

  useEffect(() => {
    const tipo = searchParams.get('tipo');
    const forma = searchParams.get('forma');
    if (tipo && ['cabecero', 'banco', 'cojin', 'puff'].includes(tipo)) {
      setProductType(tipo as ProductType);
      if (tipo === 'puff' && !forma) setShape('redondo');
      if (isMobile) {
        setOpenAccordion('measures');
      } else {
        setOpenAccordion(['measures']);
      }
    }
    if (forma) setShape(forma);
  }, [searchParams, isMobile]);

  const resetConfiguracion = (newType?: ProductType) => {
    setShape(newType === 'puff' ? 'redondo' : 'recto');
    setBedWidth('');
    setBedHeight('');
    setBenchLength('');
    setBenchDepth('');
    setBenchHeight('');
    setPuffDiameter('');
    setPuffHeight('');
    setPuffLength('');
    setPuffDepth('');
    setCushionSize('');
    setFabricId('');
    setFinish('');
    setVivoColorId('');
    setCustomWidth('');
    setCustomHeight('');
    setExtraPatas(false);
    setExtraRelleno(false);
    setExtraExpress(false);
  };

  const handleProductChange = (type: ProductType) => {
    if (type !== productType) {
      resetConfiguracion(type);
    }
    setProductType(type);
    advanceTo('measures');
  };

  const fabric = ALL_FABRICS.find(f => f.id === fabricId);
  const vivoFabric = ALL_FABRICS.find(f => f.id === vivoColorId);
  const fillColor = fabric?.hex || "#D4C5A9";
  const vivoColor = vivoFabric?.hex || darken(fillColor);

  const widthCm = productType === 'cabecero' ? parseCm(bedWidth, customWidth)
    : productType === 'banco' ? parseCm(benchLength, '')
    : productType === 'puff' ? (shape === 'rectangular' ? parseCm(puffLength, '') : parseCm(puffDiameter, ''))
    : undefined;
  const heightCm = productType === 'cabecero' ? parseCm(bedHeight, customHeight)
    : productType === 'banco' ? parseCm(benchHeight, '')
    : productType === 'puff' ? (shape === 'rectangular' ? parseCm(puffDepth, '') : parseCm(puffHeight, ''))
    : undefined;

  const svgForma = productType === 'cojin' ? cushionSize : shape;

  const options = useMemo(() => {
    const o: Record<string, string> = {};
    if (productType === 'cabecero') {
      o.shape = shape;
      o.bedSize = bedWidth || (customWidth ? customWidth + ' cm' : '');
      o.height = bedHeight || (customHeight ? customHeight + ' cm' : '');
    }
    if (productType === 'banco') o.length = benchLength;
    if (productType === 'cojin') o.size = cushionSize;
    if (productType === 'puff') {
      o.puffShape = shape;
      if (shape === 'rectangular') {
        if (puffLength) o.puffLength = puffLength;
        if (puffDepth) o.puffDepth = puffDepth;
      } else {
        o.puffSize = puffDiameter === '40cm' ? 'Pequeño' : puffDiameter === '50cm' ? 'Mediano' : puffDiameter === '60cm' ? 'Grande' : puffDiameter === '70cm' ? 'Extra Grande' : '';
      }
    }
    if (finish) o.finish = finish;
    if (fabricId) o.color = fabricId;
    if (extraPatas) o.patas = 'true';
    if (extraRelleno) o.relleno = 'true';
    if (extraExpress) o.express = 'true';
    return o;
  }, [productType, shape, bedWidth, bedHeight, benchLength, cushionSize, puffDiameter, puffLength, puffDepth, finish, fabricId, extraPatas, extraRelleno, extraExpress, customWidth, customHeight]);

  const price = useMemo(() => {
    if (!productType) return 0;
    return calculatePrice(productType, options);
  }, [productType, options]);

  const stepComplete: Record<Step, boolean> = {
    type: !!productType,
    measures: productType === 'cabecero' ? !!(bedWidth || customWidth) && !!(bedHeight || customHeight)
      : productType === 'banco' ? !!benchLength
      : productType === 'puff' ? (shape === 'rectangular' ? !!puffLength && !!puffDepth : !!puffDiameter)
      : productType === 'cojin' ? !!cushionSize
      : false,
    fabric: !!fabricId,
    finish: !!finish,
    extras: true,
  };

  const currentStep = isMobile ? (typeof openAccordion === 'string' ? openAccordion : 'type') : (Array.isArray(openAccordion) ? openAccordion[0] || 'type' : openAccordion);
  const activeStepIndex = STEPS.indexOf(currentStep as Step);
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
  if (productType === 'puff') {
    if (shape === 'rectangular') {
      chips.push(puffLength || "—");
      chips.push(puffDepth || "—");
    } else {
      chips.push(puffDiameter || "—");
    }
  }
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

  const advanceTo = (next: Step) => {
    if (isMobile) {
      setOpenAccordion(next);
    } else {
      setOpenAccordion(prev => {
        const arr = Array.isArray(prev) ? [...prev] : [prev];
        if (!arr.includes(next)) arr.push(next);
        return arr;
      });
    }
  };

  const buildOrderUrl = () => {
    if (!productType) return '/#contacto';
    const product = PRODUCTS.find(p => p.type === productType);
    const summary = buildConfigSummary(productType, options);
    const params = new URLSearchParams({
      product: product?.name || '',
      config: `Me interesa: ${summary} (aprox. ${price}€)`,
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
        if (productType === 'puff') {
          if (shape === 'rectangular') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {puffLength} × {puffDepth}</span>;
          return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> Ø{puffDiameter}</span>;
        }
        if (productType === 'cojin') return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {cushionSize}</span>;
        return <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'fabric':
        return fabric ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {fabric.name}</span> : <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'finish':
        return finishObj ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {finishObj.name}</span> : <span className="text-muted-foreground italic">Elige una opción</span>;
      case 'extras': {
        const extras = [extraPatas && 'Patas', extraRelleno && 'Relleno', extraExpress && 'Express'].filter(Boolean);
        return extras.length > 0 ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span> {extras.join(', ')}</span> : <span className="text-muted-foreground italic">Opcional</span>;
      }
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
        Paso {Math.max(1, activeStepIndex + 1)} de {STEPS.length} · {STEP_LABELS[currentStep as Step] || STEP_LABELS.type}
      </p>
    </div>
  );

  const needsVivo = finish === 'vivo-simple' || finish === 'vivo-doble';

  const productCard = (type: ProductType, label: string) => (
    <button
      key={type}
      onClick={() => handleProductChange(type)}
      className={`border rounded p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
        productType === type ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"
      }`}
    >
      <ProductIcon type={type} />
      <span className="text-sm font-light text-foreground">{label}</span>
    </button>
  );

  const accordionValue = isMobile
    ? (typeof openAccordion === 'string' ? openAccordion : '')
    : (Array.isArray(openAccordion) ? openAccordion : [openAccordion]);

  const handleAccordionChange = (val: string | string[]) => {
    setOpenAccordion(val || (isMobile ? '' : []));
  };

  const sharedAccordionProps = {
    selectionLabel,
    productType, productCard,
    shape, setShape,
    bedWidth, setBedWidth, bedHeight, setBedHeight,
    benchLength, setBenchLength, benchDepth, setBenchDepth, benchHeight, setBenchHeight,
    puffDiameter, setPuffDiameter, puffHeight, setPuffHeight,
    puffLength, setPuffLength, puffDepth, setPuffDepth,
    cushionSize, setCushionSize,
    fabricId, setFabricId: (id: string) => { setFabricId(id); },
    finish, setFinish: (f: string) => { setFinish(f); },
    vivoColorId, setVivoColorId,
    customWidth, setCustomWidth, customHeight, setCustomHeight,
    extraPatas, setExtraPatas, extraRelleno, setExtraRelleno,
    extraExpress, setExtraExpress,
    advanceTo, needsVivo,
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-3">Diseña el tuyo</h1>
        <p className="text-sm text-muted-foreground font-light">
          ¿No tienes las medidas exactas? No te preocupes, puedes indicarlo en el formulario.
        </p>
      </div>

      <div className="md:hidden sticky top-16 z-30" style={{ backgroundColor: '#F0EDE8' }}>
        <div className="px-4 py-3 flex flex-col items-center min-h-[220px]">
          <p className="font-serif text-sm text-muted-foreground mb-2 text-center truncate max-w-full">{previewLabel}</p>
          <div className="flex-1 flex items-center justify-center w-full">
            <ProductSVGPreview type={productType} color={fillColor} finish={finish} vivoColor={vivoColor} forma={svgForma} widthCm={widthCm} heightCm={heightCm} />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center mt-2">
            {chips.map((c, i) => (
              <span key={i} className={`text-xs border rounded-full px-2 py-0.5 ${c === '—' ? 'text-muted-foreground border-border' : 'text-foreground bg-background border-border'}`}>{c}</span>
            ))}
          </div>
          <div className="mt-2 w-full">
            <ProgressBar />
          </div>
        </div>
      </div>

      <div className="hidden md:flex container mx-auto px-6 py-8 gap-10 lg:gap-14">
        <div className="w-[40%] lg:w-1/2 sticky top-20 self-start" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <div className="rounded-lg p-6 lg:p-10 flex flex-col items-center justify-center min-h-[400px]" style={{ backgroundColor: '#F0EDE8' }}>
            <p className="font-serif text-sm text-muted-foreground mb-4 text-center">{previewLabel}</p>
            <div className="flex-1 flex items-center justify-center w-full">
              <ProductSVGPreview type={productType} color={fillColor} finish={finish} vivoColor={vivoColor} forma={svgForma} widthCm={widthCm} heightCm={heightCm} />
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

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleOrder}
              disabled={!productType}
              className="w-full px-6 py-3.5 bg-foreground text-background text-sm tracking-wide uppercase text-center font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40"
            >
              Lo quiero — solicitar presupuesto
            </button>
          </div>
        </div>

        <div className="w-[60%] lg:w-1/2">
          <div className="mb-6">
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-foreground">Configura tu pieza</h2>
            <p className="mt-2 text-base text-muted-foreground font-light">Elige la forma, el tamaño y el acabado. El precio se actualiza en tiempo real.</p>
          </div>
          <ProgressBar className="mb-6" />
          <ConfigAccordionsMultiple
            openAccordion={Array.isArray(accordionValue) ? accordionValue : [accordionValue as string]}
            setOpenAccordion={(v) => handleAccordionChange(v)}
            {...sharedAccordionProps}
          />
        </div>
      </div>

      <div className="md:hidden px-4 pb-28 pt-4">
        <div className="mb-4">
          <h2 className="font-serif text-2xl font-light text-foreground">Configura tu pieza</h2>
        </div>
        <ConfigAccordionsSingle
          openAccordion={typeof accordionValue === 'string' ? accordionValue : ''}
          setOpenAccordion={(v) => handleAccordionChange(v)}
          {...sharedAccordionProps}
        />
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-6 py-4">
        <div className="flex items-center justify-between">
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
    </div>
  );
};

interface AccordionContentSharedProps {
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
  puffLength: string; setPuffLength: (v: string) => void;
  puffDepth: string; setPuffDepth: (v: string) => void;
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

const AccordionItems = (props: AccordionContentSharedProps) => {
  const {
    selectionLabel,
    productType, productCard,
    shape, setShape,
    bedWidth, setBedWidth, bedHeight, setBedHeight,
    benchLength, setBenchLength, benchDepth, setBenchDepth, benchHeight, setBenchHeight,
    puffDiameter, setPuffDiameter, puffHeight, setPuffHeight,
    puffLength, setPuffLength, puffDepth, setPuffDepth,
    cushionSize, setCushionSize,
    fabricId, setFabricId,
    finish, setFinish,
    vivoColorId, setVivoColorId,
    customWidth, setCustomWidth, customHeight, setCustomHeight,
    extraPatas, setExtraPatas, extraRelleno, setExtraRelleno, extraExpress, setExtraExpress,
    advanceTo, needsVivo,
  } = props;

  const productSelected = !!productType;
  const disabledClass = productSelected ? '' : 'opacity-40 pointer-events-none';

  return (
    <>
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
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="measures" disabled={!productSelected} className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.measures}</span>
            <span className="text-xs mt-0.5">{selectionLabel('measures')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-6">
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
                <SelectWrapper>
                  <select value={bedWidth} onChange={(e) => { setBedWidth(e.target.value); if (e.target.value !== 'custom') setCustomWidth(''); }} className={selectClass}>
                    <option value="">Seleccionar ancho...</option>
                    <option value="1m">1 m</option>
                    <option value="1'20m">1'20 m</option>
                    <option value="1'30m">1'30 m</option>
                    <option value="custom">No tengo claras las medidas</option>
                  </select>
                </SelectWrapper>
                {bedWidth === 'custom' && (
                  <>
                    <div className="mt-3 flex items-center gap-2">
                      <input type="number" min={60} max={300} placeholder="Introduce los cm" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-40 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                      <span className="text-xs text-muted-foreground">cm</span>
                    </div>
                    {parseInt(customWidth) > 250 && (
                      <p className="text-sm text-destructive mt-1">El ancho máximo es 250cm. Consúltanos para medidas especiales.</p>
                    )}
                  </>
                )}
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto del cabecero</p>
                <SelectWrapper>
                  <select value={bedHeight} onChange={(e) => { setBedHeight(e.target.value); if (e.target.value !== 'custom') setCustomHeight(''); }} className={selectClass}>
                    <option value="">Seleccionar alto...</option>
                    <option value="60cm">60 cm</option>
                    <option value="70cm">70 cm</option>
                    <option value="80cm">80 cm</option>
                    <option value="90cm">90 cm</option>
                    <option value="custom">No tengo claras las medidas</option>
                  </select>
                </SelectWrapper>
                {bedHeight === 'custom' && (
                  <>
                    <div className="mt-3 flex items-center gap-2">
                      <input type="number" min={40} max={200} placeholder="Introduce los cm" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} className="w-40 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                      <span className="text-xs text-muted-foreground">cm</span>
                    </div>
                    {parseInt(customHeight) > 120 && (
                      <p className="text-sm text-destructive mt-1">El alto máximo habitual es 120cm. Escríbenos para confirmar.</p>
                    )}
                  </>
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
                    <option value="custom">No tengo claras las medidas</option>
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
                    <option value="custom">No tengo claras las medidas</option>
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
                    <option value="custom">No tengo claras las medidas</option>
                  </select>
                </SelectWrapper>
              </div>
            </>
          )}
          {productType === 'puff' && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setShape('redondo'); setPuffLength(''); setPuffDepth(''); }}
                    className={`border rounded p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${shape !== 'rectangular' ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}
                  >
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <ellipse cx="20" cy="20" rx="16" ry="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="text-xs font-light">Redondo</span>
                  </button>
                  <button
                    onClick={() => { setShape('rectangular'); setPuffDiameter(''); }}
                    className={`border rounded p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${shape === 'rectangular' ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}
                  >
                    <svg viewBox="0 0 50 35" className="w-10 h-7">
                      <rect x="4" y="7" width="42" height="21" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="text-xs font-light">Rectangular</span>
                  </button>
                </div>
              </div>
              {shape !== 'rectangular' && (
                <div>
                  <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Diámetro</p>
                  <SelectWrapper>
                    <select value={puffDiameter} onChange={(e) => setPuffDiameter(e.target.value)} className={selectClass}>
                      <option value="">Seleccionar diámetro...</option>
                      <option value="40cm">40 cm — Pequeño</option>
                      <option value="50cm">50 cm — Mediano</option>
                      <option value="60cm">60 cm — Grande</option>
                      <option value="70cm">70 cm — Extra grande</option>
                      <option value="custom">No tengo claras las medidas</option>
                    </select>
                  </SelectWrapper>
                </div>
              )}
              {shape === 'rectangular' && (
                <>
                  <div>
                    <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Largo</p>
                    <SelectWrapper>
                      <select value={puffLength} onChange={(e) => setPuffLength(e.target.value)} className={selectClass}>
                        <option value="">Seleccionar largo...</option>
                        <option value="70cm">70 cm</option>
                        <option value="80cm">80 cm</option>
                        <option value="90cm">90 cm</option>
                        <option value="100cm">100 cm</option>
                        <option value="120cm">120 cm</option>
                        <option value="custom">No tengo claras las medidas</option>
                      </select>
                    </SelectWrapper>
                  </div>
                  <div>
                    <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Fondo</p>
                    <SelectWrapper>
                      <select value={puffDepth} onChange={(e) => setPuffDepth(e.target.value)} className={selectClass}>
                        <option value="">Seleccionar fondo...</option>
                        <option value="40cm">40 cm</option>
                        <option value="50cm">50 cm</option>
                        <option value="60cm">60 cm</option>
                        <option value="custom">No tengo claras las medidas</option>
                      </select>
                    </SelectWrapper>
                  </div>
                </>
              )}
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Alto</p>
                <SelectWrapper>
                  <select value={puffHeight} onChange={(e) => setPuffHeight(e.target.value)} className={selectClass}>
                    <option value="">Seleccionar alto...</option>
                    <option value="30cm">30 cm</option>
                    <option value="35cm">35 cm</option>
                    <option value="40cm">40 cm</option>
                    <option value="45cm">45 cm</option>
                    <option value="custom">No tengo claras las medidas</option>
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
          {!productType && (
            <p className="text-base text-muted-foreground font-light italic">Primero elige un tipo de producto</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="fabric" disabled={!productSelected} className={`border-b border-border ${disabledClass}`}>
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
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="finish" disabled={!productSelected} className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.finish}</span>
            <span className="text-xs mt-0.5">{selectionLabel('finish')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-3">
          {FINISHES.filter(f => {
            if (productType === 'puff') {
              return f.id === 'liso' || f.id === 'vivo-simple';
            }
            return true;
          }).map(f => (
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

      <AccordionItem value="extras" disabled={!productSelected} className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.extras}</span>
            <span className="text-xs mt-0.5">{selectionLabel('extras')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-4">
          {productType === 'banco' && (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-base text-foreground font-light">Patas de madera</p>
                <p className="text-xs text-muted-foreground">+15€</p>
              </div>
              <Switch checked={extraPatas} onCheckedChange={setExtraPatas} />
            </div>
          )}
          {(productType === 'banco' || productType === 'puff') && (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-base text-foreground font-light">Relleno extra firmeza</p>
                <p className="text-xs text-muted-foreground">+20€</p>
              </div>
              <Switch checked={extraRelleno} onCheckedChange={setExtraRelleno} />
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="text-base text-foreground font-light">Entrega express 7 días</p>
              <p className="text-xs text-muted-foreground">+35€</p>
            </div>
            <Switch checked={extraExpress} onCheckedChange={setExtraExpress} />
          </div>
          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border/40">
            Instalación disponible bajo consulta.
          </p>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

interface SingleAccordionProps extends AccordionContentSharedProps {
  openAccordion: string;
  setOpenAccordion: (v: string) => void;
}

const ConfigAccordionsSingle = (props: SingleAccordionProps) => {
  const { openAccordion, setOpenAccordion, ...rest } = props;
  return (
    <Accordion type="single" collapsible value={openAccordion} onValueChange={(v) => setOpenAccordion(v || '')}>
      <AccordionItems {...rest} />
    </Accordion>
  );
};

interface MultipleAccordionProps extends AccordionContentSharedProps {
  openAccordion: string[];
  setOpenAccordion: (v: string[]) => void;
}

const ConfigAccordionsMultiple = (props: MultipleAccordionProps) => {
  const { openAccordion, setOpenAccordion, ...rest } = props;
  return (
    <Accordion type="multiple" value={openAccordion} onValueChange={(v) => setOpenAccordion(v)}>
      <AccordionItems {...rest} />
    </Accordion>
  );
};

export default ProductConfigurator;
