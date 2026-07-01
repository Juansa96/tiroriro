import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* SEO: target "medidas cabecero cama 150 / 135 / 90 / 180" (~28k búsquedas/mes ES).
   Estructura optimizada para featured snippets y LLMs (ChatGPT/Perplexity/Gemini). */

const BED_SIZES = [
  { bed: "Cama 90 cm (individual)",           width: "90 o 105 cm",          height: "100 o 120 cm",              note: "Recomendamos 105 cm para que sobresalga unos 7 cm a cada lado." },
  { bed: "Cama 105 cm",                       width: "105 o 135 cm",         height: "100 o 120 cm",              note: "Habitual en habitaciones juveniles y de invitados." },
  { bed: "Cama 135 cm (matrimonio pequeño)",  width: "150 cm",               height: "100 o 120 cm",              note: "La más común en pisos urbanos. 150 cm es el ancho perfecto." },
  { bed: "Cama 150 cm (matrimonio)",          width: "160 cm",               height: "100 o 120 cm",              note: "El tamaño estrella. También puedes pedir cualquier medida a mayores." },
  { bed: "Cama 160 cm (queen)",               width: "180 cm",               height: "120 cm",                    note: "Para dormitorios principales con buen ancho de pared." },
  { bed: "Cama 180 cm (king)",                width: "200 cm",               height: "120 cm",                    note: "Pide presencia: altura mínima 120 cm para que la cama no se 'coma' el cabecero." },
  { bed: "Cama 200 cm (super king)",          width: "A medida (210–220 cm)", height: "A medida (130–160 cm)",     note: "Se fabrica a medida — consúltanos para crear tu pieza." },
];

const HEIGHT_GUIDE = [
  { style: "Cabecero bajo (100 cm)", desc: "Nuestra medida estándar. Estilo minimalista, visualmente ligero, ideal en habitaciones pequeñas o con techo bajo." },
  { style: "Cabecero medio (120 cm)", desc: "La segunda medida de serie. El más equilibrado: funciona en cualquier dormitorio y se ve bien tanto sentado como de pie." },
  { style: "Cabecero alto* (a medida, 130–160 cm)", desc: "Cálido, envolvente, con mucha presencia. Recomendado para camas 150+ y dormitorios principales. No disponible en la web; consúltanos para pedirlo." },
  { style: "Cabecero extra alto* (a medida, >160 cm)", desc: "Pieza protagonista. Solo en habitaciones con techo de 2,60 m o más, para que no agobie. No disponible en la web; consúltanos para pedirlo." },
];

const FAQS = [
  { q: "¿Qué medida de cabecero necesito para una cama de 150?", a: "Para una cama de 150 cm el cabecero ideal mide 160 cm de ancho y 100 o 120 cm de alto. En Tiroriro esa es una de nuestras medidas de serie; también puedes elegir cualquier otra medida a mayores desde el configurador." },
  { q: "¿Qué medida de cabecero necesito para una cama de 135?", a: "Para una cama de 135 cm el cabecero ideal mide 150 cm de ancho y 100 o 120 cm de alto. Es la medida estándar en pisos urbanos españoles y una de nuestras medidas de serie." },
  { q: "¿Qué medida de cabecero para una cama individual de 90?", a: "Para una cama de 90 cm te recomendamos 105 cm de ancho (para que sobresalga unos 7 cm a cada lado) y 100 cm de alto. También ofrecemos la medida exacta de 90 cm." },
  { q: "¿Cuánto debe sobresalir el cabecero respecto a la cama?", a: "La regla general son 5–10 cm a cada lado del colchón. Eso evita que se vea el somier y aporta una proporción visual más agradable. En camas grandes (180+) se puede ir a 10–15 cm para reforzar la presencia." },
  { q: "¿A qué altura se coloca un cabecero tapizado?", a: "El borde inferior del cabecero debe quedar entre 10 y 15 cm por debajo del nivel del colchón, para que al apoyar las almohadas no se vea la pared. Si va anclado a pared, normalmente queda a unos 50–60 cm del suelo." },
  { q: "¿Puedo pedir un cabecero más alto del estándar?", a: "Sí. En Tiroriro las medidas de serie son 100 y 120 cm de alto, pero puedes pedir cualquier medida entre 40 y 200 cm desde la opción “Otra medida” del configurador. Por cada 10 cm por encima de 100 cm se aplica un pequeño suplemento (+15 €)." },
  { q: "¿Qué anchos de cabecero fabricáis?", a: "Nuestras medidas de serie son 90, 105, 135, 150, 160, 180 y 200 cm. Además puedes pedir cualquier medida entre 60 y 300 cm desde la opción “Otra medida” del configurador, sin coste extra por el ancho." },
  { q: "¿Podéis hacer un hueco en el cabecero para enchufes o apliques?", a: "Sí. Si quieres que el cabecero ocupe todo el ancho de la pared y hay enchufes, interruptores o apliques de lectura, podemos fabricar el cabecero con las aperturas exactas para que encaje a la perfección. Es un pequeño suplemento que te detallamos en la llamada antes de cerrar el pedido." },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guía de medidas para cabeceros tapizados: cama 90, 135, 150 y 180",
  description: "Tabla con medidas recomendadas de cabeceros tapizados según el ancho de cama (90, 105, 135, 150, 160, 180, 200) y guía de alturas por estilo.",
  image: "https://tirorirohome.com/hero-poster.webp",
  author: { "@type": "Organization", name: "Tiroriro" },
  publisher: { "@type": "Organization", name: "Tiroriro", logo: { "@type": "ImageObject", url: "https://tirorirohome.com/hero-poster.webp" } },
  mainEntityOfPage: "https://tirorirohome.com/guia-medidas-cabeceros",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://tirorirohome.com/" },
    { "@type": "ListItem", position: 2, name: "Cabeceros tapizados", item: "https://tirorirohome.com/productos/cabeceros" },
    { "@type": "ListItem", position: 3, name: "Guía de medidas", item: "https://tirorirohome.com/guia-medidas-cabeceros" },
  ],
};

