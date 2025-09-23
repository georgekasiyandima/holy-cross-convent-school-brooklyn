import React, { useEffect } from 'react';

// Google Analytics configuration
const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with actual GA tracking ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const Analytics: React.FC = () => {
  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Track page views on route changes
    const handleRouteChange = () => {
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);

    // Track custom events
    const trackEvent = (action: string, category: string, label?: string) => {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    };

    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const buttonText = target.textContent || target.closest('button')?.textContent || 'Unknown';
        trackEvent('button_click', 'engagement', buttonText);
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      trackEvent('form_submit', 'engagement', form.id || 'unknown_form');
    });

    // Track video plays
    document.addEventListener('play', (e) => {
      const video = e.target as HTMLVideoElement;
      trackEvent('video_play', 'media', video.src || 'unknown_video');
    });

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default Analytics; 