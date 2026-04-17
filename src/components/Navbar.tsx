import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/productos", label: "Productos" },
  { to: "/configurador", label: "Diseña el tuyo" },
  { to: "/#equipo", label: "Quiénes somos" },
  { to: "/contacto", label: "Solicita información", highlight: true },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  const handleClick = (to: string) => {
    if (to.startsWith("/#") && location.pathname === "/") {
      const el = document.getElementById(to.slice(2));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
        return true;
      }
    }
    return false;
  };

  const onHero = !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-20 md:h-24 px-6">
        <Link to="/" className="flex items-center" aria-label="Tiroriro inicio">
          <Logo
            className={onHero ? "text-white" : "text-primary"}
            viewBox="100 335 730 225"
            style={{
              width: typeof window !== "undefined" && window.innerWidth >= 768 ? 130 : 90,
marginTop: "-10px",
              height: "auto",
              display: "block",
              filter: onHero ? "drop-shadow(0px 1px 3px rgba(0,0,0,0.4))" : undefined,
            }}
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isHighlight = link.highlight;
            if (isHighlight) {
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => {
                    if (handleClick(link.to)) e.preventDefault();
                  }}
                  className={`text-sm tracking-extra-wide uppercase font-body font-light transition-all duration-300 ${
                    scrolled
                      ? "border border-primary text-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground"
                      : "text-white px-0 py-0 border border-transparent hover:opacity-80"
                  }`}
                  style={onHero ? { textShadow: "0 1px 3px rgba(0,0,0,0.4)" } : {}}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => {
                  if (handleClick(link.to)) e.preventDefault();
                }}
                className={`nav-link-underline text-sm tracking-extra-wide uppercase hover:opacity-80 transition-colors font-body font-light pb-0.5 ${
                  onHero ? "text-white underline-white" : "text-foreground underline-primary"
                }`}
                style={onHero ? { textShadow: "0 1px 3px rgba(0,0,0,0.4)" } : {}}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={onHero ? "md:hidden text-white" : "md:hidden text-foreground"}
          aria-label="Menú"
          style={onHero ? { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" } : undefined}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 top-20 bg-foreground/40 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="md:hidden relative z-50 bg-background/95 backdrop-blur-sm border-b border-border animate-in slide-in-from-top-2 duration-200">
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => {
                    if (handleClick(link.to)) e.preventDefault();
                  }}
                  className="text-sm tracking-extra-wide uppercase text-foreground hover:text-primary transition-colors font-body"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
