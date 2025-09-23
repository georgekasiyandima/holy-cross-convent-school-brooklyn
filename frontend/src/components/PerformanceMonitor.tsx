import React, { useEffect } from 'react';

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log performance metrics
        console.log(`${entry.name}: ${entry.startTime}ms`);
        
        // Send to analytics if needed
        if (entry.name === 'LCP') {
          // Largest Contentful Paint
          console.log('LCP:', entry.startTime);
        } else if (entry.name === 'FID') {
          // First Input Delay
          console.log('FID:', entry.startTime);
        } else if (entry.name === 'CLS') {
          // Cumulative Layout Shift
          console.log('CLS:', entry.startTime);
        }
      }
    });

    // Observe different performance metrics
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log('Page load time:', loadTime + 'ms');
    });

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor; 