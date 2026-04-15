import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import logo from "@/assets/logo-tiroriro.jpeg";

const Footer = () => (
  <footer className="bg-secondary py-16 md:py-20">
    <div className="container mx-auto px-6 text-center">
      <Link to="/">
        <img src={logo} alt="TIRO·RIRO" className="h-10 w-auto mx-auto" />
      </Link>

      <p className="mt-4 text-base text-muted-foreground font-light max-w-md mx-auto">
        Hecho a mano en España · Envío a toda la península · contacto@tiroriro.com
      </p>

      <div className="mt-8 flex items-center justify-center gap-8 text-xs tracking-extra-wide uppercase text-muted-foreground">
        <Link to="/productos" className="hover:text-foreground transition-colors">Productos</Link>
        <Link to="/#equipo" className="hover:text-foreground transition-colors">Quiénes somos</Link>
        <Link to="/configurador" className="hover:text-foreground transition-colors">Diseña el tuyo</Link>
        <Link to="/#contacto" className="hover:text-foreground transition-colors">Solicita información</Link>
        <a href="https://instagram.com/tiroriro" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Instagram de TIRO·RIRO">
          <Instagram size={18} />
        </a>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <Link to="/aviso-legal" className="hover:text-foreground transition-colors">Aviso Legal</Link>
        <span>·</span>
        <Link to="/privacidad" className="hover:text-foreground transition-colors">Política de Privacidad</Link>
        <span>·</span>
        <Link to="/cookies" className="hover:text-foreground transition-colors">Política de Cookies</Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} TIRO·RIRO. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
