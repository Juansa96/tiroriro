import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const PRODUCTS_DATA = [
  { id: 'cabeceros', name: 'Cabeceros tapizados', image: '/productos-fotos/cabeceros/IMG_2555.PNG', alt: 'Cabecero tapizado artesanal de Tiroriro', link: '/productos/cabeceros' },
  { id: 'bancos', name: 'Bancos entelados', image: '/productos-fotos/bancos/IMG_2552.PNG', alt: 'Banco entelado a medida de Tiroriro', link: '/productos/bancos' },
  { id: 'cojines', name: 'Cojines y almohadones', image: '/productos-fotos/almohadones/IMG_2486.PNG', alt: 'Cojines y almohadones artesanales de Tiroriro', link: '/productos/cojines' },
  { id: 'puffs', name: 'Puffs', image: '/productos-fotos/puff/IMG_2497.PNG', alt: 'Puff tapizado a medida de Tiroriro', link: '/productos/puffs' },
];

const VISIBLE_DESKTOP = 3;

const ProductsPreview = () => {
  const [current, setCurrent] = useState(0);
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const total = PRODUCTS_DATA.length;
  const prev = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && mobileApi) {
      mobileApi.scrollPrev();
      return;
    }
    setCurrent((c) => (c - 1 + total) % total);
  };
  const next = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && mobileApi) {
      mobileApi.scrollNext();
      return;
    }
    setCurrent((c) => (c + 1) % total);
  };
  const desktopItems = Array.from({ length: VISIBLE_DESKTOP }, (_, i) => PRODUCTS_DATA[(current + i) % total]);

  useEffect(() => {
    if (!mobileApi) return;

    const onSelect = () => setCurrent(mobileApi.selectedScrollSnap());
    onSelect();
    mobileApi.on("select", onSelect);
    mobileApi.on("reInit", onSelect);

    const autoplay = window.setInterval(() => {
      if (mobileApi.canScrollNext()) {
        mobileApi.scrollNext();
      } else {
        mobileApi.scrollTo(0);
      }
    }, 3500);

    return () => {
      window.clearInterval(autoplay);
      mobileApi.off("select", onSelect);
    };
  }, [mobileApi]);

  return (
    <section className="pt-8 pb-20 md:py-32 px-6">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Nuestros productos</h2>
          <span className="section-line" />
        </AnimatedSection>

        <div className="relative max-w-5xl mx-auto">
          <button onClick={prev} aria-label="Anterior"
            className="absolute -left-5 md:-left-14 top-[40%] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#1a4b5b] bg-white text-[#1a4b5b] transition-colors duration-200 hover:bg-[#f6f3ee]"
          >
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} aria-label="Siguiente"
            className="absolute -right-5 md:-right-14 top-[40%] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#1a4b5b] bg-white text-[#1a4b5b] transition-colors duration-200 hover:bg-[#f6f3ee]"
          >
            <ChevronRight size={18} />
          </button>

          {/* Desktop: 3 tarjetas */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {desktopItems.map((product, idx) => (
              <Link key={`${product.id}-${idx}`} to={product.link} className="block group">
                <div className="relative overflow-hidden border border-border/40 rounded-lg">
                  <img src={product.image} alt={product.alt}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                    style={product.id === 'puffs' ? { objectPosition: 'center 0%' } : undefined}
                    loading="lazy" decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorar →</span>
                  </div>
                </div>
                <div className="mt-4 h-12 flex items-start">
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-tight">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Móvil: carrusel con autoplay y tarjetas laterales visibles */}
          <div className="md:hidden">
            <Carousel
              setApi={setMobileApi}
              opts={{ align: "center", loop: true }}
              className="-mx-2"
            >
              <CarouselContent className="-ml-2">
                {PRODUCTS_DATA.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 basis-[85%]">
                    <Link to={product.link} className="block group">
                      <div className="relative overflow-hidden border border-border/40 rounded-lg">
                        <img src={product.image} alt={product.alt}
                          className="w-full aspect-[3/4] object-cover max-h-80"
                          style={product.id === 'puffs' ? { objectPosition: 'center 0%' } : undefined}
                          loading="lazy" decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                          <span className="text-white text-sm tracking-widest uppercase">Explorar →</span>
                        </div>
                      </div>
                      <div className="mt-4 h-12 flex items-start">
                        <h3 className="font-serif text-xl font-medium text-foreground leading-tight">{product.name}</h3>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {PRODUCTS_DATA.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Ver ${PRODUCTS_DATA[i].name}`}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${i === current ? 'bg-foreground' : 'bg-foreground/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
