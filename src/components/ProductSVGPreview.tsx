import { FABRIC_COLORS, HEADBOARD_SHAPES, ProductType } from "@/lib/products";

interface Props {
  type: ProductType;
  options: Record<string, string>;
}

const getColor = (colorId: string) => FABRIC_COLORS.find(c => c.id === colorId)?.hex || '#E8DCC8';
const getStrokeForFinish = (finish: string) => {
  if (finish === 'vivo-simple') return 1;
  if (finish === 'vivo-doble') return 2;
  return 0;
};

const HeadboardSVG = ({ shape, color, finish }: { shape: string; color: string; finish: number }) => {
  const paths: Record<string, string> = {
    rectangular: "M 20 180 L 20 30 L 280 30 L 280 180",
    semicirculo: "M 20 180 L 20 80 Q 150 -20 280 80 L 280 180",
    'corona-simple': "M 20 180 L 20 60 Q 80 20 150 60 Q 220 20 280 60 L 280 180",
    'corona-doble': "M 20 180 L 20 60 Q 60 20 100 60 Q 140 20 180 60 Q 220 20 260 60 L 280 60 L 280 180",
  };
  const d = paths[shape] || paths.rectangular;
  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-[300px] mx-auto">
      <path d={d + " Z"} fill={color} stroke={finish > 0 ? darken(color) : 'none'} strokeWidth={finish > 0 ? 3 : 0} style={{ transition: 'fill 0.3s ease, d 0.4s ease' }} />
      {finish === 2 && <path d={d + " Z"} fill="none" stroke={darken(color)} strokeWidth={1.5} strokeDasharray="none" transform="translate(0, -4)" style={{ transition: 'd 0.4s ease' }} />}
      {/* Bed line */}
      <line x1="10" y1="180" x2="290" y2="180" stroke="hsl(0 0% 13% / 0.15)" strokeWidth="1" />
    </svg>
  );
};

const BenchSVG = ({ color, finish }: { color: string; finish: number }) => (
  <svg viewBox="0 0 300 120" className="w-full max-w-[300px] mx-auto">
    <rect x="20" y="20" width="260" height="60" rx="4" fill={color} stroke={finish > 0 ? darken(color) : 'none'} strokeWidth={finish > 0 ? 3 : 0} style={{ transition: 'fill 0.3s ease' }} />
    {finish === 2 && <rect x="24" y="24" width="252" height="52" rx="3" fill="none" stroke={darken(color)} strokeWidth={1.5} />}
    {/* Legs */}
    <rect x="40" y="80" width="8" height="30" rx="1" fill="hsl(0 0% 13% / 0.2)" />
    <rect x="252" y="80" width="8" height="30" rx="1" fill="hsl(0 0% 13% / 0.2)" />
  </svg>
);

const TableSVG = ({ color, finish, skirt }: { color: string; finish: number; skirt: string }) => (
  <svg viewBox="0 0 300 140" className="w-full max-w-[300px] mx-auto">
    <rect x="20" y="20" width="260" height="50" rx="4" fill={color} stroke={finish > 0 ? darken(color) : 'none'} strokeWidth={finish > 0 ? 3 : 0} style={{ transition: 'fill 0.3s ease' }} />
    {finish === 2 && <rect x="24" y="24" width="252" height="42" rx="3" fill="none" stroke={darken(color)} strokeWidth={1.5} />}
    {skirt === 'Entelado' ? (
      <>
        <rect x="20" y="70" width="8" height="55" fill={color} style={{ transition: 'fill 0.3s ease' }} />
        <rect x="272" y="70" width="8" height="55" fill={color} style={{ transition: 'fill 0.3s ease' }} />
        <rect x="20" y="120" width="260" height="8" fill={color} style={{ transition: 'fill 0.3s ease' }} />
      </>
    ) : (
      <>
        <rect x="35" y="70" width="6" height="55" rx="1" fill="hsl(0 0% 13% / 0.2)" />
        <rect x="259" y="70" width="6" height="55" rx="1" fill="hsl(0 0% 13% / 0.2)" />
      </>
    )}
  </svg>
);

const CushionSVG = ({ color, finish, shape }: { color: string; finish: number; shape: string }) => {
  const isRect = shape === 'Rectangular';
  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-[240px] mx-auto">
      <rect x={isRect ? 30 : 60} y="30" width={isRect ? 240 : 180} height={isRect ? 120 : 140} rx="8" fill={color} stroke={finish > 0 ? darken(color) : 'none'} strokeWidth={finish > 0 ? 3 : 0} style={{ transition: 'fill 0.3s ease' }} />
      {finish === 2 && <rect x={isRect ? 35 : 65} y="35" width={isRect ? 230 : 170} height={isRect ? 110 : 130} rx="6" fill="none" stroke={darken(color)} strokeWidth={1.5} />}
    </svg>
  );
};

const PuffSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 180" className="w-full max-w-[200px] mx-auto">
    <ellipse cx="100" cy="100" rx="80" ry="60" fill={color} style={{ transition: 'fill 0.3s ease' }} />
    <ellipse cx="100" cy="90" rx="75" ry="20" fill={lighten(color)} style={{ transition: 'fill 0.3s ease' }} />
    <ellipse cx="100" cy="155" rx="60" ry="8" fill="hsl(0 0% 13% / 0.08)" />
  </svg>
);

function darken(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`;
}

function lighten(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`;
}

const ProductSVGPreview = ({ type, options }: Props) => {
  const color = getColor(options.color);
  const finish = getStrokeForFinish(options.finish);

  return (
    <div className="rounded-lg p-8 flex flex-col items-center justify-center" style={{ backgroundColor: '#F5F0E8' }}>
      {type === 'cabecero' && <HeadboardSVG shape={options.shape} color={color} finish={finish} />}
      {type === 'banco' && <BenchSVG color={color} finish={finish} />}
      {type === 'mesita' && <TableSVG color={color} finish={finish} skirt={options.skirt} />}
      {type === 'cojin' && <CushionSVG color={color} finish={finish} shape={options.cushionShape} />}
      {type === 'puff' && <PuffSVG color={color} />}
      <p className="mt-4 font-serif text-sm text-muted-foreground italic">Así se vería el tuyo</p>
    </div>
  );
};

export default ProductSVGPreview;
