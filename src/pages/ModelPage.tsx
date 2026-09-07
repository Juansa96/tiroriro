import { useState, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_SEO,
  CATEGORY_PRICE_FROM,
  categoryAltLabel,
  productTypeMap,
} from "./CategoryPage";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/—/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Nombre corto del producto para <title> y H1 ("Cabecero tapizado Calobra").
// El altLabel largo se queda para los alt de las fotos y el JSON-LD.
const categoryShortLabel: Record<string, string> = {
  cabeceros: "Cabecero tapizado",
  bancos: "Banco entelado",
  cojines: "Almohadón tapizado",
  pufs: "Puf tapizado",
  "mesas-centro": "Mesa de centro tapizada",
  "pantallas-lampara": "Pantalla de lámpara tapizada",
};

// Recorta a un máximo de caracteres sin partir palabras (meta description).
const clampText = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

const ModelPage = () => {
  const { category = "", model: modelSlug = "" } = useParams();
  const cat = CATEGORIES[category];
  const seoCat = CATEGORY_SEO[category];
  const [idx, setIdx] = useState(0);
  const touchX = useRef<number | null>(null);

  if (!cat || !seoCat) return <Navigate to="/productos" replace />;
  const model = cat.models.find((m) => slugify(m.name) === modelSlug);
  if (!model || model.comingSoon || model.photos.length === 0)
    return <Navigate to={seoCat.canonical.replace("https://tirorirohome.com", "")} replace />;

  const slug = slugify(model.name);
  const canonical = `${seoCat.canonical}/${slug}`;
  const priceFrom = CATEGORY_PRICE_FROM[category];
  const altLabel = categoryAltLabel[category] || "Producto tapizado";
  const ogImage = `https://tirorirohome.com${model.photos[0]}`;
  const configHref = `/configurador?tipo=${productTypeMap[category] || category}${
    model.configParam ? `&forma=${model.configParam}` : ""
  }`;

  const shortLabel = categoryShortLabel[category] || altLabel;
  const title = `${shortLabel} ${model.name} a medida | Tiroriro`;
  const description = clampText(
    `${model.desc} Hecho a mano en España en 20 días${priceFrom ? `. Desde ${priceFrom} €` : ""}. Más de 60 telas a elegir.`,
    158,
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${altLabel} ${model.name}`,
    sku: `tiroriro-${category}-${slug}`,
    description,
    brand: { "@type": "Brand", name: "Tiroriro" },
    category: cat.title,
    image: model.photos.map((p) => `https://tirorirohome.com${p}`),
    url: canonical,
    ...(priceFrom && {
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: priceFrom,
        availability: "https://schema.org/InStock",
        areaServed: "ES",
        url: canonical,
        seller: { "@type": "Organization", name: "Tiroriro", url: "https://tirorirohome.com" },
      },
    }),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://tirorirohome.com/" },
      { "@type": "ListItem", position: 2, name: "Productos", item: "https://tirorirohome.com/productos" },
      { "@type": "ListItem", position: 3, name: cat.title, item: seoCat.canonical },
      { "@type": "ListItem", position: 4, name: model.name, item: canonical },
    ],
  };

  const prev = () => setIdx((i) => (i - 1 + model.photos.length) % model.photos.length);
  const next = () => setIdx((i) => (i + 1) % model.photos.length);

  return (
    <>
      <SEO title={title} description={description} canonical={canonical} ogImage={ogImage} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-8 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link to="/productos" className="hover:text-foreground transition-colors">Productos</Link>
            <ChevronRight size={12} />
            <Link to={seoCat.canonical.replace("https://tirorirohome.com", "")} className="hover:text-foreground transition-colors">
              {cat.title}
            </Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{model.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div
              className="relative overflow-hidden rounded-lg w-full aspect-[3/4] select-none bg-muted/20"
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const d = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(d) > 40) (d < 0 ? next : prev)();
                touchX.current = null;
              }}
            >
              {model.photos.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${altLabel} ${model.name}${model.photos.length > 1 ? ` — foto ${i + 1}` : ""} | Tiroriro`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  style={{ opacity: i === idx ? 1 : 0 }}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              ))}
              {model.photos.length > 1 && (
                <>
                  <button onClick={prev} aria-label="Foto anterior" className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center text-white transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={next} aria-label="Foto siguiente" className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center text-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {model.photos.map((_, i) => (
                      <button key={i} onClick={() => setIdx(i)} aria-label={`Ir a la foto ${i + 1}`} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white" : "bg-white/40"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground font-medium mb-3">
                {cat.title}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
                {shortLabel} {model.name}
              </h1>
              <span className="section-line my-6" />
              <p className="text-base text-muted-foreground font-light leading-relaxed">{model.desc}</p>

              {priceFrom && (
                <p className="mt-6 font-serif text-2xl text-foreground">Desde {priceFrom} €</p>
              )}

              <ul className="mt-8 space-y-2 text-sm text-muted-foreground font-light">
                <li>· Hecho a mano en España en 20 días</li>
                <li>· Más de 60 telas básicas y premium</li>
                <li>· Tapizado y medidas a tu gusto</li>
                <li>· Envío a la península</li>
              </ul>

              <div className="mt-6 p-4 bg-accent-warm/5 border border-accent-warm/20 rounded-md">
                <p className="text-xs text-foreground font-medium tracking-wide">
                  Reserva con el 50% · El resto al recibir · Garantía de fabricación
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  to={configHref}
                  className="btn-sweep btn-unir btn-unir-outline inline-flex items-center justify-center px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
                >
                  <span className="relative z-10">Diseña el tuyo →</span>
                </Link>
                <Link
                  to={seoCat.canonical.replace("https://tirorirohome.com", "")}
                  className="btn-sweep btn-unir btn-unir-outline inline-flex items-center justify-center px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
                >
                  <span className="relative z-10">Ver otros modelos →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ModelPage;