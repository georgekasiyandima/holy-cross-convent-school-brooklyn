import React from 'react';
import UnderConstruction from '../components/UnderConstruction';
import SEO from '../components/SEO';

const Sport: React.FC = () => {
  return (
    <>
      <SEO
        title="Sports & Athletics - Holy Cross Convent School"
        description="Explore our comprehensive sports program including soccer, netball, tennis, and more. Building character through athletic excellence."
        keywords="sports, athletics, soccer, netball, tennis, physical education, Holy Cross Convent School"
      />
      <UnderConstruction
        title="Sports & Athletics"
        subtitle="Our athletic programs are being expanded"
        description="We're developing comprehensive sports programs including soccer, netball, tennis, mini-tennis, and karate. Our goal is to build character, teamwork, and physical excellence while maintaining our Catholic values."
        estimatedCompletion="Coming Soon - 2025"
      />
    </>
  );
};

export default Sport;
