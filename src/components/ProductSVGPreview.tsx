import { ProductType } from "@/lib/products";
import { useState, useEffect } from "react";

interface Props {
  type: ProductType | null;
  color: string;
  finish: string;
  vivoColor?: string;
  width?: number;
  height?: number;
  forma?: string;
  widthCm?: number;
  heightCm?: number;
}

function darken(hex: string, amount = 40): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
}

function lighten(hex: string, amount = 30): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, r + amount)}, ${Math.min(255, g + amount)}, ${Math.min(255, b + amount)})`;
}

const EmptyState = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-[280px] mx-auto">
    <rect x="20" y="30" width="260" height="150" rx="4" fill="#D4C5A9" stroke="rgba(0,0,0,0.15)" strokeWidth="1" className="transition-all duration-300" />
    <text x="150" y="110" textAnchor="middle" fontSize="12" fill="#999" className="font-body">Tu pieza aparecerá aquí</text>
  </svg>
);

// Vivo (ribete) path for each headboard shape
const headboardVivoPath = (forma: string): string => {
  switch (forma) {
    case 'semicirculo':
      return "M 20 160 L 20 95 Q 150 20 280 95 L 280 160 Z";
    case 'corona-simple':
      return "M 20 160 L 20 80 Q 75 30 150 55 Q 225 30 280 80 L 280 160 Z";
    case 'corona-doble':
      return "M 20 160 L 20 90 Q 60 40 100 70 Q 150 20 200 70 Q 240 40 280 90 L 280 160 Z";
    case 'recto':
    default:
      return "M 20 50 L 280 50 L 280 160 L 20 160 Z";
  }
};

const VivoForHeadboard = ({ forma, finish, vivoColor }: { forma: string; finish: string; vivoColor: string }) => {
  if (finish !== 'vivo-simple' && finish !== 'vivo-doble') return null;
  const d = headboardVivoPath(forma);
  if (finish === 'vivo-simple') {
    return <path d={d} fill="none" stroke={vivoColor} strokeWidth="3" className="transition-all duration-300" />;
  }
  // doble — outer + inner offset
  return (
    <>
      <path d={d} fill="none" stroke={vivoColor} strokeWidth="2" className="transition-all duration-300" />
      <path d={d} fill="none" stroke={vivoColor} strokeWidth="2" transform="translate(0, 8) scale(0.96, 0.94)" transform-origin="150 100" className="transition-all duration-300" />
    </>
  );
};

// Vivo for non-cabecero (rectangle-based) shapes
const VivoForRect = ({ x, y, w, h, finish, vivoColor, rx = 3 }: { x: number; y: number; w: number; h: number; finish: string; vivoColor: string; rx?: number }) => {
  if (finish === 'vivo-simple') {
    return <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx={rx} fill="none" stroke={vivoColor} strokeWidth="3" className="transition-all duration-300" />;
  }
  if (finish === 'vivo-doble') {
    return (
      <>
        <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx={rx} fill="none" stroke={vivoColor} strokeWidth="2" className="transition-all duration-300" />
        <rect x={x + 16} y={y + 16} width={w - 32} height={h - 32} rx={rx} fill="none" stroke={vivoColor} strokeWidth="2" className="transition-all duration-300" />
      </>
    );
  }
  return null;
};

const HeadboardSVG = ({ color, finish, vivoColor, forma, widthCm, heightCm }: { color: string; finish: string; vivoColor: string; forma?: string; widthCm?: number; heightCm?: number }) => {
  const f = forma || 'recto';
  // Use full viewBox-based path so silhouette is consistent with vivo path
  const fillPath = headboardVivoPath(f);

  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-[280px] mx-auto">
      <path d={fillPath} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" className="transition-all duration-400" />
      <VivoForHeadboard forma={f} finish={finish} vivoColor={vivoColor} />
      {widthCm && widthCm > 200 && (
        <text x="150" y="195" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground">{widthCm} cm</text>
      )}
    </svg>
  );
};

const BenchSVG = ({ color, finish, vivoColor, widthCm, heightCm }: { color: string; finish: string; vivoColor: string; widthCm?: number; heightCm?: number }) => {
  const baseW = widthCm ? Math.min(270, Math.max(100, (widthCm / 120) * 240)) : 260;
  const baseH = heightCm ? Math.min(80, Math.max(30, (heightCm / 45) * 55)) : 55;
  const x = (300 - baseW) / 2;

  return (
    <svg viewBox="0 0 300 130" className="w-full max-w-[280px] mx-auto">
      <rect x={x} y={20} width={baseW} height={baseH} rx={4} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" className="transition-all duration-300" />
      {finish === 'vivo-simple' && (
        <rect x={x + 8} y={28} width={baseW - 16} height={baseH - 16} rx={4} fill="none" stroke={vivoColor} strokeWidth="3" className="transition-all duration-300" />
      )}
      {finish === 'vivo-doble' && (
        <>
          <rect x={x + 6} y={26} width={baseW - 12} height={baseH - 12} rx={4} fill="none" stroke={vivoColor} strokeWidth="2" className="transition-all duration-300" />
          <rect x={x + 14} y={34} width={baseW - 28} height={baseH - 28} rx={4} fill="none" stroke={vivoColor} strokeWidth="2" className="transition-all duration-300" />
        </>
      )}
      <rect x={x + 15} y={20 + baseH} width={7} height={35} rx={2} fill="rgba(0,0,0,0.18)" />
      <rect x={x + baseW / 3} y={20 + baseH} width={7} height={35} rx={2} fill="rgba(0,0,0,0.18)" />
      <rect x={x + baseW * 2 / 3 - 7} y={20 + baseH} width={7} height={35} rx={2} fill="rgba(0,0,0,0.18)" />
      <rect x={x + baseW - 22} y={20 + baseH} width={7} height={35} rx={2} fill="rgba(0,0,0,0.18)" />
    </svg>
  );
};

const PuffSVG = ({ color, diameter }: { color: string; diameter?: number }) => {
  const r = diameter ? Math.min(90, Math.max(40, (diameter / 50) * 80)) : 80;
  return (
    <svg viewBox="0 0 200 180" className="w-full max-w-[200px] mx-auto">
      <ellipse cx="100" cy="105" rx={r} ry={r * 0.69} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" className="transition-all duration-300" />
      <ellipse cx="100" cy={105 - r * 0.25} rx={r * 0.94} ry={r * 0.22} fill={lighten(color)} className="transition-all duration-300" />
      <ellipse cx="100" cy="155" rx={r * 0.69} ry={6} fill="rgba(0,0,0,0.06)" />
    </svg>
  );
};

const CushionSVG = ({ color, finish, vivoColor, size }: { color: string; finish: string; vivoColor: string; size?: string }) => {
  const isLumbar = size?.includes('lumbar') || size?.includes('50×30');
  const w = isLumbar ? 170 : 160;
  const h = isLumbar ? 100 : 160;
  const xOff = (200 - w) / 2;
  const yOff = (200 - h) / 2;

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
      <rect x={xOff} y={yOff} width={w} height={h} rx={12} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" className="transition-all duration-300" />
      {finish === 'vivo-simple' && (
        <rect x={xOff + 8} y={yOff + 8} width={w - 16} height={h - 16} rx={10} fill="none" stroke={vivoColor} strokeWidth="3" className="transition-all duration-300" />
      )}
      {finish === 'vivo-doble' && (
        <>
          <rect x={xOff + 6} y={yOff + 6} width={w - 12} height={h - 12} rx={10} fill="none" stroke={vivoColor} strokeWidth="2" className="transition-all duration-300" />
          <rect x={xOff + 14} y={yOff + 14} width={w - 28} height={h - 28} rx={10} fill="none" stroke={vivoColor} strokeWidth="2" className="transition-all duration-300" />
        </>
      )}
    </svg>
  );
};

const MesaSVG = ({ color, forma, widthCm, heightCm }: { color: string; forma?: string; widthCm?: number; heightCm?: number }) => {
  // forma: rectangular | cuadrada | redonda
  if (forma === 'redonda') {
    const r = widthCm ? Math.min(85, Math.max(40, (widthCm / 80) * 70)) : 70;
    return (
      <svg viewBox="0 0 200 160" className="w-full max-w-[220px] mx-auto">
        <ellipse cx="100" cy="85" rx={r} ry={r * 0.45} fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" className="transition-all duration-300" />
        <ellipse cx="100" cy={85 - r * 0.18} rx={r * 0.95} ry={r * 0.18} fill={lighten(color)} className="transition-all duration-300" />
        <ellipse cx="100" cy="135" rx={r * 0.7} ry={5} fill="rgba(0,0,0,0.06)" />
      </svg>
    );
  }
  // rectangular / cuadrada
  const baseW = widthCm
    ? Math.min(260, Math.max(100, (widthCm / 100) * 200))
    : forma === 'cuadrada' ? 160 : 220;
  const baseH = forma === 'cuadrada'
    ? baseW * 0.55
    : (heightCm ? Math.min(110, Math.max(40, (heightCm / 50) * 75)) : 70);
  const x = (300 - baseW) / 2;
  const y = 30;
  return (
    <svg viewBox="0 0 300 160" className="w-full max-w-[280px] mx-auto">
      <rect x={x} y={y} width={baseW} height={baseH} rx={6} fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" className="transition-all duration-300" />
      <rect x={x} y={y} width={baseW} height={10} rx={5} fill={lighten(color)} className="transition-all duration-300" />
      {/* legs */}
      <rect x={x + 8} y={y + baseH} width={6} height={40} rx={1.5} fill="rgba(0,0,0,0.35)" />
      <rect x={x + baseW - 14} y={y + baseH} width={6} height={40} rx={1.5} fill="rgba(0,0,0,0.35)" />
    </svg>
  );
};

const ProductSVGPreview = ({ type, color, finish, vivoColor, forma, widthCm, heightCm }: Props) => {
  const vc = vivoColor || darken(color);
  const [opacity, setOpacity] = useState(1);
  const [currentForma, setCurrentForma] = useState(forma);

  useEffect(() => {
    if (forma !== currentForma) {
      setOpacity(0);
      const timer = setTimeout(() => {
        setCurrentForma(forma);
        setOpacity(1);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [forma, currentForma]);

  if (!type) return <EmptyState />;

  return (
    <div className="transition-opacity duration-300" style={{ opacity }}>
      {type === 'cabecero' && <HeadboardSVG color={color} finish={finish} vivoColor={vc} forma={currentForma} widthCm={widthCm} heightCm={heightCm} />}
      {type === 'banco' && <BenchSVG color={color} finish={finish} vivoColor={vc} widthCm={widthCm} heightCm={heightCm} />}
      {type === 'puff' && <PuffSVG color={color} diameter={widthCm} />}
      {type === 'cojin' && <CushionSVG color={color} finish={finish} vivoColor={vc} size={forma} />}
      {type === 'mesa' && <MesaSVG color={color} forma={currentForma} widthCm={widthCm} heightCm={heightCm} />}
    </div>
  );
};

export default ProductSVGPreview;
export { darken };
