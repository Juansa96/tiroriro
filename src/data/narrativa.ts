// Narrativa de marca (decidida por Juan el 6/9/2026): Tiroriro hace piezas
// para que en casa haya menos INDIFERENCIA y más encuentro. Es el hilo de
// "Quiénes somos" y el "speech de fondo" de cada categoría. Vive aquí para que
// la web, el prerender y llms-full.txt cuenten exactamente lo mismo.

export interface Speech {
  /** Contra qué se posiciona la pieza ("Contra el 'mañana hablamos'"). */
  contra: string;
  /** El párrafo de fondo, dos o tres frases. */
  texto: string;
}

export const CATEGORY_SPEECH: Record<string, Speech> = {
  cabeceros: {
    contra: "Contra el “mañana hablamos”",
    texto:
      "El último momento del día es el más importante: cuando dos personas se apoyan y se cuentan lo que ha pasado. Sin cabecero, o con uno duro, te apoyas en la pared, te escurres y te duermes sin haber hablado. Un cabecero mullido y a vuestra medida es el sitio donde se habla hoy, y a gusto.",
  },
  bancos: {
    contra: "Contra la puerta cerrada",
    texto:
      "Los hijos entran en el dormitorio de sus padres si hay dónde sentarse. Un banco a los pies de la cama es el sitio donde se cuenta lo del colegio, donde se sube el pequeño en pijama, donde la conversación empieza sin que nadie la convoque.",
  },
  pufs: {
    contra: "Contra la silla del trastero",
    texto:
      "El salón se llena y alguien va a por sillas plegables. Esa silla dice “no cabías”. Un puf dice “cabéis todos”: se arrastra hasta donde está la conversación, los niños se sientan en él en el suelo y nadie se queda fuera.",
  },
  "pantallas-lampara": {
    contra: "Contra la luz del techo",
    texto:
      "Bajo una bombilla desnuda nadie se queda a hablar. Una luz cálida, filtrada por una tela bonita, es la que hace que la gente se siente y no se levante. Es la diferencia entre una habitación y un sitio.",
  },
  "mesas-centro": {
    contra: "Contra el salón sin centro",
    texto:
      "Alrededor de una mesa ocurren los encuentros: el café de la mañana, el juego del domingo, la conversación que se alarga cuando ya no queda nada en las tazas. Una mesa de centro tapizada es una mesa a la que se acerca todo el mundo: se apoyan los pies, se sientan los niños en el suelo, nadie tiene miedo de usarla. Es el sitio donde el salón se junta.",
  },
  cojines: {
    contra: "Contra el sofá de uno",
    texto:
      "Un almohadón más es un sitio más: en el suelo, en el banco, en la cama de los niños para el cuento. Donde hay un almohadón, alguien se queda un rato más.",
  },
};

// Texto de "Quiénes somos" (/nosotros). Párrafos en orden; los títulos de
// sección van aparte para poder maquetarlos.
export const QUIENES_SOMOS = {
  titulo: "Quiénes somos",
  origen: [
    "Tiroriro lo fundaron dos parejas: Rocío e Iñaki, Bea y Juan. Dos hermanos, dos amigas de toda la vida y, cuando empezó todo, dos bebés recién nacidos y dos casas por hacer.",
    "Rocío y Bea buscaban lo mismo y no lo encontraban. No querían la casa de revista ni el mueble que viene en tres tallas. Querían una casa donde apeteciera quedarse. Donde se pudiera invitar sin pensar dónde sentar a la gente. Donde a las diez de la noche todavía se hablara.",
    "Así que aprendieron el oficio con tapiceros de toda la vida y empezaron a fabricar a mano, en Boadilla del Monte, lo que les faltaba: cabeceros, bancos, pufs, pantallas de lámpara. Piezas luminosas, alegres y cómodas, hechas para durar lo que dura una familia.",
  ],
  combatimosTitulo: "Lo que combatimos",
  combatimos: [
    "La indiferencia en casa. No llega de golpe: llega cansada. Es el día complicado que hace que no preguntes cómo ha ido el suyo. Es el agotamiento que convierte una pregunta de tu hijo en un “ahora no”. Es el “mañana hablamos” que se repite hasta que ya no queda nada que decir.",
    "Nosotros no arreglamos eso. Pero hacemos los sitios donde se arregla. Hacemos encuentros: el cabecero, el banco, el puf y la luz donde dos personas se paran, se miran y se encuentran.",
    "Un cabecero para el momento más importante del día, cuando dos personas se apoyan y se cuentan lo que ha pasado, en vez de dormirse contra una pared fría. Un banco a los pies de la cama para que los hijos entren y cuenten lo del colegio. Pufs para que, cuando el salón se llena, nadie tenga que ir a por sillas al trastero: cabéis todos. Y pantallas de lámpara para hablar alrededor de una luz cálida, filtrada por una tela bonita, y no bajo una bombilla fría.",
    "Piezas para el encuentro. Para que unos se compadezcan de otros y en casa se hable. Porque, como dijo Juan Pablo II, el futuro de la humanidad se fragua en la familia.",
  ],
  equipoTitulo: "Quién hace qué",
  equipo:
    "Hoy cada pedido lo atiende Bea o Rocío por teléfono. Iñaki se ocupa de que llegue a tu casa en el día y sin un arañazo. Juan hace que todo lo demás funcione. No tenemos tienda: tenemos un taller, una web y un teléfono al que siempre contesta uno de los cuatro.",
};
