export interface SharedFabric {
  id: string;
  name: string;
  coleccion: "Básicas" | "Premium";
  hex: string;
  image: string;
  descripcion: string;
}

export const FABRICS: SharedFabric[] = [
  // ── Básicas — Lisas ───────────────────────────────────────────────────────
  { id: "basica-arequipa-beige", name: "Arequipa Beige", coleccion: "Básicas", hex: "#D4C5A9", image: "/telas/basicas/arequipa-beige.webp", descripcion: "Lino en tono tierra cálido y natural. Versátil, combina con madera clara y tonos neutros." },

  // ── Básicas — Flores ──────────────────────────────────────────────────────
  { id: "basica-flor-azul-protea", name: "Flor Azul Protea", coleccion: "Básicas", hex: "#6B8FAA", image: "/telas/basicas/flor-azul-protea.webp", descripcion: "Floral botánico en azul. Perfecto para piezas que quieren protagonismo." },
  { id: "basica-flor-01", name: "Floral Natural", coleccion: "Básicas", hex: "#8B7355", image: "/telas/basicas/flor-01.webp", descripcion: "Estampado floral en tono natural. Delicado y atemporal." },
  { id: "basica-flor-hemera-amarilla", name: "Flor Hémera Amarilla", coleccion: "Básicas", hex: "#D4B84A", image: "/telas/basicas/flor-hemera-amarilla.webp", descripcion: "Floral en amarillo cálido. Alegre y luminoso, perfecto para dar vida a cualquier espacio." },
  { id: "basica-morris-granadas-terracota", name: "Morris Granadas Terracota", coleccion: "Básicas", hex: "#B5604A", image: "/telas/basicas/morris-granadas-terracota.webp", descripcion: "Inspirado en William Morris, granadas en terracota. Clásico con mucho carácter." },
  { id: "basica-pajaros-louise-azul", name: "Pájaros Louise Azul", coleccion: "Básicas", hex: "#5B7EA6", image: "/telas/basicas/pajaros-louise-azul.webp", descripcion: "Estampado de pájaros en azul. Delicado y con personalidad propia." },
  { id: "basica-pajaros-louise-rosa", name: "Pájaros Louise Rosa", coleccion: "Básicas", hex: "#C48080", image: "/telas/basicas/pajaros-louise-rosa.webp", descripcion: "Estampado de pájaros en rosa empolvado. Romántico y atemporal." },
  { id: "basica-pajaros-louise-verde", name: "Pájaros Louise Verde", coleccion: "Básicas", hex: "#5B8A6A", image: "/telas/basicas/pajaros-louise-verde.webp", descripcion: "Estampado de pájaros en verde natural. Fresco y lleno de vida." },
  { id: "basica-floralia-vintage", name: "Floralia Vintage", coleccion: "Básicas", hex: "#8B6B4A", image: "/telas/basicas/floralia-vintage.webp", descripcion: "Floral vintage en tonos rosa empolvado. Evoca la tapicería clásica con aire contemporáneo." },

  // ── Básicas — Geométricas ─────────────────────────────────────────────────
  { id: "basica-ikat", name: "Ikat Natural", coleccion: "Básicas", hex: "#C4A882", image: "/telas/basicas/ikat.webp", descripcion: "Tejido ikat en tonos arena. Artesanal con carácter étnico contemporáneo." },
  { id: "basica-ikat-verde", name: "Ikat Verde Agua", coleccion: "Básicas", hex: "#7D9B76", image: "/telas/basicas/ikat-verde.webp", descripcion: "Ikat en verde agua refrescante. Tendencia en interiorismo natural." },
  { id: "basica-ikat-arena", name: "Ikat Arena", coleccion: "Básicas", hex: "#C8A878", image: "/telas/basicas/ikat-arena.webp", descripcion: "Ikat en tono arena cálido. Artesanal y muy versátil." },
  { id: "basica-ikat-arrecife", name: "Ikat Arrecife", coleccion: "Básicas", hex: "#6B8B8B", image: "/telas/basicas/ikat-arrecife.webp", descripcion: "Ikat en azul arrecife. Evoca el mar con elegancia." },
  { id: "basica-ikat-bali-azul", name: "Ikat Bali Azul", coleccion: "Básicas", hex: "#4A6B8B", image: "/telas/basicas/ikat-bali-azul.webp", descripcion: "Ikat artesanal en azul Bali. Étnico y sofisticado a la vez." },
  { id: "basica-ikat-yakarta", name: "Ikat Yakarta", coleccion: "Básicas", hex: "#8B7A55", image: "/telas/basicas/ikat-yakarta.webp", descripcion: "Lino ikat en tonos naturales. Carácter artesanal con textura visible." },
  { id: "basica-arbol-kasbah", name: "Árbol Kasbah", coleccion: "Básicas", hex: "#8B6554", image: "/telas/basicas/arbol-kasbah.webp", descripcion: "Estampado árbol en tonos verde salvia. Bohemio y sofisticado." },
  { id: "basica-geometrica-kuwait", name: "Geométrica Kuwait", coleccion: "Básicas", hex: "#8B7355", image: "/telas/basicas/geometrica-kuwait.webp", descripcion: "Geométrico inspirado en la tapicería marroquí. Muy versátil." },
  { id: "basica-takada-verde", name: "Takada Verde", coleccion: "Básicas", hex: "#5B7355", image: "/telas/basicas/takada-verde.webp", descripcion: "Estampado geométrico en verde oliva. Fresco y contemporáneo." },
  { id: "basica-espiga-agua", name: "Espiga Agua", coleccion: "Básicas", hex: "#8BA89A", image: "/telas/basicas/espiga-agua.webp", descripcion: "Raya fina en tono agua marina. Textura elegante y muy resistente." },

  // ── Básicas — Rayas ───────────────────────────────────────────────────────
  { id: "basica-mil-rayas-gris", name: "Mil Rayas Gris", coleccion: "Básicas", hex: "#A0A0A0", image: "/telas/basicas/mil-rayas-gris.webp", descripcion: "Rayas finas tejidas en gris. Elegante y atemporal." },
  { id: "basica-rayas-arena", name: "Rayas Arena", coleccion: "Básicas", hex: "#C4A882", image: "/telas/basicas/rayas-arena.webp", descripcion: "Raya duplo en tono arena. Natural y fácil de combinar." },
  { id: "basica-mil-rayas-azul", name: "Mil Rayas Azul Marino", coleccion: "Básicas", hex: "#2C3E50", image: "/telas/basicas/mil-rayas-azul.webp", descripcion: "Rayas tejidas en azul marino. Clásico náutico con personalidad." },
  { id: "basica-raya-indigo", name: "Raya Índigo Acuarela", coleccion: "Básicas", hex: "#4A6FA5", image: "/telas/basicas/raya-indigo.webp", descripcion: "Raya artesanal en índigo acuarela. Efecto pintura único." },
  { id: "basica-rayas-tevere", name: "Rayas Tévere", coleccion: "Básicas", hex: "#8B7355", image: "/telas/basicas/rayas-tevere.webp", descripcion: "Raya clásica en tono natural. Versátil y resistente." },
  { id: "basica-coral-costero", name: "Coral Costero", coleccion: "Básicas", hex: "#E8A87C", image: "/telas/basicas/coral-costero.webp", descripcion: "Ramitas bordadas en tonos coral y azul sobre fondo claro. Ideal para ambientes mediterráneos." },
  { id: "basica-raya-harvest", name: "Raya Harvest", coleccion: "Básicas", hex: "#C19A6B", image: "/telas/basicas/raya-harvest.webp", descripcion: "Raya clásica en tonos harvest. Cálida y acogedora." },
  { id: "basica-rayas-laurel-azul", name: "Rayas Laurel Azul", coleccion: "Básicas", hex: "#5B7A9A", image: "/telas/basicas/rayas-laurel-azul.webp", descripcion: "Raya en verde laurel con fondo natural. Fresca y muy combinable." },
  { id: "basica-lino-greca", name: "Lino Greca", coleccion: "Básicas", hex: "#C4B090", image: "/telas/basicas/lino-greca.webp", descripcion: "Lino con motivo greca tejido. Clásico y de gran elegancia." },
  { id: "basica-raya-rioja", name: "Raya Rioja", coleccion: "Básicas", hex: "#8B3A3A", image: "/telas/basicas/raya-rioja.webp", descripcion: "Raya en burdeos Rioja. Cálida y con mucha personalidad." },
  { id: "basica-rayas-espiga-arena", name: "Rayas Espiga Arena", coleccion: "Básicas", hex: "#C8AA82", image: "/telas/basicas/rayas-espiga-arena.webp", descripcion: "Espiga tejida en tono arena. Textura artesanal muy elegante." },
  { id: "basica-rayas-espiga-azul", name: "Rayas Espiga Azul", coleccion: "Básicas", hex: "#4A6B8A", image: "/telas/basicas/rayas-espiga-azul.webp", descripcion: "Espiga en azul profundo. Clásico, resistente y muy versátil." },
  { id: "basica-rayas-piave", name: "Rayas Piave", coleccion: "Básicas", hex: "#7A8B6A", image: "/telas/basicas/rayas-piave.webp", descripcion: "Raya Piave en tonos naturales. Discreta y de gran calidad." },
  { id: "basica-raya-artesanal-lino", name: "Raya Artesanal Lino", coleccion: "Básicas", hex: "#C8B890", image: "/telas/basicas/raya-artesanal-lino.webp", descripcion: "Raya artesanal en lino natural. Textura visible y acabado cuidado." },
  { id: "basica-raya-relieve-lino", name: "Raya Relieve Lino", coleccion: "Básicas", hex: "#D4C8A8", image: "/telas/basicas/raya-relieve-lino.webp", descripcion: "Lino con raya en relieve. Elegante al tacto y a la vista." },

  // ── Básicas — Otras ───────────────────────────────────────────────────────
  { id: "basica-toile-jouy-azul", name: "Toile de Jouy Azul", coleccion: "Básicas", hex: "#6B8FAA", image: "/telas/basicas/toile-jouy-azul.webp", descripcion: "Clásico toile en azul. Romántico y con mucho carácter." },
  { id: "basica-espiga-azul", name: "Espiga Azul", coleccion: "Básicas", hex: "#5A7890", image: "/telas/basicas/espiga-azul.webp", descripcion: "Sarga lisa en azul con textura de espiga. Elegante y muy resistente al uso." },
  { id: "basica-morris-granadas-azul", name: "Morris Granadas Azul", coleccion: "Básicas", hex: "#4A6B8B", image: "/telas/basicas/morris-granadas-azul.webp", descripcion: "Granadas Morris en azul. Clásico inglés con carácter propio." },
  { id: "basica-pata-de-gallo-verde", name: "Pata de Gallo Verde", coleccion: "Básicas", hex: "#5A7A5A", image: "/telas/basicas/pata-de-gallo-verde.webp", descripcion: "Pata de gallo en verde salvia. Sofisticado y muy actual." },
  { id: "basica-ikat-rojo", name: "Ikat Rojo", coleccion: "Básicas", hex: "#B54A4A", image: "/telas/basicas/ikat-rojo.webp", descripcion: "Ikat en rojo intenso. Vibrante y con mucha energía." },

  // ── Premium ───────────────────────────────────────────────────────────────
  { id: "premium-baqueira", name: "Baqueira", coleccion: "Premium", hex: "#5B4B3A", image: "/telas/premium/baqueira.webp", descripcion: "Rayas anchas en tonos oscuros sobre fondo crudo. Tapicería premium de alto gramaje y tacto suave." },
  { id: "premium-baqueira-roja", name: "Baqueira Roja", coleccion: "Premium", hex: "#8B3A3A", image: "/telas/premium/baqueira-roja.webp", descripcion: "Rayas anchas en burdeos y azul marino sobre fondo crudo. Sofisticada y de gran carácter." },
  { id: "premium-cerler", name: "Cérler", coleccion: "Premium", hex: "#8B7355", image: "/telas/premium/cerler.webp", descripcion: "Rayas finas en verde y crudo. Tejido premium, lujoso y muy resistente." },
  { id: "premium-lola-gris", name: "Lola Gris", coleccion: "Premium", hex: "#6D6D6D", image: "/telas/premium/lola-gris.webp", descripcion: "Raya fina en gris con pequeños motivos tejidos. Discreta y elegante." },
  { id: "premium-rocio", name: "Rocío", coleccion: "Premium", hex: "#D4B896", image: "/telas/premium/rocio.webp", descripcion: "Rayas horizontales tejidas en teja sobre crudo. Premium, luminoso y con carácter." },
  { id: "premium-artesano-beige", name: "Artesano Beige", coleccion: "Premium", hex: "#D4C5A9", image: "/telas/premium/artesano-beige.webp", descripcion: "Tejido artesanal en beige natural. Textura visible con acabado impecable." },
  { id: "premium-oxford", name: "Oxford", coleccion: "Premium", hex: "#D0C8B8", image: "/telas/premium/oxford.webp", descripcion: "Lino Oxford de alto gramaje. Elegancia atemporal con una textura exquisita." },
  { id: "premium-lino-verde-botella", name: "Lino Verde Botella", coleccion: "Premium", hex: "#2D4A2D", image: "/telas/premium/lino-verde-botella.webp", descripcion: "Lino premium en verde botella intenso. Elegante y muy tendencia." },
  { id: "premium-lino-verde", name: "Lino Verde", coleccion: "Premium", hex: "#4A6B4A", image: "/telas/premium/lino-verde.webp", descripcion: "Lino viscosa en verde fresco. Fluido y de gran caída." },
  { id: "premium-guell-lamadrid", name: "Güell Lamadrid", coleccion: "Premium", hex: "#8B7355", image: "/telas/premium/guell-lamadrid.webp", descripcion: "Raya fina en azul marino y crudo, de la firma Güell Lamadrid. Calidad de firma para proyectos especiales." },
  { id: "premium-rayas-verde-sage", name: "Rayas Verde Sage", coleccion: "Premium", hex: "#7D9B76", image: "/telas/premium/rayas-verde-sage.webp", descripcion: "Lino a rayas en verde sage. Natural y muy actual." },
  { id: "premium-lino-azul-provenzal", name: "Lino Azul Provenzal", coleccion: "Premium", hex: "#4A6FA5", image: "/telas/premium/lino-azul-provenzal.webp", descripcion: "Estampado floral en azul sobre lino crudo. Evoca el sur de Francia." },
  { id: "premium-vichy-denim", name: "Vichy Denim", coleccion: "Premium", hex: "#2C3E50", image: "/telas/premium/vichy-denim.webp", descripcion: "Cuadro vichy en denim. Fresco, clásico y con mucho estilo." },
  { id: "premium-vichy-verde", name: "Vichy Verde", coleccion: "Premium", hex: "#4A7A5A", image: "/telas/premium/vichy-verde.webp", descripcion: "Vichy en verde salvia. Clásico con un toque natural muy actual." },
  { id: "premium-ramas-siena", name: "Ramas Siena Azul", coleccion: "Premium", hex: "#5B6B8B", image: "/telas/premium/ramas-siena.webp", descripcion: "Estampado botánico en azul siena. Exclusivo y con personalidad." },
  { id: "premium-flores-gardenia", name: "Flores Gardenia", coleccion: "Premium", hex: "#6B8FAA", image: "/telas/premium/flores-gardenia.webp", descripcion: "Lino con flores gardenia en turquesa. Romántico y único." },
  { id: "premium-lino-flores-normandia", name: "Lino Flores Normandía", coleccion: "Premium", hex: "#8BA870", image: "/telas/premium/lino-flores-normandia.webp", descripcion: "Lino con flores en verde Normandía. Romántico y de gran calidad." },
  { id: "premium-lino-flores-senda", name: "Lino Flores Senda", coleccion: "Premium", hex: "#C8A8A0", image: "/telas/premium/lino-flores-senda.webp", descripcion: "Flores delicadas sobre lino natural. Elegante y con mucho detalle." },
  { id: "premium-bibiana", name: "Bibiana", coleccion: "Premium", hex: "#8B7A8B", image: "/telas/premium/bibiana.webp", descripcion: "Celosía de hojas en azul sobre fondo claro. Sofisticado y de alto gramaje." },
  { id: "premium-prints-botanicos", name: "Prints Botánicos", coleccion: "Premium", hex: "#5A7A5A", image: "/telas/premium/prints-botanicos.webp", descripcion: "Estampado botánico en lino premium. Exclusivo y lleno de detalle." },
  { id: "premium-raya-monina", name: "Raya Monina", coleccion: "Premium", hex: "#C8B890", image: "/telas/premium/raya-monina.webp", descripcion: "Lino raya Monina de gran finura. Natural y muy elegante." },
  { id: "premium-rayas-jules-verde", name: "Rayas Jules Verde", coleccion: "Premium", hex: "#4A7A5A", image: "/telas/premium/rayas-jules-verde.webp", descripcion: "Rayas Jules en verde. Clásico y sofisticado con un toque fresco." },
];

// Agrupado para el configurador
export const FABRIC_GROUPS = [
  {
    label: "Básicas",
    collection: "Colección Básica",
    fabrics: FABRICS.filter(f => f.coleccion === "Básicas"),
  },
  {
    label: "Premium",
    collection: "Colección Premium",
    fabrics: FABRICS.filter(f => f.coleccion === "Premium"),
  },
] as const;

export const ALL_FABRICS = FABRICS.map(f => ({
  ...f,
  group: f.coleccion,
  collection: f.coleccion === "Básicas" ? "Colección Básica" : "Colección Premium",
}));
