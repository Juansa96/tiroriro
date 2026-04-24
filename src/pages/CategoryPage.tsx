import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { ChevronRight } from "lucide-react";

interface Model {
  name: string;
  photo: string;
  desc: string;
  priceLabel: string;
  configParam?: string;
}

const CATEGORIES: Record<string, { title: string; subtitle: string; models: Model[] }> = {
  cabeceros: {
    title: "Cabeceros tapizados",
    subtitle: "El punto de partida de cualquier dormitorio que merece la pena.",
    models: [
      { name: "Calobra", photo: "/productos-fotos/cabeceros/IMG_2555.PNG", desc: "Líneas limpias, atemporal. El más solicitado.", priceLabel: "Desde xx€", configParam: "recto" },
      { name: "Pregonda", photo: "/productos-fotos/cabeceros/IMG_2535.PNG", desc: "Remate en arco que aporta calidez sin renunciar a la elegancia.", priceLabel: "Desde xx€", configParam: "semicirculo" },
      { name: "Macarella", photo: "/productos-fotos/cabeceros/IMG_2502.PNG", desc: "Corona simple que eleva cualquier cabecero con un toque especial.", priceLabel: "Desde xx€", configParam: "corona-simple" },
      { name: "Conta", photo: "/productos-fotos/cabeceros/IMG_2218.PNG", desc: "Corona doble para los que buscan algo más elaborado y con carácter.", priceLabel: "Desde xx€", configParam: "corona-doble" },
      { name: "Barbaria", photo: "/productos-fotos/cabeceros/IMG_2218.PNG", desc: "El modelo más trabajado. Presencia máxima, acabado de autor.", priceLabel: "Desde xx€", configParam: "corona-triple" },
    ],
  },
  bancos: {
    title: "Bancos entelados",
    subtitle: "Para el pie de la cama, la entrada o donde quieras que aterrice la vista.",
    models: [
      { name: "Banco Largo", photo: "/productos-fotos/bancos/IMG_2552.PNG", desc: "Para el pie de la cama. Disponible de 80 a 160 cm.", priceLabel: "Desde xx€" },
      { name: "Banco Entrada", photo: "/productos-fotos/bancos/IMG_2554.PNG", desc: "Más compacto, perfecto para el recibidor.", priceLabel: "Desde xx€" },
      { name: "Banco con Almacenaje", photo: "/productos-fotos/bancos/IMG_2491.PNG", desc: "Tapa abatible con espacio interior. Funcional y bonito.", priceLabel: "Desde xx€" },
    ],
  },
  cojines: {
    title: "Cojines y almohadones",
    subtitle: "Detalles tapizados a medida para camas, bancos, sofás o cualquier rincón que necesite un toque especial.",
    models: [
      { name: "Rodiles — Cuadrado 45×45", photo: "/productos-fotos/almohadones/IMG_2523.PNG", desc: "El tamaño clásico. Queda bien en cualquier cama, banco o sofá.", priceLabel: "Desde xx€" },
      { name: "Covadonga — Rectangular 50×30", photo: "/productos-fotos/almohadones/IMG_2514.PNG", desc: "Rectangular, ligero y muy versátil para sumar apoyo o un acento decorativo.", priceLabel: "Desde xx€" },
      { name: "Rodiles — Grande 60×60", photo: "/productos-fotos/almohadones/IMG_2523.PNG", desc: "Generoso y mullido. Para camas grandes y sofás amplios.", priceLabel: "Desde xx€" },
      { name: "Set de 2 coordinados", photo: "/productos-fotos/almohadones/IMG_2524.PNG", desc: "Dos cojines en la misma tela. El combo perfecto.", priceLabel: "Desde xx€" },
      { name: "Torimbia — Redondo", photo: "/productos-fotos/almohadones/IMG_2525.PNG", desc: "Pieza statement: tela, vivo y remate trabajados a mano.", priceLabel: "Desde xx€" },
      { name: "Cojín con vivo", photo: "/productos-fotos/almohadones/IMG_2539.PNG", desc: "Detalle de costura que convierte un cojín en una pieza de autor.", priceLabel: "Desde xx€" },
      { name: "Gulpiyuri — Rulo", photo: "/productos-fotos/almohadones/IMG_2545.PNG", desc: "Combinable con tu cabecero o banco en la misma tela.", priceLabel: "Desde xx€" },
    ],
  },
  puffs: {
    title: "Puffs",
    subtitle: "Tapizados a medida, versátiles y fáciles de mover. Pensados para acompañar la casa sin ocuparla.",
    models: [
      { name: "Salinas", photo: "/productos-fotos/crops/puff-2497-tight.png", desc: "Redondos, ligeros visualmente y fáciles de mover de un rincón a otro.", priceLabel: "Desde xx€" },
      { name: "América", photo: "/productos-fotos/crops/puff-2497-1-tight.png", desc: "Líneas más rectas para ambientes serenos y bien estructurados.", priceLabel: "Desde xx€" },
    ],
  },
  "mesas-centro": {
    title: "Mesas de centro",
    subtitle: "Volúmenes tapizados a medida para el salón, con una presencia suave y mucho más original que una pieza estándar.",
    models: [
      { name: "Cabo de Palos", photo: "/productos-fotos/crops/puff-2497-tight.png", desc: "Volumen tapizado, limpio y sin patas, con una lectura más blanda y contemporánea.", priceLabel: "Desde xx€", configParam: "tipo-puff" },
      { name: "Calblanque", photo: "/productos-fotos/crops/puff-2497-1-tight.png", desc: "Más alargada y con estructura, para un resultado más arquitectónico.", priceLabel: "Desde xx€", configParam: "tipo-banco" },
    ],
  },
};

const productTypeMap: Record<string, string> = {
  cabeceros: 'cabecero',
  bancos: 'banco',
  cojines: 'cojin',
  puffs: 'puff',
  'mesas-centro': 'mesa',
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
  const configHref = `/configurador?tipo=${productTypeMap[category] || category}${model.configParam ? `&forma=${model.configParam}` : ''}`;

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
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.4s ease',
            objectPosition: imagePosition(category),
          }}
          loading="lazy"
          decoding="async"
        />
        <div
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
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
          <Link to="/productos" className="mt-4 inline-block text-accent-warm underline">Volver a productos</Link>
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
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link to="/productos" className="hover:text-foreground transition-colors">Productos</Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{cat.title}</span>
          </div>
          <AnimatedSection className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground">{cat.title}</h1>
            <p className="mt-3 text-muted-foreground font-light italic">{cat.subtitle}</p>
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
