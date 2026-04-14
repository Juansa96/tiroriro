import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import {
  ProductType, PRODUCTS, FABRIC_COLORS, HEADBOARD_SHAPES, BED_SIZES,
  HEADBOARD_HEIGHTS, BENCH_LENGTHS, TABLE_LENGTHS, CUSHION_SHAPES,
  CUSHION_SIZES, PUFF_SIZES, FINISHES, calculatePrice
} from "@/lib/products";

interface Props {
  initialType?: ProductType;
}

const ProductConfigurator = ({ initialType = 'cabecero' }: Props) => {
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

  const optionBtn = (selected: boolean) =>
    `px-4 py-2.5 text-sm font-light border transition-all cursor-pointer ${
      selected
        ? "border-foreground bg-foreground text-background"
        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
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
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection className="text-center mb-4">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Diseña el tuyo</h2>
          <p className="mt-4 text-muted-foreground font-light italic max-w-md mx-auto">
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
                {p.name.replace('Mesitas y cojines', 'Mesitas').replace('Puffs elegantes', 'Puffs')}
              </button>
            ))}
            <button
              onClick={() => setType('cojin')}
              className={optionBtn(type === 'cojin')}
            >
              Cojines
            </button>
          </div>

          <div className="space-y-10">
            {renderSteps()}

            {/* Finish — shared by all except puff */}
            {type !== 'puff' && (
              <Step title="Acabado">
                <div className="space-y-3">
                  {FINISHES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => set('finish', f.id)}
                      className={`w-full text-left px-5 py-4 border transition-all ${
                        options.finish === f.id
                          ? "border-foreground"
                          : "border-border hover:border-foreground/40"
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">{f.name}</span>
                      <span className="block text-xs text-muted-foreground font-light italic mt-0.5">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {/* Color palette — all products */}
            <Step title="Tela y color">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {FABRIC_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => set('color', c.id)}
                    className={`flex flex-col items-center gap-2 p-3 border transition-all ${
                      options.color === c.id ? "border-foreground" : "border-transparent hover:border-border"
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

          {/* Price */}
          <div className="mt-12 text-center border-t border-border pt-10">
            <p className="font-serif text-4xl md:text-5xl font-light text-foreground">{price}€</p>
            <p className="mt-2 text-xs text-muted-foreground font-light">
              Precio final con IVA incluido y envío a toda España — sin sorpresas cuando llegue la factura.
            </p>
            <Link
              to="/contacto"
              className="mt-6 inline-block px-10 py-3.5 bg-foreground text-background text-sm tracking-extra-wide uppercase font-medium hover:bg-foreground/90 transition-colors"
            >
              Solicitar pedido
            </Link>
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
