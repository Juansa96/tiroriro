import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { PRODUCTS } from "@/lib/products";

const ProductsPreview = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Lo que hacemos</h2>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PRODUCTS.map((product, i) => (
          <AnimatedSection key={product.id} delay={i * 0.1}>
            <Link to="/productos" className="group block">
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground font-light italic">
                  "{product.tagline}"
                </p>
                <span className="mt-3 inline-block text-xs tracking-extra-wide uppercase text-foreground border-b border-foreground pb-0.5 group-hover:border-muted-foreground transition-colors">
                  Explorar
                </span>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsPreview;
