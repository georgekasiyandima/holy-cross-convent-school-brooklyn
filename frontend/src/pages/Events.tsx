import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * DEPRECATED: Events page redirects to School Hub
 * This page is kept for backward compatibility but redirects to the unified School Hub
 */
const Events: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to School Hub (Calendar & Events tab)
    navigate('/school-hub', { replace: true });
  }, [navigate]);

  return null; // Component doesn't render anything, just redirects
};

export default Events;
