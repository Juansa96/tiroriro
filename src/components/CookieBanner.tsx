import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { safeLocalStorageGet } from "@/lib/safe-storage";
import { grantAnalyticsConsent, denyAnalyticsConsent } from "@/lib/analytics";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = safeLocalStorageGet("cookies_accepted");
    if (!accepted) setVisible(true);
  }, []);

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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-foreground/95 text-primary-foreground backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2 flex flex-row items-center justify-between gap-3">
        <p className="text-xs font-light leading-snug flex-1 min-w-0 truncate">
          Cookies técnicas y analíticas (GA4).{" "}
          <Link to="/cookies" className="underline hover:opacity-80">Más info</Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={rejectAll}
            className="px-3 py-1 text-xs font-light hover:opacity-80 transition-opacity"
          >
            Rechazar
          </button>
          <button
            onClick={acceptAll}
            className="px-3 py-1 bg-accent-warm text-white text-xs font-medium rounded hover:opacity-90 transition-opacity"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
