import { ProductType } from "@/lib/products";
import { useState, useEffect, useId } from "react";

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
    <rect x="20" y="30" width="260" height="150" rx="4" fill="#D4C5A9" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
    <text x="150" y="110" textAnchor="middle" fontSize="12" fill="#999" className="font-body">Tu pieza aparecerá aquí</text>
  </svg>
);

// Headboard shape paths (viewBox 0 0 300 200)
const headboardPath = (forma: string): string => {
  switch (forma) {
    case 'semicirculo':
      return "M 15 185 L 15 110 Q 150 25 285 110 L 285 185 Z";
    case 'corona-simple':
      return "M 10 185 L 10 118 L 52 118 C 52 118 52 100 60 88 C 72 65 100 40 150 28 C 200 40 228 65 240 88 C 248 100 248 118 248 118 L 290 118 L 290 185 Z";
    case 'corona-doble':
      return "M 10 185 L 10 148 C 12 128 22 105 44 98 C 58 92 68 100 72 112 C 73 116 74 120 75 124 C 77 118 82 106 90 94 C 102 70 122 44 150 32 C 178 44 198 70 210 94 C 218 106 223 118 225 124 C 226 120 227 116 228 112 C 232 100 242 92 256 98 C 278 105 288 128 290 148 L 290 185 Z";
    case 'recto':
    default:
      return "M 15 50 L 285 50 L 285 185 L 15 185 Z";
  }
};

