import React from 'react';
import SchoolCalendar from '../components/SchoolCalendar';
import ReturnToHome from '../components/ReturnToHome';

const Events: React.FC = () => {
  return (
    <>
      <ReturnToHome />
      <SchoolCalendar />
    </>
  );
};

export default Events; 