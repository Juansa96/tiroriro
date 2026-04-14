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
  { id: 'beige-lino', name: 'Beige lino', hex: '#E8DCC8' },
  { id: 'arena', name: 'Arena', hex: '#D4C4A0' },
  { id: 'verde-salvia', name: 'Verde salvia', hex: '#8B9D77' },
  { id: 'azul-pizarra', name: 'Azul pizarra', hex: '#6B7F8E' },
  { id: 'gris-perla', name: 'Gris perla', hex: '#C8C8C0' },
  { id: 'mostaza-apagada', name: 'Mostaza apagada', hex: '#C4A882' },
  { id: 'borgona', name: 'Borgoña', hex: '#7D3A3A' },
  { id: 'negro', name: 'Negro', hex: '#2C2C2C' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'cabecero-tapizado',
    type: 'cabecero',
    name: 'Cabeceros tapizados',
    tagline: 'El punto de partida de cualquier dormitorio que merece la pena',
    basePrice: 320,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80',
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
    name: 'Mesitas de centro enteladas',
    tagline: 'Para el salón que lleva tiempo esperando ese último detalle',
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
  },
  {
    id: 'cojin-almohadon',
    type: 'cojin',
    name: 'Cojines y almohadones',
    tagline: 'Porque una tela bien elegida cambia el carácter de cualquier rincón',
    basePrice: 45,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
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

  const finish = FINISHES.find(f => f.id === options.finish);
  if (finish) price += finish.extra;

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
    if (options.puffSize === 'Mediano') price += 40;
    if (options.puffSize === 'Grande') price += 90;
  }

  return price;
}

export function buildConfigSummary(type: ProductType, options: Record<string, string>): string {
  const product = PRODUCTS.find(p => p.type === type);
  if (!product) return '';
  const parts: string[] = [product.name];
  const colorName = FABRIC_COLORS.find(c => c.id === options.color)?.name;
  const finishName = FINISHES.find(f => f.id === options.finish)?.name;

  if (type === 'cabecero') {
    const shapeName = HEADBOARD_SHAPES.find(s => s.id === options.shape)?.name;
    if (shapeName) parts.push(shapeName);
    if (options.bedSize) parts.push(`Cama ${options.bedSize}`);
    if (options.height) parts.push(`Altura ${options.height}`);
  }
  if (type === 'banco') {
    if (options.length) parts.push(options.length);
  }
  if (type === 'mesita') {
    if (options.length) parts.push(options.length);
    if (options.skirt) parts.push(`Faldón: ${options.skirt}`);
  }
  if (type === 'cojin') {
    if (options.cushionShape) parts.push(options.cushionShape);
    if (options.size) parts.push(options.size);
  }
  if (type === 'puff') {
    if (options.puffSize) parts.push(options.puffSize);
  }
  if (finishName && type !== 'puff') parts.push(finishName);
  if (colorName) parts.push(`Color: ${colorName}`);

  return parts.join(' · ');
}
