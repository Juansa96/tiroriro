import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ProductSVGPreview from "./ProductSVGPreview";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BED_WIDTH_OPTIONS,
  BASE_DEPTH_OPTIONS,
  BASE_HEIGHT_OPTIONS,
  BASE_WIDTH_OPTIONS,
  BENCH_TYPES,
  CUSHION_SHAPES,
  CUSHION_SIZES,
  FABRIC_COLORS,
  FINISHES,
  HEADBOARD_HEIGHT_OPTIONS,
  HEADBOARD_SHAPES,
  PRODUCTS,
  ProductType,
  PUFF_SHAPES,
  buildConfigSummary,
} from "@/lib/products";
import { useIsMobile } from "@/hooks/use-mobile";
import { safeLocalStorageSet } from "@/lib/safe-storage";

type Step = "type" | "measures" | "fabric" | "finish" | "extras";

type FabricOption = {
  id: string;
  name: string;
  hex: string;
  image: string;
  group: string;
};

const darken = (hex: string, amount = 40): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
};

const STEP_LABELS: Record<Step, string> = {
  type: "¿Qué quieres?",
  measures: "Medidas",
  fabric: "Tela y color",
  finish: "Acabado",
  extras: "Extras",
};

const STEPS: Step[] = ["type", "measures", "fabric", "finish", "extras"];

const FABRICS: FabricOption[] = [
  { id: "tela-01", name: "Tela 01", hex: "#D9D0C3", image: "/telas/tela-01.webp", group: "Colección" },
  { id: "tela-02", name: "Tela 02", hex: "#D8C8B5", image: "/telas/tela-02.png", group: "Colección" },
  { id: "tela-03", name: "Tela 03", hex: "#D1CDC7", image: "/telas/tela-03.webp", group: "Colección" },
  { id: "tela-04", name: "Tela 04", hex: "#C7CFD2", image: "/telas/tela-04.png", group: "Colección" },
  { id: "tela-05", name: "Tela 05", hex: "#B3B39C", image: "/telas/tela-05.png", group: "Colección" },
  { id: "tela-06", name: "Tela 06", hex: "#BAC1BD", image: "/telas/tela-06.png", group: "Colección" },
  { id: "tela-07", name: "Tela 07", hex: "#C4B5A8", image: "/telas/tela-07.png", group: "Colección" },
  { id: "tela-08", name: "Tela 08", hex: "#919A91", image: "/telas/tela-08.png", group: "Colección" },
  { id: "tela-09", name: "Tela 09", hex: "#5C656E", image: "/telas/tela-09.png", group: "Colección" },
  { id: "tela-10", name: "Tela 10", hex: "#746E6A", image: "/telas/tela-10.jpg", group: "Colección" },
];

const HEADBOARD_SIDE_OPTIONS = [
  { id: "misma-tela", name: "Misma tela que frontal" },
  { id: "otra-tela", name: "Otra tela a elegir" },
];

const headboardSelectorPath = (shape: string) => {
  switch (shape) {
    case "semicirculo":
      return "M 5 35 L 5 22 Q 30 2 55 22 L 55 35 Z";
    case "corona-simple":
      return "M 3 37 L 3 24 C 13.6 24 18 20 18.8 16.8 A 11.2 3.2 0 0 1 41.2 16.8 C 42 20 46.4 24 57 24 L 57 37 Z";
    case "corona-doble":
      return "M 3 37 L 3 24 Q 11.4 24 11.4 19.8 Q 19.8 19.8 19.8 15.6 A 10.2 4.4 0 0 1 40.2 15.6 Q 40.2 19.8 48.6 19.8 Q 48.6 24 57 24 L 57 37 Z";
    case "corona-triple":
      return "M 3 37 L 3 24 Q 8.6 24 8.6 21.2 Q 14.2 21.2 14.2 18.4 Q 19.8 18.4 19.8 15.6 A 10.2 4.4 0 0 1 40.2 15.6 Q 40.2 18.4 45.8 18.4 Q 45.8 21.2 51.4 21.2 Q 51.4 24 57 24 L 57 37 Z";
    case "recto":
    default:
      return "M 5 35 L 5 8 L 55 8 L 55 35 Z";
  }
};

const MESA_TYPES = [
  { id: "tipo-puff", name: "Mesa de centro tapizada" },
  { id: "tipo-banco", name: "Mesa de centro tipo banco" },
];

const SURFACE_OPTIONS = [
  { id: "sin-superficie", name: "Sin cristal ni metacrilato" },
  { id: "cristal", name: "Con cristal" },
  { id: "metacrilato", name: "Con metacrilato" },
];

const selectClass =
  "w-full bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-2 appearance-none cursor-pointer pr-8";

