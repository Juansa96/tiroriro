import { ProductType } from "@/lib/products";
import { useEffect, useId, useRef, useState } from "react";

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
  tile = 30,
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

const headboardTopPoints = (forma: string) => {
  switch (forma) {
    case "semicirculo":
      return [
        [15, 110],
        [82, 56],
        [150, 25],
        [218, 56],
        [285, 110],
      ];
    case "corona-simple":
      return [
        [15, 120],
        [68, 120],
        [90, 100],
        [94, 84],
        [150, 68],
        [206, 84],
        [210, 100],
        [232, 120],
        [285, 120],
      ];
    case "corona-doble":
      return [
        [15, 120],
        [57, 120],
        [57, 99],
        [99, 99],
        [99, 78],
        [150, 56],
        [201, 78],
        [201, 99],
        [243, 99],
        [243, 120],
        [285, 120],
      ];
    case "corona-triple":
      return [
        [15, 120],
        [43, 120],
        [43, 106],
        [71, 106],
        [71, 92],
        [99, 92],
        [99, 78],
        [150, 56],
        [201, 78],
        [201, 92],
        [229, 92],
        [229, 106],
        [257, 106],
        [257, 120],
        [285, 120],
      ];
    case "recto":
    default:
      return [
        [15, 50],
        [285, 50],
      ];
  }
};

const buildTopFacePath = (points: number[][], dx: number, dy: number) => {
  const front = points.map(([x, y]) => `${x} ${y}`).join(" L ");
  const back = [...points]
    .reverse()
    .map(([x, y]) => `${x + dx} ${y + dy}`)
    .join(" L ");
  return `M ${front} L ${back} Z`;
};

