import { ProductType } from "@/lib/products";
import { useId } from "react";

interface Props {
  type: ProductType | null;
  color: string;
  fabricImage?: string;
  lateralFabricImage?: string;
  finish: string;
  vivoColor?: string;
  width?: number;
  height?: number;
  forma?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const scaleRange = (value: number | undefined, inputMin: number, inputMax: number, outputMin: number, outputMax: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return (outputMin + outputMax) / 2;
  }
  const ratio = (value - inputMin) / (inputMax - inputMin);
  const scaled = outputMin + ratio * (outputMax - outputMin);
  return clamp(scaled, Math.min(outputMin, outputMax), Math.max(outputMin, outputMax));
};

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
    <text x="150" y="110" textAnchor="middle" fontSize="12" fill="#999" className="font-body">
      Tu pieza aparecerá aquí
    </text>
  </svg>
);

const TexturePattern = ({
  id,
  image,
  color,
  tile = 18,
}: {
  id: string;
  image?: string;
  color: string;
  tile?: number;
}) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={tile} height={tile}>
    <rect width={tile} height={tile} fill={color} />
    {image ? (
      <image
        href={image}
        x="0"
        y="0"
        width={tile}
        height={tile}
        preserveAspectRatio="none"
      />
    ) : null}
  </pattern>
);

const patternFill = (patternId: string, fallback: string) => `url(#${patternId})`;

