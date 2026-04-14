export type ProductType = 'cabecero' | 'banco' | 'mesita' | 'cojin' | 'puff';

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  tagline: string;
  basePrice: number;
  image: string;
}

export const FABRIC_COLORS = [
  { id: 'beige-crudo', name: 'Beige crudo', hex: '#D4C5A9' },
  { id: 'lino-natural', name: 'Lino natural', hex: '#C8B89A' },
  { id: 'tierra-tostada', name: 'Tierra tostada', hex: '#A0855B' },
  { id: 'verde-salvia', name: 'Verde salvia', hex: '#9CAF96' },
  { id: 'azul-pizarra', name: 'Azul pizarra', hex: '#708090' },
  { id: 'gris-perla', name: 'Gris perla', hex: '#C4C0B6' },
  { id: 'mostaza-apagado', name: 'Mostaza apagado', hex: '#C9A94E' },
  { id: 'borgona', name: 'Borgoña', hex: '#6B2D3E' },
  { id: 'negro', name: 'Negro', hex: '#2C2C2C' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'cabecero-tapizado',
    type: 'cabecero',
    name: 'Cabeceros tapizados',
    tagline: 'El punto de partida de cualquier dormitorio que merece la pena',
    basePrice: 320,
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
  },
  {
    id: 'banco-entelado',
    type: 'banco',
    name: 'Bancos entelados',
    tagline: 'Para el pie de la cama, la entrada o donde quieras que aterrice la vista',
    basePrice: 220,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  },
  {
    id: 'mesita-entelada',
    type: 'mesita',
    name: 'Mesitas y cojines',
    tagline: 'Los detalles que hacen que una habitación se sienta completa',
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  },
  {
    id: 'puff-elegante',
    type: 'puff',
    name: 'Puffs elegantes',
    tagline: 'Asiento, reposapiés, escultura — según cómo lo mires',
    basePrice: 150,
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
  },
];

export const HEADBOARD_SHAPES = [
  { id: 'rectangular', name: 'Rectangular' },
  { id: 'semicirculo', name: 'Semicírculo' },
  { id: 'corona-simple', name: 'Corona simple' },
  { id: 'corona-doble', name: 'Corona doble' },
];

export const BED_SIZES = ['90 cm', '135 cm', '150 cm', '180 cm', 'Medida especial'];
export const HEADBOARD_HEIGHTS = ['100 cm', '120 cm', 'Altura especial'];
export const BENCH_LENGTHS = ['80 cm', '100 cm', '120 cm', '140 cm', '160 cm', 'Personalizado'];
export const TABLE_LENGTHS = ['80 cm', '100 cm', '120 cm', '140 cm', '160 cm', 'Personalizado'];
export const CUSHION_SHAPES = ['Cuadrado', 'Rectangular'];
export const CUSHION_SIZES = ['30×30 cm', '40×40 cm', '50×50 cm', '30×50 cm'];
export const PUFF_SIZES = ['Pequeño', 'Mediano', 'Grande'];

export const FINISHES = [
  { id: 'liso', name: 'Acabado liso', desc: 'Limpio, moderno, sin interrupciones', extra: 0 },
  { id: 'vivo-simple', name: 'Con vivo simple', desc: 'Una línea que define y remata', extra: 30 },
  { id: 'vivo-doble', name: 'Con vivo doble', desc: 'El detalle que lo convierte en una pieza de autor', extra: 60 },
];

export function calculatePrice(type: ProductType, options: Record<string, string>): number {
  const product = PRODUCTS.find(p => p.type === type);
  if (!product) return 0;
  let price = product.basePrice;

  // Finish extra
  const finish = FINISHES.find(f => f.id === options.finish);
  if (finish) price += finish.extra;

  // Size extras
  if (type === 'cabecero') {
    const sizeIdx = BED_SIZES.indexOf(options.bedSize || '');
    price += sizeIdx * 40;
    if (options.height === '120 cm') price += 50;
    if (options.height === 'Altura especial') price += 80;
    if (options.bedSize === 'Medida especial') price += 60;
  }
  if (type === 'banco' || type === 'mesita') {
    const lengths = type === 'banco' ? BENCH_LENGTHS : TABLE_LENGTHS;
    const lenIdx = lengths.indexOf(options.length || '');
    price += lenIdx * 25;
    if (options.length === 'Personalizado') price += 50;
    if (type === 'mesita' && options.skirt === 'Entelado') price += 40;
  }
  if (type === 'cojin') {
    const sizeIdx = CUSHION_SIZES.indexOf(options.size || '');
    price += sizeIdx * 10;
  }
  if (type === 'puff') {
    if (options.size === 'Mediano') price += 40;
    if (options.size === 'Grande') price += 90;
  }

  return price;
}