const ProductIcon = ({ type }: { type: ProductType }) => {
  if (type === "cabecero") {
    return <svg viewBox="0 0 40 30" className="w-8 h-6"><rect x="2" y="4" width="36" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  if (type === "banco") {
    return <svg viewBox="0 0 40 24" className="w-8 h-5"><rect x="2" y="4" width="36" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="6" y1="16" x2="6" y2="22" stroke="currentColor" strokeWidth="2" /><line x1="34" y1="16" x2="34" y2="22" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  if (type === "puff") {
    return <svg viewBox="0 0 40 30" className="w-8 h-6"><ellipse cx="20" cy="17" rx="16" ry="11" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  if (type === "mesa") {
    return <svg viewBox="0 0 42 30" className="w-8 h-6"><rect x="5" y="5" width="32" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="10" y1="15" x2="10" y2="25" stroke="currentColor" strokeWidth="2" /><line x1="32" y1="15" x2="32" y2="25" stroke="currentColor" strokeWidth="2" /></svg>;
  }
  return <svg viewBox="0 0 30 30" className="w-6 h-6"><rect x="3" y="3" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
};

const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <ChevronDown size={14} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  </div>
);

const groupedFabrics = FABRICS.reduce<Record<string, FabricOption[]>>((acc, fabric) => {
  acc[fabric.group] = acc[fabric.group] || [];
  acc[fabric.group].push(fabric);
  return acc;
}, {});

const parseMeasureToNumber = (value: string, custom: string) => {
  if (value === "Otro") return Number(custom.replace(",", ".")) || 0;
  if (value.includes("m")) {
    const meters = value.match(/(\d+(?:,\d+)?)/)?.[1];
    return meters ? Math.round(parseFloat(meters.replace(",", ".")) * 100) : 0;
  }
  return Number(value.replace(/[^\d]/g, "")) || 0;
};

const parseCushionDimensions = (shape: string, size: string, customWidth: string, customHeight: string) => {
  if (size === "Otro") {
    return {
      width: Number(customWidth.replace(",", ".")) || 0,
      height: Number(customHeight.replace(",", ".")) || 0,
    };
  }

  const match = size.match(/(\d+)\D+(\d+)/);
  if (match) {
    return {
      width: Number(match[1]) || 0,
      height: Number(match[2]) || 0,
    };
  }

  if (shape === "cilindro") {
    return { width: 60, height: 22 };
  }

  return { width: 45, height: 45 };
};

const formatMeasure = (value: string, custom: string) => {
  if (!value) return "";
  return value === "Otro" ? (custom ? `${custom} cm` : "") : value;
};

const FabricSwatch = ({
  fabric,
  active,
  onClick,
}: {
  fabric: FabricOption;
  active: boolean;
  onClick: () => void;
}) => (
  <button onClick={onClick} type="button" className="flex flex-col items-center gap-2 text-center">
    <span
      className={`h-14 w-14 overflow-hidden rounded-md border transition-all ${
        active ? "border-foreground ring-2 ring-foreground/15 ring-offset-2" : "border-border hover:border-foreground/50"
      }`}
      style={{
        backgroundImage: `url(${fabric.image})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: fabric.hex,
      }}
    />
    <span className="max-w-[76px] text-[10px] leading-tight text-muted-foreground">{fabric.name}</span>
  </button>
);

const ProductConfigurator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const [productType, setProductType] = useState<ProductType | null>(null);

  const [headboardShape, setHeadboardShape] = useState("recto");
  const [headboardWidth, setHeadboardWidth] = useState("");
  const [headboardWidthCustom, setHeadboardWidthCustom] = useState("");
  const [headboardHeight, setHeadboardHeight] = useState("");
  const [headboardHeightCustom, setHeadboardHeightCustom] = useState("");
  const [headboardLateralMode, setHeadboardLateralMode] = useState("misma-tela");
  const [headboardLateralFabric, setHeadboardLateralFabric] = useState("");
  const [headboardHanging, setHeadboardHanging] = useState(false);

  const [benchKind, setBenchKind] = useState("madera");
  const [benchLength, setBenchLength] = useState("");
  const [benchLengthCustom, setBenchLengthCustom] = useState("");
  const [benchDepth, setBenchDepth] = useState("");
  const [benchDepthCustom, setBenchDepthCustom] = useState("");
  const [benchHeight, setBenchHeight] = useState("");
  const [benchHeightCustom, setBenchHeightCustom] = useState("");
  const [benchExtraFirm, setBenchExtraFirm] = useState(false);

  const [puffShape, setPuffShape] = useState("cuadrado");
  const [puffWidth, setPuffWidth] = useState("");
  const [puffWidthCustom, setPuffWidthCustom] = useState("");
  const [puffDepth, setPuffDepth] = useState("");
  const [puffDepthCustom, setPuffDepthCustom] = useState("");
  const [puffHeight, setPuffHeight] = useState("");
  const [puffHeightCustom, setPuffHeightCustom] = useState("");
  const [puffPair, setPuffPair] = useState(false);

  const [mesaKind, setMesaKind] = useState("tipo-puff");
  const [mesaWidth, setMesaWidth] = useState("");
  const [mesaWidthCustom, setMesaWidthCustom] = useState("");
  const [mesaDepth, setMesaDepth] = useState("");
  const [mesaDepthCustom, setMesaDepthCustom] = useState("");
  const [mesaHeight, setMesaHeight] = useState("");
  const [mesaHeightCustom, setMesaHeightCustom] = useState("");
  const [mesaSurface, setMesaSurface] = useState("sin-superficie");

  const [cushionShape, setCushionShape] = useState("cuadrada");
  const [cushionSize, setCushionSize] = useState("");
  const [cushionWidthCustom, setCushionWidthCustom] = useState("");
  const [cushionHeightCustom, setCushionHeightCustom] = useState("");

  const [fabricId, setFabricId] = useState("");
  const [finish, setFinish] = useState("");
  const [vivoColorId, setVivoColorId] = useState("");
  const [extraExpress, setExtraExpress] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | string[]>(isMobile ? "type" : ["type"]);

  useEffect(() => {
    safeLocalStorageSet("tiro_configurador_visited", "true");
    safeLocalStorageSet("configurador_visitado", "true");
  }, []);

  useEffect(() => {
    setOpenAccordion(isMobile ? "type" : ["type"]);
  }, [isMobile]);

  const resetAll = (nextType?: ProductType) => {
    setHeadboardShape("recto");
    setHeadboardWidth("");
    setHeadboardWidthCustom("");
    setHeadboardHeight("");
    setHeadboardHeightCustom("");
    setHeadboardLateralMode("misma-tela");
    setHeadboardLateralFabric("");
    setHeadboardHanging(false);
    setBenchKind("madera");
    setBenchLength("");
    setBenchLengthCustom("");
    setBenchDepth("");
    setBenchDepthCustom("");
    setBenchHeight("");
    setBenchHeightCustom("");
    setBenchExtraFirm(false);
    setPuffShape("cuadrado");
    setPuffWidth("");
    setPuffWidthCustom("");
    setPuffDepth("");
    setPuffDepthCustom("");
    setPuffHeight("");
    setPuffHeightCustom("");
    setPuffPair(false);
    setMesaKind("tipo-puff");
    setMesaWidth("");
    setMesaWidthCustom("");
    setMesaDepth("");
    setMesaDepthCustom("");
    setMesaHeight("");
    setMesaHeightCustom("");
    setMesaSurface("sin-superficie");
    setCushionShape("cuadrada");
    setCushionSize("");
    setCushionWidthCustom("");
    setCushionHeightCustom("");
    setFabricId("");
    setFinish("");
    setVivoColorId("");
    setExtraExpress(false);
    if (nextType) setProductType(nextType);
  };

  useEffect(() => {
    const tipo = searchParams.get("tipo");
    const forma = searchParams.get("forma");
    if (!tipo || !["cabecero", "banco", "cojin", "puff", "mesa"].includes(tipo)) return;
    setProductType(tipo as ProductType);
    if (tipo === "cabecero" && forma) setHeadboardShape(forma);
    if (tipo === "puff" && forma && ["cuadrado", "circular"].includes(forma)) setPuffShape(forma);
    if (tipo === "mesa" && forma && ["tipo-puff", "tipo-banco"].includes(forma)) setMesaKind(forma);
    if (isMobile) setOpenAccordion("measures");
    else setOpenAccordion(["measures"]);
  }, [searchParams, isMobile]);

  const currentFabric = FABRICS.find((fabric) => fabric.id === fabricId);
  const currentVivoFabric = FABRICS.find((fabric) => fabric.id === (vivoColorId || fabricId));
  const currentLateralFabric = FABRICS.find((fabric) => fabric.id === headboardLateralFabric);
  const fillColor = currentFabric?.hex || "#D4C5A9";
  const simpleVivo = FABRIC_COLORS.find((item) => item.id === (vivoColorId || ""))?.hex;
  const vivoColor = simpleVivo || currentVivoFabric?.hex || darken(fillColor);

  const currentFinishOptions = productType ? FINISHES[productType] : [];
  const finishLabel = currentFinishOptions.find((item) => item.id === finish)?.name || "";
  const needsVivo = finish === "vivo-simple" || finish === "vivo-doble";

  const cushionPreview = parseCushionDimensions(cushionShape, cushionSize, cushionWidthCustom, cushionHeightCustom);

  const previewForma =
    productType === "cabecero" ? headboardShape :
    productType === "banco" ? benchKind :
    productType === "puff" ? puffShape :
    productType === "mesa" ? mesaKind :
    productType === "cojin" ? cushionShape :
    undefined;

  const previewWidthCm =
    productType === "cabecero" ? parseMeasureToNumber(headboardWidth, headboardWidthCustom) :
    productType === "banco" ? parseMeasureToNumber(benchLength, benchLengthCustom) :
    productType === "puff" ? parseMeasureToNumber(puffWidth, puffWidthCustom) :
    productType === "mesa" ? parseMeasureToNumber(mesaWidth, mesaWidthCustom) :
    0;

  const previewHeightCm =
    productType === "cabecero" ? parseMeasureToNumber(headboardHeight, headboardHeightCustom) :
    productType === "banco" ? parseMeasureToNumber(benchHeight, benchHeightCustom) :
    productType === "puff" ? parseMeasureToNumber(puffHeight, puffHeightCustom) :
    productType === "mesa" ? parseMeasureToNumber(mesaHeight, mesaHeightCustom) :
    productType === "cojin" ? cushionPreview.height :
    0;

  const previewDepthCm =
    productType === "banco" ? parseMeasureToNumber(benchDepth, benchDepthCustom) :
    productType === "puff" ? parseMeasureToNumber(puffDepth, puffDepthCustom) :
    productType === "mesa" ? parseMeasureToNumber(mesaDepth, mesaDepthCustom) :
    productType === "cojin" ? cushionPreview.height :
    0;

  const previewWidthValue =
    productType === "cojin" ? cushionPreview.width : previewWidthCm;

  const formattedOptions = useMemo(() => {
    const options: Record<string, string> = {};
    if (!productType) return options;

    options.fabricLabel = currentFabric?.name || "";
    options.finish = finish;
    options.finishLabel = finishLabel;
    options.color = fabricId;
    options.vivoLabel = currentVivoFabric?.name || "";
    options.express = extraExpress ? "true" : "false";

    if (productType === "cabecero") {
      options.shape = headboardShape;
      options.shapeLabel = HEADBOARD_SHAPES.find((item) => item.id === headboardShape)?.name || "";
      options.width = formatMeasure(headboardWidth, headboardWidthCustom);
      options.height = formatMeasure(headboardHeight, headboardHeightCustom);
      options.lateralMode = headboardLateralMode;
      options.lateralLabel =
        headboardLateralMode === "otra-tela"
          ? currentLateralFabric?.name || "Otra tela"
          : "Misma tela que frontal";
      options.hangingAccessories = headboardHanging ? "true" : "false";
    }

    if (productType === "banco") {
      options.kind = benchKind;
      options.kindLabel = BENCH_TYPES.find((item) => item.id === benchKind)?.name || "";
      options.length = formatMeasure(benchLength, benchLengthCustom);
      options.depth = formatMeasure(benchDepth, benchDepthCustom);
      options.height = formatMeasure(benchHeight, benchHeightCustom);
      options.extraFirm = benchExtraFirm ? "true" : "false";
    }

    if (productType === "puff") {
      options.shape = puffShape;
      options.shapeLabel = PUFF_SHAPES.find((item) => item.id === puffShape)?.name || "";
      options.width = formatMeasure(puffWidth, puffWidthCustom);
      options.depth = formatMeasure(puffDepth, puffDepthCustom);
      options.height = formatMeasure(puffHeight, puffHeightCustom);
      options.doubleSet = puffPair ? "true" : "false";
    }

    if (productType === "mesa") {
      options.kind = mesaKind;
      options.kindLabel = MESA_TYPES.find((item) => item.id === mesaKind)?.name || "";
      options.width = formatMeasure(mesaWidth, mesaWidthCustom);
      options.depth = formatMeasure(mesaDepth, mesaDepthCustom);
      options.height = formatMeasure(mesaHeight, mesaHeightCustom);
      options.surface = mesaSurface;
      options.surfaceLabel = SURFACE_OPTIONS.find((item) => item.id === mesaSurface)?.name || "";
    }

    if (productType === "cojin") {
      options.shape = cushionShape;
      options.shapeLabel = CUSHION_SHAPES.find((item) => item.id === cushionShape)?.name || "";
      options.sizeLabel =
        cushionSize === "Otro"
          ? (cushionWidthCustom && cushionHeightCustom ? `${cushionWidthCustom}×${cushionHeightCustom} cm` : "")
          : cushionSize;
      options.width = cushionSize === "Otro" ? `${cushionWidthCustom} cm` : "";
      options.depth = cushionSize === "Otro" ? `${cushionHeightCustom} cm` : "";
    }

    return options;
  }, [
    productType,
    currentFabric,
    finish,
    finishLabel,
    currentVivoFabric,
    fabricId,
    extraExpress,
    headboardShape,
    headboardWidth,
    headboardWidthCustom,
    headboardHeight,
    headboardHeightCustom,
    headboardLateralMode,
    currentLateralFabric,
    headboardHanging,
    benchKind,
    benchLength,
    benchLengthCustom,
    benchDepth,
    benchDepthCustom,
    benchHeight,
    benchHeightCustom,
    benchExtraFirm,
    puffShape,
    puffWidth,
    puffWidthCustom,
    puffDepth,
    puffDepthCustom,
    puffHeight,
    puffHeightCustom,
    puffPair,
    mesaKind,
    mesaWidth,
    mesaWidthCustom,
    mesaDepth,
    mesaDepthCustom,
    mesaHeight,
    mesaHeightCustom,
    mesaSurface,
    cushionShape,
    cushionSize,
    cushionWidthCustom,
    cushionHeightCustom,
  ]);

  const measuresComplete =
    productType === "cabecero"
      ? !!formatMeasure(headboardWidth, headboardWidthCustom) && !!formatMeasure(headboardHeight, headboardHeightCustom)
      : productType === "banco"
        ? !!formatMeasure(benchLength, benchLengthCustom) && !!formatMeasure(benchDepth, benchDepthCustom) && !!formatMeasure(benchHeight, benchHeightCustom)
        : productType === "puff"
          ? !!puffShape && !!formatMeasure(puffWidth, puffWidthCustom) && !!formatMeasure(puffDepth, puffDepthCustom) && !!formatMeasure(puffHeight, puffHeightCustom)
          : productType === "mesa"
            ? !!mesaKind && !!formatMeasure(mesaWidth, mesaWidthCustom) && !!formatMeasure(mesaDepth, mesaDepthCustom) && !!formatMeasure(mesaHeight, mesaHeightCustom)
            : productType === "cojin"
              ? !!cushionShape && !!(cushionSize === "Otro" ? cushionWidthCustom && cushionHeightCustom : cushionSize)
              : false;

  const fabricComplete = !!fabricId && (productType !== "cabecero" || headboardLateralMode !== "otra-tela" || !!headboardLateralFabric);
  const finishComplete = !!finish;
  const extrasComplete =
    productType === "mesa"
      ? !!mesaSurface
      : productType === "cabecero"
        ? headboardHanging || extraExpress
        : productType === "banco"
          ? benchExtraFirm || extraExpress
          : productType === "puff"
            ? puffPair || extraExpress
            : extraExpress;

  const stepComplete: Record<Step, boolean> = {
    type: !!productType,
    measures: measuresComplete,
    fabric: fabricComplete,
    finish: finishComplete,
    extras: extrasComplete,
  };

  const currentStep = isMobile
    ? (typeof openAccordion === "string" ? (openAccordion || "type") : "type")
    : (Array.isArray(openAccordion) ? openAccordion[0] || "type" : "type");
  const activeStepIndex = STEPS.indexOf(currentStep as Step);
  const canOrder = !!productType && measuresComplete && fabricComplete && finishComplete;

  const chips = [
    productType ? PRODUCTS.find((product) => product.type === productType)?.name : "",
    productType === "cabecero" ? formatMeasure(headboardWidth, headboardWidthCustom) : "",
    productType === "banco" ? formatMeasure(benchLength, benchLengthCustom) : "",
    productType === "puff" ? formatMeasure(puffWidth, puffWidthCustom) : "",
    productType === "mesa" ? formatMeasure(mesaWidth, mesaWidthCustom) : "",
    productType === "cojin" ? (cushionSize === "Otro" ? `${cushionWidthCustom}×${cushionHeightCustom} cm` : cushionSize) : "",
    currentFabric?.name || "",
    finishLabel,
  ].filter(Boolean) as string[];

  const previewLabel = [
    productType ? PRODUCTS.find((product) => product.type === productType)?.name : "",
    currentFabric?.name || "",
  ].filter(Boolean).join(" · ") || "Tu pieza aparecerá aquí";

  const advanceTo = (next: Step) => {
    if (isMobile) setOpenAccordion(next);
    else setOpenAccordion((prev) => {
      const current = Array.isArray(prev) ? [...prev] : [prev];
      return current.includes(next) ? current : [...current, next];
    });
  };

  const buildOrderUrl = () => {
    if (!productType) return "/#contacto";
    const product = PRODUCTS.find((item) => item.type === productType);
    const summary = buildConfigSummary(productType, formattedOptions);
    const params = new URLSearchParams({
      product: product?.name || "",
      config: `Hemos recuperado esta selección: ${summary}. Si hace falta, podemos ajustar medidas o detalles antes de cerrar el presupuesto.`,
      previewType: productType,
      previewForma: previewForma || "",
      previewColor: fillColor,
      previewTexture: currentFabric?.image || "",
      previewLateralTexture: productType === "cabecero" && headboardLateralMode === "otra-tela" ? currentLateralFabric?.image || "" : "",
      previewFinish: finish,
      previewVivo: needsVivo ? vivoColor : "",
      previewWidth: previewWidthValue ? String(previewWidthValue) : "",
      previewHeight: previewHeightCm ? String(previewHeightCm) : "",
      previewDepth: previewDepthCm ? String(previewDepthCm) : "",
    });
    if (extraExpress) params.set("express", "true");
    return `/?${params.toString()}#contacto`;
  };

  const handleOrder = () => {
    if (!canOrder) return;
    navigate(buildOrderUrl());
  };

  const selectionLabel = (step: Step): React.ReactNode => {
    if (step === "type") {
      return productType
        ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{PRODUCTS.find((product) => product.type === productType)?.name}</span>
        : <span className="text-muted-foreground italic">Elige una opción</span>;
    }
    if (step === "measures") {
      if (!measuresComplete) return <span className="text-muted-foreground italic">Completa el paso</span>;
      if (productType === "cabecero") return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{formatMeasure(headboardWidth, headboardWidthCustom)} × {formatMeasure(headboardHeight, headboardHeightCustom)}</span>;
      if (productType === "banco") return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{formatMeasure(benchLength, benchLengthCustom)} × {formatMeasure(benchDepth, benchDepthCustom)} × {formatMeasure(benchHeight, benchHeightCustom)}</span>;
      if (productType === "puff") return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{formatMeasure(puffWidth, puffWidthCustom)} × {formatMeasure(puffDepth, puffDepthCustom)} × {formatMeasure(puffHeight, puffHeightCustom)}</span>;
      if (productType === "mesa") return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{formatMeasure(mesaWidth, mesaWidthCustom)} × {formatMeasure(mesaDepth, mesaDepthCustom)} × {formatMeasure(mesaHeight, mesaHeightCustom)}</span>;
      return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{cushionSize === "Otro" ? `${cushionWidthCustom}×${cushionHeightCustom} cm` : cushionSize}</span>;
    }
    if (step === "fabric") {
      return fabricComplete
        ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{currentFabric?.name}</span>
        : <span className="text-muted-foreground italic">Completa el paso</span>;
    }
    if (step === "finish") {
      return finishComplete
        ? <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{finishLabel}</span>
        : <span className="text-muted-foreground italic">Completa el paso</span>;
    }
    if (!extrasComplete) return <span className="text-muted-foreground italic">Opcional</span>;
    const extras = [
      headboardHanging && "Accesorios para colgar",
      benchExtraFirm && "Relleno firme",
      puffPair && "Pareja de puffs",
      mesaSurface !== "sin-superficie" && SURFACE_OPTIONS.find((item) => item.id === mesaSurface)?.name,
      extraExpress && "Entrega express",
    ].filter(Boolean);
    return <span className="text-foreground flex items-center gap-1"><span className="text-accent-warm">✓</span>{extras.join(", ")}</span>;
  };

  const ProgressBar = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      <div className="flex gap-1">
        {STEPS.map((step) => (
          <div key={step} className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: stepComplete[step] ? "100%" : "0%", backgroundColor: "hsl(var(--accent-warm))" }} />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-light mt-2">
        Paso {Math.max(1, activeStepIndex + 1)} de {STEPS.length} · {STEP_LABELS[currentStep as Step] || STEP_LABELS.type}
      </p>
    </div>
  );

  const productCard = (type: ProductType, label: string) => (
    <button
      key={type}
      type="button"
      onClick={() => {
        if (type !== productType) resetAll(type);
        else setProductType(type);
        advanceTo("measures");
      }}
      className={`border rounded p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
        productType === type ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"
      }`}
    >
      <ProductIcon type={type} />
      <span className="text-sm font-light text-foreground">{label}</span>
    </button>
  );

  const accordionValue = isMobile
    ? (typeof openAccordion === "string" ? openAccordion : "")
    : (Array.isArray(openAccordion) ? openAccordion : [openAccordion]);

  const sharedAccordionProps = {
    productType,
    selectionLabel,
    productCard,
    headboardShape,
    setHeadboardShape,
    headboardWidth,
    setHeadboardWidth,
    headboardWidthCustom,
    setHeadboardWidthCustom,
    headboardHeight,
    setHeadboardHeight,
    headboardHeightCustom,
    setHeadboardHeightCustom,
    headboardLateralMode,
    setHeadboardLateralMode,
    headboardLateralFabric,
    setHeadboardLateralFabric,
    benchKind,
    setBenchKind,
    benchLength,
    setBenchLength,
    benchLengthCustom,
    setBenchLengthCustom,
    benchDepth,
    setBenchDepth,
    benchDepthCustom,
    setBenchDepthCustom,
    benchHeight,
    setBenchHeight,
    benchHeightCustom,
    setBenchHeightCustom,
    puffShape,
    setPuffShape,
    puffWidth,
    setPuffWidth,
    puffWidthCustom,
    setPuffWidthCustom,
    puffDepth,
    setPuffDepth,
    puffDepthCustom,
    setPuffDepthCustom,
    puffHeight,
    setPuffHeight,
    puffHeightCustom,
    setPuffHeightCustom,
    mesaKind,
    setMesaKind,
    mesaWidth,
    setMesaWidth,
    mesaWidthCustom,
    setMesaWidthCustom,
    mesaDepth,
    setMesaDepth,
    mesaDepthCustom,
    setMesaDepthCustom,
    mesaHeight,
    setMesaHeight,
    mesaHeightCustom,
    setMesaHeightCustom,
    cushionShape,
    setCushionShape,
    cushionSize,
    setCushionSize,
    cushionWidthCustom,
    setCushionWidthCustom,
    cushionHeightCustom,
    setCushionHeightCustom,
    fabricId,
    setFabricId: (id: string) => {
      setFabricId(id);
      if (!vivoColorId) setVivoColorId(id);
    },
    finish,
    setFinish,
    vivoColorId,
    setVivoColorId,
    headboardHanging,
    setHeadboardHanging,
    benchExtraFirm,
    setBenchExtraFirm,
    puffPair,
    setPuffPair,
    mesaSurface,
    setMesaSurface,
    extraExpress,
    setExtraExpress,
    needsVivo,
    advanceTo,
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-3">Diseña el tuyo</h1>
        <p className="text-sm text-muted-foreground font-light">Elige la pieza, la tela y las medidas. Si necesitas algo especial, lo afinamos contigo después.</p>
      </div>

      <div className="md:hidden sticky top-16 z-30" style={{ backgroundColor: "#F0EDE8" }}>
        <div className="px-4 py-3 flex flex-col items-center min-h-[220px]">
          <p className="font-serif text-sm text-muted-foreground mb-2 text-center truncate max-w-full">{previewLabel}</p>
          <div className="flex-1 flex items-center justify-center w-full">
            <ProductSVGPreview
              type={productType}
              color={fillColor}
              fabricImage={currentFabric?.image}
              lateralFabricImage={productType === "cabecero" && headboardLateralMode === "otra-tela" ? currentLateralFabric?.image : undefined}
              finish={finish}
              vivoColor={vivoColor}
              forma={previewForma}
              widthCm={previewWidthValue || undefined}
              heightCm={previewHeightCm || undefined}
              depthCm={previewDepthCm || undefined}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center mt-2">
            {chips.map((chip) => (
              <span key={chip} className="text-xs border rounded-full px-2 py-0.5 text-foreground bg-background border-border">{chip}</span>
            ))}
          </div>
          <div className="mt-2 w-full"><ProgressBar /></div>
        </div>
      </div>

      <div className="hidden md:flex container mx-auto px-6 py-8 gap-10 lg:gap-14">
        <div className="w-[40%] lg:w-1/2 sticky top-20 self-start" style={{ maxHeight: "calc(100vh - 80px)" }}>
          <div className="rounded-lg p-6 lg:p-10 flex flex-col items-center justify-center min-h-[400px]" style={{ backgroundColor: "#F0EDE8" }}>
            <p className="font-serif text-sm text-muted-foreground mb-4 text-center">{previewLabel}</p>
            <div className="flex-1 flex items-center justify-center w-full">
              <ProductSVGPreview
                type={productType}
                color={fillColor}
                fabricImage={currentFabric?.image}
                lateralFabricImage={productType === "cabecero" && headboardLateralMode === "otra-tela" ? currentLateralFabric?.image : undefined}
                finish={finish}
                vivoColor={vivoColor}
                forma={previewForma}
                widthCm={previewWidthValue || undefined}
                heightCm={previewHeightCm || undefined}
                depthCm={previewDepthCm || undefined}
              />
            </div>
            {!productType && <p className="text-xs text-muted-foreground text-center mt-2">Tu pieza aparecerá aquí</p>}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center mt-4">
            {chips.map((chip) => (
              <span key={chip} className="text-xs border rounded-full px-2 py-0.5 text-foreground bg-background border-border">{chip}</span>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="font-serif text-2xl lg:text-3xl font-light text-foreground transition-opacity duration-150">
              {productType ? "Tu selección" : "—"}
            </p>
            <p className="text-xs text-muted-foreground font-light mt-1">Revisamos contigo todos los detalles antes de confirmarlo.</p>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <button onClick={handleOrder} disabled={!canOrder} className="btn-sweep btn-unir btn-unir-outline w-full px-6 py-3.5 text-sm text-center font-medium disabled:opacity-40">
              <span className="relative z-10">Lo quiero — solicitar presupuesto</span>
            </button>
          </div>
        </div>

        <div className="w-[60%] lg:w-1/2">
          <div className="mb-6">
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-foreground">Configura tu pieza</h2>
            <p className="mt-2 text-base text-muted-foreground font-light">La estructura se mantiene limpia y cada decisión queda ordenada paso a paso.</p>
          </div>
          <ProgressBar className="mb-6" />
          <ConfigAccordionsMultiple
            openAccordion={Array.isArray(accordionValue) ? accordionValue : [accordionValue as string]}
            setOpenAccordion={(value) => setOpenAccordion(value)}
            {...sharedAccordionProps}
          />
        </div>
      </div>

      <div className="md:hidden px-4 pb-28 pt-4">
        <div className="mb-4"><h2 className="font-serif text-2xl font-light text-foreground">Configura tu pieza</h2></div>
        <ConfigAccordionsSingle
          openAccordion={typeof accordionValue === "string" ? accordionValue : ""}
          setOpenAccordion={(value) => setOpenAccordion(value)}
          {...sharedAccordionProps}
        />
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-serif text-xl text-foreground">{productType ? "Tu selección" : "—"}</p>
            <p className="text-xs text-muted-foreground">Listo para enviarlo</p>
          </div>
          <button onClick={handleOrder} disabled={!canOrder} className="btn-sweep btn-unir px-6 py-3 text-sm font-medium disabled:opacity-40">
            <span className="relative z-10">Lo quiero →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface SharedProps {
  productType: ProductType | null;
  selectionLabel: (step: Step) => React.ReactNode;
  productCard: (type: ProductType, label: string) => React.ReactNode;
  headboardShape: string;
  setHeadboardShape: (value: string) => void;
  headboardWidth: string;
  setHeadboardWidth: (value: string) => void;
  headboardWidthCustom: string;
  setHeadboardWidthCustom: (value: string) => void;
  headboardHeight: string;
  setHeadboardHeight: (value: string) => void;
  headboardHeightCustom: string;
  setHeadboardHeightCustom: (value: string) => void;
  headboardLateralMode: string;
  setHeadboardLateralMode: (value: string) => void;
  headboardLateralFabric: string;
  setHeadboardLateralFabric: (value: string) => void;
  benchKind: string;
  setBenchKind: (value: string) => void;
  benchLength: string;
  setBenchLength: (value: string) => void;
  benchLengthCustom: string;
  setBenchLengthCustom: (value: string) => void;
  benchDepth: string;
  setBenchDepth: (value: string) => void;
  benchDepthCustom: string;
  setBenchDepthCustom: (value: string) => void;
  benchHeight: string;
  setBenchHeight: (value: string) => void;
  benchHeightCustom: string;
  setBenchHeightCustom: (value: string) => void;
  puffShape: string;
  setPuffShape: (value: string) => void;
  puffWidth: string;
  setPuffWidth: (value: string) => void;
  puffWidthCustom: string;
  setPuffWidthCustom: (value: string) => void;
  puffDepth: string;
  setPuffDepth: (value: string) => void;
  puffDepthCustom: string;
  setPuffDepthCustom: (value: string) => void;
  puffHeight: string;
  setPuffHeight: (value: string) => void;
  puffHeightCustom: string;
  setPuffHeightCustom: (value: string) => void;
  mesaKind: string;
  setMesaKind: (value: string) => void;
  mesaWidth: string;
  setMesaWidth: (value: string) => void;
  mesaWidthCustom: string;
  setMesaWidthCustom: (value: string) => void;
  mesaDepth: string;
  setMesaDepth: (value: string) => void;
  mesaDepthCustom: string;
  setMesaDepthCustom: (value: string) => void;
  mesaHeight: string;
  setMesaHeight: (value: string) => void;
  mesaHeightCustom: string;
  setMesaHeightCustom: (value: string) => void;
  cushionShape: string;
  setCushionShape: (value: string) => void;
  cushionSize: string;
  setCushionSize: (value: string) => void;
  cushionWidthCustom: string;
  setCushionWidthCustom: (value: string) => void;
  cushionHeightCustom: string;
  setCushionHeightCustom: (value: string) => void;
  fabricId: string;
  setFabricId: (value: string) => void;
  finish: string;
  setFinish: (value: string) => void;
  vivoColorId: string;
  setVivoColorId: (value: string) => void;
  headboardHanging: boolean;
  setHeadboardHanging: (value: boolean) => void;
  benchExtraFirm: boolean;
  setBenchExtraFirm: (value: boolean) => void;
  puffPair: boolean;
  setPuffPair: (value: boolean) => void;
  mesaSurface: string;
  setMesaSurface: (value: string) => void;
  extraExpress: boolean;
  setExtraExpress: (value: boolean) => void;
  needsVivo: boolean;
  advanceTo: (step: Step) => void;
}

const MeasureSelect = ({
  label,
  value,
  onChange,
  options,
  customValue,
  onCustomChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  customValue: string;
  onCustomChange: (value: string) => void;
}) => (
  <div>
    <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">{label}</p>
    <SelectWrapper>
      <select value={value} onChange={(event) => { onChange(event.target.value); if (event.target.value !== "Otro") onCustomChange(""); }} className={selectClass}>
        <option value="">Seleccionar...</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </SelectWrapper>
    {value === "Otro" && (
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={customValue}
          onChange={(event) => onCustomChange(event.target.value)}
          placeholder="Indica los cm"
          className="w-40 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1"
        />
        <span className="text-xs text-muted-foreground">cm</span>
      </div>
    )}
  </div>
);

const AccordionItems = (props: SharedProps) => {
  const {
    productType,
    selectionLabel,
    productCard,
    headboardShape,
    setHeadboardShape,
    headboardWidth,
    setHeadboardWidth,
    headboardWidthCustom,
    setHeadboardWidthCustom,
    headboardHeight,
    setHeadboardHeight,
    headboardHeightCustom,
    setHeadboardHeightCustom,
    headboardLateralMode,
    setHeadboardLateralMode,
    headboardLateralFabric,
    setHeadboardLateralFabric,
    benchKind,
    setBenchKind,
    benchLength,
    setBenchLength,
    benchLengthCustom,
    setBenchLengthCustom,
    benchDepth,
    setBenchDepth,
    benchDepthCustom,
    setBenchDepthCustom,
    benchHeight,
    setBenchHeight,
    benchHeightCustom,
    setBenchHeightCustom,
    puffShape,
    setPuffShape,
    puffWidth,
    setPuffWidth,
    puffWidthCustom,
    setPuffWidthCustom,
    puffDepth,
    setPuffDepth,
    puffDepthCustom,
    setPuffDepthCustom,
    puffHeight,
    setPuffHeight,
    puffHeightCustom,
    setPuffHeightCustom,
    mesaKind,
    setMesaKind,
    mesaWidth,
    setMesaWidth,
    mesaWidthCustom,
    setMesaWidthCustom,
    mesaDepth,
    setMesaDepth,
    mesaDepthCustom,
    setMesaDepthCustom,
    mesaHeight,
    setMesaHeight,
    mesaHeightCustom,
    setMesaHeightCustom,
    cushionShape,
    setCushionShape,
    cushionSize,
    setCushionSize,
    cushionWidthCustom,
    setCushionWidthCustom,
    cushionHeightCustom,
    setCushionHeightCustom,
    fabricId,
    setFabricId,
    finish,
    setFinish,
    vivoColorId,
    setVivoColorId,
    headboardHanging,
    setHeadboardHanging,
    benchExtraFirm,
    setBenchExtraFirm,
    puffPair,
    setPuffPair,
    mesaSurface,
    setMesaSurface,
    extraExpress,
    setExtraExpress,
    needsVivo,
    advanceTo,
  } = props;

  const disabledClass = productType ? "" : "opacity-40 pointer-events-none";

  return (
    <>
      <AccordionItem value="type" className="border-b border-border">
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.type}</span>
            <span className="text-xs mt-0.5">{selectionLabel("type")}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {productCard("cabecero", "Cabeceros")}
            {productCard("banco", "Bancos entelados")}
            {productCard("cojin", "Cojines y almohadones")}
            {productCard("puff", "Puffs")}
            {productCard("mesa", "Mesas de centro")}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="measures" disabled={!productType} className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.measures}</span>
            <span className="text-xs mt-0.5">{selectionLabel("measures")}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-6">
          {productType === "cabecero" && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {HEADBOARD_SHAPES.map((shape) => (
                    <button key={shape.id} type="button" onClick={() => setHeadboardShape(shape.id)} className={`border rounded p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${headboardShape === shape.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                      <svg viewBox="0 0 60 40" className="w-12 h-8">
                        <path d={headboardSelectorPath(shape.id)} fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <span className="text-xs font-light">{shape.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <MeasureSelect label="Ancho de cama" value={headboardWidth} onChange={setHeadboardWidth} options={BED_WIDTH_OPTIONS} customValue={headboardWidthCustom} onCustomChange={setHeadboardWidthCustom} />
              <MeasureSelect label="Alto del cabecero" value={headboardHeight} onChange={setHeadboardHeight} options={HEADBOARD_HEIGHT_OPTIONS} customValue={headboardHeightCustom} onCustomChange={setHeadboardHeightCustom} />
            </>
          )}

          {productType === "banco" && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tipo de banco</p>
                <div className="grid md:grid-cols-3 gap-3">
                  {BENCH_TYPES.map((option) => (
                    <button key={option.id} type="button" onClick={() => setBenchKind(option.id)} className={`border rounded p-3 text-center transition-all ${benchKind === option.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                      <span className="text-xs font-light">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <MeasureSelect label="Largo" value={benchLength} onChange={setBenchLength} options={BASE_WIDTH_OPTIONS} customValue={benchLengthCustom} onCustomChange={setBenchLengthCustom} />
              <MeasureSelect label="Fondo" value={benchDepth} onChange={setBenchDepth} options={BASE_DEPTH_OPTIONS} customValue={benchDepthCustom} onCustomChange={setBenchDepthCustom} />
              <MeasureSelect label="Alto" value={benchHeight} onChange={setBenchHeight} options={BASE_HEIGHT_OPTIONS} customValue={benchHeightCustom} onCustomChange={setBenchHeightCustom} />
            </>
          )}

          {productType === "puff" && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma</p>
                <div className="grid grid-cols-2 gap-3">
                  {PUFF_SHAPES.map((option) => (
                    <button key={option.id} type="button" onClick={() => setPuffShape(option.id)} className={`border rounded p-3 text-center transition-all ${puffShape === option.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                      <span className="text-xs font-light">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <MeasureSelect label="Ancho" value={puffWidth} onChange={setPuffWidth} options={BASE_WIDTH_OPTIONS} customValue={puffWidthCustom} onCustomChange={setPuffWidthCustom} />
              <MeasureSelect label="Fondo" value={puffDepth} onChange={setPuffDepth} options={BASE_DEPTH_OPTIONS} customValue={puffDepthCustom} onCustomChange={setPuffDepthCustom} />
              <MeasureSelect label="Alto" value={puffHeight} onChange={setPuffHeight} options={BASE_HEIGHT_OPTIONS} customValue={puffHeightCustom} onCustomChange={setPuffHeightCustom} />
            </>
          )}

          {productType === "mesa" && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tipo de mesa de centro</p>
                <div className="grid gap-3">
                  {MESA_TYPES.map((option) => (
                    <button key={option.id} type="button" onClick={() => setMesaKind(option.id)} className={`border rounded p-3 text-left transition-all ${mesaKind === option.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                      <span className="text-sm font-light">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <MeasureSelect label="Ancho" value={mesaWidth} onChange={setMesaWidth} options={BASE_WIDTH_OPTIONS} customValue={mesaWidthCustom} onCustomChange={setMesaWidthCustom} />
              <MeasureSelect label="Fondo" value={mesaDepth} onChange={setMesaDepth} options={BASE_DEPTH_OPTIONS} customValue={mesaDepthCustom} onCustomChange={setMesaDepthCustom} />
              <MeasureSelect label="Alto" value={mesaHeight} onChange={setMesaHeight} options={BASE_HEIGHT_OPTIONS} customValue={mesaHeightCustom} onCustomChange={setMesaHeightCustom} />
            </>
          )}

          {productType === "cojin" && (
            <>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Forma</p>
                <div className="grid md:grid-cols-3 gap-3">
                  {CUSHION_SHAPES.map((option) => (
                    <button key={option.id} type="button" onClick={() => setCushionShape(option.id)} className={`border rounded p-3 text-center transition-all ${cushionShape === option.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                      <span className="text-xs font-light">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Medidas</p>
                <SelectWrapper>
                  <select value={cushionSize} onChange={(event) => { setCushionSize(event.target.value); if (event.target.value !== "Otro") { setCushionWidthCustom(""); setCushionHeightCustom(""); } }} className={selectClass}>
                    <option value="">Seleccionar...</option>
                    {CUSHION_SIZES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </SelectWrapper>
                {cushionSize === "Otro" && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <input type="number" min={1} placeholder="Ancho" value={cushionWidthCustom} onChange={(event) => setCushionWidthCustom(event.target.value)} className="w-28 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                    <span className="text-xs text-muted-foreground">×</span>
                    <input type="number" min={1} placeholder="Fondo" value={cushionHeightCustom} onChange={(event) => setCushionHeightCustom(event.target.value)} className="w-28 bg-transparent border-b border-border text-sm font-light text-foreground focus:outline-none focus:border-foreground py-1" />
                    <span className="text-xs text-muted-foreground">cm</span>
                  </div>
                )}
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="fabric" disabled={!productType} className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.fabric}</span>
            <span className="text-xs mt-0.5">{selectionLabel("fabric")}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-6">
          {Object.entries(groupedFabrics).map(([group, fabrics]) => (
            <div key={group}>
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">{group}</p>
              <div className="flex flex-wrap gap-3">
                {fabrics.map((fabric) => (
                  <FabricSwatch key={fabric.id} fabric={fabric} active={fabricId === fabric.id} onClick={() => { setFabricId(fabric.id); advanceTo("finish"); }} />
                ))}
              </div>
            </div>
          ))}
          {productType === "cabecero" && (
            <div className="pt-2 space-y-4">
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground font-light">Lateral</p>
              <div className="grid gap-3">
                {HEADBOARD_SIDE_OPTIONS.map((option) => (
                  <button key={option.id} type="button" onClick={() => setHeadboardLateralMode(option.id)} className={`border rounded p-3 text-left transition-all ${headboardLateralMode === option.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                    <span className="text-sm font-light">{option.name}</span>
                  </button>
                ))}
              </div>
              {headboardLateralMode === "otra-tela" && (
                <div className="flex flex-wrap gap-3">
                  {FABRICS.map((fabric) => (
                    <FabricSwatch key={`lateral-${fabric.id}`} fabric={fabric} active={headboardLateralFabric === fabric.id} onClick={() => setHeadboardLateralFabric(fabric.id)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="finish" disabled={!productType} className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.finish}</span>
            <span className="text-xs mt-0.5">{selectionLabel("finish")}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-3">
          {productType && FINISHES[productType].map((option) => (
            <button key={option.id} type="button" onClick={() => { setFinish(option.id); advanceTo("extras"); }} className={`w-full text-left px-5 py-4 border rounded transition-all ${finish === option.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
              <span className="text-sm font-medium text-foreground">{option.name}</span>
              <span className="block text-xs text-muted-foreground font-light italic mt-0.5">{option.desc}</span>
            </button>
          ))}
          {needsVivo && (
            <div className="pt-3">
              <p className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 font-light">Tela del vivo</p>
              <div className="flex flex-wrap gap-3">
                {FABRIC_COLORS.map((color) => (
                  <button key={`vivo-${color.id}`} type="button" onClick={() => setVivoColorId(color.id)} className="flex flex-col items-center gap-2 text-center">
                    <span className={`h-10 w-10 rounded-full border transition-all ${vivoColorId === color.id ? "border-foreground ring-2 ring-foreground/15 ring-offset-2" : "border-border hover:border-foreground/50"}`} style={{ backgroundColor: color.hex }} />
                    <span className="max-w-[70px] text-[10px] leading-tight text-muted-foreground">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="extras" disabled={!productType} className={`border-b border-border ${disabledClass}`}>
        <AccordionTrigger className="py-5 hover:no-underline">
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-base font-medium text-foreground">{STEP_LABELS.extras}</span>
            <span className="text-xs mt-0.5">{selectionLabel("extras")}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-4">
          {productType === "cabecero" && (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-base text-foreground font-light">Accesorios para colgar</p>
                <p className="text-xs text-muted-foreground">Te lo dejamos previsto para colgarlo con facilidad.</p>
              </div>
              <Switch checked={headboardHanging} onCheckedChange={setHeadboardHanging} />
            </div>
          )}
          {productType === "banco" && (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-base text-foreground font-light">Relleno más firme</p>
                <p className="text-xs text-muted-foreground">Para una sentada más estructurada.</p>
              </div>
              <Switch checked={benchExtraFirm} onCheckedChange={setBenchExtraFirm} />
            </div>
          )}
          {productType === "puff" && (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-base text-foreground font-light">Quiero dos puffs iguales</p>
                <p className="text-xs text-muted-foreground">Muy útil cuando van en pareja o a los lados de una mesa.</p>
              </div>
              <Switch checked={puffPair} onCheckedChange={setPuffPair} />
            </div>
          )}
          {productType === "mesa" && (
            <div className="space-y-3">
              <p className="text-base text-foreground font-light">Superficie</p>
              <div className="grid gap-3">
                {SURFACE_OPTIONS.map((option) => (
                  <button key={option.id} type="button" onClick={() => setMesaSurface(option.id)} className={`border rounded p-3 text-left transition-all ${mesaSurface === option.id ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/60"}`}>
                    <span className="text-sm font-light">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-t border-border/40 pt-4">
            <div>
              <p className="text-base text-foreground font-light">Entrega express 7 días</p>
              <p className="text-xs text-muted-foreground">Si necesitas acelerar plazos, lo vemos contigo.</p>
            </div>
            <Switch checked={extraExpress} onCheckedChange={setExtraExpress} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

const ConfigAccordionsSingle = ({ openAccordion, setOpenAccordion, ...rest }: SharedProps & { openAccordion: string; setOpenAccordion: (value: string) => void }) => (
  <Accordion type="single" collapsible value={openAccordion} onValueChange={(value) => setOpenAccordion(value || "")}>
    <AccordionItems {...rest} />
  </Accordion>
);

const ConfigAccordionsMultiple = ({ openAccordion, setOpenAccordion, ...rest }: SharedProps & { openAccordion: string[]; setOpenAccordion: (value: string[]) => void }) => (
  <Accordion type="multiple" value={openAccordion} onValueChange={setOpenAccordion}>
    <AccordionItems {...rest} />
  </Accordion>
);

export default ProductConfigurator;
