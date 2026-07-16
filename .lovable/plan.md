Voy a implementar los 12 cambios agrupados por bloque. Antes de tocar código quiero confirmar el plan porque hay decisiones importantes (SSR, CDN, textos y fuente de reseñas) que conviene fijar contigo.

## 1. Configurador — mensaje y CTA
- Unificar a **"Precio en tiempo real"** (eliminar "Precio estimado").
- CTA principal pasa a: **"Lo quiero — reserva por [PRECIO] €"** usando el precio calculado en vivo.
- Mostrar junto al precio: **"Reserva con el 50% · El resto al recibir · Garantía de fabricación"** (ver punto 7).

## 2. Precio visible en el formulario final (ContactForm)
Cuando llegan params del configurador, mostrar bloque resumen con:
- Miniatura/preview SVG de la configuración.
- Desglose por línea.
- Texto: **"Te llamamos en menos de 24 h laborables"**.
- Lógica de envío según CP:
  - CP Madrid (28xxx) → `producto + envío 40 € = total (IVA incluido)`.
  - Resto → `producto + envío a consultar según destino`, con nota "el importe final se confirma en la llamada de <24h". No sumar envío al total.
- El CP/provincia del formulario recalcula el desglose en vivo.

## 3. H1 de la home (HeroSection)
- H1: **"Cabeceros tapizados a medida, hechos a mano en España"**.
- Subtítulo (con el mismo typewriter/timing/easing que tenía el H1): *"Algunas cosas merecen hacerse a mano"*.
- Se mantiene la animación existente, solo cambian textos y jerarquía.

## 4. CTAs de la home
- Eliminar botón **"Sigue bajando"**.
- CTA primario único: **"Diseña el tuyo"** (accent-warm, estilo sólido).
- "Ver productos" queda secundario (outline sweep).
- El "Solicita información" del header se mantiene pero visualmente ya es secundario.

## 5. Mensaje de envío unificado
Buscar y reemplazar en toda la web ("Envío a toda la península", "a consultar según destino", variantes) por **"Envío a la península"**. El desglose real del formulario (punto 2) mantiene su propia lógica.

## 6. Reseñas verificables
- Cabecera del bloque: **"4,9/5 en Google · 47 reseñas"** con enlace a Google Reviews.
- Cada tarjeta (o el bloque entero) enlaza a la ficha pública de Google.
- **Necesito de ti:** URL real de vuestro perfil de Google Business y nº real de reseñas + nota media. Si no me la das, dejo placeholder `#` y un TODO visible.

## 7. Modelo de pago y garantía
Bloque visible junto al precio en:
- Configurador (bajo el precio, antes del CTA).
- Ficha de producto (ModelPage, junto al precio/CTA).
Formato: `Reserva con el 50% · El resto al recibir · Garantía de fabricación`.

## 8-9. Rendimiento — qué haré y qué NO
Lo que **sí** puedo hacer ahora en el repo:
- Auditar bundle y aumentar code-splitting (lazy en componentes pesados de la home: `ReviewsCarousel`, `InstagramFeedTeaser`, `FAQSection`, `ContactForm` — hoy son eager).
- Revisar imports que rompen tree-shaking.
- Comprimir el asset de 31 KB tardón (identificarlo por network y optimizarlo con squoosh/sharp o convertirlo a webp/avif).
- Preload del LCP ya está.

Lo que **NO** puedo hacer desde Lovable:
- **SSR/prerender**: Lovable sirve SPA (Vite + React). No hay hosting SSR ni build de prerender integrado. Si lo quieres, requiere migrar el hosting fuera de Lovable (Vercel/Cloudflare Pages con adaptador) — decisión de infraestructura, fuera del alcance de un cambio de código aquí.
- **Cloudflare delante**: es config de DNS/hosting, no de código. Puedes activarlo apuntando el dominio a Cloudflare (proxy naranja) desde tu registrador; no requiere cambios en el repo.

Te lo dejo anotado y sigo con lo que sí es accionable.

## 10. Banner cookies + burbujas flotantes
- Reducir `CookieBanner` a barra fina (una línea, altura ~48px, sin tapar CTAs; botones compactos).
- `FloatingButtons`: dejar solo WhatsApp.
- Añadir enlace de Instagram al `Footer` (si no está ya visible).

## 11. Teléfono/WhatsApp en header
- En `Navbar` desktop, junto al CTA "Solicita información", añadir:
  `¿Dudas? 660 786 453` con enlace `https://wa.me/34660786453`.
- En mobile: icono/enlace equivalente compacto.

## 12. Formulario — campos redundantes
- Si `ContactForm` recibe datos del configurador (URL params), ocultar el campo "Tipo de producto".
- Textarea de "detalles adicionales" pasa a **opcional** (quitar `required`, ajustar label).

---

## Preguntas antes de ejecutar
1. **Reseñas (punto 6):** ¿me pasas la URL de Google Business y la cifra real (nota/nº reseñas)? Sin eso pongo placeholders.
2. **Mensaje unificado del precio (punto 1):** confirmo **"Precio en tiempo real"** como texto único, ¿ok?
3. **SSR/CDN (puntos 8-9):** ¿te vale con que documente la limitación y aplique lo accionable en repo, o quieres que además prepare una guía de migración a Vercel/Cloudflare?
4. **WhatsApp header (punto 11):** ¿enlace a WhatsApp `wa.me/34660786453` o a `tel:` llamada directa?

Confirma o corrige y ejecuto todo en una sola pasada.
