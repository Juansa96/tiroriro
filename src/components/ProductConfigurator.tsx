import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import ProductSVGPreview from "./ProductSVGPreview";
import {
  ProductType, PRODUCTS, FABRIC_COLORS, HEADBOARD_SHAPES, BED_SIZES,
  HEADBOARD_HEIGHTS, BENCH_LENGTHS, TABLE_LENGTHS, CUSHION_SHAPES,
  CUSHION_SIZES, PUFF_SIZES, FINISHES, calculatePrice, buildConfigSummary
} from "@/lib/products";

interface Props {
  initialType?: ProductType;
}

const ProductConfigurator = ({ initialType = 'cabecero' }: Props) => {
  const navigate = useNavigate();
  const [type, setType] = useState<ProductType>(initialType);
  const [options, setOptions] = useState<Record<string, string>>({
    shape: HEADBOARD_SHAPES[0].id,
    bedSize: BED_SIZES[0],
    height: HEADBOARD_HEIGHTS[0],
    finish: FINISHES[0].id,
    color: FABRIC_COLORS[0].id,
    length: BENCH_LENGTHS[0],
    skirt: 'Sin entelar',
    cushionShape: CUSHION_SHAPES[0],
    size: CUSHION_SIZES[0],
    puffSize: PUFF_SIZES[0],
  });

  const set = (key: string, value: string) => setOptions((o) => ({ ...o, [key]: value }));
  const price = calculatePrice(type, options);

  const handleOrder = () => {
    const summary = buildConfigSummary(type, options);
    const product = PRODUCTS.find(p => p.type === type);
    const params = new URLSearchParams({
      product: product?.name || '',
      config: summary,
      price: price.toString(),
    });
    navigate(`/contacto?${params.toString()}`);
  };

  const optionBtn = (selected: boolean) =>
    `px-4 py-2.5 text-sm font-light border transition-all cursor-pointer ${
      selected
        ? "border-accent-warm bg-accent-warm text-white"
        : "border-border text-muted-foreground hover:border-accent-warm hover:text-foreground"
    }`;

  const renderSteps = () => {
    switch (type) {
      case 'cabecero':
        return (
          <>
            <Step title="Forma">
              <div className="flex flex-wrap gap-3">
                {HEADBOARD_SHAPES.map((s) => (
                  <button key={s.id} onClick={() => set('shape', s.id)} className={optionBtn(options.shape === s.id)}>
                    {s.name}
                  </button>
                ))}
              </div>
            </Step>
            <Step title="Para cama de">
              <div className="flex flex-wrap gap-3">
                {BED_SIZES.map((s) => (
                  <button key={s} onClick={() => set('bedSize', s)} className={optionBtn(options.bedSize === s)}>
                    {s}
                  </button>
                ))}
              </div>
            </Step>
            <Step title="Altura">
              <div className="flex flex-wrap gap-3">
                {HEADBOARD_HEIGHTS.map((h) => (
                  <button key={h} onClick={() => set('height', h)} className={optionBtn(options.height === h)}>
                    {h}
                  </button>
                ))}
              </div>
            </Step>
          </>
        );
      case 'banco':
        return (
          <Step title="Largo">
            <div className="flex flex-wrap gap-3">
              {BENCH_LENGTHS.map((l) => (
                <button key={l} onClick={() => set('length', l)} className={optionBtn(options.length === l)}>
                  {l}
                </button>
              ))}
            </div>
          </Step>
        );
      case 'mesita':
        return (
          <>
            <Step title="Largo">
              <div className="flex flex-wrap gap-3">
                {TABLE_LENGTHS.map((l) => (
                  <button key={l} onClick={() => set('length', l)} className={optionBtn(options.length === l)}>
                    {l}
                  </button>
                ))}
              </div>
            </Step>
            <Step title="Faldón lateral">
              <div className="flex flex-wrap gap-3">
                {['Entelado', 'Sin entelar'].map((s) => (
                  <button key={s} onClick={() => set('skirt', s)} className={optionBtn(options.skirt === s)}>
                    {s}
                  </button>
                ))}
              </div>
            </Step>
          </>
        );
      case 'cojin':
        return (
          <>
            <Step title="Forma">
              <div className="flex flex-wrap gap-3">
                {CUSHION_SHAPES.map((s) => (
                  <button key={s} onClick={() => set('cushionShape', s)} className={optionBtn(options.cushionShape === s)}>
                    {s}
                  </button>
                ))}
              </div>
            </Step>
            <Step title="Tamaño">
              <div className="flex flex-wrap gap-3">
                {CUSHION_SIZES.map((s) => (
                  <button key={s} onClick={() => set('size', s)} className={optionBtn(options.size === s)}>
                    {s}
                  </button>
                ))}
              </div>
            </Step>
          </>
        );
      case 'puff':
        return (
          <Step title="Tamaño">
            <div className="flex flex-wrap gap-3">
              {PUFF_SIZES.map((s) => (
                <button key={s} onClick={() => set('puffSize', s)} className={optionBtn(options.puffSize === s)}>
                  {s}
                </button>
              ))}
            </div>
          </Step>
        );
    }
  };

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection className="text-center mb-4">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Diseña el tuyo</h2>
          <span className="section-line" />
          <p className="mt-6 text-muted-foreground font-light italic max-w-md mx-auto">
            "Cuantos más detalles nos das, más tuya sale la pieza."
          </p>
          <p className="mt-2 text-sm text-muted-foreground font-light">
            Elige la forma, el tamaño y el acabado y el precio se actualiza en tiempo real.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {/* Product type selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 mt-8">
            {PRODUCTS.map((p) => (
              <button
                key={p.type}
                onClick={() => setType(p.type)}
                className={optionBtn(type === p.type)}
              >
                {p.name.replace(' enteladas', '').replace(' tapizados', '').replace(' elegantes', '').replace(' y almohadones', '')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Options */}
            <div className="space-y-10 order-2 lg:order-1">
              {renderSteps()}

              {type !== 'puff' && (
                <Step title="Acabado">
                  <div className="space-y-3">
                    {FINISHES.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => set('finish', f.id)}
                        className={`w-full text-left px-5 py-4 border transition-all ${
                          options.finish === f.id
                            ? "border-accent-warm"
                            : "border-border hover:border-accent-warm/40"
                        }`}
                      >
                        <span className="text-sm font-medium text-foreground">{f.name}</span>
                        <span className="block text-xs text-muted-foreground font-light italic mt-0.5">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </Step>
              )}

              <Step title="Tela y color">
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                  {FABRIC_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => set('color', c.id)}
                      className={`flex flex-col items-center gap-2 p-3 border transition-all ${
                        options.color === c.id ? "border-accent-warm" : "border-transparent hover:border-border"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs text-muted-foreground font-light">{c.name}</span>
                    </button>
                  ))}
                </div>
              </Step>
            </div>

            {/* SVG Preview */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
              <ProductSVGPreview type={type} options={options} />

              {/* Price */}
              <div className="mt-8 text-center">
                <p className="font-serif text-4xl md:text-5xl font-light text-foreground">{price}€</p>
                <p className="mt-2 text-xs text-muted-foreground font-light">
                  Precio final con IVA incluido y envío a toda España — sin sorpresas.
                </p>
                <button
                  onClick={handleOrder}
                  className="mt-6 inline-block px-10 py-3.5 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity"
                >
                  Solicitar pedido
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

const Step = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-serif text-lg font-medium text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

export default ProductConfigurator;
