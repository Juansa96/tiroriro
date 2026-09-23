// Enlaces de WhatsApp de la web.
//
// Cada botón abre el chat con un texto distinto: así, en los WhatsApp que entran
// en el CRM se sabe desde qué botón escribió cada cliente (el informe diario de
// marketing los cuenta por ese texto). Si cambias un texto, avisa: el informe
// busca el comienzo de cada mensaje.

export const WHATSAPP_NUMBER = "34660786453";

export const whatsappHref = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** Comienzo fijo del mensaje con el diseño del configurador (lo usa el informe). */
export const CONFIGURADOR_DISENO_PREFIX = "Hola, he diseñado en el configurador:";

export const configuradorDisenoText = (summary: string, precio?: string) =>
  `${CONFIGURADOR_DISENO_PREFIX} ${summary}${precio ? ` (precio orientativo ${precio})` : ""}. ¿Me dais precio final y plazo?`;

// El configurador publica aquí el diseño en curso para que el botón flotante de
// WhatsApp lo mande en lugar del saludo genérico.
let disenoActual: string | null = null;
export const setConfiguradorDiseno = (text: string | null) => {
  disenoActual = text;
};
export const getConfiguradorDiseno = () => disenoActual;
