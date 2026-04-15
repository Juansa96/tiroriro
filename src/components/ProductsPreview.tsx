import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { PRODUCTS } from "@/lib/products";
import { ArrowRight } from "lucide-react";

const ALT_TEXTS: Record<string, string> = {
  'cabecero-tapizado': 'Cabecero tapizado en lino natural sobre cama de matrimonio',
  'banco-entelado': 'Banco entelado al pie de cama en tela beige',
  'mesita-entelada': 'Mesita de noche entelada en dormitorio elegante',
  'cojin-almohadon': 'Cojines y almohadones decorativos en tonos neutros sobre cama',
  'puff-elegante': 'Puff tapizado elegante en salón con luz natural',
};

const ProductsPreview = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Lo que hacemos</h2>
        <span className="section-line" />
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        {PRODUCTS.map((product, i) => (
          <AnimatedSection
            key={product.id}
            delay={i * 0.1}
            className={PRODUCTS.length % 2 !== 0 && i === PRODUCTS.length - 1 ? "sm:col-span-2 sm:max-w-md sm:mx-auto" : ""}
          >
            <Link to="/productos" className="group block">
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={ALT_TEXTS[product.id] || product.name}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground font-light italic">
                  "{product.tagline}"
                </p>
                <span className="mt-3 inline-block text-xs tracking-extra-wide uppercase text-foreground border-b border-foreground pb-0.5 group-hover:border-accent-warm group-hover:text-accent-warm transition-colors">
                  Explorar
                </span>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection className="text-center mt-12">
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-warm text-accent-warm-foreground text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity"
        >
          Ver todos los productos <ArrowRight size={16} />
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default ProductsPreview;
