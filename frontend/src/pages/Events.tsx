import React from 'react';
import EnhancedSchoolCalendar from '../components/EnhancedSchoolCalendar';
import ReturnToHome from '../components/ReturnToHome';
import PageBanner from '../components/PageBanner';

const Events: React.FC = () => {
  return (
    <>
      <PageBanner
        title="School Events"
        subtitle="Stay updated with all our upcoming events and activities"
        backgroundImage="/Event.jpg"
      />
      <ReturnToHome />
      <EnhancedSchoolCalendar />
    </>
  );
};

export default Events; 