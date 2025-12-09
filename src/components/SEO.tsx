import { Helmet } from 'react-helmet-async';
import { getGlobalKeywords } from '@/config/seo-keywords';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  structuredData?: object;
}

export const SEO = ({
  title = 'Bangle Storage Boxes & Organizers | Sister Storage – Culture Without Clutter',
  description = 'Shop premium bangle storage boxes that protect your jewelry. Dust-free, stackable organizers designed for South Asian jewelry. Ships to Canada & USA.',
  keywords = getGlobalKeywords(),
  image = 'https://storage.googleapis.com/gpt-engineer-file-uploads/8uQERUCGS1TCaXnOFIRH4upfJG73/social-images/social-1760066089943-sister storage logo.jpg',
  url = 'https://sisterstorage.ca',
  type = 'website',
  noindex = false,
  structuredData
}: SEOProps) => {
  const siteUrl = 'https://sisterstorage.ca';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;

  // Base structured data for the organization
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sister Storage',
    description: 'Premium bangle storage boxes and jewelry organizers designed for South Asian jewelry',
    url: siteUrl,
    logo: image,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'sisterstorageinc@gmail.com',
      contactType: 'Customer Service',
      areaServed: ['CA', 'US']
    },
    sameAs: [
      'https://www.instagram.com/sisterstorageinc'
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Sister Storage" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="author" content="Sister Storage" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Toronto" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
