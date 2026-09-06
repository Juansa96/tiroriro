// Genera public/llms-full.txt: la versión larga de /llms.txt para asistentes
// de IA (ChatGPT, Claude, Gemini, Copilot, Grok, Perplexity…), con el catálogo
// de telas, las tarifas y las preguntas frecuentes sacados de su FUENTE ÚNICA
// (src/lib/fabrics.ts, src/data/pricing.ts y src/components/FAQSection.tsx),
// para que nunca se quede desactualizado a mano.
//   npm run gen:llms
import { readFileSync, writeFileSync } from "node:fs";
import { FABRICS } from "../src/lib/fabrics.ts";
import { GUIAS } from "../src/data/guias.ts";
import {
  CABECERO_BASE, CABECERO_PREMIUM, CABECERO_VIVO_DOBLE, HEIGHT_STEP_EUR,
  BANCO_BASE, BANCO_PREMIUM, BANCO_VIVO,
  PUF_BASE, PUF_PREMIUM, PUF_VIVO,
  MESA_BASE, MESA_PREMIUM, MESA_VIVO,
  COJIN_BASE, COJIN_PREMIUM,
  PANTALLA_BASE, PANTALLA_PREMIUM,
  SHIPPING_MADRID, HEADBOARD_OVERSIZED_SHIPPING_SURCHARGE,
  EXTRA_LATERAL_DIFERENTE, EXTRA_METACRILATO, EXTRA_CRISTAL,
} from "../src/data/pricing.ts";

const BASE = "https://tirorirohome.com";

