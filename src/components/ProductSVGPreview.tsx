import { ProductType } from "@/lib/products";

interface Props {
  type: ProductType | null;
  color: string;
  finish: string;
  vivoColor?: string;
  width?: number;
  height?: number;
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
  if (finish === 'botonadura') {
    const dots = [];
    const cols = 3;
    const rows = 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push(
          <circle
            key={`${r}-${c}`}
            cx={x + w * 0.25 + (c * w * 0.25)}
            cy={y + h * 0.35 + (r * h * 0.35)}
            r={4}
            fill={vivoColor}
            className="transition-all duration-300"
          />
        );
      }
    }
    return <>{dots}</>;
  }
  return null;
};

const EmptyState = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-[280px] mx-auto">
    <rect x="20" y="30" width="260" height="150" rx="4" fill="#E5E5E5" className="transition-all duration-300" />
    <line x1="10" y1="180" x2="290" y2="180" stroke="hsl(0 0% 13% / 0.1)" strokeWidth="1" />
  </svg>
);

const HeadboardSVG = ({ color, finish, vivoColor, shape }: { color: string; finish: string; vivoColor: string; shape?: string }) => {
  const paths: Record<string, string> = {
    rectangular: "M 20 180 L 20 30 Q 20 26 24 26 L 276 26 Q 280 26 280 30 L 280 180 Z",
    semicirculo: "M 20 180 L 20 80 Q 150 -20 280 80 L 280 180 Z",
    'corona-simple': "M 20 180 L 20 60 Q 80 20 150 60 Q 220 20 280 60 L 280 180 Z",
    'corona-doble': "M 20 180 L 20 60 Q 60 20 100 60 Q 140 20 180 60 Q 220 20 260 60 L 280 60 L 280 180 Z",
  };
  const d = paths[shape || 'rectangular'] || paths.rectangular;
  
  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-[280px] mx-auto">
      <path d={d} fill={color} className="transition-all duration-400" />
      {finish === 'vivo-simple' && (
        <path d={d} fill="none" stroke={vivoColor} strokeWidth={3} transform="scale(0.92) translate(12, 10)" className="transition-all duration-300" />
      )}
      {finish === 'vivo-doble' && (
        <>
          <path d={d} fill="none" stroke={vivoColor} strokeWidth={2} transform="scale(0.94) translate(9, 7)" className="transition-all duration-300" />
          <path d={d} fill="none" stroke={vivoColor} strokeWidth={2} transform="scale(0.88) translate(20, 15)" className="transition-all duration-300" />
        </>
      )}
      {finish === 'botonadura' && (
        <>
          {[0, 1].map(r => [0, 1, 2].map(c => (
            <circle key={`${r}-${c}`} cx={80 + c * 70} cy={80 + r * 50} r={4} fill={vivoColor} className="transition-all duration-300" />
          )))}
        </>
      )}
      <line x1="10" y1="180" x2="290" y2="180" stroke="hsl(0 0% 13% / 0.12)" strokeWidth="1" />
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

const TableSVG = ({ color, finish, vivoColor }: { color: string; finish: string; vivoColor: string }) => (
  <svg viewBox="0 0 200 160" className="w-full max-w-[200px] mx-auto">
    <rect x="20" y="20" width="160" height="50" rx="4" fill={color} className="transition-all duration-300" />
    <VivoOverlay x={20} y={20} w={160} h={50} rx={4} finish={finish} vivoColor={vivoColor} />
    <rect x="30" y="70" width="6" height="70" rx="2" fill="hsl(0 0% 13% / 0.18)" />
    <rect x="164" y="70" width="6" height="70" rx="2" fill="hsl(0 0% 13% / 0.18)" />
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

const ProductSVGPreview = ({ type, color, finish, vivoColor }: Props) => {
  const vc = vivoColor || darken(color);
  
  if (!type) return <EmptyState />;
  
  switch (type) {
    case 'cabecero':
      return <HeadboardSVG color={color} finish={finish} vivoColor={vc} />;
    case 'banco':
      return <BenchSVG color={color} finish={finish} vivoColor={vc} />;
    case 'mesita':
      return <TableSVG color={color} finish={finish} vivoColor={vc} />;
    case 'puff':
      return <PuffSVG color={color} />;
    case 'cojin':
      return <CushionSVG color={color} finish={finish} vivoColor={vc} />;
    default:
      return <EmptyState />;
  }
};

export default ProductSVGPreview;
export { darken };
