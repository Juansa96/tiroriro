import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-secondary py-16 md:py-20">
    <div className="container mx-auto px-6 text-center">
      <Link to="/" className="font-serif text-2xl md:text-3xl font-semibold tracking-ultra-wide text-foreground">
        TIRO·RIRO
      </Link>

      <p className="mt-4 text-sm text-muted-foreground font-light max-w-md mx-auto">
        Hecho a mano en España · Envío a toda la península · contacto@tiroriro.com
      </p>

      <div className="mt-8 flex items-center justify-center gap-8 text-xs tracking-extra-wide uppercase text-muted-foreground">
        <Link to="/productos" className="hover:text-foreground transition-colors">Productos</Link>
        <Link to="/configurador" className="hover:text-foreground transition-colors">Diseña el tuyo</Link>
        <Link to="/contacto" className="hover:text-foreground transition-colors">Contacto</Link>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
          <Instagram size={18} />
        </a>
      </div>

      <p className="mt-10 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} TIRO·RIRO. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