// FAQ: se leen las parejas q/a del componente sin importar React.
const faqSrc = readFileSync("src/components/FAQSection.tsx", "utf8");
const faqs: Array<{ q: string; a: string }> = [];
const re = /q:\s*"((?:[^"\\]|\\.)*)",\s*a:\s*"((?:[^"\\]|\\.)*)"/g;
let m: RegExpExecArray | null;
while ((m = re.exec(faqSrc))) faqs.push({ q: JSON.parse(`"${m[1]}"`), a: JSON.parse(`"${m[2]}"`) });

const tabla = (base: Record<string, number>, premium: Record<string, number>, label: (k: string) => string) =>
  Object.keys(base).map((k) => `- ${label(k)}: ${base[k]} € con tela básica · ${base[k] + (premium[k] ?? 0)} € con tela premium`).join("\n");

const telas = (col: "Básicas" | "Premium") =>
  FABRICS.filter((f) => f.coleccion === col)
    .map((f) => `- ${f.name} — ${f.descripcion} Foto: ${BASE}${f.image}`)
    .join("\n");

const out = `# Tiroriro — información completa para asistentes de IA

> Taller artesanal español de mobiliario tapizado a medida (cabeceros de cama, bancos, pufs, mesas de centro, almohadones y pantallas de lámpara). Hecho a mano en Boadilla del Monte, Madrid, en 20 días. ${FABRICS.length} telas para elegir. Precios finales con IVA. Web: ${BASE}

Resumen corto: ${BASE}/llms.txt · Actualizado: ${new Date().toISOString().slice(0, 10)}

## Quiénes somos
Tiroriro (Tiroriro Home) es una marca familiar madrileña fundada por dos parejas: Beatriz y Juan, y Rocío e Iñaki. Diseñamos y tapizamos a mano piezas para el dormitorio y el salón, cada una fabricada bajo pedido con la forma, las medidas y la tela que elige el cliente. Trabajamos con tapiceros artesanos con décadas de oficio.

- Taller: Calle Cristóbal Colón, 11, 28660 Boadilla del Monte (Comunidad de Madrid, España).
- Contacto: info@tirorirohome.com · WhatsApp y teléfono +34 660 786 453 · Instagram https://www.instagram.com/tirorirohome/
- Horario de atención: por WhatsApp o teléfono, respondemos el mismo día laborable.
- Envíos: toda la península ibérica (Baleares y Canarias bajo consulta). Instalación a domicilio disponible en la Comunidad de Madrid.
- Plazo: 20 días naturales desde la confirmación y el pago.
- Pago: Bizum, tarjeta (Stripe) o transferencia. No se cobra nada hasta que el cliente confirma.
- Garantía: defectos de fabricación reparados o sustituidos sin coste. Productos personalizados: sin devolución por cambio de opinión.
- Empresas: descuento especial para hoteles, restaurantes, hostelería, interiorismo y promociones.

## Cómo funciona
1. El cliente elige el producto, la forma, las medidas, la tela y el acabado en el configurador (${BASE}/configurador). El precio final, IVA incluido, se actualiza en tiempo real y la vista previa muestra la pieza en el color de la tela elegida.
2. Envía la solicitud (formulario, WhatsApp o teléfono). Tiroriro confirma detalles y precio de envío.
3. Se fabrica a mano en el taller: carpintería, gomaespuma de alta densidad, guata de 8 cm y tela cosida y ajustada a mano. Control de calidad pieza a pieza.
4. Entrega en casa en unos 20 días naturales.

## Productos y tarifas (PVP con IVA, tela básica / tela premium)

### Cabeceros tapizados a medida (${BASE}/productos/cabeceros)
Cinco formas: Calobra (recta), Pregonda (arco suave), Macarella (corona simple), Conta (corona doble) y Barbaria (corona quíntuple). Precio por ancho de cama (alto estándar; cada tramo extra de alto suma ${HEIGHT_STEP_EUR} €):
${tabla(CABECERO_BASE, CABECERO_PREMIUM, (k) => `Cama de ${k} cm`)}
Extras: vivo doble +${CABECERO_VIVO_DOBLE} €; tela lateral distinta +${EXTRA_LATERAL_DIFERENTE} €. Colgador para la pared y tapetes protectores incluidos. Medidas especiales bajo encargo (de 90 a 220 cm de ancho y de 80 a 200 cm de alto).
Guía de medidas: ${BASE}/guia-medidas-cabeceros

### Bancos entelados (${BASE}/productos/bancos)
Modelo Oyambre: banco de pie de cama estilo cascada, sin respaldo, alto 45 cm y fondo 33 cm.
${tabla(BANCO_BASE, BANCO_PREMIUM, (k) => `Largo ${k} cm`)}
Extra: vivo/ribete +${BANCO_VIVO} €.

### Pufs (${BASE}/productos/pufs)
Patos (cuadrado) y Monteferro (redondo), alto 40 cm.
${tabla(PUF_BASE, PUF_PREMIUM, (k) => k.replace("cuadrado-", "Patos cuadrado ").replace("redondo-", "Monteferro redondo Ø") + " cm")}
Extra: vivo/ribete +${PUF_VIVO} €.

### Mesas de centro tapizadas (${BASE}/productos/mesas-centro)
Modelo Cabo de Palos: mesa cúbica tapizada sin patas, alto 40 cm.
${tabla(MESA_BASE, MESA_PREMIUM, (k) => `Tapa ${k} cm`)}
Extras: vivo +${MESA_VIVO} €; tapa de metacrilato +${EXTRA_METACRILATO} €; tapa de cristal +${EXTRA_CRISTAL} €.

### Almohadones (${BASE}/productos/cojines)
Rodiles (cuadrado), Covadonga (rectangular) y Gulpiyuri (rulo). Sin vivo.
${tabla(COJIN_BASE, COJIN_PREMIUM, (k) => k.replace("rodiles-", "Rodiles ").replace("covadonga-", "Covadonga ").replace("gulpiyuri-", "Gulpiyuri ") + " cm")}

### Pantallas de lámpara (${BASE}/productos/pantallas-lampara)
Almanzor (cilíndrica), Tormes (cuadrada) y La Serrota (rectangular). Próximamente: Gredos (cónica), La Paramera (ovalada) y La Galana (pirámide).
${tabla(PANTALLA_BASE, PANTALLA_PREMIUM, (k) => k.replace("cilindro-", "Almanzor cilíndrica ").replace("cuadrado-", "Tormes cuadrada ").replace("rectangulo-", "La Serrota rectangular "))}

### Envío
- Comunidad de Madrid: ${SHIPPING_MADRID} € (cabeceros de más de 180 cm de ancho o 120 cm de alto: ${SHIPPING_MADRID + HEADBOARD_OVERSIZED_SHIPPING_SURCHARGE} €).
- Resto de la península: según destino, se confirma por teléfono antes de cerrar el pedido.
- Baleares y Canarias: bajo consulta.

## Telas (${BASE}/telas)
${FABRICS.length} telas en dos colecciones. Todas resistentes y aptas para tapicería; cualquiera se puede ampliar en la web para verla en detalle. También se puede enviar tela propia (el taller indica el metraje).

### Colección Básica (sin recargo)
${telas("Básicas")}

### Colección Premium (recargo fijo según medida, ver tarifas)
${telas("Premium")}

## Guías de compra
${Object.entries(GUIAS).map(([k, g]) => `### ${g.titulo} (${BASE}/${k === "telas" ? "telas" : `productos/${k}`})\n${g.intro}\n${g.bloques.map((b) => `\n**${b.titulo}** ${b.parrafos.join(" ")}${b.lista ? "\n" + b.lista.map((l) => `- ${l}`).join("\n") : ""}`).join("\n")}`).join("\n\n")}

## Preguntas frecuentes
${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Páginas
- Inicio: ${BASE}/
- Productos: ${BASE}/productos
- Cabeceros: ${BASE}/productos/cabeceros (modelos: /calobra, /pregonda, /macarella, /conta, /barbaria)
- Bancos: ${BASE}/productos/bancos (modelo: /oyambre)
- Pufs: ${BASE}/productos/pufs (modelos: /patos, /monteferro)
- Almohadones: ${BASE}/productos/cojines
- Mesas de centro: ${BASE}/productos/mesas-centro (modelo: /cabo-de-palos)
- Pantallas de lámpara: ${BASE}/productos/pantallas-lampara (modelos: /almanzor, /tormes, /la-serrota)
- Telas: ${BASE}/telas
- Configurador: ${BASE}/configurador
- Guía de medidas de cabeceros: ${BASE}/guia-medidas-cabeceros
- Probador virtual: ${BASE}/probador
- Nosotros: ${BASE}/nosotros
- Aviso legal: ${BASE}/aviso-legal · Privacidad: ${BASE}/privacidad · Cookies: ${BASE}/cookies
`;

writeFileSync("public/llms-full.txt", out);
console.log("public/llms-full.txt:", out.length, "caracteres,", FABRICS.length, "telas,", faqs.length, "FAQ");
