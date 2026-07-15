import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import AnimatedSection from "./AnimatedSection";

type Review = {
  name: string;
  location: string;
  photo: string;
  text: string;
};

const REVIEWS: Review[] = [
  { name: "Íñigo Camino", location: "Cliente verificado", photo: "/reviews/inigo-camino.jpg", text: "Todo un acierto. De diez. El cabecero me llegó en perfecto estado y muy protegido. Es exactamente igual que en las fotos. Se nota el trabajo artesanal y la cercanía de Juan y Bea a la hora de personalizarlo a mi gusto. Volveré a comprar." },
  { name: "Ana Cuadrado", location: "Cliente verificado", photo: "/reviews/ana-cuadrado.jpg", text: "Estaba un poco reticente a comprar este tipo de textil online sin tocarlo antes, pero la web es muy intuitiva y las fotos reflejan muy bien la realidad. El pedido llegó a tiempo y la calidad del producto cumple de sobra con lo prometido. Buena relación calidad-precio." },
  { name: "Alex Gutiérrez", location: "Cliente verificado", photo: "/reviews/alex-gutierrez.jpg", text: "No suelo poner reseñas, pero la experiencia ha sido tan buena que espero que mucha más gente la tenga. Nuestro cabecero nuevo es precioso y se nota la atención al detalle, pero lo que más me ha gustado ha sido el trato, la recomendación fantástica para elegir la tela y la puntualidad del envío. Millones de gracias!" },
  { name: "María Gómez de Olea", location: "Cliente verificado", photo: "/reviews/maria-gomez-de-olea.jpg", text: "Increíble el trato de Tiroriro, súper recomendables! Beatriz es encantadora, me atendió fenomenal y el pedido llegó en tiempo y forma. Aparte, me he hecho un estudio de mercado de precios y estos son los que mejor salen con diferencia." },
  { name: "Vari Álvarez", location: "Cliente verificado", photo: "/reviews/vari-alvarez.jpg", text: "Tenía bastantes dudas sobre el tono exacto de la tela para el cabecero y les escribí por atención al cliente. Me atendieron de maravilla, me asesoraron súper bien con los colores y el resultado en casa ha sido espectacular. La tela tiene un tacto increíble, se nota que es de buena calidad." },
  { name: "Isabel Plettenberg", location: "Cliente verificado", photo: "/reviews/isabel-plettenberg.jpg", text: "Hemos encargado un cabecero con forma conta de medidas 1,80x1,20. Estamos felices con el resultado. Todo el proceso ha sido muy fácil y rápido. En dos semanas lo teníamos en casa. Muy recomendable!" },
  { name: "David Franco", location: "Cliente verificado", photo: "/reviews/david-franco.jpg", text: "Buscábamos un cabecero que saliera un poco de lo típico que ves en todas las grandes superficies y dimos con esta web. El diseño es moderno pero atemporal, y la calidad del tejido es brutal. Un descubrimiento de marca, la verdad." },
  { name: "María Espa", location: "Cliente verificado", photo: "/reviews/maria-espa.jpg", text: "Da gusto abrir un paquete cuando viene todo tan bien presentado y protegido. Desde el minuto uno te das cuenta de que es una marca con identidad. El cabecero que compramos queda de revista, todo el mundo que entra a la habitación nos pregunta de dónde es." },
  { name: "Manuel Álvarez", location: "Cliente verificado", photo: "/reviews/manuel-alvarez.jpg", text: "Descubrí Tiroriro buscando un cabecero a medida y la experiencia ha sido muy buena. Lo que más me gustó fue la posibilidad de personalizar prácticamente todo: medidas, forma y tejido, algo que no es tan fácil de encontrar." },
  { name: "SyM", location: "Cliente verificado", photo: "/reviews/sym.jpg", text: "Hubo una pequeña confusión con la dirección de entrega por parte de la agencia de transportes, pero el equipo de Tiroriro lo solucionó el mismo día de forma súper amable. El cabecero ya está puesto y no puedo estar más contenta. Da gusto comprar en marcas que cuidan así al cliente." },
];

const reviewJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://tirorirohome.com/#organization",
  "name": "Tiroriro",
  "url": "https://tirorirohome.com",
  "review": REVIEWS.map((r) => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": r.name },
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "reviewBody": r.text,
  })),
};

const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(29,43%,59%)" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </svg>
);

const Avatar = ({ review }: { review: Review }) => {
  const [failed, setFailed] = useState(false);
  const initial = review.name.trim().charAt(0).toUpperCase();
  if (failed) {
    return (
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center bg-secondary text-foreground font-serif text-xl ring-2 ring-border shrink-0"
        aria-label={`Inicial de ${review.name}`}
      >
        {initial}
      </div>
    );
  }
  return (
    <img
      src={review.photo}
      alt={`Foto de ${review.name}, cliente de Tiroriro`}
      className="w-14 h-14 rounded-full object-cover ring-2 ring-border shrink-0"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};

const ReviewsCarousel = () => {
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplayRef.current]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (i: number) => emblaApi?.scrollTo(i);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(reviewJsonLd)}</script>
      </Helmet>
      <section id="resenas" className="py-20 md:py-32 px-6 bg-background">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">
              Lo que dicen quienes ya lo tienen
            </h2>
            <span className="section-line" />
            <p className="mt-6 text-muted-foreground font-light italic text-base">
              "No lo decimos nosotros — lo dicen ellos."
            </p>
          </AnimatedSection>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4 md:-ml-6">
                {REVIEWS.map((r) => (
                  <div
                    key={r.name}
                    className="pl-4 md:pl-6 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <article className="h-full bg-secondary border border-border rounded shadow-sm p-6 md:p-8 flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar review={r} />
                        <div>
                          <p className="font-serif font-medium text-foreground">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-3" aria-label="5 de 5 estrellas">
                        {[...Array(5)].map((_, j) => <Star key={j} />)}
                      </div>
                      <p className="text-base font-light italic text-muted-foreground leading-relaxed flex-1">
                        "{r.text}"
                      </p>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Reseña anterior"
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-6 w-10 h-10 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm"
            >
              <ChevronLeft size={18} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Siguiente reseña"
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-6 w-10 h-10 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm"
            >
              <ChevronRight size={18} strokeWidth={1.6} />
            </button>

            <div className="mt-8 flex md:hidden justify-center gap-3">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Reseña anterior"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <ChevronLeft size={18} strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Siguiente reseña"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <ChevronRight size={18} strokeWidth={1.6} />
              </button>
            </div>

            {scrollSnaps.length > 1 && (
              <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Indicadores de reseñas">
                {scrollSnaps.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-label={`Ir a la reseña ${i + 1}`}
                    aria-selected={i === selectedIndex}
                    onClick={() => scrollTo(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === selectedIndex
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-border hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsCarousel;