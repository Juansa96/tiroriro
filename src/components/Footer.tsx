import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import Logo from "./Logo";

const Footer = () => (
  <footer className="bg-secondary pt-8 pb-16 md:pt-10 md:pb-20">
    <div className="container mx-auto px-6 text-center">
      <Link to="/" className="inline-flex" aria-label="Tiroriro inicio">
        <Logo
          className="text-primary"
          viewBox="0 340 929 220"
          style={{ width: 200, height: "auto" }}
        />
      </Link>
      <p className="mt-4 text-base text-muted-foreground font-light max-w-md mx-auto">
        Hecho a mano en España · Envío a toda la península · contacto@tiroriro.com
      </p>
      <div className="mt-8 flex items-center justify-center">
        <a
          href="https://instagram.com/tiroriro"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Tiroriro"
          className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-light"
        >
          <Instagram size={16} />
          @tiroriro
        </a>
      </div>
      <p className="mt-10 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} Tiroriro. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
