// Avisa a IndexNow (Bing, Copilot y los buscadores que lo usan) de las URL del
// sitemap para que las rastreen al momento, sin esperar al crawler.
//   npm run indexnow            → envía todas las URL de public/sitemap.xml
//   npm run indexnow -- /telas  → envía solo esas rutas
// La clave la generó Bing Webmaster Tools y está publicada en
// public/<clave>.txt (así IndexNow comprueba que el dominio es nuestro).
import { readFileSync } from "node:fs";

const SITE = "https://tirorirohome.com";
const KEY = "d5a2744da584453788f80db2dbe77086";

const args = process.argv.slice(2);
const urls = args.length
  ? args.map((r) => (r.startsWith("http") ? r : `${SITE}${r.startsWith("/") ? r : `/${r}`}`))
  : Array.from(readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (m) => m[1]);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "tirorirohome.com", key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} · ${urls.length} URL enviadas`);
if (!res.ok) { console.error(await res.text()); process.exit(1); }
