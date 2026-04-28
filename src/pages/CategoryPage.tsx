import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { ChevronRight, Clock } from "lucide-react";

interface Model {
  name: string;
  photo: string;
  desc: string;
  priceLabel: string;
  configParam?: string;
  comingSoon?: boolean;
}

const CATEGORIES: Record<string, { title: string; subtitle: string; models: Model[]; comingSoon?: boolean }> = {
  cabeceros: {
    title: "Cabeceros tapizados",
    subtitle: "El punto de partida de cualquier dormitorio que merece la pena.",
    models: [
      {
        name: "Calobra",
        photo: "/productos-fotos/cabeceros/IMG_2555.webp",
        desc: "Forma rectangular clásica, de líneas rectas y remate horizontal. El más solicitado y el más versátil: encaja en cualquier estilo, desde el más contemporáneo al más clásico. Su silueta limpia y atemporal hace que toda la atención caiga sobre la tela y el acabado.",
        priceLabel: "Desde xx€",
        configParam: "recto",
      },
      {
        name: "Pregonda",
        photo: "/productos-fotos/cabeceros/IMG_2535.webp",
        desc: "Remate en arco suave y continuo, que aporta calidez y movimiento sin renunciar a la elegancia. La curva única da profundidad al dormitorio y suaviza ambientes con mucho ángulo recto. Ideal si buscas algo especial sin que resulte recargado.",
        priceLabel: "Desde xx€",
        configParam: "semicirculo",
      },
      {
        name: "Macarella",
        photo: "/productos-fotos/cabeceros/IMG_2502.webp",
        desc: "Corona simple con una sola ondulación central. La elevación en el centro crea un punto focal natural que enmarca la cabecera con personalidad. Un diseño con carácter propio que eleva cualquier cabecero con un toque escultórico sin perder elegancia.",
        priceLabel: "Desde xx€",
        configParam: "corona-simple",
      },
      {
        name: "Conta",
        photo: "/productos-fotos/cabeceros/IMG_2218.webp",
        desc: "Corona doble con dos niveles de ondulación escalonada. Más elaborada y con una lectura visual más rica, para dormitorios que buscan un punto de distinción. El doble escalonado aporta profundidad y convierte el cabecero en la pieza protagonista del espacio.",
        priceLabel: "Desde xx€",
        configParam: "corona-doble",
      },
      {
        name: "Barbaria",
        photo: "/productos-fotos/cabeceros/IMG_2218.webp",
        desc: "Corona triple, el modelo más trabajado de nuestra colección. Tres niveles de ondulación escalonada crean una silueta espectacular y de gran presencia. Pensada para quienes quieren un dormitorio con carácter máximo y un acabado de autor. Presencia máxima, artesanía pura.",
        priceLabel: "Desde xx€",
        configParam: "corona-triple",
      },
    ],
  },
  bancos: {
    title: "Bancos entelados",
    subtitle: "Para el pie de la cama, la entrada o donde quieras que aterrice la vista.",
    comingSoon: true,
    models: [
      { name: "Banco Largo", photo: "/productos-fotos/bancos/IMG_2552.webp", desc: "Para el pie de la cama. Disponible de 80 a 160 cm.", priceLabel: "Desde xx€", comingSoon: true },
      { name: "Banco Entrada", photo: "/productos-fotos/bancos/IMG_2554.webp", desc: "Más compacto, perfecto para el recibidor.", priceLabel: "Desde xx€", comingSoon: true },
      { name: "Banco con Almacenaje", photo: "/productos-fotos/bancos/IMG_2491.webp", desc: "Tapa abatible con espacio interior. Funcional y bonito.", priceLabel: "Desde xx€", comingSoon: true },
    ],
  },
  cojines: {
    title: "Cojines y almohadones",
    subtitle: "Detalles tapizados a medida para camas, bancos, sofás o cualquier rincón que necesite un toque especial.",
    models: [
      { name: "Rodiles — Cuadrado 45×45", photo: "/productos-fotos/almohadones/IMG_2523.webp", desc: "El tamaño clásico. Queda bien en cualquier cama, banco o sofá.", priceLabel: "Desde xx€" },
      { name: "Covadonga — Rectangular 50×30", photo: "/productos-fotos/almohadones/IMG_2514.webp", desc: "Rectangular, ligero y muy versátil para sumar apoyo o un acento decorativo.", priceLabel: "Desde xx€" },
      { name: "Rodiles — Grande 60×60", photo: "/productos-fotos/almohadones/IMG_2523.webp", desc: "Generoso y mullido. Para camas grandes y sofás amplios.", priceLabel: "Desde xx€" },
      { name: "Set de 2 coordinados", photo: "/productos-fotos/almohadones/IMG_2524.webp", desc: "Dos cojines en la misma tela. El combo perfecto.", priceLabel: "Desde xx€" },
      { name: "Torimbia — Redondo", photo: "/productos-fotos/almohadones/IMG_2525.webp", desc: "Pieza statement: tela, vivo y remate trabajados a mano.", priceLabel: "Desde xx€" },
      { name: "Cojín con vivo", photo: "/productos-fotos/almohadones/IMG_2539.webp", desc: "Detalle de costura que convierte un cojín en una pieza de autor.", priceLabel: "Desde xx€" },
      { name: "Gulpiyuri — Rulo", photo: "/productos-fotos/almohadones/IMG_2545.webp", desc: "Combinable con tu cabecero o banco en la misma tela.", priceLabel: "Desde xx€" },
    ],
  },
  puffs: {
    title: "Puffs",
    subtitle: "Tapizados a medida, versátiles y fáciles de mover. Pensados para acompañar la casa sin ocuparla.",
    models: [
      {
        name: "Monteferro",
        photo: "/productos-fotos/crops/puff-2497-tight.png",
        desc: "Redondo, ligero visualmente y fácil de mover de un rincón a otro. Su forma circular lo convierte en una pieza suave que encaja en cualquier ambiente. Colección Galicia.",
        priceLabel: "Desde xx€",
        configParam: "circular",
      },
      {
        name: "Patos",
        photo: "/productos-fotos/crops/puff-2497-1-tight.png",
        desc: "Cúbico, con líneas limpias y estructuradas para ambientes más serenos y bien definidos. Misma altura que anchura para una presencia equilibrada y sólida. Colección Galicia.",
        priceLabel: "Desde xx€",
        configParam: "cuadrado",
      },
    ],
  },
  "mesas-centro": {
    title: "Mesas de centro",
    subtitle: "Volúmenes tapizados a medida para el salón, con una presencia suave y mucho más original que una pieza estándar.",
    models: [
      {
        name: "Cabo de Palos",
        photo: "/productos-fotos/crops/puff-2497-tight.png",
        desc: "Mesa rectangular totalmente tapizada, sin patas. Un volumen limpio y bando que apoya directamente en el suelo, de la Colección Murcia. Lectura muy contemporánea, fácil de integrar y de mover.",
        priceLabel: "Desde xx€",
        configParam: "tipo-puff",
      },
      {
        name: "Calblanque",
        photo: "/productos-fotos/crops/puff-2497-1-tight.png",
        desc: "Mesa tapizada con patas, de la Colección Murcia. Estructura más elevada y arquitectónica que aporta ligereza al conjunto. La combinación de tapizado y patas le da un carácter más refinado y versátil.",
        priceLabel: "Desde xx€",
        configParam: "tipo-banco",
      },
    ],
  },
  "pantallas-lampara": {
    title: "Pantallas de lámpara",
    subtitle: "Pantallas tapizadas a mano en lino, terciopelo o bouclé para convertir cualquier lámpara en una pieza única.",
    models: [
      {
        name: "Cónica",
        photo: "/placeholder.svg",
        desc: "La forma clásica por excelencia. Más ancha en la base y estrecha en la parte superior, proyecta una luz cálida y difusa que envuelve cualquier espacio. Atemporal, elegante y siempre acertada.",
        priceLabel: "Desde xx€",
        configParam: "conica",
      },
      {
        name: "Cilíndrica",
        photo: "/placeholder.svg",
        desc: "Forma recta y geométrica, misma anchura arriba y abajo. Proyecta la luz de manera más directa y uniforme. Perfecta para ambientes contemporáneos y minimalistas donde la línea recta es protagonista.",
        priceLabel: "Desde xx€",
        configParam: "cilindrica",
      },
      {
        name: "Cuadrada",
        photo: "/placeholder.svg",
        desc: "Base cuadrada con ligera inclinación hacia arriba. Aporta una geometría más estructurada y original. Muy versátil, combina tanto con lámparas de pie como de mesa de estilo clásico o transicional.",
        priceLabel: "Desde xx€",
        configParam: "cuadrada",
      },
      {
        name: "Trapecio",
        photo: "/placeholder.svg",
        desc: "Forma rectangular con lados ligeramente inclinados hacia adentro. Combina la claridad de la línea recta con un perfil más dinámico. Ideal para lámparas de gran formato y ambientes con personalidad.",
        priceLabel: "Desde xx€",
        configParam: "trapecio",
      },
      {
        name: "Cuadrada recta",
        photo: "/placeholder.svg",
        desc: "Sección cuadrada completamente recta, sin ninguna inclinación. Forma cúbica pura que da un carácter muy geométrico y moderno. Perfecta para estancias con diseño contemporáneo o de tendencia.",
        priceLabel: "Desde xx€",
        configParam: "cuadrada-recta",
      },
      {
        name: "Rectangular",
        photo: "/placeholder.svg",
        desc: "Forma rectangular horizontal, más ancha que alta. Muy útil para iluminar mesas largas, aparadores o zonas de estar. Da una escala generosa y presencia especial sobre cualquier lámpara de pie o sobremesa grande.",
        priceLabel: "Desde xx€",
        configParam: "rectangular",
      },
      {
        name: "Ovalada",
        photo: "/placeholder.svg",
        desc: "Silueta oval con curvas suaves que suavizan el ambiente. Más cálida y orgánica que las formas geométricas estrictas. Ideal para dormitorios y salones donde se busca un punto de calidez y delicadeza.",
        priceLabel: "Desde xx€",
        configParam: "ovalada",
      },
    ],
  },
};

