// Genera public/catalog.json a partir de src/data/pricing.ts (FUENTE ÚNICA).
// Ejecutar tras cualquier cambio de precios:  npm run gen:catalog
// El CRM de Tiroriro consume este JSON para no mantener una copia de precios.
import {
  CABECERO_BASE, CABECERO_PREMIUM, HEIGHT_STEP_EUR, CABECERO_VIVO_DOBLE,
  BANCO_BASE, BANCO_PREMIUM, BANCO_VIVO,
  PUF_BASE, PUF_PREMIUM, PUF_VIVO, PUF_HEIGHT_CM,
  MESA_BASE, MESA_PREMIUM, MESA_VIVO, MESA_HEIGHT_CM,
  COJIN_BASE, COJIN_PREMIUM,
  PANTALLA_BASE, PANTALLA_PREMIUM,
  SHIPPING_MADRID, EXTRA_COLGADOR, EXTRA_METACRILATO, EXTRA_CRISTAL,
} from "../src/data/pricing.ts";
import { writeFileSync } from "node:fs";

const catalog = {
  version: new Date().toISOString().slice(0, 10),
  moneda: "EUR",
  ivaIncluido: true,
  cabecero: {
    base: CABECERO_BASE, premium: CABECERO_PREMIUM,
    alturas: [100, 120, 130], heightStepEur: HEIGHT_STEP_EUR,
    vivoDoble: CABECERO_VIVO_DOBLE, colgador: EXTRA_COLGADOR,
  },
  banco: { base: BANCO_BASE, premium: BANCO_PREMIUM, vivo: BANCO_VIVO },
  puf:   { base: PUF_BASE, premium: PUF_PREMIUM, vivo: PUF_VIVO, alturaCm: PUF_HEIGHT_CM["cuadrado-40"] ?? 40, alturas: PUF_HEIGHT_CM },
  mesa:  { base: MESA_BASE, premium: MESA_PREMIUM, vivo: MESA_VIVO, alturaCm: MESA_HEIGHT_CM, metacrilato: EXTRA_METACRILATO, cristal: EXTRA_CRISTAL },
  cojin: { base: COJIN_BASE, premium: COJIN_PREMIUM },
  pantalla: { base: PANTALLA_BASE, premium: PANTALLA_PREMIUM },
  envioMadrid: SHIPPING_MADRID,
};

writeFileSync("public/catalog.json", JSON.stringify(catalog, null, 2) + "\n");
console.log("public/catalog.json generado (version " + catalog.version + ")");
