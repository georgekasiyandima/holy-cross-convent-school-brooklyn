import React from 'react';
import UnderConstruction from '../components/UnderConstruction';
import SEO from '../components/SEO';

const Vacancies: React.FC = () => {
  return (
    <>
      <SEO
        title="Career Opportunities - Holy Cross Convent School"
        description="Join our dedicated team of educators and support staff. Explore current job openings and career opportunities at Holy Cross Convent School Brooklyn."
        keywords="careers, job opportunities, teaching positions, employment, Holy Cross Convent School, Brooklyn"
      />
      <UnderConstruction
        title="Career Opportunities"
        subtitle="Our job listings are being updated"
        description="We're updating our career opportunities page to showcase current openings for qualified educators and support staff who share our commitment to Catholic education and student excellence. Join our mission to nurture young minds and hearts."
        estimatedCompletion="Coming Soon - 2025"
      />
    </>
  );
};

export default Vacancies;
