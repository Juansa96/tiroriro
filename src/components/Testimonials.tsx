import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AnimatedSection from "./AnimatedSection";
import francescaPhoto from "@/assets/testimonials/francesca-cirenei.webp";
import gabrielPhoto from "@/assets/testimonials/gabriel-di-stefano.webp";
import almuPhoto from "@/assets/testimonials/almu-alonso.webp";

const TESTIMONIALS = [
  { name: "Francesca Cirenei", location: "Villanueva de la Cañada - Madrid", photo: francescaPhoto, text: "Pedí un cabecero en lino crudo para una cama de 150 y quedó exactamente como lo imaginaba. Beatriz me llamó al día siguiente de rellenar el formulario y en 12 días lo tenía en casa. El acabado es precioso y todo el proceso fue muchísimo más fácil de lo que esperaba." },
  { name: "Gabriel Di Stefano", location: "Zaragoza", photo: gabrielPhoto, text: "Llevaba meses buscando un banco para el pie de la cama que no fuera la típica pieza estándar. Lo encontré aquí. Me dejaron elegir la tela, el color y la altura — y llegó en dos semanas con un embalaje muy cuidado. Repetiré sin duda." },
  { name: "Almu Alonso", location: "Tres Cantos - Madrid", photo: almuPhoto, text: "Tenía dudas porque es una compra importante sin verlo en persona. Rocío resolvió todas mis dudas por teléfono y me ayudó a elegir la tela perfecta. El resultado es espectacular. Mi dormitorio ha cambiado por completo." },
];

const reviewJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://tirorirohome.com/#organization",
  "name": "Tiroriro",
  "url": "https://tirorirohome.com",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": TESTIMONIALS.length,
    "bestRating": "5",
  },
  "review": TESTIMONIALS.map((t) => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": t.name },
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "reviewBody": t.text,
  })),
};

const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(29,43%,59%)" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </svg>
);

const Testimonials = () => (
  <>
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(reviewJsonLd)}</script>
  </Helmet>
  <section id="testimoniales" className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Lo que dicen nuestros clientes</h2>
        <span className="section-line" />
        <p className="mt-6 text-muted-foreground font-light italic text-base">"No lo decimos nosotros — lo dicen ellos."</p>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        {TESTIMONIALS.map((t, i) => (
          <AnimatedSection key={t.name} delay={i * 0.12}>
            <div className="bg-background border border-border rounded shadow-sm p-6 md:p-8 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <img src={t.photo} alt={`Foto de ${t.name}, cliente de Tiroriro en ${t.location}`} className="w-16 h-16 rounded-full object-cover" loading="lazy" decoding="async" />
                <div>
                  <p className="font-serif font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => <Star key={j} />)}</div>
              <p className="text-base font-light text-muted-foreground italic leading-relaxed flex-1">"{t.text}"</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link
          to="/configurador"
          className="btn-sweep btn-unir btn-unir-outline inline-flex items-center px-8 py-3 text-xs font-light"
        >
          <span className="relative z-10">Diseña el tuyo</span>
        </Link>
      </div>
    </div>
  </section>
  </>
);

export default Testimonials;
