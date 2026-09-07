// Narrativa de marca (decidida por Juan el 6/9/2026, compactada el 7/9/2026):
// Tiroriro hace piezas para que en casa haya menos INDIFERENCIA y más
// encuentro. Es el hilo de "Por qué Tiroriro" (home), de la introducción de
// "Quiénes somos" y del "speech de fondo" de cada categoría. Vive aquí para
// que la web, el prerender y llms-full.txt cuenten exactamente lo mismo.

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

// "Por qué Tiroriro" (sección de la home). Versión compacta de la narrativa:
// kicker + titular + una frase, tres razones numeradas y la cita de cierre.
export const POR_QUE_TIRORIRO = {
  kicker: "Contra la indiferencia en casa",
  titulo: "Por qué Tiroriro",
  intro: "Hacemos encuentros: los sitios de casa donde una familia se para, se mira y habla.",
  razones: [
    {
      num: "01",
      titulo: "Nació de dos casas por hacer",
      texto:
        "Dos parejas, dos bebés recién nacidos y dos casas nuevas. Rocío, Iñaki, Bea y Juan no querían la casa de revista ni el mueble que viene en tres tallas: querían una casa donde apeteciera quedarse y donde a las diez de la noche todavía se hablara. Como no lo encontraban, aprendieron el oficio con tapiceros de toda la vida y empezaron a hacerlo ellos: a mano, a medida y de una en una, no en serie.",
    },
    {
      num: "02",
      titulo: "Hacemos encuentros",
      texto:
        "El “mañana hablamos” se repite hasta que en casa ya no se habla. Por eso hacemos los sitios donde una familia se encuentra: el cabecero donde os contáis el día, el banco donde entran los hijos, el puf que dice “cabéis todos” y la pantalla de lámpara con la luz cálida bajo la que nadie se levanta.",
    },
    {
      num: "03",
      titulo: "A vuestra medida, y tú solo abres la puerta",
      texto:
        "Tú eliges tela, tamaño y acabado; nosotros lo construimos a mano y en 20 días está en tu casa. Sin buscar tapiceros ni coordinar entregas. Y si dudas, nos llamas: te enseñamos telas, te ayudamos con las medidas y resolvemos cualquier duda antes de encargar nada. Al teléfono siempre contesta uno de los cuatro.",
    },
  ],
  cita: {
    texto: "El futuro de la humanidad se fragua en la familia.",
    autor: "Juan Pablo II",
  },
};

// Introducción de "Quiénes somos" (/nosotros), en primera persona. Debajo van
// las fichas de "Los cuatro" y los datos clave, que viven en la propia página.
export const QUIENES_SOMOS = {
  kicker: "Dos familias",
  titulo: "Quiénes somos",
  intro: [
    "Tiroriro lo fundamos dos parejas: Rocío e Iñaki, Bea y Juan. Dos hermanos, dos amigas de toda la vida y, cuando empezó todo, dos bebés recién nacidos y dos casas por hacer.",
    "Buscábamos una casa donde apeteciera quedarse. Donde se pudiera invitar sin pensar dónde sentar a la gente. Donde a las diez de la noche todavía se hablara. Como no lo encontrábamos, aprendimos el oficio con tapiceros de toda la vida y empezamos a fabricarlo a mano en Boadilla del Monte.",
    "Hacemos encuentros: cabeceros, bancos, pufs, mesas y pantallas donde una familia se para, se mira y habla. Porque, como dijo Juan Pablo II, el futuro de la humanidad se fragua en la familia.",
  ],
};
