// Plugin de Vite: PRERENDER de las rutas del sitemap al terminar `vite build`.
//
// Qué hace: después de generar dist/, compila src/entry-prerender.tsx en modo
// SSR (a un directorio temporal), renderiza cada URL de public/sitemap.xml a
// HTML y escribe dist/<ruta>/index.html con el contenido real de la página y
// su <head> (title, description, canonical, Open Graph y JSON-LD de esa
// página). Para "/" sobrescribe dist/index.html.
//
// Por qué: la web es una SPA. Sin esto, cualquier URL devuelve el mismo
// index.html casi vacío, y los rastreadores que no ejecutan JavaScript
// (GPTBot, ClaudeBot, PerplexityBot, Bing para Copilot…) no ven ni el texto ni
// el head de /telas, /productos/cabeceros, etc.
//
// Seguridad del build: TODO va dentro de try/catch. Si algo falla (una página
// que toca `window` al renderizar, un módulo que no carga en Node…), se avisa
// por consola y dist/ se queda como lo dejó Vite: la web se publica igual,
// solo sin prerender. Nunca rompe el build de Lovable. Para desactivarlo:
// PRERENDER=0 vite build.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Plugin, ResolvedConfig } from "vite";

const SSR_ENTRY = "src/entry-prerender.tsx";
const SSR_OUT_DIR = "dist-ssr";
const SITEMAP = "public/sitemap.xml";
const SITE = "https://tirorirohome.com";

// Etiquetas del <head> de index.html que cada página sustituye por las suyas
// (las gestiona el componente SEO con react-helmet-async).
const HEAD_TAGS_TO_REPLACE = [
  /<title>[\s\S]*?<\/title>\s*/i,
  /<meta\s+name="description"[^>]*>\s*/gi,
  /<meta\s+property="og:[^"]*"[^>]*>\s*/gi,
  /<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi,
  /<link\s+rel="canonical"[^>]*>\s*/gi,
];

function routesFromSitemap(root: string): string[] {
  const xml = readFileSync(join(root, SITEMAP), "utf8");
  const routes: string[] = [];
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const loc = m[1];
    if (!loc.startsWith(SITE)) continue;
    const path = loc.slice(SITE.length) || "/";
    routes.push(path.startsWith("/") ? path : `/${path}`);
  }
  return Array.from(new Set(routes));
}

function outFileForRoute(distDir: string, route: string): string {
  return route === "/" ? join(distDir, "index.html") : join(distDir, route.replace(/^\//, ""), "index.html");
}

function injectHead(template: string, head: string): string {
  // Si la página no define su <title> (no usa el componente SEO), se conserva
  // el head genérico de index.html en vez de dejarla sin título.
  if (!/<title\b/i.test(head)) return template;
  let out = template;
  for (const re of HEAD_TAGS_TO_REPLACE) out = out.replace(re, "");
  return out.replace("</head>", `    <!-- prerender: head de esta página -->\n    ${head}\n  </head>`);
}

function injectBody(template: string, html: string): string {
  const start = template.indexOf('<div id="root">');
  if (start < 0) throw new Error('index.html no tiene <div id="root">');
  // Cierre del root: se recorren los <div>/</div> anidados desde la apertura
  // (el root lleva dentro el contenido estático de reserva de index.html).
  const re = /<div\b|<\/div>/g;
  re.lastIndex = start;
  let depth = 0;
  let end = -1;
  for (let m = re.exec(template); m; m = re.exec(template)) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) { end = m.index; break; }
  }
  if (end < 0) throw new Error('No se encuentra el cierre de <div id="root">');
  return `${template.slice(0, start)}<div id="root" data-prerendered="1">${html}</div>${template.slice(end + "</div>".length)}`;
}

export function prerenderPlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "tiroriro-prerender",
    apply: "build",
    enforce: "post",
    configResolved(c) { config = c; },
    async closeBundle() {
      // Solo tras el build del CLIENTE (el build SSR que lanzamos abajo también
      // pasa por aquí y no debe volver a entrar).
      if (config.build.ssr) return;
      if (process.env.PRERENDER === "0") return;
      const root = config.root;
      const distDir = resolve(root, config.build.outDir);
      const ssrDir = resolve(root, SSR_OUT_DIR);
      const log = (msg: string) => config.logger.info(`[prerender] ${msg}`);
      const warn = (msg: string) => config.logger.warn(`[prerender] ${msg}`);

      try {
        const templatePath = join(distDir, "index.html");
        if (!existsSync(templatePath)) { warn("no hay dist/index.html; se omite"); return; }
        const template = readFileSync(templatePath, "utf8");
        const routes = routesFromSitemap(root);
        if (routes.length === 0) { warn("sitemap sin rutas; se omite"); return; }

        // 1. Build SSR de la entrada de prerender (mismo vite.config: alias, React…).
        const { build } = await import("vite");
        await build({
          root,
          mode: config.mode,
          logLevel: "warn",
          configFile: config.configFile,
          build: {
            ssr: SSR_ENTRY,
            outDir: SSR_OUT_DIR,
            emptyOutDir: true,
            ssrEmitAssets: false,
            minify: false,
            rollupOptions: { output: { format: "es", entryFileNames: "entry-prerender.js" } },
          },
        });

        // 2. Cargar el módulo compilado y renderizar cada ruta.
        const entry = join(ssrDir, "entry-prerender.js");
        const mod = (await import(pathToFileURL(entry).href)) as { render: (url: string) => Promise<{ html: string; head: string; noIndex: boolean }> };
        let ok = 0;
        const failed: string[] = [];
        for (const route of routes) {
          try {
            const { html, head, noIndex } = await mod.render(route);
            if (noIndex) { warn(`${route} es noindex; no se prerenderiza`); continue; }
            if (!html || html.length < 500) { warn(`${route} ha renderizado casi vacío; no se escribe`); continue; }
            const page = injectBody(injectHead(template, head), html);
            const file = outFileForRoute(distDir, route);
            mkdirSync(dirname(file), { recursive: true });
            writeFileSync(file, page);
            ok++;
          } catch (e) {
            failed.push(route);
            warn(`${route}: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
        log(`${ok}/${routes.length} rutas prerenderizadas${failed.length ? ` (fallaron: ${failed.join(", ")})` : ""}`);
      } catch (e) {
        warn(`desactivado por error, dist/ se queda sin prerender: ${e instanceof Error ? e.stack ?? e.message : String(e)}`);
      } finally {
        rmSync(ssrDir, { recursive: true, force: true });
      }
    },
  };
}