const headboardSelectorPath = (forma: string) => {
  switch (forma) {
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

const headboardCorners = (forma: string): [[number, number], [number, number]] => {
  switch (forma) {
    case "semicirculo": return [[15, 110], [285, 110]];
    case "corona-simple":
    case "corona-doble":
    case "corona-triple": return [[15, 120], [285, 120]];
    case "recto":
    default: return [[15, 50], [285, 50]];
  }
};

const headboardTopFacePath = (forma: string, dx: number, dy: number): string => {
  switch (forma) {
    case "semicirculo":
      return `M 15 110 Q 150 25 285 110 L ${285+dx} ${110+dy} Q ${150+dx} ${25+dy} ${15+dx} ${110+dy} Z`;
    case "corona-simple":
      return (
        `M 15 120 C 68 120 90 100 94 84 A 56 16 0 0 1 206 84 C 210 100 232 120 285 120 ` +
        `L ${285+dx} ${120+dy} ` +
        `C ${232+dx} ${120+dy} ${210+dx} ${100+dy} ${206+dx} ${84+dy} ` +
        `A 56 16 0 0 0 ${94+dx} ${84+dy} ` +
        `C ${90+dx} ${100+dy} ${68+dx} ${120+dy} ${15+dx} ${120+dy} Z`
      );
    case "corona-doble":
      return (
        `M 15 120 Q 57 120 57 99 Q 99 99 99 78 A 51 22 0 0 1 201 78 Q 201 99 243 99 Q 243 120 285 120 ` +
        `L ${285+dx} ${120+dy} ` +
        `Q ${243+dx} ${120+dy} ${243+dx} ${99+dy} ` +
        `Q ${201+dx} ${99+dy} ${201+dx} ${78+dy} ` +
        `A 51 22 0 0 0 ${99+dx} ${78+dy} ` +
        `Q ${99+dx} ${99+dy} ${57+dx} ${99+dy} ` +
        `Q ${57+dx} ${120+dy} ${15+dx} ${120+dy} Z`
      );
    case "corona-triple":
      return (
        `M 15 120 Q 43 120 43 106 Q 71 106 71 92 Q 99 92 99 78 A 51 22 0 0 1 201 78 Q 201 92 229 92 Q 229 106 257 106 Q 257 120 285 120 ` +
        `L ${285+dx} ${120+dy} ` +
        `Q ${257+dx} ${120+dy} ${257+dx} ${106+dy} ` +
        `Q ${229+dx} ${106+dy} ${229+dx} ${92+dy} ` +
        `Q ${201+dx} ${92+dy} ${201+dx} ${78+dy} ` +
        `A 51 22 0 0 0 ${99+dx} ${78+dy} ` +
        `Q ${99+dx} ${92+dy} ${71+dx} ${92+dy} ` +
        `Q ${71+dx} ${106+dy} ${43+dx} ${106+dy} ` +
        `Q ${43+dx} ${120+dy} ${15+dx} ${120+dy} Z`
      );
    case "recto":
    default:
      return `M 15 50 L 285 50 L ${285+dx} ${50+dy} L ${15+dx} ${50+dy} Z`;
  }
};

const headboardPath = (forma: string, bottomY: number) => {
  switch (forma) {
    case "semicirculo":
      return `M 15 ${bottomY} L 15 110 Q 150 25 285 110 L 285 ${bottomY} Z`;
    case "corona-simple":
      return `M 15 ${bottomY} L 15 120 C 68 120 90 100 94 84 A 56 16 0 0 1 206 84 C 210 100 232 120 285 120 L 285 ${bottomY} Z`;
    case "corona-doble":
      return `M 15 ${bottomY} L 15 120 Q 57 120 57 99 Q 99 99 99 78 A 51 22 0 0 1 201 78 Q 201 99 243 99 Q 243 120 285 120 L 285 ${bottomY} Z`;
    case "corona-triple":
      return `M 15 ${bottomY} L 15 120 Q 43 120 43 106 Q 71 106 71 92 Q 99 92 99 78 A 51 22 0 0 1 201 78 Q 201 92 229 92 Q 229 106 257 106 Q 257 120 285 120 L 285 ${bottomY} Z`;
    case "recto":
    default:
      return `M 15 ${bottomY} L 15 50 L 285 50 L 285 ${bottomY} Z`;
  }
};

const HeadboardSVG = ({
  color,
  fabricImage,
  lateralFabricImage,
  finish,
  vivoColor,
  forma,
  widthCm,
  heightCm,
}: {
  color: string;
  fabricImage?: string;
  lateralFabricImage?: string;
  finish: string;
  vivoColor: string;
  forma?: string;
  widthCm?: number;
  heightCm?: number;
}) => {
  const shape = forma || "recto";
  const patternId = useId();
  const lateralPatternId = useId();
  const clipId = useId();
  const scaleX = scaleRange(widthCm, 90, 200, 0.72, 1.02);
  const heightScale = scaleRange(heightCm, 100, 130, 0.82, 1.12);
  const bottomY = 188;
  const dx = 8;
  const dy = -5;
  const frontPath = headboardPath(shape, bottomY);
  const [firstTop, lastTop] = headboardCorners(shape);
  const topFacePath = headboardTopFacePath(shape, dx, dy);
  const leftSidePath = `M 15 ${bottomY} L ${firstTop[0]} ${firstTop[1]} L ${firstTop[0] + dx} ${firstTop[1] + dy} L ${15 + dx} ${bottomY + dy} Z`;
  const rightSidePath = `M 285 ${bottomY} L ${lastTop[0]} ${lastTop[1]} L ${lastTop[0] + dx} ${lastTop[1] + dy} L ${285 + dx} ${bottomY + dy} Z`;
  const topColor = lighten(color, 16);
  const sideColor = darken(color, 18);

  return (
    <svg viewBox="0 0 330 220" className="w-full max-w-[320px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={18} />
        <TexturePattern id={lateralPatternId} image={lateralFabricImage || fabricImage} color={color} tile={18} />
        <clipPath id={`hb-${clipId}`}>
          <path d={frontPath} />
        </clipPath>
      </defs>

      <g
        style={{
          transform: `scale(${scaleX}, ${heightScale})`,
          transformOrigin: "150px 186px",
          transition: "transform 0.4s ease",
        }}
      >
        <ellipse cx="160" cy="203" rx="118" ry="8" fill="rgba(0,0,0,0.08)" />
        <path
          d={frontPath}
          transform={`translate(${dx} ${dy})`}
          fill={patternFill(lateralPatternId, darken(color, 20))}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1"
        />
        <path
          d={frontPath}
          transform={`translate(${dx} ${dy})`}
          fill="rgba(0,0,0,0.10)"
        />
        <path d={topFacePath} fill={patternFill(lateralPatternId, topColor)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        <path d={topFacePath} fill="rgba(255,255,255,0.12)" />
        <path d={leftSidePath} fill={patternFill(lateralPatternId, sideColor)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        <path d={leftSidePath} fill="rgba(0,0,0,0.08)" />
        <path d={rightSidePath} fill={patternFill(lateralPatternId, darken(color, 24))} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        <path d={rightSidePath} fill="rgba(0,0,0,0.12)" />
        {finish === "vivo-doble" && (
          <path d={frontPath} transform={`translate(${dx} ${dy})`} fill="none" stroke={vivoColor} strokeWidth="2.2" strokeLinejoin="round" />
        )}
        <path d={frontPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />

        {finish === "vivo-simple" && (
          <g clipPath={`url(#hb-${clipId})`}>
            <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="3" strokeLinejoin="round" />
          </g>
        )}
        {finish === "vivo-doble" && (
          <g clipPath={`url(#hb-${clipId})`}>
            <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="2.6" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </svg>
  );
};

const BenchSVG = ({
  color,
  fabricImage,
  finish,
  vivoColor,
  variant,
  widthCm,
  heightCm,
  depthCm,
}: {
  color: string;
  fabricImage?: string;
  finish: string;
  vivoColor: string;
  variant?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
}) => {
  const mode = variant || "madera";
  const patternId = useId();
  const clipId = useId();
  const scaleX = scaleRange(widthCm, 40, 120, 0.72, 1.16);
  const scaleY = scaleRange(heightCm, 30, 50, 0.8, 1.14);
  const depthX = scaleRange(depthCm, 30, 70, 14, 28);
  const depthY = -depthX * 0.75;

  const seatX = 52;
  const seatY = mode === "baul" ? 66 : 60;
  const seatW = 190;
  const seatH = mode === "baul" ? 92 : 48;
  const seatTop = `M ${seatX} ${seatY} L ${seatX + seatW} ${seatY} L ${seatX + seatW + depthX} ${seatY + depthY} L ${seatX + depthX} ${seatY + depthY} Z`;
  const seatSide = `M ${seatX + seatW} ${seatY} L ${seatX + seatW + depthX} ${seatY + depthY} L ${seatX + seatW + depthX} ${seatY + seatH + depthY} L ${seatX + seatW} ${seatY + seatH} Z`;
  const seatFrontRect = `M ${seatX + 8} ${seatY} H ${seatX + seatW - 8} Q ${seatX + seatW} ${seatY} ${seatX + seatW} ${seatY + 8} V ${seatY + seatH} H ${seatX} V ${seatY + 8} Q ${seatX} ${seatY} ${seatX + 8} ${seatY} Z`;

  const openLegW = 38;
  const cutTop = seatY + 52;
  const uFrontPath =
    `M ${seatX + 8} ${seatY} H ${seatX + seatW - 8} Q ${seatX + seatW} ${seatY} ${seatX + seatW} ${seatY + 8} ` +
    `V ${seatY + 112} H ${seatX + seatW - openLegW} V ${cutTop} H ${seatX + openLegW} V ${seatY + 112} H ${seatX} V ${seatY + 8} ` +
    `Q ${seatX} ${seatY} ${seatX + 8} ${seatY} Z`;
  const rightOuterSide = `M ${seatX + seatW} ${seatY} L ${seatX + seatW + depthX} ${seatY + depthY} L ${seatX + seatW + depthX} ${seatY + 112 + depthY} L ${seatX + seatW} ${seatY + 112} Z`;
  const innerLeftSide = `M ${seatX + openLegW} ${cutTop} L ${seatX + openLegW + depthX} ${cutTop + depthY} L ${seatX + openLegW + depthX} ${seatY + 112 + depthY} L ${seatX + openLegW} ${seatY + 112} Z`;
  const innerRightSide = `M ${seatX + seatW - openLegW} ${cutTop} L ${seatX + seatW - openLegW + depthX} ${cutTop + depthY} L ${seatX + seatW - openLegW + depthX} ${seatY + 112 + depthY} L ${seatX + seatW - openLegW} ${seatY + 112} Z`;

  const seatTopColor = lighten(color, 14);
  const seatSideColor = darken(color, 18);

  return (
    <svg viewBox="0 0 320 230" className="w-full max-w-[300px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={18} />
        <clipPath id={`bn-${clipId}`}>
          <path d={mode === "baul" ? seatFrontRect : uFrontPath} />
        </clipPath>
      </defs>

      <g
        style={{
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "150px 190px",
          transition: "transform 0.4s ease",
        }}
      >
        <ellipse cx={157} cy={204} rx={110} ry={8} fill="rgba(0,0,0,0.08)" />

        {(mode === "madera" || mode === "enteladas") && (
          <>
            <path d={seatTop} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={seatTop} fill="rgba(255,255,255,0.12)" />
            <path d={rightOuterSide} fill={patternFill(patternId, seatSideColor)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={rightOuterSide} fill="rgba(0,0,0,0.10)" />
            <path d={innerLeftSide} fill={patternFill(patternId, darken(color, 14))} stroke="rgba(0,0,0,0.14)" strokeWidth="1" />
            <path d={innerLeftSide} fill="rgba(0,0,0,0.08)" />
            <path d={innerRightSide} fill={patternFill(patternId, darken(color, 16))} stroke="rgba(0,0,0,0.14)" strokeWidth="1" />
            <path d={innerRightSide} fill="rgba(0,0,0,0.10)" />
            <path d={uFrontPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
          </>
        )}

        {mode === "baul" && (
          <>
            <path d={seatTop} fill={patternFill(patternId, seatTopColor)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={seatTop} fill="rgba(255,255,255,0.12)" />
            <path d={seatSide} fill={patternFill(patternId, seatSideColor)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={seatSide} fill="rgba(0,0,0,0.10)" />
            <path d={seatFrontRect} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={`M ${seatX + seatW / 2 - 16} ${seatY + 42} Q ${seatX + seatW / 2} ${seatY + 54} ${seatX + seatW / 2 + 16} ${seatY + 42}`} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}

        {finish === "vivo-simple" && (
          <g clipPath={`url(#bn-${clipId})`}>
            <path d={mode === "baul" ? seatFrontRect : uFrontPath} fill="none" stroke={vivoColor} strokeWidth="3" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </svg>
  );
};

const PuffSVG = ({
  color,
  fabricImage,
  finish,
  vivoColor,
  forma,
  widthCm,
  depthCm,
  heightCm,
}: {
  color: string;
  fabricImage?: string;
  finish: string;
  vivoColor: string;
  forma?: string;
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
}) => {
  const isCircular = forma === "circular";
  const patternId = useId();
  const clipId = useId();

  if (isCircular) {
    const topRx = scaleRange(widthCm, 40, 100, 52, 84);
    const topRy = clamp(topRx * 0.28, 18, 28);
    const bodyH = scaleRange(heightCm, 30, 50, 62, 112);
    const topCx = 150;
    const topCy = 72;
    const bodyTop = topCy;
    const bodyBottom = topCy + bodyH;
    return (
      <svg viewBox="0 0 300 230" className="w-full max-w-[260px] mx-auto">
        <defs>
          <TexturePattern id={patternId} image={fabricImage} color={color} tile={16} />
          <clipPath id={`pf-${clipId}`}>
            <path
              d={`M ${topCx - topRx} ${bodyTop} A ${topRx} ${topRy} 0 0 1 ${topCx + topRx} ${bodyTop} L ${topCx + topRx} ${bodyBottom} A ${topRx} ${topRy} 0 0 1 ${topCx - topRx} ${bodyBottom} Z`}
            />
          </clipPath>
        </defs>
        <ellipse cx={150} cy={bodyBottom + 16} rx={topRx * 0.82} ry={8} fill="rgba(0,0,0,0.08)" />
        <path
          d={`M ${topCx - topRx} ${bodyTop} A ${topRx} ${topRy} 0 0 1 ${topCx + topRx} ${bodyTop} L ${topCx + topRx} ${bodyBottom} A ${topRx} ${topRy} 0 0 1 ${topCx - topRx} ${bodyBottom} Z`}
          fill={patternFill(patternId, color)}
          stroke="rgba(0,0,0,0.16)"
          strokeWidth="1"
        />
        <ellipse cx={150} cy={bodyTop} rx={topRx} ry={topRy} fill={patternFill(patternId, color)} />
        <ellipse cx={150} cy={bodyTop} rx={topRx} ry={topRy} fill="rgba(255,255,255,0.14)" />
        <ellipse cx={168} cy={bodyTop + bodyH * 0.5} rx={topRx * 0.18} ry={bodyH * 0.36} fill="rgba(255,255,255,0.12)" />
        <ellipse cx={150} cy={bodyBottom} rx={topRx} ry={topRy} fill={darken(color, 12)} opacity="0.18" />
        {finish === "vivo-simple" && (
          <g clipPath={`url(#pf-${clipId})`}>
            <path
              d={`M ${topCx - topRx} ${bodyTop} A ${topRx} ${topRy} 0 0 1 ${topCx + topRx} ${bodyTop} L ${topCx + topRx} ${bodyBottom} A ${topRx} ${topRy} 0 0 1 ${topCx - topRx} ${bodyBottom} Z`}
              fill="none"
              stroke={vivoColor}
              strokeWidth="3"
            />
          </g>
        )}
      </svg>
    );
  }

  const baseW = scaleRange(widthCm, 40, 120, 112, 190);
  const baseH = scaleRange(heightCm, 30, 50, 72, 118);
  const depthX = scaleRange(depthCm, 30, 70, 14, 26);
  const depthY = -depthX * 0.7;
  const x = (300 - baseW) / 2;
  const y = 72;
  const frontPath = `M ${x + 10} ${y} H ${x + baseW - 10} Q ${x + baseW} ${y} ${x + baseW} ${y + 10} V ${y + baseH - 10} Q ${x + baseW} ${y + baseH} ${x + baseW - 10} ${y + baseH} H ${x + 10} Q ${x} ${y + baseH} ${x} ${y + baseH - 10} V ${y + 10} Q ${x} ${y} ${x + 10} ${y} Z`;
  const topPath = `M ${x} ${y} L ${x + baseW} ${y} L ${x + baseW + depthX} ${y + depthY} L ${x + depthX} ${y + depthY} Z`;
  const sidePath = `M ${x + baseW} ${y} L ${x + baseW + depthX} ${y + depthY} L ${x + baseW + depthX} ${y + baseH + depthY} L ${x + baseW} ${y + baseH} Z`;

  return (
    <svg viewBox="0 0 320 230" className="w-full max-w-[270px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={18} />
        <clipPath id={`pf-${clipId}`}>
          <path d={frontPath} />
        </clipPath>
      </defs>
      <ellipse cx={158} cy={y + baseH + 14} rx={baseW * 0.45} ry={8} fill="rgba(0,0,0,0.08)" />
      <path d={topPath} fill={patternFill(patternId, lighten(color, 16))} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
      <path d={topPath} fill="rgba(255,255,255,0.12)" />
      <path d={sidePath} fill={patternFill(patternId, darken(color, 18))} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
      <path d={sidePath} fill="rgba(0,0,0,0.10)" />
      <path d={frontPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
      {finish === "vivo-simple" && (
        <g clipPath={`url(#pf-${clipId})`}>
          <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="3" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};

const CushionSVG = ({
  color,
  fabricImage,
  finish,
  vivoColor,
  shape,
  widthCm,
  heightCm,
}: {
  color: string;
  fabricImage?: string;
  finish: string;
  vivoColor: string;
  shape?: string;
  widthCm?: number;
  heightCm?: number;
}) => {
  const kind = shape || "cuadrada";
  const patternId = useId();
  const clipId = useId();

  if (kind === "cilindro") {
    const length = scaleRange(widthCm, 30, 100, 140, 240);
    const radius = scaleRange(heightCm, 15, 50, 22, 40);
    const x = (300 - length) / 2;
    const y = 72;
    return (
      <svg viewBox="0 0 300 180" className="w-full max-w-[300px] mx-auto">
        <defs>
          <TexturePattern id={patternId} image={fabricImage} color={color} tile={16} />
          <clipPath id={`cy-${clipId}`}>
            <rect x={x} y={y} width={length} height={radius * 2} rx={radius} />
          </clipPath>
        </defs>
        <ellipse cx="150" cy={y + radius * 2 + 14} rx={length * 0.38} ry="8" fill="rgba(0,0,0,0.08)" />
        <rect x={x} y={y} width={length} height={radius * 2} rx={radius} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.14)" strokeWidth="1" />
        <ellipse cx={x + 12} cy={y + radius} rx={12} ry={radius * 0.88} fill={darken(color, 18)} opacity="0.18" />
        <ellipse cx={x + length - 12} cy={y + radius} rx={12} ry={radius * 0.88} fill={darken(color, 20)} opacity="0.18" />
        {finish === "vivo-simple" && (
          <g clipPath={`url(#cy-${clipId})`}>
            <rect x={x} y={y} width={length} height={radius * 2} rx={radius} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
      </svg>
    );
  }

  if (kind === "rectangular") {
    const scaleX = scaleRange(widthCm, 30, 80, 1.05, 1.8);
    const scaleY = scaleRange(heightCm, 20, 60, 0.55, 1.05);
    const outerPath =
      "M 42 54 Q 100 40 158 54 Q 170 54 170 66 Q 178 100 170 134 Q 170 146 158 146 Q 100 160 42 146 Q 30 146 30 134 Q 22 100 30 66 Q 30 54 42 54 Z";
    const innerPath =
      "M 48 60 Q 100 50 152 60 Q 162 60 162 70 Q 168 100 162 130 Q 162 140 152 140 Q 100 150 48 140 Q 38 140 38 130 Q 32 100 38 70 Q 38 60 48 60 Z";
    return (
      <svg viewBox="0 0 200 200" className="w-full max-w-[230px] mx-auto">
        <defs>
          <TexturePattern id={patternId} image={fabricImage} color={color} tile={16} />
          <clipPath id={`cu-${clipId}`}>
            <path d={outerPath} />
          </clipPath>
        </defs>
        <g
          style={{
            transform: `scale(${scaleX}, ${scaleY})`,
            transformOrigin: "100px 100px",
            transition: "transform 0.4s ease",
          }}
        >
          <ellipse cx="102" cy="108" rx="70" ry="42" fill="rgba(0,0,0,0.07)" />
          <path d={outerPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          <path d={innerPath} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
          {finish === "vivo-simple" && (
            <g clipPath={`url(#cu-${clipId})`}>
              <path d={outerPath} fill="none" stroke={vivoColor} strokeWidth="3" />
            </g>
          )}
        </g>
      </svg>
    );
  }

  const scaleX = scaleRange(widthCm, 30, 80, 0.9, 1.45);
  const scaleY = scaleRange(heightCm, 20, 80, 0.7, 1.35);
  const outerPath =
    "M 52 40 Q 100 28 148 40 Q 164 40 164 56 Q 174 100 164 144 Q 164 160 148 160 Q 100 172 52 160 Q 36 160 36 144 Q 26 100 36 56 Q 36 40 52 40 Z";
  const innerPath =
    "M 58 48 Q 100 38 142 48 Q 154 48 154 60 Q 162 100 154 140 Q 154 152 142 152 Q 100 162 58 152 Q 46 152 46 140 Q 38 100 46 60 Q 46 48 58 48 Z";

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={16} />
        <clipPath id={`cu-${clipId}`}>
          <path d={outerPath} />
        </clipPath>
      </defs>
      <g
        style={{
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "100px 100px",
          transition: "transform 0.4s ease",
        }}
      >
        <ellipse cx="102" cy="108" rx="64" ry="58" fill="rgba(0,0,0,0.07)" />
        <path d={outerPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
        <path d={innerPath} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
        {finish === "vivo-simple" && (
          <g clipPath={`url(#cu-${clipId})`}>
            <path d={outerPath} fill="none" stroke={vivoColor} strokeWidth="3" />
          </g>
        )}
      </g>
    </svg>
  );
};

const MesaSVG = ({
  color,
  fabricImage,
  finish,
  vivoColor,
  variant,
  widthCm,
  heightCm,
  depthCm,
}: {
  color: string;
  fabricImage?: string;
  finish: string;
  vivoColor: string;
  variant?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
}) => {
  const mode = variant || "tipo-puff";
  const patternId = useId();
  const clipId = useId();
  const baseW = scaleRange(widthCm, 50, 120, 150, 230);
  const baseH = scaleRange(heightCm, 30, 50, 44, 82);
  const depthX = scaleRange(depthCm, 30, 70, 16, 28);
  const depthY = -depthX * 0.72;
  const x = (300 - baseW) / 2;
  const y = 62;
  const frontPath = `M ${x + 8} ${y} H ${x + baseW - 8} Q ${x + baseW} ${y} ${x + baseW} ${y + 8} V ${y + baseH - 8} Q ${x + baseW} ${y + baseH} ${x + baseW - 8} ${y + baseH} H ${x + 8} Q ${x} ${y + baseH} ${x} ${y + baseH - 8} V ${y + 8} Q ${x} ${y} ${x + 8} ${y} Z`;
  const topPath = `M ${x} ${y} L ${x + baseW} ${y} L ${x + baseW + depthX} ${y + depthY} L ${x + depthX} ${y + depthY} Z`;
  const sidePath = `M ${x + baseW} ${y} L ${x + baseW + depthX} ${y + depthY} L ${x + baseW + depthX} ${y + baseH + depthY} L ${x + baseW} ${y + baseH} Z`;

  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-[290px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={18} />
        <clipPath id={`ms-${clipId}`}>
          <path d={frontPath} />
        </clipPath>
      </defs>
      <ellipse cx="158" cy={y + baseH + 72} rx={baseW * 0.38} ry={8} fill="rgba(0,0,0,0.08)" />

      {mode === "tipo-puff" ? (
        <>
          <path d={topPath} fill={patternFill(patternId, lighten(color, 14))} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
          <path d={topPath} fill="rgba(255,255,255,0.12)" />
          <path d={sidePath} fill={patternFill(patternId, darken(color, 18))} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
          <path d={sidePath} fill="rgba(0,0,0,0.10)" />
          <path d={frontPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
        </>
      ) : (
        <>
          <path d={topPath} fill={patternFill(patternId, lighten(color, 14))} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
          <path d={topPath} fill="rgba(255,255,255,0.12)" />
          <path d={sidePath} fill={patternFill(patternId, darken(color, 18))} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
          <path d={sidePath} fill="rgba(0,0,0,0.10)" />
          <path d={frontPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
          <path d={`M ${x + 10} ${y + baseH} V ${y + baseH + 70} H ${x + 58} V ${y + 30 + baseH} H ${x + baseW - 58} V ${y + baseH + 70} H ${x + baseW - 10} V ${y + baseH} Z`} fill={darken(color, 22)} opacity="0.95" />
        </>
      )}

      {finish === "vivo-simple" && (
        <g clipPath={`url(#ms-${clipId})`}>
          <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="3" />
        </g>
      )}
    </svg>
  );
};

const ProductSVGPreview = ({
  type,
  color,
  fabricImage,
  lateralFabricImage,
  finish,
  vivoColor,
  forma,
  widthCm,
  heightCm,
  depthCm,
}: Props) => {
  const vc = vivoColor || darken(color);

  if (!type) return <EmptyState />;

  return (
    <div className="transition-opacity duration-300" style={{ opacity: 1 }}>
      {type === "cabecero" && (
        <HeadboardSVG
          color={color}
          fabricImage={fabricImage}
          lateralFabricImage={lateralFabricImage}
          finish={finish}
          vivoColor={vc}
          forma={forma}
          widthCm={widthCm}
          heightCm={heightCm}
        />
      )}
      {type === "banco" && (
        <BenchSVG
          color={color}
          fabricImage={fabricImage}
          finish={finish}
          vivoColor={vc}
          variant={forma}
          widthCm={widthCm}
          heightCm={heightCm}
          depthCm={depthCm}
        />
      )}
      {type === "puff" && (
        <PuffSVG
          color={color}
          fabricImage={fabricImage}
          finish={finish}
          vivoColor={vc}
          forma={forma}
          widthCm={widthCm}
          heightCm={heightCm}
          depthCm={depthCm}
        />
      )}
      {type === "cojin" && (
        <CushionSVG
          color={color}
          fabricImage={fabricImage}
          finish={finish}
          vivoColor={vc}
          shape={forma}
          widthCm={widthCm}
          heightCm={heightCm}
        />
      )}
      {type === "mesa" && forma === "tipo-banco" && (
        <BenchSVG
          color={color}
          fabricImage={fabricImage}
          finish={finish}
          vivoColor={vc}
          variant="enteladas"
          widthCm={widthCm}
          heightCm={heightCm}
          depthCm={depthCm}
        />
      )}
      {type === "mesa" && forma !== "tipo-banco" && (
        <MesaSVG
          color={color}
          fabricImage={fabricImage}
          finish={finish}
          vivoColor={vc}
          variant={forma}
          widthCm={widthCm}
          heightCm={heightCm}
          depthCm={depthCm}
        />
      )}
    </div>
  );
};

export default ProductSVGPreview;
