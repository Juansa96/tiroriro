import AnimatedSection from "./AnimatedSection";

const TESTIMONIALS = [
  {
    name: "Sara M.",
    location: "Madrid",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    text: "Pedí un cabecero en lino crudo para una cama de 150 y quedó exactamente como lo imaginaba. Beatriz me llamó al día siguiente de rellenar el formulario y en 12 días lo tenía en casa. El acabado es precioso — y el precio, muy por debajo de lo que esperaba.",
  },
  {
    name: "Alejandro R.",
    location: "Barcelona",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    text: "Llevaba meses buscando un banco para el pie de la cama que no pareciese de catálogo. Lo encontré aquí. Me dejaron elegir la tela, el color y la altura — y llegó en dos semanas con un embalaje muy cuidado. Repetiré sin duda.",
  },
  {
    name: "Cristina L.",
    location: "Valencia",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    text: "Tenía dudas porque es una compra importante sin verlo en persona. Rocío me mandó muestras de tela antes de confirmar y resolvió todas mis dudas por teléfono. El resultado es espectacular. Mi dormitorio ha cambiado por completo.",
  },
];

const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(29,43%,59%)" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </svg>
);

const Testimonials = () => (
  <section className="py-20 md:py-32 px-6 bg-background">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Lo que dicen nuestros clientes</h2>
        <span className="section-line" />
        <p className="mt-6 text-muted-foreground font-light italic">
          "No lo decimos nosotros — lo dicen ellos."
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        {TESTIMONIALS.map((t, i) => (
          <AnimatedSection key={t.name} delay={i * 0.12}>
            <div className="bg-background border border-border rounded shadow-sm p-6 md:p-8 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.photo}
                  alt={`Foto de ${t.name}, cliente de TIRO·RIRO en ${t.location}`}
                  className="w-16 h-16 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="font-serif font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} />)}
              </div>
              <p className="text-sm font-light text-muted-foreground italic leading-relaxed flex-1">
                "{t.text}"
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
