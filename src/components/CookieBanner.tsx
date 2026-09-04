import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { safeLocalStorageGet } from "@/lib/safe-storage";
import { grantAnalyticsConsent, denyAnalyticsConsent } from "@/lib/analytics";

// Altura real del banner, publicada en el <body> para que el botón flotante de
// WhatsApp suba mientras está abierto y no quede tapado por la tarjeta.
const HEIGHT_VAR = "--cookie-banner-h";

// Pegatina: un monstruito propio (no es ningún personaje con licencia) zampándose
// una galleta. Es SVG en línea: no carga ninguna imagen, pesa unos 2 KB y no toca
// ni los botones ni el consentimiento. Solo decorativo (aria-hidden).
const MonstruoGaloso = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 96 96"
    className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 -mt-1 -ml-1 -rotate-6 drop-shadow-sm motion-safe:animate-[nom_1.6s_ease-in-out_infinite]"
  >
    <defs>
      <mask id="mordisco">
        <rect width="96" height="96" fill="white" />
        <circle cx="60" cy="56" r="9" fill="black" />
      </mask>
    </defs>
    {/* Borde blanco de pegatina */}
    <g fill="white" stroke="white" strokeWidth="7" strokeLinejoin="round">
      <circle cx="42" cy="56" r="30" />
      <circle cx="70" cy="62" r="13" />
    </g>
    {/* Pelo */}
    <g fill="#2E6F80">
      <circle cx="42" cy="56" r="30" />
      <circle cx="18" cy="42" r="6" /><circle cx="24" cy="30" r="6" /><circle cx="36" cy="24" r="6" />
      <circle cx="50" cy="24" r="6" /><circle cx="62" cy="31" r="6" /><circle cx="69" cy="43" r="6" />
      <circle cx="14" cy="56" r="5" /><circle cx="17" cy="70" r="5" />
    </g>
    {/* Ojos saltones */}
    <circle cx="33" cy="42" r="8.5" fill="white" /><circle cx="51" cy="39" r="9.5" fill="white" />
    <circle cx="35" cy="43" r="3.6" fill="#101820" /><circle cx="49" cy="41" r="4" fill="#101820" />
    <circle cx="36.3" cy="41.6" r="1.1" fill="white" /><circle cx="50.4" cy="39.4" r="1.2" fill="white" />
    {/* Boca abierta */}
    <path d="M24 60 Q42 52 60 62 Q54 78 40 78 Q28 76 24 60Z" fill="#141F26" />
    <path d="M32 71 Q42 66 52 72 Q46 77 40 77 Q35 76 32 71Z" fill="#C9535F" />
    {/* Galleta con mordisco */}
    <g mask="url(#mordisco)">
      <circle cx="70" cy="62" r="13" fill="#D9A866" />
      <circle cx="70" cy="62" r="13" fill="none" stroke="#B8843F" strokeWidth="1.5" />
    </g>
    <g fill="#5A3A1E">
      <circle cx="66" cy="66" r="1.8" /><circle cx="74" cy="69" r="1.6" /><circle cx="76" cy="59" r="1.5" /><circle cx="70" cy="72.5" r="1.3" />
    </g>
    {/* Mano */}
    <circle cx="61" cy="72" r="6" fill="#2E6F80" stroke="white" strokeWidth="2" />
    {/* Migas */}
    <g fill="#B8843F">
      <circle cx="20" cy="82" r="1.6" /><circle cx="28" cy="87" r="1.2" /><circle cx="56" cy="88" r="1.4" /><circle cx="64" cy="82" r="1.1" />
    </g>
  </svg>
);

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accepted = safeLocalStorageGet("cookies_accepted");
    if (!accepted) setVisible(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = bannerRef.current;
    const clear = () => document.body.style.removeProperty(HEIGHT_VAR);
    if (!visible || !el) {
      clear();
      return;
    }
    const sync = () => document.body.style.setProperty(HEIGHT_VAR, `${el.offsetHeight}px`);
    sync();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    observer?.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", sync);
      clear();
    };
  }, [visible]);

  const acceptAll = () => {
    grantAnalyticsConsent();
    setVisible(false);
  };

  const rejectAll = () => {
    denyAnalyticsConsent();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Velo que da protagonismo al banner. No bloquea el scroll ni los clics. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[59] bg-black/50 pointer-events-none"
      />

      <div
        ref={bannerRef}
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-desc"
        className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5 animate-fade-in-up"
      >
        <div className="mx-auto max-w-3xl rounded-2xl bg-background text-foreground shadow-2xl ring-1 ring-foreground/10 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <MonstruoGaloso />

            <div className="flex-1 min-w-0">
              <p id="cookie-banner-title" className="font-serif text-lg sm:text-xl font-light">
                Cookies (las nuestras no se comen)
              </p>
              <p id="cookie-banner-desc" className="mt-1.5 text-sm font-light leading-relaxed text-foreground/75">
                Las técnicas mantienen la web en pie. Las analíticas (GA4) nos cuentan qué cabeceros
                te enamoran, para acertar más. Tú eliges, y esta decisión —prometido— no te va a
                quitar el sueño.{" "}
                <Link to="/cookies" className="underline underline-offset-2 hover:opacity-80">
                  Más info
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
            <button
              onClick={rejectAll}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-foreground/30 text-sm font-medium hover:bg-foreground/5 transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={acceptAll}
              className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "hsl(var(--accent-warm))",
                color: "hsl(var(--accent-warm-foreground))",
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;
