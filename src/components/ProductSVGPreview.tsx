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

// Headboard shape paths (viewBox 0 0 300 190)
const headboardPath = (forma: string): string => {
  switch (forma) {
    case 'semicirculo':
      return "M 15 185 L 15 110 Q 150 25 285 110 L 285 185 Z";
    case 'corona-simple':
      return "M 15 185 L 15 115 L 55 115 C 55 95, 70 82, 82 80 C 105 55, 130 38, 150 35 C 170 38, 195 55, 218 80 C 230 82, 245 95, 245 115 L 285 115 L 285 185 Z";
    case 'corona-doble':
      return "M 15 185 L 15 130 C 30 90, 65 35, 110 55 C 130 65, 145 85, 150 95 C 155 85, 170 65, 190 55 C 235 35, 270 90, 285 130 L 285 185 Z";
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
        {(finish === 'vivo-simple' || finish === 'vivo-doble') && (
          <g clipPath={`url(#hb-${clipId})`}>
            <path d={path} fill="none" stroke={vivoColor} strokeWidth={finish === 'vivo-doble' ? 2.5 : 3} />
            {finish === 'vivo-doble' && (
              <path d={path} fill="none" stroke={vivoColor} strokeWidth="2.5"
                style={{ transform: 'scale(0.93)', transformOrigin: '150px 100px' }} />
            )}
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
  const r = diameter ? Math.min(90, Math.max(40, (diameter / 50) * 80)) : 80;
  const scaleY = heightCm ? Math.min(1.4, Math.max(0.7, heightCm / 35)) : 1;
  const clipId = useId();
  const cx = 100, cy = 105;
  const ry = r * 0.69;

  return (
    <svg viewBox="0 0 200 180" className="w-full max-w-[220px] mx-auto">
      <defs>
        <clipPath id={`pf-${clipId}`}>
          <ellipse cx={cx} cy={cy} rx={r} ry={ry} />
        </clipPath>
      </defs>
      <g style={{ transform: `scale(1, ${scaleY})`, transformOrigin: `${cx}px 155px`, transition: 'transform 0.4s ease' }}>
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        <ellipse cx={cx} cy={cy - r * 0.25} rx={r * 0.94} ry={r * 0.22} fill={lighten(color)} />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#pf-${clipId})`}>
            <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        <ellipse cx={cx} cy="155" rx={r * 0.69} ry={6} fill="rgba(0,0,0,0.06)" />
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
    const r = widthCm ? Math.min(85, Math.max(40, (widthCm / 80) * 70)) : 70;
    const cx = 100, cy = 85;
    const ry = r * 0.45;
    return (
      <svg viewBox="0 0 200 160" className="w-full max-w-[220px] mx-auto">
        <defs>
          <clipPath id={`ms-${clipId}`}>
            <ellipse cx={cx} cy={cy} rx={r} ry={ry} />
          </clipPath>
        </defs>
        <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        <ellipse cx={cx} cy={cy - r * 0.18} rx={r * 0.95} ry={r * 0.18} fill={lighten(color)} />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#ms-${clipId})`}>
            <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        <ellipse cx={cx} cy="135" rx={r * 0.7} ry={5} fill="rgba(0,0,0,0.06)" />
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
      <defs>
        <clipPath id={`ms-${clipId}`}>
          <rect x={x} y={y} width={baseW} height={baseH} rx="6" />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={baseW} height={baseH} rx="6" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
      <rect x={x} y={y} width={baseW} height="10" rx="5" fill={lighten(color)} />
      {finish === 'vivo-simple' && (
        <g clipPath={`url(#ms-${clipId})`}>
          <rect x={x} y={y} width={baseW} height={baseH} rx="6" fill="none" stroke={vivoColor} strokeWidth="3" />
        </g>
      )}
      <rect x={x + 8} y={y + baseH} width="6" height="40" rx="1.5" fill="rgba(0,0,0,0.35)" />
      <rect x={x + baseW - 14} y={y + baseH} width="6" height="40" rx="1.5" fill="rgba(0,0,0,0.35)" />
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
