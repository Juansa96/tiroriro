import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    alt: "Dormitorio elegante con cabecero tapizado en tonos neutros",
    large: true,
  },
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    alt: "Cabecero de lino natural en habitación luminosa",
    large: false,
  },
  {
    src: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=600&q=80",
    alt: "Cabecero tapizado con patas en dormitorio moderno",
    large: false,
  },
  {
    src: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80",
    alt: "Cabecero capitoné en dormitorio con estilo clásico",
    large: true,
  },
  {
    src: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80",
    alt: "Banco entelado al pie de cama en habitación acogedora",
    large: false,
  },
  {
    src: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
    alt: "Cojines decorativos artesanales sobre cama",
    large: false,
  },
];

const InspirationGallery = () => (
  <section className="py-20 md:py-28 px-6 bg-background">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Así quedan en casa</h2>
        <span className="section-line" />
        <p className="mt-6 text-muted-foreground font-light italic">
          "Algunos dormitorios de clientes nuestros — o cómo debería verse el tuyo."
        </p>
      </AnimatedSection>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
        {PHOTOS.map((photo, i) => (
          <AnimatedSection
            key={i}
            delay={i * 0.08}
            className={`${
              i === 0 ? 'md:row-span-2' : ''
            } ${
              i === 3 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="overflow-hidden rounded">
              <img
                src={photo.src}
                alt={photo.alt}
                className={`w-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer ${
                  i === 0 ? 'aspect-[3/4] md:h-full' : i === 3 ? 'aspect-[2/1] md:aspect-[2/1]' : 'aspect-square'
                }`}
                loading="lazy"
                decoding="async"
              />
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.5} className="text-center mt-12">
        <Link to="/contacto" className="cta-link">
          ¿Quieres que el tuyo sea el próximo? →
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default InspirationGallery;
