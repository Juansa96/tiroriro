import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { ChevronRight } from "lucide-react";

interface Model {
  name: string;
  photo: string;
  desc: string;
  price: number;
  configParam?: string;
}

const CATEGORIES: Record<string, { title: string; subtitle: string; models: Model[] }> = {
  cabeceros: {
    title: "Cabeceros tapizados",
    subtitle: "El punto de partida de cualquier dormitorio que merece la pena.",
    models: [
      { name: "Recto Clásico", photo: "/productos-fotos/cabeceros/IMG_2555.PNG", desc: "Líneas limpias, atemporal. El más solicitado.", price: 180, configParam: "recto" },
      { name: "Arco Suave", photo: "/productos-fotos/cabeceros/IMG_2535.PNG", desc: "Remate en arco que aporta calidez sin renunciar a la elegancia.", price: 195, configParam: "arco" },
      { name: "Alto Moderno", photo: "/productos-fotos/cabeceros/IMG_2502.PNG", desc: "Para dormitorios con altura de techo — hace la habitación más grande.", price: 220, configParam: "alto" },
      { name: "Con Patas", photo: "/productos-fotos/cabeceros/IMG_2218.PNG", desc: "Se ancla al suelo. Estable y con personalidad propia.", price: 240, configParam: "con-patas" },
    ],
  },
  bancos: {
    title: "Bancos entelados",
    subtitle: "Para el pie de la cama, la entrada o donde quieras que aterrice la vista.",
    models: [
      { name: "Banco Largo", photo: "/productos-fotos/bancos/IMG_2552.PNG", desc: "Para el pie de la cama. Disponible de 80 a 160cm.", price: 120 },
      { name: "Banco Entrada", photo: "/productos-fotos/bancos/IMG_2554.PNG", desc: "Más compacto, perfecto para el recibidor.", price: 95 },
      { name: "Banco con Almacenaje", photo: "/productos-fotos/bancos/IMG_2491.PNG", desc: "Tapa abatible con espacio interior. Funcional y bonito.", price: 160 },
    ],
  },
  cojines: {
    title: "Cojines y almohadones",
    subtitle: "Los últimos detalles que convierten una cama en la tuya.",
    models: [
      { name: "Cojín Cuadrado 45×45", photo: "/productos-fotos/almohadones/IMG_2486.PNG", desc: "El tamaño clásico. Queda bien en cualquier cama o sofá.", price: 35 },
      { name: "Cojín Lumbar 50×30", photo: "/productos-fotos/almohadones/IMG_2514.PNG", desc: "Rectangular, ideal para la zona lumbar o como acento decorativo.", price: 30 },
      { name: "Cojín Grande 60×60", photo: "/productos-fotos/almohadones/IMG_2523.PNG", desc: "Generoso y mullido. Para camas grandes y sofás amplios.", price: 45 },
      { name: "Set de 2 coordinados", photo: "/productos-fotos/almohadones/IMG_2524.PNG", desc: "Dos cojines en la misma tela. El combo perfecto.", price: 60 },
      { name: "Almohadón decorativo", photo: "/productos-fotos/almohadones/IMG_2525.PNG", desc: "Pieza estatement: tela, vivo y remate trabajados a mano.", price: 55 },
      { name: "Cojín con vivo doble", photo: "/productos-fotos/almohadones/IMG_2539.PNG", desc: "Detalle de costura que convierte un cojín en una pieza de autor.", price: 50 },
      { name: "Cojín a juego", photo: "/productos-fotos/almohadones/IMG_2545.PNG", desc: "Combinable con tu cabecero o banco en la misma tela.", price: 40 },
    ],
  },
  puffs: {
    title: "Puffs y mesas de centro",
    subtitle: "Asiento, reposapiés, mesa — según cómo lo mires.",
    models: [
      { name: "Puff Redondo", photo: "/productos-fotos/puff/IMG_2497.PNG", desc: "El clásico. Versátil y fácil de mover.", price: 95 },
      { name: "Puff Cuadrado", photo: "/productos-fotos/puff/IMG_2497_1.PNG", desc: "Líneas rectas para ambientes más estructurados.", price: 110 },
    ],
  },
};

const productTypeMap: Record<string, string> = {
  cabeceros: 'cabecero',
  bancos: 'banco',
  cojines: 'cojin',
  puffs: 'puff',
};

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
            objectPosition: category === 'puffs' ? 'center 0%' : undefined,
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
          <p className="text-base text-foreground font-medium">Desde {model.price}€</p>
          <span className="text-xs tracking-extra-wide uppercase text-accent-warm border-b border-accent-warm pb-0.5 group-hover:opacity-80 transition-opacity">
            Personalizar
          </span>
        </div>
      </div>
    </Link>
  );
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const cat = CATEGORIES[category || ''];

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
                  <ModelCard model={model} category={category || ''} />
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
