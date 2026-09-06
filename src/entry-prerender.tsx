// Entrada del PRERENDER (solo se ejecuta en Node durante `vite build`, ver
// scripts/vite-plugin-prerender.ts). Renderiza una ruta de la web a HTML con
// las mismas páginas que ve el navegador, para que los rastreadores que no
// ejecutan JavaScript (GPTBot, ClaudeBot, PerplexityBot, Bing…) lean el
// contenido real de cada URL y no una página vacía.
//
// No se incluyen los componentes que solo tienen sentido en el navegador
// (analítica, píxel, banner de cookies, toasts, scroll): el HTML resultante lo
// sustituye React al arrancar en el cliente (main.tsx), así que aquí solo
// importa el contenido.
import { PassThrough } from "node:stream";
import { StrictMode, Suspense } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRoutes from "./AppRoutes";

export interface PrerenderResult {
  /** HTML del contenido (lo que va dentro de <div id="root">). */
  html: string;
  /** Etiquetas <head> de la página (title, meta, link, JSON-LD) ya serializadas. */
  head: string;
  /** true si la página se ha marcado como noindex (no conviene publicarla prerenderizada). */
  noIndex: boolean;
}

export function render(url: string): Promise<PrerenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const app = (
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <StaticRouter location={url} future={{ v7_relativeSplatPath: true }}>
              <Suspense fallback={null}>
                <AppRoutes />
              </Suspense>
            </StaticRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </StrictMode>
  );

  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new PassThrough();
    sink.on("data", (chunk: Buffer | string) => { html += chunk.toString(); });
    sink.on("end", () => {
      const h = helmetContext.helmet;
      const head = h
        ? [h.title.toString(), h.meta.toString(), h.link.toString(), h.script.toString()]
            .map((x) => x.trim()).filter(Boolean).join("\n")
        : "";
      const noIndex = /name="robots"[^>]*content="[^"]*noindex/i.test(head);
      resolve({ html, head, noIndex });
    });
    sink.on("error", reject);

    const stream = renderToPipeableStream(app, {
      // onAllReady espera a TODAS las Suspense (incluidas las páginas lazy):
      // así el HTML lleva la página entera y no el fallback.
      onAllReady() { stream.pipe(sink); },
      onError(err) { reject(err instanceof Error ? err : new Error(String(err))); },
    });
  });
}
