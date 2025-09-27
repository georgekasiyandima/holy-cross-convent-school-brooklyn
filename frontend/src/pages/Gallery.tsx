import React from 'react';
import EnhancedGallery from '../components/EnhancedGallery';
import ReturnToHome from '../components/ReturnToHome';

const Gallery: React.FC = () => {
  return (
    <>
      <ReturnToHome />
      <EnhancedGallery
        title="School Gallery"
        subtitle="Explore our school life through photos - From academic achievements to spiritual celebrations"
      />
    </>
  );
};

export default Gallery; 