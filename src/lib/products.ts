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
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
  },
  {
    id: 'banco-entelado',
    type: 'banco',
    name: 'Bancos entelados',
    tagline: 'Para el pie de la cama, la entrada o donde quieras que aterrice la vista',
    basePrice: 120,
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
  },
  {
    id: 'mesita-entelada',
    type: 'mesita',
    name: 'Mesitas de noche',
    tagline: 'El rincón que más tocas — que también sea bonito',
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=800&q=80',
  },
  {
    id: 'cojin-almohadon',
    type: 'cojin',
    name: 'Cojines y almohadones',
    tagline: 'Los últimos detalles que convierten una cama en la tuya',
    basePrice: 35,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
  },
  {
    id: 'puff-elegante',
    type: 'puff',
    name: 'Puffs elegantes',
    tagline: 'Asiento, reposapiés, escultura — según cómo lo mires',
    basePrice: 95,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  },
];

export const HEADBOARD_SHAPES = [
  { id: 'rectangular', name: 'Rectangular' },
  { id: 'semicirculo', name: 'Semicírculo' },
  { id: 'corona-simple', name: 'Corona simple' },
  { id: 'corona-doble', name: 'Corona doble' },
];

export const BED_SIZES = ['90 cm', '105 cm', '135 cm', '150 cm', '160 cm', '180 cm'];
export const HEADBOARD_HEIGHTS = ['60 cm', '70 cm', '80 cm', '90 cm'];
export const BENCH_LENGTHS = ['80 cm', '100 cm', '120 cm', '140 cm', 'Personalizado'];
export const TABLE_LENGTHS = ['80 cm', '100 cm', '120 cm', '140 cm', '160 cm', 'Personalizado'];
export const CUSHION_SHAPES = ['Cuadrado', 'Rectangular'];
export const CUSHION_SIZES = ['40×40 cm', '45×45 cm', '50×30 cm (lumbar)'];
export const PUFF_SIZES = ['Pequeño', 'Mediano', 'Grande'];

export const FINISHES = [
  { id: 'liso', name: 'Acabado liso', desc: 'Limpio, moderno, sin interrupciones', extra: 0 },
  { id: 'vivo-simple', name: 'Con vivo simple', desc: 'Una línea que define y remata', extra: 15 },
  { id: 'vivo-doble', name: 'Con vivo doble', desc: 'El detalle que lo convierte en una pieza de autor', extra: 25 },
  { id: 'botonadura', name: 'Botonadura', desc: 'Botones tapizados distribuidos uniformemente', extra: 30 },
];

export function calculatePrice(type: ProductType, options: Record<string, string>): number {
  const product = PRODUCTS.find(p => p.type === type);
  if (!product) return 0;
  let price = product.basePrice;

  const finish = FINISHES.find(f => f.id === options.finish);
  if (finish) price += finish.extra;

  if (type === 'cabecero') {
    const sizeMap: Record<string, number> = {
      '90 cm': 180, '105 cm': 195, '135 cm': 220, '150 cm': 240, '160 cm': 260, '180 cm': 290,
    };
    const sizePrice = sizeMap[options.bedSize];
    if (sizePrice) {
      price = sizePrice; // base is the size price
      if (finish) price += finish.extra;
    }
  }

  if (type === 'banco') {
    const lenMap: Record<string, number> = { '80 cm': 120, '100 cm': 135, '120 cm': 150, '140 cm': 165 };
    const lenPrice = lenMap[options.length];
    if (lenPrice) {
      price = lenPrice;
      if (finish) price += finish.extra;
    }
    if (options.length === 'Personalizado') price += 50;
  }

  if (type === 'mesita') {
    const lengths = TABLE_LENGTHS;
    const lenIdx = lengths.indexOf(options.length || '');
    price += lenIdx * 25;
    if (options.length === 'Personalizado') price += 50;
    if (options.skirt === 'Entelado') price += 40;
  }

  if (type === 'cojin') {
    const sizeIdx = CUSHION_SIZES.indexOf(options.size || '');
    price += sizeIdx * 10;
  }

  if (type === 'puff') {
    if (options.puffSize === 'Mediano') price += 40;
    if (options.puffSize === 'Grande') price += 90;
  }

  // Extras
  if (options.patas === 'true') price += 15;
  if (options.relleno === 'true') price += 20;
  if (options.express === 'true') price += 35;

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