const headboardPath = (forma: string, bottomY: number) => {
  const topPoints = headboardTopPoints(forma);
  const top = topPoints.map(([x, y]) => `L ${x} ${y}`).join(" ");
  return `M 24 ${bottomY} ${top} L 276 ${bottomY} Z`;
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
  const scaleX = widthCm ? clamp(widthCm / 150, 0.72, 1.28) : 1;
  const heightScale = heightCm ? clamp(heightCm / 120, 0.8, 1.12) : 1;
  const bottomY = 188;
  const dx = 8;
  const dy = -5;
  const frontPath = headboardPath(shape, bottomY);
  const topPoints = headboardTopPoints(shape);
  const firstTop = topPoints[0];
  const lastTop = topPoints[topPoints.length - 1];
  const topFacePath = buildTopFacePath(topPoints, dx, dy);
  const leftSidePath = `M 24 ${bottomY} L ${firstTop[0]} ${firstTop[1]} L ${firstTop[0] + dx} ${firstTop[1] + dy} L ${24 + dx} ${bottomY + dy} Z`;
  const rightSidePath = `M 276 ${bottomY} L ${lastTop[0]} ${lastTop[1]} L ${lastTop[0] + dx} ${lastTop[1] + dy} L ${276 + dx} ${bottomY + dy} Z`;
  const topColor = lighten(color, 16);
  const sideColor = darken(color, 18);

  return (
    <svg viewBox="0 0 330 220" className="w-full max-w-[320px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={30} />
        <TexturePattern id={lateralPatternId} image={lateralFabricImage || fabricImage} color={color} tile={30} />
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
        <path d={topFacePath} fill={topColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        <path d={leftSidePath} fill={patternFill(lateralPatternId, sideColor)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        <path d={rightSidePath} fill={patternFill(lateralPatternId, darken(color, 24))} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        <path d={frontPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />

        {finish === "vivo-simple" && (
          <g clipPath={`url(#hb-${clipId})`}>
            <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="3" strokeLinejoin="round" />
          </g>
        )}
        {finish === "vivo-doble" && (
          <g clipPath={`url(#hb-${clipId})`}>
            <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="2.6" strokeLinejoin="round" />
            <g transform="translate(150 188) scale(0.94) translate(-150 -188)">
              <path d={frontPath} fill="none" stroke={vivoColor} strokeWidth="2" strokeLinejoin="round" />
            </g>
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
  const scaleX = widthCm ? clamp(widthCm / 110, 0.74, 1.25) : 1;
  const scaleY = heightCm ? clamp(heightCm / 45, 0.75, 1.2) : 1;
  const depthX = depthCm ? clamp((depthCm - 30) * 0.25 + 16, 14, 24) : 18;
  const depthY = -depthX * 0.75;

  const seatX = 52;
  const seatY = mode === "baul" ? 66 : 60;
  const seatW = mode === "madera" ? 176 : 190;
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

  const woodColor = "#8E6C4E";
  const seatTopColor = lighten(color, 14);
  const seatSideColor = darken(color, 18);
  const frontLeftX = seatX + 10;
  const frontRightX = seatX + seatW - 22;
  const backLeftX = seatX + depthX + 2;
  const backRightX = seatX + seatW + depthX - 30;
  const frontLegTop = seatY + seatH;
  const backLegTop = seatY + seatH + depthY;
  const legHeight = 62;

  return (
    <svg viewBox="0 0 320 230" className="w-full max-w-[300px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={30} />
        <clipPath id={`bn-${clipId}`}>
          <path d={mode === "enteladas" ? uFrontPath : seatFrontRect} />
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

        {mode === "madera" && (
          <>
            <path d={seatTop} fill={seatTopColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={seatSide} fill={seatSideColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={seatFrontRect} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <rect x={frontLeftX} y={frontLegTop} width="12" height={legHeight} rx="4" fill={woodColor} />
            <rect x={frontRightX} y={frontLegTop} width="12" height={legHeight} rx="4" fill={woodColor} />
            <rect x={backLeftX} y={backLegTop} width="12" height={legHeight} rx="4" fill={darken(woodColor, 8)} />
            <rect x={backRightX} y={backLegTop} width="12" height={legHeight} rx="4" fill={darken(woodColor, 8)} />
          </>
        )}

        {mode === "baul" && (
          <>
            <path d={seatTop} fill={seatTopColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={seatSide} fill={seatSideColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={seatFrontRect} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={`M ${seatX + seatW / 2 - 16} ${seatY + 42} Q ${seatX + seatW / 2} ${seatY + 54} ${seatX + seatW / 2 + 16} ${seatY + 42}`} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}

        {mode === "enteladas" && (
          <>
            <path d={seatTop} fill={seatTopColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={rightOuterSide} fill={seatSideColor} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            <path d={innerLeftSide} fill={darken(color, 14)} stroke="rgba(0,0,0,0.14)" strokeWidth="1" />
            <path d={innerRightSide} fill={darken(color, 16)} stroke="rgba(0,0,0,0.14)" strokeWidth="1" />
            <path d={uFrontPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
          </>
        )}

        {finish === "vivo-simple" && (
          <g clipPath={`url(#bn-${clipId})`}>
            <path d={mode === "enteladas" ? uFrontPath : seatFrontRect} fill="none" stroke={vivoColor} strokeWidth="3" strokeLinejoin="round" />
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
    const topRx = widthCm ? clamp(widthCm * 0.9, 50, 84) : 68;
    const topRy = clamp(topRx * 0.28, 18, 28);
    const bodyH = heightCm ? clamp(heightCm * 1.5, 58, 118) : 86;
    const topCx = 150;
    const topCy = 72;
    const bodyTop = topCy;
    const bodyBottom = topCy + bodyH;
    return (
      <svg viewBox="0 0 300 230" className="w-full max-w-[260px] mx-auto">
        <defs>
          <TexturePattern id={patternId} image={fabricImage} color={color} tile={28} />
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
        <ellipse cx={150} cy={bodyTop} rx={topRx} ry={topRy} fill={lighten(color, 18)} opacity="0.35" />
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

  const baseW = widthCm ? clamp(widthCm * 2, 108, 190) : 148;
  const baseH = heightCm ? clamp(heightCm * 1.7, 68, 122) : 92;
  const depthX = depthCm ? clamp((depthCm - 30) * 0.25 + 16, 14, 24) : 18;
  const depthY = -depthX * 0.7;
  const x = (300 - baseW) / 2;
  const y = 72;
  const frontPath = `M ${x + 10} ${y} H ${x + baseW - 10} Q ${x + baseW} ${y} ${x + baseW} ${y + 10} V ${y + baseH - 10} Q ${x + baseW} ${y + baseH} ${x + baseW - 10} ${y + baseH} H ${x + 10} Q ${x} ${y + baseH} ${x} ${y + baseH - 10} V ${y + 10} Q ${x} ${y} ${x + 10} ${y} Z`;
  const topPath = `M ${x} ${y} L ${x + baseW} ${y} L ${x + baseW + depthX} ${y + depthY} L ${x + depthX} ${y + depthY} Z`;
  const sidePath = `M ${x + baseW} ${y} L ${x + baseW + depthX} ${y + depthY} L ${x + baseW + depthX} ${y + baseH + depthY} L ${x + baseW} ${y + baseH} Z`;

  return (
    <svg viewBox="0 0 320 230" className="w-full max-w-[270px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={30} />
        <clipPath id={`pf-${clipId}`}>
          <path d={frontPath} />
        </clipPath>
      </defs>
      <ellipse cx={158} cy={y + baseH + 14} rx={baseW * 0.45} ry={8} fill="rgba(0,0,0,0.08)" />
      <path d={topPath} fill={lighten(color, 16)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
      <path d={sidePath} fill={darken(color, 18)} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
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
    const length = widthCm ? clamp(widthCm * 2.9, 130, 240) : 196;
    const radius = heightCm ? clamp(heightCm * 1.05, 24, 42) : 30;
    const x = (300 - length) / 2;
    const y = 72;
    return (
      <svg viewBox="0 0 300 180" className="w-full max-w-[300px] mx-auto">
        <defs>
          <TexturePattern id={patternId} image={fabricImage} color={color} tile={26} />
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
    const scaleX = widthCm ? clamp(widthCm / 50, 1.15, 1.85) : 1.55;
    const scaleY = heightCm ? clamp(heightCm / 45, 0.58, 0.98) : 0.74;
    const outerPath =
      "M 42 54 Q 100 40 158 54 Q 170 54 170 66 Q 178 100 170 134 Q 170 146 158 146 Q 100 160 42 146 Q 30 146 30 134 Q 22 100 30 66 Q 30 54 42 54 Z";
    const innerPath =
      "M 48 60 Q 100 50 152 60 Q 162 60 162 70 Q 168 100 162 130 Q 162 140 152 140 Q 100 150 48 140 Q 38 140 38 130 Q 32 100 38 70 Q 38 60 48 60 Z";
    return (
      <svg viewBox="0 0 200 200" className="w-full max-w-[230px] mx-auto">
        <defs>
          <TexturePattern id={patternId} image={fabricImage} color={color} tile={26} />
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

  const scaleX = widthCm ? clamp(widthCm / 45, 0.9, 1.6) : kind === "rectangular" ? 1.3 : 1;
  const scaleY = heightCm ? clamp(heightCm / 45, 0.68, 1.5) : kind === "rectangular" ? 0.82 : 1;
  const outerPath =
    "M 52 40 Q 100 28 148 40 Q 164 40 164 56 Q 174 100 164 144 Q 164 160 148 160 Q 100 172 52 160 Q 36 160 36 144 Q 26 100 36 56 Q 36 40 52 40 Z";
  const innerPath =
    "M 58 48 Q 100 38 142 48 Q 154 48 154 60 Q 162 100 154 140 Q 154 152 142 152 Q 100 162 58 152 Q 46 152 46 140 Q 38 100 46 60 Q 46 48 58 48 Z";

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={26} />
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
  const baseW = widthCm ? clamp(widthCm * 1.65, 140, 230) : 196;
  const baseH = heightCm ? clamp(heightCm * 1.25, 42, 82) : 58;
  const depthX = depthCm ? clamp((depthCm - 35) * 0.22 + 18, 16, 26) : 20;
  const depthY = -depthX * 0.72;
  const x = (300 - baseW) / 2;
  const y = 62;
  const frontPath = `M ${x + 8} ${y} H ${x + baseW - 8} Q ${x + baseW} ${y} ${x + baseW} ${y + 8} V ${y + baseH - 8} Q ${x + baseW} ${y + baseH} ${x + baseW - 8} ${y + baseH} H ${x + 8} Q ${x} ${y + baseH} ${x} ${y + baseH - 8} V ${y + 8} Q ${x} ${y} ${x + 8} ${y} Z`;
  const topPath = `M ${x} ${y} L ${x + baseW} ${y} L ${x + baseW + depthX} ${y + depthY} L ${x + depthX} ${y + depthY} Z`;
  const sidePath = `M ${x + baseW} ${y} L ${x + baseW + depthX} ${y + depthY} L ${x + baseW + depthX} ${y + baseH + depthY} L ${x + baseW} ${y + baseH} Z`;

  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-[290px] mx-auto">
      <defs>
        <TexturePattern id={patternId} image={fabricImage} color={color} tile={30} />
        <clipPath id={`ms-${clipId}`}>
          <path d={frontPath} />
        </clipPath>
      </defs>
      <ellipse cx="158" cy={y + baseH + 72} rx={baseW * 0.38} ry={8} fill="rgba(0,0,0,0.08)" />

      {mode === "tipo-puff" ? (
        <>
          <path d={topPath} fill={lighten(color, 14)} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
          <path d={sidePath} fill={darken(color, 18)} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
          <path d={frontPath} fill={patternFill(patternId, color)} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
        </>
      ) : (
        <>
          <path d={topPath} fill={lighten(color, 14)} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
          <path d={sidePath} fill={darken(color, 18)} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
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
  const [opacity, setOpacity] = useState(1);
  const [currentForma, setCurrentForma] = useState(forma);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (forma === currentForma) return;
    setOpacity(0.15);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCurrentForma(forma);
      setOpacity(1);
    }, 120);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [forma, currentForma]);

  if (!type) return <EmptyState />;

  return (
    <div className="transition-opacity duration-300" style={{ opacity }}>
      {type === "cabecero" && (
        <HeadboardSVG
          color={color}
          fabricImage={fabricImage}
          lateralFabricImage={lateralFabricImage}
          finish={finish}
          vivoColor={vc}
          forma={currentForma}
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
          variant={currentForma}
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
          forma={currentForma}
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
          shape={currentForma}
          widthCm={widthCm}
          heightCm={heightCm}
        />
      )}
      {type === "mesa" && (
        <MesaSVG
          color={color}
          fabricImage={fabricImage}
          finish={finish}
          vivoColor={vc}
          variant={currentForma}
          widthCm={widthCm}
          heightCm={heightCm}
          depthCm={depthCm}
        />
      )}
    </div>
  );
};

export default ProductSVGPreview;
