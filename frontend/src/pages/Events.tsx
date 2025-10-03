import React from 'react';
import EnhancedSchoolCalendar from '../components/EnhancedSchoolCalendar';
import ReturnToHome from '../components/ReturnToHome';

const Events: React.FC = () => {
  return (
    <>
      <ReturnToHome />
      <EnhancedSchoolCalendar />
    </>
  );
};

export default Events; 