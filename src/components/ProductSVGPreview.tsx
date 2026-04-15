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

const VivoOverlay = ({ x, y, w, h, rx, finish, vivoColor }: { x: number; y: number; w: number; h: number; rx: number; finish: string; vivoColor: string }) => {
  if (finish === 'vivo-simple') {
    return <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx={rx} fill="none" stroke={vivoColor} strokeWidth={3} className="transition-all duration-300" />;
  }
  if (finish === 'vivo-doble') {
    return (
      <>
        <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx={rx} fill="none" stroke={vivoColor} strokeWidth={2} className="transition-all duration-300" />
        <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} rx={rx} fill="none" stroke={vivoColor} strokeWidth={2} className="transition-all duration-300" />
      </>
    );
  }
  return null;
};

const EmptyState = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-[280px] mx-auto">
    <rect x="20" y="30" width="260" height="150" rx="4" fill="#E5E5E5" className="transition-all duration-300" />
    <text x="150" y="110" textAnchor="middle" fontSize="12" fill="#999" className="font-body">Tu pieza aparecerá aquí</text>
    <line x1="10" y1="180" x2="290" y2="180" stroke="hsl(0 0% 13% / 0.1)" strokeWidth="1" />
  </svg>
);

const HeadboardSVG = ({ color, finish, vivoColor, forma, widthCm, heightCm }: { color: string; finish: string; vivoColor: string; forma?: string; widthCm?: number; heightCm?: number }) => {
  // Calculate proportional dimensions
  const baseW = widthCm ? Math.min(290, Math.max(80, (widthCm / 150) * 280)) : 280;
  const baseH = heightCm ? Math.min(175, Math.max(60, (heightCm / 80) * 130)) : 130;
  const x = (300 - baseW) / 2;
  const y = 170 - baseH;

  const renderShape = () => {
    switch (forma) {
      case 'arco':
        return <path d={`M${x},170 L${x},${y + baseH * 0.5} Q${150},${y - 10} ${x + baseW},${y + baseH * 0.5} L${x + baseW},170 Z`} fill={color} className="transition-all duration-400" />;
      case 'alto':
        return <rect x={x + 10} y={10} width={baseW - 20} height={175} rx={3} fill={color} className="transition-all duration-400" />;
      case 'con-patas':
        return (
          <>
            <rect x={x} y={y} width={baseW} height={baseH - 10} rx={3} fill={color} className="transition-all duration-400" />
            <rect x={x + 15} y={y + baseH - 10} width={18} height={38} rx={2} fill={color} className="transition-all duration-400" />
            <rect x={x + baseW - 33} y={y + baseH - 10} width={18} height={38} rx={2} fill={color} className="transition-all duration-400" />
          </>
        );
      default: // recto / rectangular
        return <rect x={x} y={y} width={baseW} height={baseH} rx={3} fill={color} className="transition-all duration-400" />;
    }
  };

  const renderVivo = () => {
    if (forma === 'arco' || forma === 'alto' || forma === 'con-patas') {
      // For non-rect shapes, use simplified vivo
      if (finish === 'vivo-simple') {
        return <rect x={x + 10} y={y + 10} width={baseW - 20} height={baseH - 20} rx={3} fill="none" stroke={vivoColor} strokeWidth={3} className="transition-all duration-300" />;
      }
      if (finish === 'vivo-doble') {
        return (
          <>
            <rect x={x + 8} y={y + 8} width={baseW - 16} height={baseH - 16} rx={3} fill="none" stroke={vivoColor} strokeWidth={2} className="transition-all duration-300" />
            <rect x={x + 16} y={y + 16} width={baseW - 32} height={baseH - 32} rx={3} fill="none" stroke={vivoColor} strokeWidth={2} className="transition-all duration-300" />
          </>
        );
      }
    } else {
      if (finish === 'vivo-simple') {
        return <rect x={x + 10} y={y + 10} width={baseW - 20} height={baseH - 20} rx={3} fill="none" stroke={vivoColor} strokeWidth={3} className="transition-all duration-300" />;
      }
      if (finish === 'vivo-doble') {
        return (
          <>
            <rect x={x + 8} y={y + 8} width={baseW - 16} height={baseH - 16} rx={3} fill="none" stroke={vivoColor} strokeWidth={2} className="transition-all duration-300" />
            <rect x={x + 16} y={y + 16} width={baseW - 32} height={baseH - 32} rx={3} fill="none" stroke={vivoColor} strokeWidth={2} className="transition-all duration-300" />
          </>
        );
      }
    }
    return null;
  };

  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-[280px] mx-auto">
      {renderShape()}
      {renderVivo()}
      <line x1="10" y1="180" x2="290" y2="180" stroke="hsl(0 0% 13% / 0.12)" strokeWidth="1" />
      {widthCm && widthCm > 200 && (
        <text x="150" y="195" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground">{widthCm} cm</text>
      )}
    </svg>
  );
};

const BenchSVG = ({ color, finish, vivoColor }: { color: string; finish: string; vivoColor: string }) => (
  <svg viewBox="0 0 300 130" className="w-full max-w-[280px] mx-auto">
    <rect x="20" y="20" width="260" height="55" rx="4" fill={color} className="transition-all duration-300" />
    <VivoOverlay x={20} y={20} w={260} h={55} rx={4} finish={finish} vivoColor={vivoColor} />
    <rect x="35" y="75" width="7" height="35" rx="2" fill="hsl(0 0% 13% / 0.18)" />
    <rect x="95" y="75" width="7" height="35" rx="2" fill="hsl(0 0% 13% / 0.18)" />
    <rect x="198" y="75" width="7" height="35" rx="2" fill="hsl(0 0% 13% / 0.18)" />
    <rect x="258" y="75" width="7" height="35" rx="2" fill="hsl(0 0% 13% / 0.18)" />
  </svg>
);

const PuffSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 180" className="w-full max-w-[200px] mx-auto">
    <ellipse cx="100" cy="105" rx="80" ry="55" fill={color} className="transition-all duration-300" />
    <ellipse cx="100" cy="85" rx="75" ry="18" fill={lighten(color)} className="transition-all duration-300" />
    <ellipse cx="100" cy="155" rx="55" ry="6" fill="hsl(0 0% 13% / 0.06)" />
  </svg>
);

const CushionSVG = ({ color, finish, vivoColor }: { color: string; finish: string; vivoColor: string }) => (
  <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
    <rect x="20" y="20" width="160" height="160" rx="12" fill={color} className="transition-all duration-300" />
    <VivoOverlay x={20} y={20} w={160} h={160} rx={10} finish={finish} vivoColor={vivoColor} />
  </svg>
);

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
      {type === 'banco' && <BenchSVG color={color} finish={finish} vivoColor={vc} />}
      {type === 'puff' && <PuffSVG color={color} />}
      {type === 'cojin' && <CushionSVG color={color} finish={finish} vivoColor={vc} />}
    </div>
  );
};

export default ProductSVGPreview;
export { darken };
