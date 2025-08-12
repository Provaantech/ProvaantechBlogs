/**
 * useReport Hook
 * Hook for error reporting and analytics
 */

import { useCallback } from 'react';

export default function useReport() {
  const reportError = useCallback((error, context = {}) => {
    console.error('Lexical Error:', error, context);
    
    // In a real application, you would send this to your error reporting service
    // e.g., Sentry, LogRocket, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error reporting is disabled in development mode');
    }
  }, []);

  const reportEvent = useCallback((eventName, data = {}) => {
    console.log('Event:', eventName, data);
    
    // In a real application, you would send this to your analytics service
    // e.g., Google Analytics, Mixpanel, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('Event reporting is disabled in development mode');
    }
  }, []);

  return { reportError, reportEvent };
}
