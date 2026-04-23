import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safe-storage";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = safeLocalStorageGet("cookies_accepted");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    safeLocalStorageSet("cookies_accepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm font-light">
          Usamos cookies técnicas necesarias para el funcionamiento de la web. Sin ellas, algunas funciones no estarán disponibles.{" "}
          <Link to="/cookies" className="underline hover:opacity-80">
            Más información
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 bg-accent-warm text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
          >
            Aceptar
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 border border-primary-foreground/40 text-primary-foreground text-sm font-light rounded hover:bg-primary-foreground/10 transition-colors"
          >
            Solo necesarias
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
