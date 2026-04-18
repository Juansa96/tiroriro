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

const headboardPath = (forma: string): string => {
  switch (forma) {
    case 'semicirculo':
      return "M 15 185 L 15 110 Q 150 25 285 110 L 285 185 Z";
    case 'corona-simple':
      return "M 15 185 L 15 162 C 15 148 88 148 88 108 A 62 57 0 0 1 212 108 C 212 148 285 148 285 162 L 285 185 Z";
    case 'corona-doble':
      return "M 15 185 L 15 164 Q 44 164 44 144 Q 88 144 88 108 A 62 52 0 0 1 212 108 Q 212 144 256 144 Q 256 164 285 164 L 285 185 Z";
    case 'recto':
    default:
      return "M 15 50 L 285 50 L 285 185 L 15 185 Z";
  }
};

const HeadboardSVG = ({ color, finish, vivoColor, forma, widthCm, heightCm }: { color: string; finish: string; vivoColor: string; forma?: string; widthCm?: number; heightCm?: number }) => {
  const f = forma || 'recto';
  const path = headboardPath(f);
  const clipId = useId();
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
  const x = 25, y = 70;
  const w = 250;
  const h = 110;
  const topBand = 55;
  const legW = 62;
  const cornerR = 6;
  const dx = 12, dy = -10;
  const leftLegX = x;
  const rightLegX = x + w - legW;
  const cutTop = y + topBand;
  const frontPath =
    `M ${x + cornerR} ${y} ` +
    `L ${x + w - cornerR} ${y} ` +
    `Q ${x + w} ${y} ${x + w} ${y + cornerR} ` +
    `L ${x + w} ${y + h} ` +
    `L ${rightLegX} ${y + h} ` +
    `L ${rightLegX} ${cutTop} ` +
    `L ${leftLegX + legW} ${cutTop} ` +
    `L ${leftLegX + legW} ${y + h} ` +
    `L ${x} ${y + h} ` +
    `L ${x} ${y + cornerR} ` +
    `Q ${x} ${y} ${x + cornerR} ${y} Z`;
  const topPath = `M ${x} ${y} L ${x + w} ${y} L ${x + w + dx} ${y + dy} L ${x + dx} ${y + dy} Z`;
  const sidePath = `M ${x + w} ${y} L ${x + w + dx} ${y + dy} L ${x + w + dx} ${y + h + dy} L ${x + w} ${y + h} Z`;
  const topColor = lighten(color, 18);
  const sideColor = darken(color, 18);
  return (
    <svg viewBox="0 0 300 230" className="w-full max-w-[300px] mx-auto">
      <defs>
        <clipPath id={`bn-${clipId}`}>
          <path d={frontPath} />
        </clipPath>
      </defs>
      <g style={{ transform: `scale(${scaleX}, ${scaleY})`, transformOrigin: '150px 200px', transition: 'transform 0.4s ease' }}>
        <ellipse cx={150 + dx / 2} cy={y + h + 10} rx={w * 0.45} ry={4} fill="rgba(0,0,0,0.1)" />
        <path d={sidePath} fill={sideColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        <path d={topPath} fill={topColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        <path d={frontPath} fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        <line x1={x + 4} y1={cutTop} x2={x + w - 4} y2={cutTop} stroke={darken(color, 25)} strokeWidth="1" opacity="0.15" />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#bn-${clipId})`}>
            <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        {finish === 'vivo-doble' && (
          <g clipPath={`url(#bn-${clipId})`}>
            <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="2.5" />
          </g>
        )}
      </g>
    </svg>
  );
};

const PuffSVG = ({ color, finish, vivoColor, diameter, heightCm }: { color: string; finish: string; vivoColor: string; diameter?: number; heightCm?: number }) => {
  const scaleY = heightCm ? Math.min(1.4, Math.max(0.7, heightCm / 35)) : 1;
  const scaleX = diameter ? Math.min(1.2, Math.max(0.7, diameter / 50)) : 1;
  const clipId = useId();
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
        <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={adjustedColor} strokeWidth="1.5" opacity="0.3" />
        <line x1={150} y1={y} x2={150} y2={y + h} stroke={adjustedColor} strokeWidth="1.5" opacity="0.3" />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#pf-${clipId})`}>
            <rect x={x} y={y} width={w} height={h} rx={rx} ry={rx} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        <ellipse cx={150} cy={200} rx={w * 0.4} ry={5} fill="rgba(0,0,0,0.08)" />
      </g>
    </svg>
  );
};

const CushionSVG = ({ color, finish, vivoColor, size }: { color: string; finish: string; vivoColor: string; size?: string }) => {
  const isLumbar = size?.includes('lumbar') || size?.includes('50×30');
  const clipId = useId();
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
  const x = 40, y = 40, w = 120, h = 120;
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
        <ellipse cx={cx} cy={cy + 10} rx={rx} ry={ry} fill={darken(color, 25)} />
        <rect x={cx - rx} y={cy} width={rx * 2} height="12" fill={darken(color, 15)} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
        <ellipse cx={cx} cy={cy - ry * 0.4} rx={rx * 0.95} ry={ry * 0.4} fill={lighten(color)} opacity="0.4" />
        {finish === 'vivo-simple' && (
          <g clipPath={`url(#ms-${clipId})`}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
        <rect x={cx - 75} y="100" width="11" height="90" rx="5" fill={darken(color, 40)} />
        <rect x={cx + 64} y="100" width="11" height="90" rx="5" fill={darken(color, 40)} />
        <rect x={cx - 42} y="106" width="11" height="84" rx="5" fill={darken(color, 50)} />
        <rect x={cx + 31} y="106" width="11" height="84" rx="5" fill={darken(color, 50)} />
        <ellipse cx={cx} cy={200} rx={rx * 0.7} ry={5} fill="rgba(0,0,0,0.08)" />
      </svg>
    );
  }
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
      <rect x={x} y={y + baseH - 4} width={baseW} height="10" fill={darken(color, 20)} />
      <rect x={x} y={y} width={baseW} height={baseH} rx="6" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1" style={{ transition: 'fill 0.3s ease' }} />
      <rect x={x} y={y} width={baseW} height="10" rx="5" fill={lighten(color)} opacity="0.4" />
      {finish === 'vivo-simple' && (
        <g clipPath={`url(#ms-${clipId})`}>
          <rect x={x} y={y} width={baseW} height={baseH} rx="6" fill="none" stroke={vivoColor} strokeWidth="3" />
        </g>
      )}
      <rect x={x + 8} y={y + baseH + 5} width="10" height="80" rx="3" fill={darken(color, 40)} />
      <rect x={x + baseW - 18} y={y + baseH + 5} width="10" height="80" rx="3" fill={darken(color, 40)} />
      <rect x={x + 30} y={y + baseH + 8} width="10" height="76" rx="3" fill={darken(color, 50)} />
      <rect x={x + baseW - 40} y={y + baseH + 8} width="10" height="76" rx="3" fill={darken(color, 50)} />
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
