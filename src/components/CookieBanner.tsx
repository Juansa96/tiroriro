import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { safeLocalStorageGet } from "@/lib/safe-storage";
import { grantAnalyticsConsent, denyAnalyticsConsent } from "@/lib/analytics";

// Altura real del banner, publicada en el <body> para que el botón flotante de
// WhatsApp suba mientras está abierto y no quede tapado por la tarjeta.
const HEIGHT_VAR = "--cookie-banner-h";

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
            <span
              aria-hidden="true"
              className="hidden sm:flex shrink-0 items-center justify-center w-11 h-11 rounded-full"
              style={{ backgroundColor: "hsl(var(--accent-warm))" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z" />
                <circle cx="9" cy="10" r="1" fill="white" stroke="none" />
                <circle cx="14" cy="15" r="1" fill="white" stroke="none" />
                <circle cx="8.5" cy="15.5" r="1" fill="white" stroke="none" />
              </svg>
            </span>

            <div className="flex-1 min-w-0">
              <p id="cookie-banner-title" className="font-serif text-lg sm:text-xl font-light">
                Usamos cookies
              </p>
              <p id="cookie-banner-desc" className="mt-1.5 text-sm font-light leading-relaxed text-foreground/75">
                Técnicas para que la web funcione y analíticas (GA4) para entender cómo se usa y mejorarla.
                Tú decides.{" "}
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
