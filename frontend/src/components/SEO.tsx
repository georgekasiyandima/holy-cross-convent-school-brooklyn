import React, { memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

// TypeScript interfaces for type safety
interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'book';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo?: string;
  address?: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
}

const SEO: React.FC<SEOProps> = ({
  title = 'Holy Cross Convent School Brooklyn - Excellence in Catholic Education',
  description = 'Holy Cross Convent School Brooklyn offers quality Catholic education from Pre-Grade R to Grade 7. Nurturing faith, academic excellence, and character development in a caring environment.',
  keywords = 'Catholic school, Brooklyn, Cape Town, primary education, Grade R, Grade 7, religious education, Holy Cross, convent school, South Africa',
  image = '/Logo(1).svg',
  url = 'https://holycrossbrooklyn.edu.za',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  noFollow = false
}) => {
  // Memoized computed values
  const fullUrl = useMemo(() => url + window.location.pathname, [url]);
  const fullImageUrl = useMemo(() => url + image, [url, image]);
  const fullKeywords = useMemo(() => {
    const baseKeywords = keywords.split(', ');
    const allKeywords = [...baseKeywords, ...tags];
    return allKeywords.join(', ');
  }, [keywords, tags]);

  // Structured data for better SEO
  const structuredData: StructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Holy Cross Convent School Brooklyn',
    description: 'A Catholic primary school offering quality education from Pre-Grade R to Grade 7 in Brooklyn, Cape Town.',
    url: fullUrl,
    logo: fullImageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '162 Koeberg Road',
      addressLocality: 'Brooklyn',
      addressRegion: 'Western Cape',
      postalCode: '7405',
      addressCountry: 'ZA'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+27-21-511-4337',
      contactType: 'customer service',
      email: 'admin@holycrossbrooklyn.co.za'
    }
  }), [fullUrl, fullImageUrl]);

  // Robots meta tag
  const robotsContent = useMemo(() => {
    const directives = [];
    if (noIndex) directives.push('noindex');
    if (noFollow) directives.push('nofollow');
    if (!noIndex && !noFollow) directives.push('index, follow');
    return directives.join(', ');
  }, [noIndex, noFollow]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content={author || 'Holy Cross Convent School Brooklyn'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Holy Cross Convent School Brooklyn" />
      <meta property="og:locale" content="en_ZA" />
      {author && <meta property="og:author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:site" content="@holycrossbrooklyn" />
      <meta property="twitter:creator" content="@holycrossbrooklyn" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1a237e" />
      <meta name="msapplication-TileColor" content="#1a237e" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Holy Cross School" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://connect.facebook.net" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional structured data for breadcrumbs */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': url
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': title.split(' - ')[0],
              'item': fullUrl
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default memo(SEO); 