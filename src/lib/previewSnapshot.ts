// Captura del dibujo del configurador (la silueta SVG que ve el cliente) para
// mandarlo al CRM y a los emails. Se hace en el navegador, en el momento de
// enviar el formulario, a partir del SVG que ya está pintado en la página:
//
//   1. `serializePreviewSvg` clona el <svg>, lo deja autocontenido (xmlns,
//      width/height, ids sin los ":r1:" de React, transform CSS → atributo)
//      y devuelve el texto SVG.
//   2. `svgToPngDataUrl` lo rasteriza con un <canvas> a PNG (los clientes de
//      correo como Gmail no pintan SVG, así que el email necesita un PNG).
//
// Todo es "best effort": si algo falla, el formulario se envía igual sin
// dibujo. Nunca debe bloquear una solicitud.

export interface PreviewSnapshot {
  /** Texto SVG autocontenido (sirve como respaldo si no se pudo subir el PNG). */
  svg: string;
  /** PNG en data URL (`data:image/png;base64,…`) listo para subir. */
  png?: string;
  width: number;
  height: number;
}

const SVG_NS = "http://www.w3.org/2000/svg";

/** Convierte `transform: scale(a, b)` + `transform-origin: X Y` (CSS) en un atributo SVG equivalente. */
function inlineCssTransform(el: Element): void {
  const style = (el as HTMLElement).style;
  if (!style) return;
  const transform = style.transform || "";
  if (!transform) return;
  const m = /scale\(\s*([-\d.]+)\s*(?:,\s*([-\d.]+)\s*)?\)/.exec(transform);
  if (!m) return;
  const sx = Number(m[1]);
  const sy = m[2] !== undefined ? Number(m[2]) : sx;
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return;
  const origin = /([-\d.]+)px\s+([-\d.]+)px/.exec(style.transformOrigin || "");
  const ox = origin ? Number(origin[1]) : 0;
  const oy = origin ? Number(origin[2]) : 0;
  const existing = el.getAttribute("transform");
  const attr = `translate(${ox} ${oy}) scale(${sx} ${sy}) translate(${-ox} ${-oy})`;
  el.setAttribute("transform", existing ? `${existing} ${attr}` : attr);
  style.removeProperty("transform");
  style.removeProperty("transform-origin");
  style.removeProperty("transition");
  if (!style.cssText.trim()) el.removeAttribute("style");
}

/**
 * Devuelve el SVG del preview como texto autocontenido, o `null` si no hay
 * SVG. No toca el elemento original.
 */
export function serializePreviewSvg(svgEl: SVGSVGElement | null | undefined): PreviewSnapshot | null {
  if (!svgEl) return null;
  const viewBox = (svgEl.getAttribute("viewBox") || "").trim().split(/[\s,]+/).map(Number);
  const width = viewBox.length === 4 && viewBox[2] > 0 ? viewBox[2] : 300;
  const height = viewBox.length === 4 && viewBox[3] > 0 ? viewBox[3] : 200;

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.removeAttribute("class");

  // Los transform CSS (scale según medidas) no los entienden todos los
  // rasterizadores: los pasamos a atributo SVG.
  clone.querySelectorAll("[style]").forEach(inlineCssTransform);
  inlineCssTransform(clone);

  let markup = new XMLSerializer().serializeToString(clone);

  // React genera ids tipo ":r1:" (useId). Son válidos en el DOM pero dan
  // problemas en algunos visores; los renombramos de forma consistente en
  // id="…", url(#…) y href="#…".
  const ids = Array.from(clone.querySelectorAll("[id]"))
    .map((n) => n.getAttribute("id") || "")
    .filter((id) => id && /[^A-Za-z0-9_-]/.test(id));
  ids.forEach((id, i) => {
    const safe = `tr-id-${i}`;
    markup = markup.split(id).join(safe);
  });

  return { svg: markup, width, height };
}

function loadImage(src: string, timeoutMs: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error("timeout cargando SVG")), timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(img); };
    img.onerror = () => { clearTimeout(timer); reject(new Error("no se pudo cargar el SVG")); };
    img.src = src;
  });
}

/**
 * Rasteriza un SVG (texto) a PNG con fondo blanco. `scale` 2 = el doble de
 * píxeles que el viewBox, para que se vea nítido en pantallas retina.
 */
export async function svgToPngDataUrl(
  svgMarkup: string,
  width: number,
  height: number,
  options: { scale?: number; timeoutMs?: number } = {},
): Promise<string> {
  const scale = options.scale ?? 2;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
  const img = await loadImage(src, options.timeoutMs ?? 4000);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas no disponible");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/png");
  if (!dataUrl.startsWith("data:image/png;base64,")) throw new Error("no se pudo generar el PNG");
  return dataUrl;
}

/**
 * Captura completa: SVG + PNG. Si el PNG falla (navegador raro, canvas
 * bloqueado…), devuelve solo el SVG. Si no hay SVG, devuelve `null`.
 */
export async function capturePreview(container: HTMLElement | null | undefined): Promise<PreviewSnapshot | null> {
  try {
    const svgEl = container?.querySelector("svg") ?? null;
    const snap = serializePreviewSvg(svgEl);
    if (!snap) return null;
    try {
      snap.png = await svgToPngDataUrl(snap.svg, snap.width, snap.height);
    } catch (err) {
      console.warn("No se pudo rasterizar el dibujo del configurador:", err);
    }
    return snap;
  } catch (err) {
    console.warn("No se pudo capturar el dibujo del configurador:", err);
    return null;
  }
}
