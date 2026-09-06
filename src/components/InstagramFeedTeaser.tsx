import { Instagram } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

// Static curated grid of real product photos that links out to Instagram.
// (Sin API: la mayoría de embeds oficiales requieren aprobación del user, aquí
//  reutilizamos fotos reales del catálogo y mandamos el clic a @tirorirohome.)
const PHOTOS = [
  "/productos-fotos/cabeceros/calobra-02.webp",
  "/productos-fotos/bancos/banco-entelado.png",
  "/productos-fotos/pantallas/almanzor-01.webp",
  "/productos-fotos/puff/puff-nuevo.webp",
  "/productos-fotos/cabeceros/pregonda-01.webp",
  "/productos-fotos/mesas-centro/cabo-de-palos.webp",
];

const IG_URL =
  "https://www.instagram.com/tirorirohome/?utm_source=web&utm_medium=home_feed&utm_campaign=to_instagram";

const InstagramFeedTeaser = () => (
  <section className="py-16 md:py-24 px-6 bg-bone">
    <div className="container mx-auto max-w-5xl">
      <AnimatedSection className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3 text-muted-foreground">
          <Instagram size={16} strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.24em] uppercase font-medium">Síguenos</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
          Nuestro día a día en Instagram
        </h2>
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-accent-warm hover:underline font-light"
        >
          @tirorirohome
        </a>
      </AnimatedSection>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
        {PHOTOS.map((src, i) => (
          <a
            key={src}
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-square overflow-hidden group"
            aria-label={`Ver foto ${i + 1} en Instagram`}
          >
            <img
              src={src}
              alt="Tapizado a medida hecho a mano en España — Tiroriro"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
              <Instagram
                size={22}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </a>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sweep btn-unir btn-unir-outline inline-flex items-center px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
        >
          <span className="relative z-10">Ver más en Instagram →</span>
        </a>
      </div>
    </div>
  </section>
);

export default InstagramFeedTeaser;