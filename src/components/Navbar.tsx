import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-tiroriro.jpeg";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/productos", label: "Productos" },
  { to: "/#equipo", label: "Quiénes somos" },
  { to: "/#testimoniales", label: "Testimoniales" },
  { to: "/configurador", label: "Diseña el tuyo" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  const handleClick = (to: string) => {
    if (to.startsWith('/#') && location.pathname === '/') {
      const el = document.getElementById(to.slice(2));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setOpen(false);
        return true;
      }
    }
    return false;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-6">
        <Link to="/">
          <img src={logo} alt="TIRO·RIRO" className="h-8 md:h-10 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => {
                if (handleClick(link.to)) e.preventDefault();
              }}
              className="nav-link-underline text-sm tracking-extra-wide uppercase text-foreground hover:text-foreground transition-colors font-body font-light pb-0.5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/#contacto"
            onClick={(e) => {
              if (handleClick('/#contacto')) e.preventDefault();
            }}
            className="ml-4 px-4 py-2 rounded-full bg-accent-warm text-white text-xs tracking-wide uppercase font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Solicita información
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 top-16 bg-foreground/40 z-40"
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
                  className="text-sm tracking-extra-wide uppercase text-foreground hover:text-accent-warm transition-colors font-body"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/#contacto"
                onClick={(e) => {
                  if (handleClick('/#contacto')) e.preventDefault();
                }}
                className="text-sm tracking-extra-wide uppercase text-accent-warm hover:text-accent-warm transition-colors font-body font-medium"
              >
                Solicita información
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
