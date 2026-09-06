# Tiroriro

Web de cabeceros tapizados a medida. Vite + React + TypeScript + Tailwind + shadcn/ui,
con Supabase para formularios y correo transaccional.

## Flujo de trabajo con Lovable (importante)

El proyecto está conectado a Lovable, y **Lovable sincroniza con `main`, no con las ramas
de PR**. Un cambio que se quede en una rama es invisible para Juan: no aparece en la vista
previa de Lovable y no puede publicarlo.

Por eso, para cualquier cambio de código, el flujo completo es:

1. Desarrollar en la rama indicada para la sesión.
2. Validar antes de dar nada por terminado (ver más abajo).
3. Crear siempre el pull request, con una descripción que explique qué cambia y cómo se
   verificó. **Siempre**, aunque el cambio sea pequeño y aunque no lo pida explícitamente.
4. **Fusionar el PR a `main`** una vez esté limpio, para que Lovable lo recoja.
5. Decirle a Juan que recargue Lovable y pulse **Publicar**.

Lo único que él debería tener que hacer es darle a Publicar. No dejes cambios esperando en
una rama a que alguien los fusione.

Antes de fusionar: comprobar que el PR está en `mergeable_state: clean` y que el CI (si
algún día se añade) está en verde. Si hay conflicto o algo falla, arreglarlo primero. Si un
cambio es arriesgado o tiene una decisión de producto abierta, decírselo a Juan antes de
fusionar en lugar de fusionar a ciegas.

## Validación antes de fusionar

No hay CI en el repo, así que las comprobaciones se hacen aquí:

```
npm ci                                # el contenedor arranca sin node_modules
npx tsc -p tsconfig.app.json --noEmit
npx eslint <archivos tocados>         # el repo arrastra ~40 problemas previos; no los arregles de paso
npx vitest run
npx vite build
```

Para cambios visuales, verificarlos de verdad en el navegador antes de fusionar. Chromium
viene preinstalado; Playwright hay que apuntarlo al binario:

```js
chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
```

Probar a 1280x800 y 390x844 como mínimo, porque bastante tráfico es móvil.

## Analítica y consentimiento

- gtag.js ya está en `index.html` con `G-03HDLKFQ5T` (GA4) y `AW-18316237534` (Ads). No lo
  añadas otra vez.
- `window.gtag` ya está declarado en `src/lib/analytics.ts`. No crees otro `.d.ts`: una
  segunda declaración global entra en conflicto de tipos.
- GA4 carga con **Consent Mode v2**, solo tras aceptar cookies. Una conversión solo se
  registra si el visitante aceptó. Usa siempre `window.gtag?.(...)` para que un adblocker
  no rompa nada.
- Conversiones de Ads en uso: lead del formulario en `src/lib/tracking.ts`, clic en el
  botón flotante de WhatsApp en `src/components/FloatingButtons.tsx`.

## Detalles de UI que conviene recordar

- Paleta: `--foreground` (195 56% 17%) y `--accent-warm` (195 56% 23%) se diferencian en un
  6 % de luminosidad. **No los pongas uno sobre otro**: el resultado es ilegible. Para que
  algo destaque, va sobre el crema `--background`.
- Capas: CTA móvil `z-40`, botones flotantes `z-50`, banner de cookies `z-[60]` sobre velo
  `z-[59]`.
- El banner de cookies publica su altura en `--cookie-banner-h` sobre el `<body>` y
  `FloatingButtons` la suma a su separación inferior, para que el botón de WhatsApp no
  quede tapado. Si cambias el alto del banner, no hay que tocar nada: se recalcula solo.
- **El preview del configurador refleja la elección del cliente** (decisión de septiembre
  de 2026, que revierte la silueta neutra de unos días antes): el color de la tela tiñe la
  pieza, el vivo se pinta con su color y la tela lateral se ve en los laterales. Lo que NO
  se hace es repetir la foto de la tela sobre la cara frontal (ese estampado en mosaico
  despistaba a los clientes): la cara frontal va en color liso y la foto se ve en las
  muestras del panel lateral y en la lupa (`FabricLightbox`).
- **Cualquier tela se puede ampliar al pulsarla** (`FabricLightbox`): en `/telas`, en las
  muestras del configurador y, en las rejillas del configurador, pulsando otra vez sobre la
  tela ya elegida. Si añades una rejilla de telas nueva, conecta la lupa.
- El texto de cookies puede tener gracia, pero los botones se quedan en "Aceptar" y
  "Rechazar" (etiquetas inequívocas, guía de la AEPD) y con la misma facilidad de
  pulsación.

## Idioma

El producto, la interfaz y los textos son en español. Los mensajes de commit y las
descripciones de PR, también.
