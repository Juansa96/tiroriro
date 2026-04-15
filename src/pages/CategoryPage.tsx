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
      { name: "Recto Clásico", photo: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80", desc: "Líneas limpias, atemporal. El más solicitado.", price: 180, configParam: "recto" },
      { name: "Arco Suave", photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", desc: "Remate en arco que aporta calidez sin renunciar a la elegancia.", price: 195, configParam: "semicirculo" },
      { name: "Alto Moderno", photo: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80", desc: "Para dormitorios con altura de techo — hace la habitación más grande.", price: 220, configParam: "rectangular" },
      { name: "Con Patas", photo: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=600&q=80", desc: "Se ancla al suelo. Estable y con personalidad propia.", price: 240, configParam: "corona-simple" },
      { name: "Capitoné", photo: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80", desc: "Botonadura artesanal. El más elaborado de la colección.", price: 280, configParam: "corona-doble" },
    ],
  },
  bancos: {
    title: "Bancos entelados",
    subtitle: "Para el pie de la cama, la entrada o donde quieras que aterrice la vista.",
    models: [
      { name: "Banco Largo", photo: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80", desc: "Para el pie de la cama. Disponible de 80 a 160cm.", price: 120 },
      { name: "Banco Entrada", photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", desc: "Más compacto, perfecto para el recibidor.", price: 95 },
      { name: "Banco con Almacenaje", photo: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80", desc: "Tapa abatible con espacio interior. Funcional y bonito.", price: 160 },
      { name: "Banco Redondo", photo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", desc: "Silueta circular. Para un rincón que necesita carácter.", price: 140 },
    ],
  },
  cojines: {
    title: "Cojines y almohadones",
    subtitle: "Los últimos detalles que convierten una cama en la tuya.",
    models: [
      { name: "Cojín Cuadrado 45×45", photo: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80", desc: "El tamaño clásico. Queda bien en cualquier cama o sofá.", price: 35 },
      { name: "Cojín Lumbar 50×30", photo: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80", desc: "Rectangular, ideal para la zona lumbar o como acento decorativo.", price: 30 },
      { name: "Cojín Grande 60×60", photo: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80", desc: "Generoso y mullido. Para camas grandes y sofás amplios.", price: 45 },
      { name: "Set de 2 coordinados", photo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80", desc: "Dos cojines en la misma tela. El combo perfecto.", price: 60 },
    ],
  },
  puffs: {
    title: "Puffs elegantes",
    subtitle: "Asiento, reposapiés, escultura — según cómo lo mires.",
    models: [
      { name: "Puff Redondo", photo: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80", desc: "El clásico. Versátil y fácil de mover.", price: 95 },
      { name: "Puff Cuadrado", photo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80", desc: "Líneas rectas para ambientes más estructurados.", price: 110 },
      { name: "Puff Alto (taburete)", photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", desc: "Altura de asiento. Perfecto junto a un tocador.", price: 120 },
      { name: "Puff Gigante", photo: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80", desc: "El más contundente. Para salones y zonas de estar.", price: 150 },
    ],
  },
  mesitas: {
    title: "Mesitas de noche",
    subtitle: "El rincón que más tocas — que también sea bonito.",
    models: [
      { name: "Mesita Redonda", photo: "https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=600&q=80", desc: "Silueta suave. Combina con todo.", price: 85 },
      { name: "Mesita Cuadrada", photo: "https://images.unsplash.com/photo-1586798271654-0471bb1b0517?w=600&q=80", desc: "Clásica y funcional. Líneas rectas.", price: 90 },
      { name: "Mesita con Bandeja", photo: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80", desc: "Superficie extraíble para más versatilidad.", price: 105 },
      { name: "Mesita Set ×2", photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", desc: "Dos mesitas iguales. Perfectas para camas de matrimonio.", price: 160 },
    ],
  },
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

  const productTypeMap: Record<string, string> = {
    cabeceros: 'cabecero',
    bancos: 'banco',
    cojines: 'cojin',
    puffs: 'puff',
    mesitas: 'mesita',
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="container mx-auto">
          {/* Breadcrumb */}
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
              <AnimatedSection key={model.name} delay={i * 0.08}>
                <div className="group border border-border/40 rounded overflow-hidden">
                  <div className="overflow-hidden">
                    <img
                      src={model.photo}
                      alt={`${model.name} - ${cat.title} de TIRO·RIRO`}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-medium text-foreground">{model.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground font-light italic">{model.desc}</p>
                    <p className="mt-2 text-sm text-foreground font-medium">Desde {model.price}€</p>
                    <Link
                      to={`/configurador?tipo=${productTypeMap[category || '']}${model.configParam ? `&forma=${model.configParam}` : ''}`}
                      className="mt-3 inline-block text-xs tracking-extra-wide uppercase text-accent-warm border-b border-accent-warm pb-0.5 hover:opacity-80 transition-opacity"
                    >
                      Personalizar
                    </Link>
                  </div>
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
