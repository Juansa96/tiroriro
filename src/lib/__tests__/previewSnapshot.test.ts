import { describe, it, expect } from "vitest";
import { serializePreviewSvg } from "@/lib/previewSnapshot";

function mount(markup: string): SVGSVGElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  document.body.appendChild(host);
  return host.querySelector("svg") as SVGSVGElement;
}

describe("serializePreviewSvg", () => {
  it("devuelve null si no hay svg", () => {
    expect(serializePreviewSvg(null)).toBeNull();
  });

  it("deja el SVG autocontenido: xmlns, tamaño del viewBox, sin clases de Tailwind", () => {
    const svg = mount('<svg viewBox="0 0 330 220" class="w-full max-w-[320px]"><rect width="10" height="10"/></svg>');
    const snap = serializePreviewSvg(svg)!;
    expect(snap.width).toBe(330);
    expect(snap.height).toBe(220);
    expect(snap.svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(snap.svg).toContain('width="330"');
    expect(snap.svg).toContain('height="220"');
    expect(snap.svg).not.toContain("class=");
    // el original no se toca
    expect(svg.getAttribute("class")).toBe("w-full max-w-[320px]");
  });

  it("renombra los ids de React (:r1:) en definiciones y referencias", () => {
    const svg = mount(
      '<svg viewBox="0 0 10 10"><defs><pattern id=":r1:"/><clipPath id="hb-:r2:"/></defs>' +
      '<path fill="url(#:r1:)" clip-path="url(#hb-:r2:)"/></svg>',
    );
    const out = serializePreviewSvg(svg)!.svg;
    expect(out).not.toContain(":r1:");
    expect(out).not.toContain(":r2:");
    expect(out).toContain('id="tr-id-0"');
    expect(out).toContain('fill="url(#tr-id-0)"');
    expect(out).toContain('id="tr-id-1"');
    expect(out).toContain('clip-path="url(#tr-id-1)"');
  });

  it("pasa el transform CSS (scale + origin) a atributo SVG", () => {
    const svg = mount(
      '<svg viewBox="0 0 330 220"><g style="transform: scale(0.9, 1.1); transform-origin: 150px 186px; transition: transform 0.4s ease;"><rect/></g></svg>',
    );
    const out = serializePreviewSvg(svg)!.svg;
    expect(out).toContain('transform="translate(150 186) scale(0.9 1.1) translate(-150 -186)"');
    expect(out).not.toContain("transition");
    expect(out).not.toMatch(/style="[^"]*transform/);
  });
});
