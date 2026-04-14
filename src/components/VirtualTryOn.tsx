import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { PRODUCTS, FABRIC_COLORS } from "@/lib/products";
import { Upload, ImageIcon, Loader2 } from "lucide-react";

const VirtualTryOn = () => {
  const [image, setImage] = useState<string | null>(null);
  const [product, setProduct] = useState(PRODUCTS[0].name);
  const [color, setColor] = useState(FABRIC_COLORS[0].id);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleTry = async () => {
    if (!image) return;
    setLoading(true);
    // TODO: Call Supabase Edge Function with AI
    await new Promise((r) => setTimeout(r, 2000));
    const colorName = FABRIC_COLORS.find(c => c.id === color)?.name || color;
    setResult(
      `Imagina tu ${product.toLowerCase()} en ${colorName} justo contra esa pared — la luz cálida que entra por la ventana va a hacer que la tela cobre una suavidad increíble, como si siempre hubiera estado ahí. El tono combina perfectamente con los elementos naturales de tu espacio, aportando calidez sin restar luminosidad. Es exactamente lo que tu habitación necesitaba para sentirse completa.`
    );
    setLoading(false);
  };

  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">
            Míralo en tu casa antes de decidir
          </h2>
          <p className="mt-4 text-muted-foreground font-light italic max-w-lg mx-auto">
            "Sube una foto de tu estancia, elige el producto y la tela, y nuestra IA te cuenta exactamente cómo quedaría — en segundos."
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="space-y-8">
            {/* Upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-foreground/30 transition-colors cursor-pointer p-10 text-center"
            >
              {image ? (
                <img src={image} alt="Tu habitación" className="max-h-64 mx-auto object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Upload size={32} strokeWidth={1} />
                  <span className="text-sm font-light">Subir foto de mi habitación</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImage}
                className="hidden"
              />
            </div>

            {/* Product selector */}
            <div>
              <label className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-2 block">Producto</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground focus:outline-none focus:border-foreground appearance-none cursor-pointer font-light"
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Color selector */}
            <div>
              <label className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 block">Tela y color</label>
              <div className="flex flex-wrap gap-3">
                {FABRIC_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`w-10 h-10 rounded-sm border-2 transition-all ${
                      color === c.id ? "border-foreground scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <button
                onClick={handleTry}
                disabled={!image || loading}
                className="px-10 py-3.5 bg-foreground text-background text-sm tracking-extra-wide uppercase font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Analizando...
                  </span>
                ) : (
                  "Ver cómo queda"
                )}
              </button>
            </div>

            {/* Result */}
            {result && (
              <AnimatedSection>
                <div className="bg-background p-8 md:p-10 mt-4">
                  <div className="flex items-start gap-3 mb-4">
                    <ImageIcon size={20} className="text-earth mt-0.5 shrink-0" />
                    <p className="font-serif text-base md:text-lg text-foreground leading-relaxed italic">
                      "{result}"
                    </p>
                  </div>
                  <div className="text-center mt-6">
                    <Link
                      to="/contacto"
                      className="inline-block px-8 py-3 bg-foreground text-background text-sm tracking-extra-wide uppercase font-medium hover:bg-foreground/90 transition-colors"
                    >
                      Quiero este — ir al formulario
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default VirtualTryOn;
