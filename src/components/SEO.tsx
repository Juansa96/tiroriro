import { Helmet } from "react-helmet-async";

const BASE_URL = "https://tirorirohome.com";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * SEO component — gestiona title, description, canonical y Open Graph por ruta.
 * Usar en cada página justo dentro del fragment raíz, antes del <Navbar />.
 */
const SEO = ({ title, description, canonical, ogImage = DEFAULT_OG_IMAGE, noIndex = false }: SEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {noIndex && <meta name="robots" content="noindex, follow" />}

    {/* Open Graph */}
    <meta property="og:type"        content="website" />
    <meta property="og:title"       content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url"         content={canonical} />
    <meta property="og:image"       content={ogImage} />

    {/* Twitter Card */}
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image"       content={ogImage} />
  </Helmet>
);

export default SEO;
