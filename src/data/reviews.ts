// Reseñas y nota de Google de Tiroriro, en un único sitio para la web y el
// JSON-LD (carrusel de la portada, fichas de categoría y de modelo).
//
// OJO: el JSON-LD estático de index.html (LocalBusiness > makesOffer) repite
// la nota, el nº de reseñas y algunas reseñas a mano, porque index.html no
// puede importar este módulo. Al cambiar algo aquí, cambiarlo también allí
// (hay un test en src/test/reviews-jsonld.test.ts que avisa si se descuadran).

// Perfil de Empresa de Google de Tiroriro (mismo id que el enlace de reseña
// del correo de entrega del CRM, ENTREGA_REVIEW_URL).
export const GOOGLE_BUSINESS_URL = "https://g.page/r/Ces4vVtTbYFGEBM";

// Nota y nº de reseñas del perfil de Google. Se actualizan A MANO: al cambiar
// en Google, cambiarlos aquí (salen en la web y en el JSON-LD).
export const GOOGLE_RATING = "4,9";
export const GOOGLE_REVIEW_COUNT = 47;

export type Review = {
  name: string;
  location: string;
  text: string;
  // Categorías (clave de CATEGORIES en CategoryPage) de las que habla la
  // reseña. Sin valor ⇒ habla del taller en general y vale para cualquiera.
  about?: string[];
};

export const REVIEWS: Review[] = [
  { name: "Íñigo Camino", location: "Cliente verificado", about: ["cabeceros"], text: "Todo un acierto. De diez. El cabecero me llegó en perfecto estado y muy protegido. Es exactamente igual que en las fotos. Se nota el trabajo artesanal y la cercanía de Juan y Bea a la hora de personalizarlo a mi gusto. Volveré a comprar." },
  { name: "Ana Cuadrado", location: "Cliente verificado", text: "Estaba un poco reticente a comprar este tipo de textil online sin tocarlo antes, pero la web es muy intuitiva y las fotos reflejan muy bien la realidad. El pedido llegó a tiempo y la calidad del producto cumple de sobra con lo prometido. Buena relación calidad-precio." },
  { name: "Alex Gutiérrez", location: "Cliente verificado", about: ["cabeceros"], text: "No suelo poner reseñas, pero la experiencia ha sido tan buena que espero que mucha más gente la tenga. Nuestro cabecero nuevo es precioso y se nota la atención al detalle, pero lo que más me ha gustado ha sido el trato, la recomendación fantástica para elegir la tela y la puntualidad del envío. Millones de gracias!" },
  { name: "María Gómez de Olea", location: "Cliente verificado", text: "Increíble el trato de Tiroriro, súper recomendables! Beatriz es encantadora, me atendió fenomenal y el pedido llegó en tiempo y forma. Aparte, me he hecho un estudio de mercado de precios y estos son los que mejor salen con diferencia." },
  { name: "Vari Álvarez", location: "Cliente verificado", about: ["cabeceros"], text: "Tenía bastantes dudas sobre el tono exacto de la tela para el cabecero y les escribí por atención al cliente. Me atendieron de maravilla, me asesoraron súper bien con los colores y el resultado en casa ha sido espectacular. La tela tiene un tacto increíble, se nota que es de buena calidad." },
  { name: "Isabel Plettenberg", location: "Cliente verificado", about: ["cabeceros"], text: "Hemos encargado un cabecero con forma conta de medidas 1,80x1,20. Estamos felices con el resultado. Todo el proceso ha sido muy fácil y rápido. En dos semanas lo teníamos en casa. Muy recomendable!" },
  { name: "David Franco", location: "Cliente verificado", about: ["cabeceros"], text: "Buscábamos un cabecero que saliera un poco de lo típico que ves en todas las grandes superficies y dimos con esta web. El diseño es moderno pero atemporal, y la calidad del tejido es brutal. Un descubrimiento de marca, la verdad." },
  { name: "María Espa", location: "Cliente verificado", about: ["cabeceros"], text: "Da gusto abrir un paquete cuando viene todo tan bien presentado y protegido. Desde el minuto uno te das cuenta de que es una marca con identidad. El cabecero que compramos queda de revista, todo el mundo que entra a la habitación nos pregunta de dónde es." },
  { name: "Manuel Álvarez", location: "Cliente verificado", about: ["cabeceros"], text: "Descubrí Tiroriro buscando un cabecero a medida y la experiencia ha sido muy buena. Lo que más me gustó fue la posibilidad de personalizar prácticamente todo: medidas, forma y tejido, algo que no es tan fácil de encontrar." },
  { name: "SyM", location: "Cliente verificado", about: ["cabeceros"], text: "Hubo una pequeña confusión con la dirección de entrega por parte de la agencia de transportes, pero el equipo de Tiroriro lo solucionó el mismo día de forma súper amable. El cabecero ya está puesto y no puedo estar más contenta. Da gusto comprar en marcas que cuidan así al cliente." },
];

// Nota agregada para JSON-LD (Organization, Product…).
export const aggregateRatingJsonLd = () => ({
  "@type": "AggregateRating",
  ratingValue: GOOGLE_RATING.replace(",", "."),
  bestRating: "5",
  worstRating: "1",
  reviewCount: String(GOOGLE_REVIEW_COUNT),
});

export const reviewJsonLd = (r: Review) => ({
  "@type": "Review",
  author: { "@type": "Person", name: r.name },
  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5", worstRating: "1" },
  reviewBody: r.text,
});

// Reseñas para el JSON-LD de un Product: las que hablan de esa categoría y,
// si no hay, las generales del taller. Como mucho `max`.
export const reviewsForCategory = (category: string, max = 3): Review[] => {
  const own = REVIEWS.filter((r) => r.about?.includes(category));
  const general = REVIEWS.filter((r) => !r.about);
  return (own.length ? [...own, ...general] : general).slice(0, max);
};

// Campos `aggregateRating` y `review` para añadir a un Product de JSON-LD
// (Search Console los pide como "opcionales" en los fragmentos de producto).
export const productRatingJsonLd = (category: string) => ({
  aggregateRating: aggregateRatingJsonLd(),
  review: reviewsForCategory(category).map(reviewJsonLd),
});
