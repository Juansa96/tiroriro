import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MobileStickyCTA = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Hide on configurator (already has its own bottom bar), thank-you, legal pages
  const hiddenRoutes = ["/configurador", "/gracias", "/unsubscribe", "/privacidad", "/aviso-legal", "/cookies"];
  const isHidden = hiddenRoutes.some((r) => location.pathname.startsWith(r));

  useEffect(() => {
    if (isHidden) {
      setVisible(false);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHidden, location.pathname]);

  if (isHidden) return null;

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-3 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        background: "linear-gradient(to top, hsl(var(--background)) 70%, hsl(var(--background) / 0))",
      }}
    >
      <Link
        to="/configurador"
        className="block w-full text-center py-3.5 rounded-full text-sm font-medium tracking-wide shadow-lg"
        style={{
          backgroundColor: "hsl(var(--accent-warm))",
          color: "hsl(var(--background))",
        }}
        aria-label="Personalizar tu pieza en el configurador"
      >
        Personalizar tu pieza →
      </Link>
    </div>
  );
};

export default MobileStickyCTA;