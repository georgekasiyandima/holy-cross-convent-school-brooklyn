import React from 'react';
import UnderConstruction from '../components/UnderConstruction';
import SEO from '../components/SEO';

const Academic: React.FC = () => {
  return (
    <>
      <SEO
        title="Academic Excellence - Holy Cross Convent School"
        description="Discover our comprehensive academic program designed to foster excellence in learning and prepare students for future success."
        keywords="academic excellence, education, learning, curriculum, Holy Cross Convent School"
      />
      <UnderConstruction
        title="Academic Excellence"
        subtitle="Our comprehensive academic program is being enhanced"
        description="We're developing a world-class academic curriculum that combines traditional Catholic values with innovative teaching methods to prepare our students for success in the modern world."
        estimatedCompletion="Coming Soon - 2025"
      />
    </>
  );
};

export default Academic;
