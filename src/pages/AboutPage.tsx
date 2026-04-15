import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

// TODO: Replace with real photos when uploaded
const teamPhotos = {
  beatriz: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
  rocio: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
  inaki: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80",
  juan: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
};

const TEAM = [
  {
    name: "Beatriz",
    role: "LA ESTRATEGA",
    desc: "Bea es la que convierte una idea en una lista de tareas antes de que termines la frase — la que necesita que las cosas pasen, que se decidan y que se acaben — y si le preguntas si prefiere tener una idea perfecta en tres semanas o una buena idea mañana, ya sabes la respuesta.",
    photo: teamPhotos.beatriz,
  },
  {
    name: "Rocío",
    role: "LA CREATIVA",
    desc: "Rocío podría estar rediseñando un cabecero, eligiendo telas para tres pedidos y pensando en la próxima colección al mismo tiempo — sin parpadear — porque si pudiera vivir exclusivamente de imaginar cómo quedan las cosas, lo haría sin dudarlo un segundo.",
    photo: teamPhotos.rocio,
  },
  {
    name: "Iñaki",
    role: "EL QUE LO VENDE TODO",
    desc: "Iñaki podría vender mantas en agosto y sombrillas en enero — y los clientes le darían las gracias — es el que habla con cada persona que llega a Tiroriro, el que entiende lo que necesitan antes de que ellas mismas lo sepan, y el que se asegura de que todo llegue donde tiene que llegar.",
    photo: teamPhotos.inaki,
  },
  {
    name: "Juan",
    role: "EL TECNOLÓGICO",
    desc: "Juan es el responsable de que puedas leer esto — de que la web funcione, de que el configurador calcule bien, de que los datos digan lo que tienen que decir — y probablemente el único del equipo que sabe exactamente cuántas personas han llegado hasta esta frase.",
    photo: teamPhotos.juan,
  },
];

const AboutPage = () => (
  <>
    <Navbar />
    <main className="pt-20">
      {/* Hero */}
      <section className="py-20 md:py-28 px-6 bg-secondary">
        <div className="container mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">Las personas detrás de TIRO·RIRO</h1>
            <span className="section-line" />
            <p className="mt-6 text-muted-foreground font-light leading-relaxed max-w-xl mx-auto italic">
              "Dos parejas, dos hermanos, dos amigas de toda la vida — y un proyecto que nació porque ninguna de las dos encontraba lo que buscaba para su casa."
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* El origen */}
      <section className="py-20 md:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80"
                alt="Taller artesanal de tapicería con herramientas de trabajo"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                decoding="async"
              />
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <span className="font-serif text-3xl text-accent-warm font-light">01</span>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mt-2">El origen</h2>
              <p className="mt-4 text-muted-foreground font-light leading-relaxed">
                Dos amigas de toda la vida, dos bebés casi a la vez, dos casas nuevas que decorar — y ninguna web que tuviera lo que buscaban sin costar una fortuna o parecer el catálogo de un hotel de aeropuerto.
              </p>
              <p className="mt-4 text-muted-foreground font-light leading-relaxed">
                Beatriz y Rocío empezaron buscando un cabecero. Acabaron montando un taller. Sus parejas, Iñaki y Juan, se unieron al proyecto porque cuando ves algo que funciona, no te quedas mirando. Hoy TIRO·RIRO es eso: cuatro personas que creen que los muebles hechos a medida no tienen por qué costar un ojo de la cara.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20 md:py-28 px-6 bg-secondary">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">El equipo</h2>
            <span className="section-line" />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {TEAM.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="bg-background overflow-hidden">
                  <img
                    src={member.photo}
                    alt={`${member.name}, ${member.role.toLowerCase()} del equipo TIRO·RIRO`}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-medium text-foreground">{member.name}</h3>
                    <p className="mt-1 text-xs tracking-ultra-wide uppercase text-muted-foreground">{member.role}</p>
                    <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed italic">
                      "{member.desc}"
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* El taller */}
      <section className="py-20 md:py-28 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection delay={0.1}>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground">El taller</h2>
              <p className="mt-4 text-muted-foreground font-light leading-relaxed">
                Cada pieza de TIRO·RIRO se construye a mano en nuestro taller. Sin cadenas de montaje, sin producción masiva — solo manos expertas que cortan, tapizar y cosen con la misma atención que pondrían en su propia casa.
              </p>
              <p className="mt-4 text-muted-foreground font-light leading-relaxed">
                Trabajamos con más de 80 referencias de tela, estructuras de madera maciza y rellenos de alta densidad. El resultado es una pieza que dura, que se siente bien y que está hecha exactamente para ti.
              </p>
            </AnimatedSection>
            <AnimatedSection>
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80"
                alt="Manos artesanas trabajando en tapicería de muebles"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                decoding="async"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 bg-secondary text-center">
        <AnimatedSection>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">¿Hablamos?</h2>
          <p className="mt-4 text-muted-foreground font-light">Cuéntanos qué necesitas y te ayudamos a hacerlo realidad.</p>
          <Link
            to="/contacto"
            className="mt-8 inline-block px-10 py-3.5 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity"
          >
            Solicita información
          </Link>
        </AnimatedSection>
      </section>
    </main>
    <Footer />
  </>
);

export default AboutPage;
