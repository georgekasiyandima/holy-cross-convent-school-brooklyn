import React from 'react';
import UnderConstruction from '../components/UnderConstruction';
import SEO from '../components/SEO';

const Cultural: React.FC = () => {
  return (
    <>
      <SEO
        title="Cultural Arts - Holy Cross Convent School"
        description="Discover our vibrant cultural programs including visual arts, music, drama, and liturgical dance. Nurturing creativity and artistic expression."
        keywords="cultural arts, visual arts, music, drama, liturgical dance, creativity, Holy Cross Convent School"
      />
      <UnderConstruction
        title="Cultural Arts"
        subtitle="Our cultural programs are being enriched"
        description="We're developing comprehensive cultural programs including visual arts, music, drama, liturgical dance, and gardening. These programs nurture creativity, self-expression, and appreciation for the arts while celebrating our rich Catholic heritage."
        estimatedCompletion="Coming Soon - 2025"
      />
    </>
  );
};

export default Cultural;