const GuiaMedidasCabecerosPage = () => (
  <>
    <SEO
      title="Medidas de cabeceros tapizados: cama 90, 135, 150 y 180 | Tiroriro"
      description="Guía de medidas para cabeceros tapizados según el ancho de cama (90, 135, 150, 180). Tabla con ancho recomendado, altura por estilo y consejos de instalación."
      canonical="https://tirorirohome.com/guia-medidas-cabeceros"
    />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
    </Helmet>
    <Navbar />
    <main className="pt-24 md:pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Inicio</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/productos/cabeceros">Cabeceros</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Guía de medidas</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <AnimatedSection>
          <header className="mb-12">
            <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-4">
              Guía de medidas para cabeceros tapizados
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
              La medida correcta de un cabecero depende del ancho de tu cama y de la altura del techo.
              Aquí tienes la tabla que usamos en el taller para asesorar a nuestros clientes, con la
              medida ideal para camas de 90, 105, 135, 150, 160, 180 y 200 cm.
            </p>
          </header>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <section className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6">Ancho del cabecero según la cama</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base border-collapse">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 pr-4 font-medium">Cama</th>
                    <th className="py-3 pr-4 font-medium">Ancho cabecero</th>
                    <th className="py-3 pr-4 font-medium">Alto recomendado</th>
                  </tr>
                </thead>
                <tbody>
                  {BED_SIZES.map((row) => (
                    <tr key={row.bed} className="border-b border-border/60 align-top">
                      <td className="py-3 pr-4 font-medium text-foreground">{row.bed}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{row.width}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{row.height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-3 italic">
              La regla general: el cabecero debe sobresalir 5–10 cm a cada lado del colchón.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2 italic">
              * Alturas superiores a 120 cm no están disponibles en la web. Escríbenos por WhatsApp o email para consultarlas y te las fabricamos.
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <section className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6">Altura: ¿bajo, medio o alto?</h2>
            <ul className="space-y-5">
              {HEIGHT_GUIDE.map((h) => (
                <li key={h.style} className="border-l-2 border-accent-warm pl-4">
                  <h3 className="font-medium text-foreground mb-1">{h.style}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{h.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <section className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6">Cómo medir antes de pedir</h2>
            <ol className="list-decimal pl-5 space-y-3 text-muted-foreground font-light leading-relaxed">
              <li><strong className="text-foreground font-medium">Mide el ancho del colchón</strong> de extremo a extremo y suma 10–20 cm.</li>
              <li><strong className="text-foreground font-medium">Mide la pared disponible</strong> entre mesitas o muebles. El cabecero no debería rozar las mesitas: deja al menos 5 cm de aire a cada lado.</li>
              <li><strong className="text-foreground font-medium">Decide la altura</strong> en función del techo: nunca debe quedar a menos de 60 cm del techo para que la habitación respire.</li>
              <li><strong className="text-foreground font-medium">Elige el sistema de sujeción:</strong> apoyado en el somier (más sencillo), con patas al suelo, o anclado a pared. En Tiroriro lo explicamos por teléfono antes de cerrar el pedido.</li>
            </ol>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.18}>
          <section className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6">Huecos para enchufes, apliques e interruptores</h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-4">
              Si quieres que el cabecero ocupe todo el ancho de la pared y hay enchufes, interruptores o apliques de lectura a la altura del cabecero, podemos fabricar la pieza con las aperturas exactas para que encaje a la perfección.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-light leading-relaxed mb-4">
              <li><strong className="text-foreground font-medium">Hueco para enchufes:</strong> ideal si tienes una regleta o tomas justo detrás del cabecero.</li>
              <li><strong className="text-foreground font-medium">Hueco para apliques:</strong> si tienes lámparas de pared a los lados o encima de la cama, dejamos el hueco para que el aplique quede integrado.</li>
              <li><strong className="text-foreground font-medium">Hueco para interruptores:</strong> útil en dormitorios donde el interruptor principal queda a la altura del cabecero.</li>
            </ul>
            <p className="text-muted-foreground font-light leading-relaxed">
              Es una opción muy práctica cuando buscas que el cabecero ocupe mucho de ancho. Tiene un pequeño suplemento que te detallamos en la llamada antes de cerrar el pedido, porque depende de la cantidad y ubicación de los huecos. Si te interesa, mándanos una foto de tu pared y te decimos exactamente cómo quedaría.
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <section className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6">Preguntas frecuentes</h2>
            <div className="space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="font-medium text-foreground mb-2">{f.q}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <section className="bg-secondary p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-4">
              ¿Tienes la medida? Diseña tu cabecero
            </h2>
            <p className="text-muted-foreground font-light mb-6 max-w-xl mx-auto">
              Elige forma, mide al milímetro y escoge entre más de 60 telas. Precio en tiempo real,
              entrega en 20 días desde nuestro taller en Madrid.
            </p>
            <Link
              to="/configurador?producto=cabecero"
              className="inline-block bg-foreground text-background px-8 py-3 font-body text-sm tracking-wider uppercase hover:bg-foreground/90 transition-colors"
            >
              Ir al configurador
            </Link>
          </section>
        </AnimatedSection>
      </div>
    </main>
    <Footer />
  </>
);

export default GuiaMedidasCabecerosPage;