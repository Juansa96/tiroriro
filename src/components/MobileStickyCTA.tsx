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

    let contactVisible = false;
    const update = () => {
      const scrolled = window.scrollY > 600;
      setVisible(scrolled && !contactVisible);
    };

    // Observe #contacto to auto-hide the CTA when it's on screen. The
    // contact form is lazy-loaded, so retry finding it until it appears.
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    const attach = () => {
      const target = document.getElementById("contacto");
      if (!target || !("IntersectionObserver" in window)) return false;
      observer = new IntersectionObserver(
        (entries) => {
          contactVisible = entries[0]?.isIntersecting ?? false;
          update();
        },
        { rootMargin: "0px 0px -20% 0px", threshold: 0.05 }
      );
      observer.observe(target);
      return true;
    };

    if (!attach() && "MutationObserver" in window) {
      mutationObserver = new MutationObserver(() => {
        if (attach()) mutationObserver?.disconnect();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
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