const HeadboardSVG = ({ color, finish, vivoColor, forma, widthCm, heightCm }: { color: string; finish: string; vivoColor: string; forma?: string; widthCm?: number; heightCm?: number }) => {
  const f = forma || 'recto';
  const path = headboardPath(f);
  const clipId = useId();

  // Scale based on real measurements
  const scaleX = widthCm ? Math.min(1.25, Math.max(0.75, widthCm / 150)) : 1;
  const scaleY = heightCm ? Math.min(1.25, Math.max(0.7, heightCm / 90)) : 1;

  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-[300px] mx-auto">
      <defs>
        <clipPath id={`hb-${clipId}`}>
          <path d={path} />
        </clipPath>
      </defs>
      <g style={{ transform: `scale(${scaleX}, ${scaleY})`, transformOrigin: '150px 185px', transition: 'transform 0.4s ease' }}>
        <path d={path} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#hb-${clipId})`}>
            <path d={path} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        {finish === 'vivo-doble' && (
          <g clipPath={`url(#hb-${clipId})`}>
            <path d={path} fill="none" stroke={vivoColor} strokeWidth="2.5" />
            <g style={{ transform: 'translate(150px, 100px) scale(0.9) translate(-150px, -100px)' }}>
              <path d={path} fill="none" stroke={vivoColor} strokeWidth="2.5" />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
};

const BenchSVG = ({ color, finish, vivoColor, widthCm, heightCm }: { color: string; finish: string; vivoColor: string; widthCm?: number; heightCm?: number }) => {
  const scaleX = widthCm ? Math.min(1.2, Math.max(0.7, widthCm / 110)) : 1;
  const scaleY = heightCm ? Math.min(1.25, Math.max(0.8, heightCm / 42)) : 1;
  const clipId = useId();
  // Base rect: x=12, y=55, w=276, h=120 (top of seat to bottom)
  const seatPath = "M 12 55 L 288 55 L 288 175 L 12 175 Z";

  return (
    <svg viewBox="0 0 300 230" className="w-full max-w-[300px] mx-auto">
      <defs>
        <clipPath id={`bn-${clipId}`}>
          <path d={seatPath} />
        </clipPath>
      </defs>
      <g style={{ transform: `scale(${scaleX}, ${scaleY})`, transformOrigin: '150px 175px', transition: 'transform 0.4s ease' }}>
        <rect x="12" y="55" width="276" height="120" rx="4" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#bn-${clipId})`}>
            <path d="M 12 55 L 288 55 L 288 175 L 12 175 Z" fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        {finish === 'vivo-doble' && (
          <g clipPath={`url(#bn-${clipId})`}>
            <path d="M 12 55 L 288 55 L 288 175 L 12 175 Z" fill="none" stroke={vivoColor} strokeWidth="2.5" />
            <path d="M 24 67 L 276 67 L 276 163 L 24 163 Z" fill="none" stroke={vivoColor} strokeWidth="2" />
          </g>
        )}
        {/* legs */}
        <rect x="22" y="175" width="7" height="38" rx="2" fill="rgba(0,0,0,0.3)" />
        <rect x="100" y="175" width="7" height="38" rx="2" fill="rgba(0,0,0,0.3)" />
        <rect x="193" y="175" width="7" height="38" rx="2" fill="rgba(0,0,0,0.3)" />
        <rect x="271" y="175" width="7" height="38" rx="2" fill="rgba(0,0,0,0.3)" />
      </g>
    </svg>
  );
};

const PuffSVG = ({ color, finish, vivoColor, diameter, heightCm }: { color: string; finish: string; vivoColor: string; diameter?: number; heightCm?: number }) => {
  const scaleY = heightCm ? Math.min(1.4, Math.max(0.7, heightCm / 35)) : 1;
  const scaleX = diameter ? Math.min(1.2, Math.max(0.7, diameter / 50)) : 1;
  const clipId = useId();
  // Cube/box shape — viewBox 0 0 300 220
  const x = 35, y = 55, w = 230, h = 135, rx = 28;
  const adjustedColor = darken(color, 30);

  return (
    <svg viewBox="0 0 300 220" className="w-full max-w-[260px] mx-auto">
      <defs>
        <clipPath id={`pf-${clipId}`}>
          <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} />
        </clipPath>
      </defs>
      <g style={{ transform: `scale(${scaleX}, ${scaleY})`, transformOrigin: '150px 190px', transition: 'transform 0.4s ease' }}>
        <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        {/* horizontal seam */}
        <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={adjustedColor} strokeWidth="1.5" opacity="0.3" />
        {/* vertical seam */}
        <line x1={150} y1={y} x2={150} y2={y + h} stroke={adjustedColor} strokeWidth="1.5" opacity="0.3" />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#pf-${clipId})`}>
            <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        {/* shadow */}
        <ellipse cx={150} cy={200} rx={w * 0.4} ry={5} fill="rgba(0,0,0,0.08)" />
      </g>
    </svg>
  );
};

const CushionSVG = ({ color, finish, vivoColor, size }: { color: string; finish: string; vivoColor: string; size?: string }) => {
  const isLumbar = size?.includes('lumbar') || size?.includes('50×30');
  const clipId = useId();

  // Determine scale by size selection
  let scaleX = 1, scaleY = 1;
  if (isLumbar) {
    scaleX = 1.15; scaleY = 0.7;
  } else if (size?.startsWith('60')) {
    scaleX = 1.5; scaleY = 1.5;
  } else if (size?.startsWith('50')) {
    scaleX = 1.25; scaleY = 1.25;
  } else if (size?.startsWith('45')) {
    scaleX = 1.12; scaleY = 1.12;
  } else if (size?.startsWith('40')) {
    scaleX = 1; scaleY = 1;
  }

  // Base 120x120 rect centered
  const x = 40, y = 40, w = 120, h = 120;
  const path = `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <defs>
        <clipPath id={`cu-${clipId}`}>
          <rect x={x} y={y} width={w} height={h} rx="12" />
        </clipPath>
      </defs>
      <g style={{ transform: `scale(${scaleX}, ${scaleY})`, transformOrigin: '100px 100px', transition: 'transform 0.4s ease' }}>
        <rect x={x} y={y} width={w} height={h} rx="12" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#cu-${clipId})`}>
            <rect x={x} y={y} width={w} height={h} rx="12" fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        {finish === 'vivo-doble' && (
          <g clipPath={`url(#cu-${clipId})`}>
            <rect x={x} y={y} width={w} height={h} rx="12" fill="none" stroke={vivoColor} strokeWidth="2.5" />
            <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx="9" fill="none" stroke={vivoColor} strokeWidth="2" />
          </g>
        )}
      </g>
    </svg>
  );
};

