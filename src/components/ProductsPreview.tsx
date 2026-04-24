import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const PRODUCTS_DATA = [
  { id: "cabeceros", name: "Cabeceros tapizados", image: "/productos-fotos/cabeceros/IMG_2555.PNG", alt: "Cabecero tapizado artesanal de Tiroriro", link: "/productos/cabeceros" },
  { id: "bancos", name: "Bancos entelados", image: "/productos-fotos/bancos/IMG_2552.PNG", alt: "Banco entelado a medida de Tiroriro", link: "/productos/bancos" },
  { id: "cojines", name: "Cojines y almohadones", image: "/productos-fotos/almohadones/IMG_2514.PNG", alt: "Cojines y almohadones artesanales de Tiroriro", link: "/productos/cojines" },
  { id: "puffs", name: "Puffs", image: "/productos-fotos/crops/puff-2497-tight.png", alt: "Puffs tapizados a medida de Tiroriro", link: "/productos/puffs" },
  { id: "mesas-centro", name: "Mesas de centro", image: "/productos-fotos/crops/puff-2497-1-tight.png", alt: "Mesa de centro tapizada de Tiroriro", link: "/productos/mesas-centro" },
];

const ProductsPreview = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    const autoplay = window.setInterval(() => {
      api.scrollNext();
    }, 3500);

    return () => {
      window.clearInterval(autoplay);
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section id="productos-home" className="pt-8 pb-20 md:py-32 md:px-6">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h2>
          <span className="section-line" />
        </AnimatedSection>

        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => api?.scrollPrev()}
            aria-label="Anterior"
            className="absolute -left-5 md:-left-14 top-[40%] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#1a4b5b] bg-white text-[#1a4b5b] transition-colors duration-200 hover:bg-[#f6f3ee]"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => api?.scrollNext()}
            aria-label="Siguiente"
            className="absolute -right-5 md:-right-14 top-[40%] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#1a4b5b] bg-white text-[#1a4b5b] transition-colors duration-200 hover:bg-[#f6f3ee]"
          >
            <ChevronRight size={18} />
          </button>

          <Carousel
            setApi={setApi}
            opts={{ align: "center", loop: true, skipSnaps: false }}
            className="px-4 md:px-0"
          >
            <CarouselContent className="-ml-3 md:-ml-6">
              {PRODUCTS_DATA.map((product) => (
                <CarouselItem key={product.id} className="pl-2 basis-[92%] md:pl-6 md:basis-1/3">
                  <Link to={product.link} className="block group h-full">
                    <div className="relative overflow-hidden border border-border/40 rounded-lg">
                      <img
                        src={product.image}
                        alt={product.alt}
                        className="w-full aspect-[4/5] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        style={{ objectPosition: product.id === "puffs" || product.id === "mesas-centro" ? "center 8%" : undefined }}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-x-0 bottom-0 md:hidden bg-gradient-to-t from-black/60 via-black/15 to-transparent px-4 pb-4 pt-10 pointer-events-none">
                        <h3 className="font-serif text-xl font-medium text-white leading-tight">{product.name}</h3>
                      </div>
                      <div className="absolute inset-0 bg-black/10 md:bg-black/0 md:group-hover:bg-black/25 transition-colors duration-500 flex items-center justify-center pointer-events-none">
                        <span className="text-white text-sm tracking-widest uppercase opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                          Explorar →
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 h-12 items-start hidden md:flex">
                      <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-tight">{product.name}</h3>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {PRODUCTS_DATA.map((product, i) => (
            <button
              key={product.id}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Ver ${product.name}`}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${i === current ? "bg-foreground" : "bg-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
