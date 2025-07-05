import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Holy Cross Convent School Brooklyn - Excellence in Catholic Education',
  description = 'Holy Cross Convent School Brooklyn offers quality Catholic education from Pre-Grade R to Grade 7. Nurturing faith, academic excellence, and character development in a caring environment.',
  keywords = 'Catholic school, Brooklyn, Cape Town, primary education, Grade R, Grade 7, religious education, Holy Cross, convent school, South Africa',
  image = '/HCLOGO1.png',
  url = 'https://holycrossbrooklyn.edu.za',
  type = 'website'
}) => {
  const fullUrl = url + window.location.pathname;
  const fullImageUrl = url + image;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
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
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEO; 