import inakiRocioPhoto from "@/assets/team/inaki-rocio.jpeg";
import juanBeaPhoto from "@/assets/team/juan-bea.jpeg";

const COUPLES = [
  {
    photo: inakiRocioPhoto,
    photoAlt: "Iñaki y Rocío, pareja fundadora de Tiroriro",
    members: [
      {
        name: "Iñaki",
        role: "EL QUE LO VENDE TODO",
        desc: "Iñaki podría vender mantas en agosto y sombrillas en enero — y los clientes le darían las gracias — es el que habla con cada persona que llega a Tiroriro, entiende lo que necesitan antes que ellas mismas y se asegura de que todo llegue donde tiene que llegar.",
      },
      {
        name: "Rocío",
        role: "LA CREATIVA",
        desc: "Rocío podría rediseñar un cabecero, elegir telas para tres pedidos y pensar en la próxima colección al mismo tiempo — sin parpadear — porque si pudiera vivir exclusivamente de imaginar cómo quedan las cosas, lo haría sin dudarlo un segundo.",
      },
    ],
  },
  {
    photo: juanBeaPhoto,
    photoAlt: "Juan y Beatriz, pareja fundadora de Tiroriro",
    members: [
      {
        name: "Juan",
        role: "EL TECNOLÓGICO",
        desc: "Juan es el responsable de que puedas leer esto — de que la web funcione, de que el configurador calcule bien y de que los datos digan lo que tienen que decir — probablemente el único del equipo que sabe cuántas personas han llegado hasta esta frase.",
      },
      {
        name: "Beatriz",
        role: "LA ESTRATEGA",
        desc: "Bea convierte una idea en una lista de tareas antes de que termines la frase — necesita que las cosas pasen, que se decidan y que se acaben — y si le preguntas si prefiere una idea perfecta en tres semanas o una buena idea mañana, ya sabes la respuesta.",
      },
    ],
  },
];

const TeamSection = () => (
  <section id="equipo" className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Quiénes somos</h2>
        <span className="section-line" />
        <p className="mt-6 text-muted-foreground font-light max-w-xl mx-auto italic text-base">
          "Dos matrimonios, dos hermanos y dos amigas — y un proyecto que nació porque ninguna de las dos encontraba lo que buscaba para su casa."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 max-w-6xl mx-auto">
        {COUPLES.map((couple) => (
          <div key={couple.photoAlt} className="flex flex-col">
            <img
              src={couple.photo}
              alt={couple.photoAlt}
              className="w-full aspect-[4/3] object-cover rounded-sm"
              loading="lazy"
              decoding="async"
            />
            <div className="mt-8 space-y-8">
              {couple.members.map((m) => (
                <div key={m.name}>
                  <h3 className="font-serif text-2xl font-medium text-foreground">{m.name}</h3>
                  <p className="mt-1 text-xs tracking-ultra-wide uppercase text-muted-foreground">{m.role}</p>
                  <p className="mt-3 text-base text-muted-foreground font-light leading-relaxed italic">
                    "{m.desc}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;
