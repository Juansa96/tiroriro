import AnimatedSection from "./AnimatedSection";

const TEAM = [
  {
    name: "Beatriz",
    role: "LA ESTRATEGA",
    desc: "Bea es la que convierte una idea en una lista de tareas antes de que termines la frase — la que necesita que las cosas pasen, que se decidan y que se acaben — y si le preguntas si prefiere tener una idea perfecta en tres semanas o una buena idea mañana, ya sabes la respuesta.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
  },
  {
    name: "Rocío",
    role: "LA CREATIVA",
    desc: "Rocío podría estar rediseñando un cabecero, eligiendo telas para tres pedidos y pensando en la próxima colección al mismo tiempo — sin parpadear — porque si pudiera vivir exclusivamente de imaginar cómo quedan las cosas, lo haría sin dudarlo un segundo.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
  },
  {
    name: "Iñaki",
    role: "EL QUE LO VENDE TODO",
    desc: "Iñaki podría vender mantas en agosto y sombrillas en enero — y los clientes le darían las gracias — es el que habla con cada persona que llega a Tiroriro, el que entiende lo que necesitan antes de que ellas mismas lo sepan, y el que se asegura de que todo llegue donde tiene que llegar.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80",
  },
  {
    name: "Juan",
    role: "EL TECNOLÓGICO",
    desc: "Juan es el responsable de que puedas leer esto — de que la web funcione, de que el configurador calcule bien, de que los datos digan lo que tienen que decir — y probablemente el único del equipo que sabe exactamente cuántas personas han llegado hasta esta frase.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
  },
];

const TeamSection = () => (
  <section id="equipo" className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Los que están detrás</h2>
        <span className="section-line" />
        <p className="mt-6 text-muted-foreground font-light max-w-xl mx-auto italic">
          "Dos parejas, dos hermanos, dos amigas de toda la vida — y un proyecto que nació porque ninguna de las dos encontraba lo que buscaba para su casa."
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
        {TEAM.map((member, i) => (
          <AnimatedSection key={member.name} delay={i * 0.1}>
            <div className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full mx-auto grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                decoding="async"
              />
              <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">{member.name}</h3>
              <p className="mt-1 text-xs tracking-ultra-wide uppercase text-muted-foreground">{member.role}</p>
              <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed italic max-w-sm mx-auto">
                "{member.desc}"
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;
