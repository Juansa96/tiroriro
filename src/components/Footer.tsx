import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import Logo from "./Logo";

const Footer = () => (
  <footer className="bg-secondary py-16 md:py-20">
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
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs tracking-widest uppercase text-muted-foreground font-light">
        <Link to="/productos" className="hover:text-foreground transition-colors">Productos</Link>
        <Link to="/configurador" className="hover:text-foreground transition-colors">Diseña el tuyo</Link>
        <Link to="/#equipo" className="hover:text-foreground transition-colors">Quiénes somos</Link>
        <Link to="/contacto" className="hover:text-foreground transition-colors">Solicita información</Link>
        <a
          href="https://instagram.com/tiroriro"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Tiroriro"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
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
