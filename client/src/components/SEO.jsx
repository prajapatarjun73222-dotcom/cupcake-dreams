import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/AppContext';

export default function SEO({ title, description, image, path = '' }) {
  const { settings } = useSettings();
  const pageTitle = title
    ? `${title} | Cupcake Dreams Events`
    : settings.seo?.title || 'Cupcake Dreams Events And Party Planner';
  const desc = description || settings.seo?.description || '';
  const ogImage = image || settings.seo?.ogImageUrl || '/images/hero.png';
  const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessName,
    description: desc,
    telephone: settings.phone,
    email: settings.email,
    image: ogImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address?.line1,
      addressLocality: settings.address?.city,
      postalCode: settings.address?.postcode,
      addressCountry: 'GB',
    },
    areaServed: 'Scotland',
    url,
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
