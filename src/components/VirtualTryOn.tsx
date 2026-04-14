import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { PRODUCTS, FABRIC_COLORS } from "@/lib/products";
import { Upload, Loader2 } from "lucide-react";

const VirtualTryOn = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [product, setProduct] = useState(PRODUCTS[0].name);
  const [color, setColor] = useState(FABRIC_COLORS[0].id);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
    setResultImage(null);
  };

  const handleTry = async () => {
    if (!image) return;
    setLoading(true);
    // TODO: Call Supabase Edge Function with HuggingFace API
    // For now, show a placeholder result
    await new Promise((r) => setTimeout(r, 3000));
    // Placeholder: show the user's own image with a tinted overlay
    setResultImage(image);
    setLoading(false);
  };

  const handleOrder = () => {
    const colorName = FABRIC_COLORS.find(c => c.id === color)?.name || '';
    const params = new URLSearchParams({
      product: product,
      config: `${product} · Color: ${colorName}`,
    });
    navigate(`/contacto?${params.toString()}`);
  };

  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">
            Míralo en tu casa antes de decidir
          </h2>
          <span className="section-line" />
          <p className="mt-6 text-muted-foreground font-light italic max-w-lg mx-auto">
            "Sube una foto de tu estancia, elige el producto y la tela, y nuestra IA te muestra cómo quedaría — en segundos."
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="space-y-8">
            {/* Upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-accent-warm/40 transition-colors cursor-pointer p-10 text-center rounded-lg"
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
            <div className="rounded p-4 border" style={{ backgroundColor: '#FDFAF5', borderColor: '#E8DCC8' }}>
              <label className="block text-xs tracking-extra-wide uppercase text-muted-foreground mb-2 font-light">Producto</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="field-input appearance-none cursor-pointer"
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Color selector */}
            <div>
              <label className="text-xs tracking-extra-wide uppercase text-muted-foreground mb-3 block font-light">Tela y color</label>
              <div className="flex flex-wrap gap-3">
                {FABRIC_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`w-10 h-10 rounded-sm border-2 transition-all ${
                      color === c.id ? "border-accent-warm scale-110" : "border-transparent"
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
                className="px-10 py-3.5 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Imaginando tu estancia...
                  </span>
                ) : (
                  "Ver cómo queda"
                )}
              </button>
              {loading && (
                <div className="mt-4">
                  <div className="w-48 h-1 mx-auto rounded-full overflow-hidden bg-muted">
                    <div className="h-full bg-accent-warm animate-pulse rounded-full" style={{ width: '60%' }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground font-light">La generación puede tardar entre 10 y 20 segundos.</p>
                </div>
              )}
            </div>

            {/* Result */}
            {resultImage && !loading && (
              <AnimatedSection>
                <div className="bg-background p-6 md:p-8 mt-4 rounded-lg">
                  <img src={resultImage} alt="Resultado del probador virtual" className="w-full min-h-[300px] object-contain rounded" />
                  <p className="mt-4 text-xs text-muted-foreground font-light italic text-center">
                    Esta imagen es una interpretación creada por IA para ayudarte a visualizar el resultado — el producto final puede variar en detalle.
                  </p>
                  <div className="text-center mt-6">
                    <button
                      onClick={handleOrder}
                      className="inline-block px-8 py-3 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity"
                    >
                      Quiero este — solicitar pedido
                    </button>
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
