import React from 'react';
import EnhancedGallery from '../components/EnhancedGallery';
import ReturnToHome from '../components/ReturnToHome';
import PageBanner from '../components/PageBanner';

const Gallery: React.FC = () => {
  return (
    <>
      <PageBanner
        title="School Gallery"
        subtitle="Explore our school life through photos - From academic achievements to spiritual celebrations"
        backgroundImage="/HCCREATIVEART.jpg"
      />
      <ReturnToHome />
      <EnhancedGallery
        title=""
        subtitle=""
      />
    </>
  );
};

export default Gallery; 