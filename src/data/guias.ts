// Guías de compra por categoría. Se enseñan al final de cada página de
// categoría (y la de telas en /telas) y entran en public/llms-full.txt vía
// scripts/gen-llms-full.ts. Son el texto largo y útil que buscadores y
// asistentes de IA citan cuando alguien pregunta "qué banco para una cama de
// 150" o "qué pantalla para mi lámpara". Sin páginas nuevas: cero clics extra.
//
// Regla de oro: solo datos reales del taller (medidas y precios salen de
// src/data/pricing.ts). Si algo cambia en el taller, cambia aquí.

export interface GuiaBloque {
  titulo: string;
  parrafos: string[];
  lista?: string[];
}

export interface Guia {
  titulo: string;
  intro: string;
  bloques: GuiaBloque[];
}

export const GUIAS: Record<string, Guia> = {
  bancos: {
    titulo: "Cómo elegir tu banco de pie de cama",
    intro:
      "El banco Oyambre se fabrica a mano en cinco largos, siempre con 45 cm de alto y 33 cm de fondo. Estas son las tres preguntas que nos hacen antes de pedirlo.",
    bloques: [
      {
        titulo: "¿Qué largo según la cama?",
        parrafos: [
          "La regla que mejor funciona es que el banco quede entre 20 y 30 cm más estrecho que el colchón: así deja aire a los lados y no tropieza con las mesillas.",
        ],
        lista: [
          "Cama de 90 cm → banco de 60 cm.",
          "Cama de 105 o 135 cm → banco de 90 cm.",
          "Cama de 150 o 160 cm → banco de 120 cm.",
          "Cama de 180 cm → banco de 150 cm.",
          "Cama de 200 cm → banco de 180 cm.",
        ],
      },
      {
        titulo: "¿Dónde ponerlo?",
        parrafos: [
          "A los pies de la cama es su sitio natural: para dejar la colcha por la noche, sentarse a ponerse los zapatos o apoyar la maleta. Pero el de 60 y el de 90 cm funcionan igual de bien en un recibidor, bajo una ventana o en el vestidor. Si va en un pasillo o una entrada, mide el paso que queda libre: con 33 cm de fondo cabe donde una silla no.",
        ],
      },
      {
        titulo: "¿Cuánto aguanta?",
        parrafos: [
          "Está pensado para sentarse a diario. La estructura es de madera reforzada y el asiento lleva gomaespuma de alta densidad, la que no se hunde con los años, más una capa de guata para el tacto mullido. La tela va cosida y ajustada a mano, sin costuras vistas en el asiento.",
        ],
      },
      {
        titulo: "¿Qué tela le va?",
        parrafos: [
          "Si ya tienes un cabecero tapizado, hay dos caminos que siempre quedan bien: la misma tela, para que dormitorio y banco se lean como un conjunto, o una lisa en un tono del estampado del cabecero. Para un banco que se usa mucho, elige una tela de trama cerrada y color medio: disimula el uso y se limpia mejor. Puedes ampliar todas las telas en la página de telas.",
        ],
      },
    ],
  },

  pufs: {
    titulo: "Cómo elegir tu puf",
    intro:
      "Dos formas, Patos (cuadrado) y Monteferro (redondo), en tres tamaños cada una y siempre con 40 cm de alto. Así se elige el que encaja en tu casa.",
    bloques: [
      {
        titulo: "¿Cuadrado o redondo?",
        parrafos: [
          "El cuadrado se alinea con el sofá, la mesa de centro y las paredes: ordena el espacio y sirve de mesa auxiliar con una bandeja encima. El redondo suaviza salones muy rectos, se rodea sin tropezar y es el favorito para habitaciones infantiles y para zonas de paso.",
        ],
      },
      {
        titulo: "¿Qué tamaño para qué uso?",
        parrafos: ["Los 40 cm de alto coinciden con la altura del asiento de un sofá, así que también sirven de reposapiés."],
        lista: [
          "40 cm: reposapiés, asiento extra ocasional o puf de habitación infantil.",
          "50 cm: el tamaño más versátil. Asiento cómodo para un adulto y mesa auxiliar con bandeja.",
          "60 cm: asiento amplio, mesa de centro blanda con bandeja o pareja de pufs a los pies de la cama en lugar de un banco.",
        ],
      },
      {
        titulo: "¿Dónde queda mejor?",
        parrafos: [
          "En el salón, delante del sofá o en la esquina de lectura. En el dormitorio, uno a cada lado a los pies de la cama. En el recibidor, el de 40 o 50 cm hace de asiento para calzarse sin ocupar sitio. Y en la habitación de los niños aguanta lo que le echen: se tapiza con la misma gomaespuma de alta densidad que los cabeceros.",
        ],
      },
      {
        titulo: "¿Cómo se cuida?",
        parrafos: [
          "Basta con aspirar cada dos o tres semanas con la boquilla suave. Una mancha puntual se retira con un paño húmedo y jabón neutro, de fuera hacia dentro. Si quieres que el borde marque la forma, pide el vivo: un ribete cosido que además protege la costura del roce.",
        ],
      },
    ],
  },

  "pantallas-lampara": {
    titulo: "Qué pantalla para tu lámpara",
    intro:
      "Una pantalla tapizada cambia una lámpara entera por muy poco dinero. Tres formas disponibles, Almanzor (cilíndrica), Tormes (cuadrada) y La Serrota (rectangular), y esta guía para acertar con la medida.",
    bloques: [
      {
        titulo: "¿Qué forma según la lámpara?",
        parrafos: [],
        lista: [
          "Almanzor, cilíndrica: la más versátil. Para lámparas de mesilla, de sobremesa y de pie con base redonda.",
          "Tormes, cuadrada: líneas limpias para bases cuadradas o cúbicas y para espacios contemporáneos.",
          "La Serrota, rectangular: para apliques de pared y lámparas de pie o de mesa con base alargada.",
        ],
      },
      {
        titulo: "¿Qué medida?",
        parrafos: ["La regla clásica: el diámetro de la pantalla debe estar entre el ancho de la base y el doble de ese ancho."],
        lista: [
          "Ø 15 × 20 cm: lámpara de mesilla o de escritorio pequeña.",
          "Ø 25 × 25 cm: lámpara de sobremesa de tamaño medio, la más habitual.",
          "Ø 40 × 40 cm: lámpara de pie o de sobremesa grande, para presidir un salón.",
          "20 × 20 cm cuadrada y 20 × 40 cm rectangular: apliques y bases rectas.",
        ],
      },
      {
        titulo: "¿Cómo mido la pantalla que tengo?",
        parrafos: [
          "Apunta tres números: el diámetro (o el lado) de la parte de arriba, el de la parte de abajo y el alto en vertical. Hazle una foto al aro interior donde va la bombilla y envíanosla por WhatsApp: con eso te decimos si la nueva encaja en tu lámpara sin cambiar nada más.",
        ],
      },
      {
        titulo: "¿Qué tela deja pasar más luz?",
        parrafos: [
          "Las telas claras y lisas (linos crudos, arenas, blancos rotos) dan una luz general y cálida. Las oscuras o de estampado denso concentran la luz hacia arriba y hacia abajo y crean ambiente: perfectas para una lámpara de rincón o de mesilla. Un estampado pequeño, como una raya fina o un vichy, es la forma más fácil de dar carácter sin oscurecer.",
        ],
      },
    ],
  },

  telas: {
    titulo: "Cómo elegir la tela",
    intro:
      "Más de 60 telas en dos colecciones: Básicas, incluidas en el precio, y Premium, con un recargo fijo según la medida de la pieza. Todas son telas de tapicería, pensadas para durar. Estas son las claves para elegir bien.",
    bloques: [
      {
        titulo: "Según la pieza",
        parrafos: [],
        lista: [
          "Cabecero: vale cualquiera. Es la pieza que más se ve y la que menos se toca, así que puedes arriesgar con un estampado.",
          "Banco y puf: se usan a diario. Mejor telas de trama cerrada (sargas, linos de alto gramaje, vichys) y colores medios.",
          "Almohadones: cualquiera, y con funda desenfundable.",
          "Pantallas: las claras dan más luz; las oscuras, más ambiente.",
        ],
      },
      {
        titulo: "Según la luz de la habitación",
        parrafos: [
          "En una habitación orientada al norte o con poca luz, los tonos cálidos (arena, teja, mostaza, verde oliva) la caldean. Con mucha luz natural, los azules, verdes agua y grises quedan frescos sin resultar fríos. Un truco que funciona: mira la tela ampliada en la web y luego imagina el color un punto más apagado, que es como se ve con la luz de casa.",
        ],
      },
      {
        titulo: "Con niños o mascotas",
        parrafos: [
          "Evita los linos muy claros y las telas de trama abierta. Funcionan mejor los tejidos densos y los colores medios o los estampados pequeños, que disimulan el uso. Si tienes gato, huye de las tramas donde las uñas enganchan y elige sargas o tejidos planos.",
        ],
      },
      {
        titulo: "Cómo se limpian",
        parrafos: [
          "Aspirar cada dos o tres semanas con la boquilla suave. Una mancha puntual: paño húmedo con jabón neutro, frotando de fuera hacia dentro. Cabeceros, bancos y pufs no se lavan a máquina porque llevan relleno interior; los almohadones se desenfundan y van a limpieza en seco.",
        ],
      },
      {
        titulo: "¿Puedo traer mi propia tela?",
        parrafos: [
          "Sí, lo hacemos a menudo. El metraje depende de la pieza y del tipo de tela: las de rayas o estampado grande piden algo más para casar los dibujos. Antes de comprarla, escríbenos y te decimos los metros exactos.",
        ],
      },
    ],
  },
};
