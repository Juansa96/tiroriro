import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Palette, Ruler, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";

// Link-in-bio page pensada para el perfil de Instagram (@tirorirohome).
// Minimalista, sin navbar ni footer para maximizar conversión.
const LINKS = [
  {
    href: "/configurador?utm_source=instagram&utm_medium=bio&utm_campaign=linktree",
    label: "Diseña tu pieza",
    sub: "Configurador — cabeceros, bancos, pufs y más",
    icon: Sparkles,
  },
  {
    href: "/productos?utm_source=instagram&utm_medium=bio&utm_campaign=linktree",
    label: "Ver el catálogo",
    sub: "Todas las piezas y modelos",
    icon: Palette,
  },
  {
    href: "/telas?utm_source=instagram&utm_medium=bio&utm_campaign=linktree",
    label: "Todas las telas",
    sub: "Más de 60 telas básicas y premium",
    icon: Palette,
  },
  {
    href: "/guia-medidas-cabeceros?utm_source=instagram&utm_medium=bio&utm_campaign=linktree",
    label: "Guía de medidas",
    sub: "Qué cabecero encaja con tu cama",
    icon: Ruler,
  },
  {
    href: "https://wa.me/34660786453?text=Hola,%20os%20escribo%20desde%20Instagram",
    label: "Escríbenos por WhatsApp",
    sub: "Respondemos en menos de 24h",
    icon: MessageCircle,
    external: true,
  },
  {
    href: "https://www.instagram.com/tirorirohome/",
    label: "Volver a Instagram",
    sub: "@tirorirohome",
    icon: Instagram,
    external: true,
  },
];

const IgPage = () => (
  <>
    <SEO
      title="Tiroriro Home | Enlaces desde Instagram"
      description="Diseña tu pieza, mira el catálogo, elige tela o escríbenos. Hecho a mano en España."
      canonical="https://tirorirohome.com/ig"
      noIndex
    />
    <main className="min-h-screen bg-bone flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-light text-foreground">Tiroriro Home</h1>
          <p className="mt-2 text-sm text-muted-foreground font-light italic">
            Tapizados a medida, hechos a mano en España
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const content = (
              <div className="w-full flex items-center gap-4 px-5 py-4 bg-background border border-border rounded-lg hover:border-accent-warm hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-full bg-accent-warm/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-accent-warm" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground leading-tight">{link.label}</p>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">{link.sub}</p>
                </div>
              </div>
            );
            return link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <Link key={link.label} to={link.href}>{content}</Link>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[11px] tracking-[0.20em] uppercase text-muted-foreground/60 font-medium">
          @tirorirohome
        </p>
      </div>
    </main>
  </>
);

export default IgPage;