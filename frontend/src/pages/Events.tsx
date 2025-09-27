import React from 'react';
import SchoolCalendar from '../components/SchoolCalendar';
import ReturnToHome from '../components/ReturnToHome';

const Events: React.FC = () => {
  return (
    <>
      <ReturnToHome />
      <SchoolCalendar
        title="School Events & Calendar"
        subtitle="Stay updated with all important dates and events for Term 3 2025"
      />
    </>
  );
};

export default Events; 