import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet-async";
import AnimatedSection from "./AnimatedSection";

// TODO: sustituir por el enlace real al perfil de Google Business de Tiroriro Home.
const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=Tiroriro+Home+opiniones";
const GOOGLE_RATING = "4,9";
const GOOGLE_REVIEW_COUNT = 47;

type Review = {
  name: string;
  location: string;
  text: string;
};

const REVIEWS: Review[] = [
  { name: "Íñigo Camino", location: "Cliente verificado", text: "Todo un acierto. De diez. El cabecero me llegó en perfecto estado y muy protegido. Es exactamente igual que en las fotos. Se nota el trabajo artesanal y la cercanía de Juan y Bea a la hora de personalizarlo a mi gusto. Volveré a comprar." },
  { name: "Ana Cuadrado", location: "Cliente verificado", text: "Estaba un poco reticente a comprar este tipo de textil online sin tocarlo antes, pero la web es muy intuitiva y las fotos reflejan muy bien la realidad. El pedido llegó a tiempo y la calidad del producto cumple de sobra con lo prometido. Buena relación calidad-precio." },
  { name: "Alex Gutiérrez", location: "Cliente verificado", text: "No suelo poner reseñas, pero la experiencia ha sido tan buena que espero que mucha más gente la tenga. Nuestro cabecero nuevo es precioso y se nota la atención al detalle, pero lo que más me ha gustado ha sido el trato, la recomendación fantástica para elegir la tela y la puntualidad del envío. Millones de gracias!" },
  { name: "María Gómez de Olea", location: "Cliente verificado", text: "Increíble el trato de Tiroriro, súper recomendables! Beatriz es encantadora, me atendió fenomenal y el pedido llegó en tiempo y forma. Aparte, me he hecho un estudio de mercado de precios y estos son los que mejor salen con diferencia." },
  { name: "Vari Álvarez", location: "Cliente verificado", text: "Tenía bastantes dudas sobre el tono exacto de la tela para el cabecero y les escribí por atención al cliente. Me atendieron de maravilla, me asesoraron súper bien con los colores y el resultado en casa ha sido espectacular. La tela tiene un tacto increíble, se nota que es de buena calidad." },
  { name: "Isabel Plettenberg", location: "Cliente verificado", text: "Hemos encargado un cabecero con forma conta de medidas 1,80x1,20. Estamos felices con el resultado. Todo el proceso ha sido muy fácil y rápido. En dos semanas lo teníamos en casa. Muy recomendable!" },
  { name: "David Franco", location: "Cliente verificado", text: "Buscábamos un cabecero que saliera un poco de lo típico que ves en todas las grandes superficies y dimos con esta web. El diseño es moderno pero atemporal, y la calidad del tejido es brutal. Un descubrimiento de marca, la verdad." },
  { name: "María Espa", location: "Cliente verificado", text: "Da gusto abrir un paquete cuando viene todo tan bien presentado y protegido. Desde el minuto uno te das cuenta de que es una marca con identidad. El cabecero que compramos queda de revista, todo el mundo que entra a la habitación nos pregunta de dónde es." },
  { name: "Manuel Álvarez", location: "Cliente verificado", text: "Descubrí Tiroriro buscando un cabecero a medida y la experiencia ha sido muy buena. Lo que más me gustó fue la posibilidad de personalizar prácticamente todo: medidas, forma y tejido, algo que no es tan fácil de encontrar." },
  { name: "SyM", location: "Cliente verificado", text: "Hubo una pequeña confusión con la dirección de entrega por parte de la agencia de transportes, pero el equipo de Tiroriro lo solucionó el mismo día de forma súper amable. El cabecero ya está puesto y no puedo estar más contenta. Da gusto comprar en marcas que cuidan así al cliente." },
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
  const initial = review.name.trim().charAt(0).toUpperCase();
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-serif text-xl text-white ring-2 ring-border"
      style={{ backgroundColor: "#1a4b5b" }}
      aria-label={`Inicial de ${review.name}`}
    >
      {initial}
    </div>
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
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-foreground hover:text-accent-warm transition-colors group"
              aria-label={`${GOOGLE_RATING} sobre 5 en Google · ${GOOGLE_REVIEW_COUNT} reseñas. Ver en Google.`}
            >
              <span className="flex gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, j) => <Star key={j} />)}
              </span>
              <span className="font-medium">{GOOGLE_RATING}/5 en Google</span>
              <span className="text-muted-foreground font-light">· {GOOGLE_REVIEW_COUNT} reseñas</span>
              <ExternalLink size={12} strokeWidth={1.6} className="text-muted-foreground group-hover:text-accent-warm" />
            </a>
          </AnimatedSection>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4 md:-ml-6">
                {REVIEWS.map((r) => (
                  <div
                    key={r.name}
                    className="pl-4 md:pl-6 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <a
                      href={GOOGLE_REVIEWS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Leer reseña de ${r.name} en Google`}
                      className="block h-full"
                    >
                    <article className="h-full bg-secondary border border-border rounded shadow-sm p-6 md:p-8 flex flex-col hover:border-accent-warm/40 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar review={r} />
                        <div>
                          <p className="font-serif font-medium text-foreground">{r.name}</p>
                          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                            Reseña en Google <ExternalLink size={10} strokeWidth={1.6} />
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-3" aria-label="5 de 5 estrellas">
                        {[...Array(5)].map((_, j) => <Star key={j} />)}
                      </div>
                      <p className="text-base font-light italic text-muted-foreground leading-relaxed flex-1">
                        "{r.text}"
                      </p>
                    </article>
                    </a>
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