const MesaSVG = ({ color, finish, vivoColor, forma, widthCm, heightCm }: { color: string; finish: string; vivoColor: string; forma?: string; widthCm?: number; heightCm?: number }) => {
  const clipId = useId();

  if (forma === 'redonda') {
    // Round table: top ellipse + 4 visible legs (viewBox 0 0 300 220)
    const cx = 150, cy = 80;
    const rx = widthCm ? Math.min(125, Math.max(80, (widthCm / 80) * 115)) : 115;
    const ry = 48;
    return (
      <svg viewBox="0 0 300 220" className="w-full max-w-[280px] mx-auto">
        <defs>
          <clipPath id={`ms-${clipId}`}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
          </clipPath>
        </defs>
        {/* Tabletop with thickness */}
        <ellipse cx={cx} cy={cy + 10} rx={rx} ry={ry} fill={darken(color, 25)} />
        <rect x={cx - rx} y={cy} width={rx * 2} height="12" fill={darken(color, 15)} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        <ellipse cx={cx} cy={cy - ry * 0.4} rx={rx * 0.95} ry={ry * 0.4} fill={lighten(color)} opacity="0.4" />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#ms-${clipId})`}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        {/* 4 legs */}
        <rect x={cx - 75} y="100" width="11" height="90" rx="5" fill={darken(color, 40)} />
        <rect x={cx + 64} y="100" width="11" height="90" rx="5" fill={darken(color, 40)} />
        <rect x={cx - 42} y="106" width="11" height="84" rx="5" fill={darken(color, 50)} />
        <rect x={cx + 31} y="106" width="11" height="84" rx="5" fill={darken(color, 50)} />
        {/* shadow */}
        <ellipse cx={cx} cy={200} rx={rx * 0.7} ry={5} fill="rgba(0,0,0,0.08)" />
      </svg>
    );
  }

  // rectangular / cuadrada — viewBox 0 0 300 220
  const baseW = widthCm
    ? Math.min(240, Math.max(120, (widthCm / 100) * 200))
    : forma === 'cuadrada' ? 160 : 220;
  const baseH = forma === 'cuadrada'
    ? baseW * 0.55
    : (heightCm ? Math.min(95, Math.max(45, (heightCm / 50) * 70)) : 70);
  const x = (300 - baseW) / 2;
  const y = 50;

  return (
    <svg viewBox="0 0 300 220" className="w-full max-w-[280px] mx-auto">
      <defs>
        <clipPath id={`ms-${clipId}`}>
          <rect x={x} y={y} width={baseW} height={baseH} rx="6" />
        </clipPath>
      </defs>
      {/* Tabletop with thickness */}
      <rect x={x} y={y + baseH - 4} width={baseW} height="10" fill={darken(color, 20)} />
      <rect x={x} y={y} width={baseW} height={baseH} rx="6" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
      <rect x={x} y={y} width={baseW} height="10" rx="5" fill={lighten(color)} opacity="0.4" />
      {finish === 'vivo-simple' && (
        <g clipPath={`url(#ms-${clipId})`}>
          <rect x={x} y={y} width={baseW} height={baseH} rx="6" fill="none" stroke={vivoColor} strokeWidth="3" />
        </g>
      )}
      {/* 4 legs */}
      <rect x={x + 8} y={y + baseH + 5} width="10" height="80" rx="3" fill={darken(color, 40)} />
      <rect x={x + baseW - 18} y={y + baseH + 5} width="10" height="80" rx="3" fill={darken(color, 40)} />
      <rect x={x + 30} y={y + baseH + 8} width="10" height="76" rx="3" fill={darken(color, 50)} />
      <rect x={x + baseW - 40} y={y + baseH + 8} width="10" height="76" rx="3" fill={darken(color, 50)} />
      {/* shadow */}
      <ellipse cx={150} cy={200} rx={baseW * 0.4} ry={4} fill="rgba(0,0,0,0.08)" />
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
      {type === 'puff' && <PuffSVG color={color} finish={finish} vivoColor={vc} diameter={widthCm} heightCm={heightCm} />}
      {type === 'cojin' && <CushionSVG color={color} finish={finish} vivoColor={vc} size={currentForma} />}
      {type === 'mesa' && <MesaSVG color={color} finish={finish} vivoColor={vc} forma={currentForma} widthCm={widthCm} heightCm={heightCm} />}
    </div>
  );
};

export default ProductSVGPreview;
export { darken };
