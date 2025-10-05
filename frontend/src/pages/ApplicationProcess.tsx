import React from 'react';
import UnderConstruction from '../components/UnderConstruction';
import SEO from '../components/SEO';

const ApplicationProcess: React.FC = () => {
  return (
    <>
      <SEO
        title="Application Process - Holy Cross Convent School"
        description="Learn about our application process and how to enroll your child at Holy Cross Convent School Brooklyn. Discover the steps to join our Catholic educational community."
        keywords="application process, enrollment, admissions, Holy Cross Convent School, Brooklyn, Catholic school"
      />
      <UnderConstruction
        title="Application Process"
        subtitle="Our enrollment process is being streamlined"
        description="We're developing a comprehensive and user-friendly application process that will guide families through each step of enrollment. Our new system will provide clear information about requirements, deadlines, and procedures to make joining our Holy Cross community as smooth as possible."
        estimatedCompletion="Coming Soon - 2025"
      />
    </>
  );
};

export default ApplicationProcess;
