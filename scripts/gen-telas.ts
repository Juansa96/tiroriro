// Genera public/telas.json desde src/data|lib/fabrics (FUENTE ÚNICA de telas).
// El CRM de Tiroriro lee este JSON para reutilizar nombre+foto sin duplicar.
//   npm run gen:telas
import { FABRICS } from "../src/lib/fabrics.ts";
import { writeFileSync } from "node:fs";
const BASE = "https://tirorirohome.com";
const out = {
  version: new Date().toISOString().slice(0, 10),
  telas: FABRICS.map((f) => ({
    id: f.id,
    nombre: f.name,
    coleccion: f.coleccion === "Premium" ? "premium" : "basica",
    foto: f.image.startsWith("http") ? f.image : BASE + f.image,
    hex: f.hex,
  })),
};
writeFileSync("public/telas.json", JSON.stringify(out, null, 2) + "\n");
console.log("public/telas.json:", out.telas.length, "telas");