const productTypeMap: Record<string, string> = {
  cabeceros: "cabecero",
  bancos: "banco",
  cojines: "cojin",
  puffs: "puff",
  "mesas-centro": "mesa",
  "pantallas-lampara": "pantalla",
};

const imagePosition = (category: string) => {
  if (category === "puffs" || category === "mesas-centro") return "center center";
  if (category === "bancos") return "center center";
  return undefined;
};

interface CategoryPageProps {
  categoryKey?: string;
}

const ModelCard = ({ model, category }: { model: Model; category: string }) => {
  const [hovered, setHovered] = useState(false);
  const configHref = `/configurador?tipo=${productTypeMap[category] || category}${model.configParam ? `&forma=${model.configParam}` : ""}`;

  if (model.comingSoon) {
    return (
      <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden relative">
        <div className="relative overflow-hidden">
          <img
            src={model.photo}
            alt={model.name}
            className="w-full aspect-[4/3] object-cover grayscale opacity-60"
            style={{ objectPosition: imagePosition(category) }}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
            <div className="text-center">
              <Clock size={20} className="text-white mx-auto mb-2" />
              <span className="text-white text-xs tracking-[0.2em] uppercase font-medium">Próximamente</span>
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-lg font-medium text-foreground/60">{model.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground/60 font-light flex-1">{model.desc}</p>
          <div className="mt-4">
            <span className="text-xs text-muted-foreground/50 uppercase tracking-widest">Disponible próximamente</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={configHref}
      className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={model.photo}
          alt={model.name}
          className="w-full aspect-[4/3] object-cover"
          style={{
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.4s ease",
            objectPosition: imagePosition(category),
          }}
          loading="lazy"
          decoding="async"
        />
        <div
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }}
          className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none"
        >
          <span className="text-white text-sm tracking-widest uppercase">Personalizar →</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-medium text-foreground">{model.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground font-light flex-1">{model.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-base text-foreground font-medium">{model.priceLabel}</p>
          <span className="text-xs tracking-extra-wide uppercase text-accent-warm border-b border-accent-warm pb-0.5 group-hover:opacity-80 transition-opacity">
            Personalizar
          </span>
        </div>
      </div>
    </Link>
  );
};

const CategoryPage = ({ categoryKey }: CategoryPageProps) => {
  const category = categoryKey || "";
  const cat = CATEGORIES[category];

  if (!cat) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 px-6 text-center">
          <h1 className="font-serif text-3xl font-light text-foreground">Categoría no encontrada</h1>
          <Link to="/productos" className="mt-4 inline-block text-accent-warm underline">
            Volver a productos
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight size={12} />
            <Link to="/productos" className="hover:text-foreground transition-colors">
              Productos
            </Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{cat.title}</span>
          </div>
          <AnimatedSection className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground">{cat.title}</h1>
            <p className="mt-3 text-muted-foreground font-light italic">{cat.subtitle}</p>
            {cat.comingSoon && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-full">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider uppercase">Próximamente disponibles</span>
              </div>
            )}
            <span className="section-line" />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.models.map((model, i) => (
              <AnimatedSection key={model.name} delay={i * 0.08} className="h-full">
                <div className="h-full">
                  <ModelCard model={model} category={category} />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryPage;
