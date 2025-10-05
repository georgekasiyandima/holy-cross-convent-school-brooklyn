import React from 'react';
import UnderConstruction from '../components/UnderConstruction';
import SEO from '../components/SEO';

const Policies: React.FC = () => {
  return (
    <>
      <SEO
        title="School Policies - Holy Cross Convent School"
        description="Access our comprehensive school policies including Religious Education, General Policies, Language Policy, Code of Conduct, Attendance, POPIA, Cellphone, and IT & Internet Usage policies."
        keywords="school policies, religious education policy, code of conduct, attendance policy, POPIA, cellphone policy, IT policy, Holy Cross Convent School"
      />
      <UnderConstruction
        title="School Policies"
        subtitle="Our policy documents are being updated and organized"
        description="We're developing a comprehensive policy section that will include all our school policies: Religious Education, General Policies, Language Policy, Code of Conduct, Attendance, POPIA, Cellphone, and IT & Internet Usage policies. These documents will provide clear guidelines for students, parents, and staff."
        estimatedCompletion="Coming Soon - 2025"
      />
    </>
  );
};

export default Policies;
