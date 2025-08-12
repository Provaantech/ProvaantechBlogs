/**
 * Flash Message Context
 * Manages toast notifications and flash messages
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const FlashMessageContext = createContext({});

export function FlashMessageProvider({ children }) {
  const [flashMessage, setFlashMessage] = useState(null);

  const showFlashMessage = useCallback((message, type = 'info') => {
    setFlashMessage({ message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  }, []);

  const hideFlashMessage = useCallback(() => {
    setFlashMessage(null);
  }, []);

  return (
    <FlashMessageContext.Provider
      value={{
        flashMessage,
        showFlashMessage,
        hideFlashMessage,
      }}
    >
      {children}
    </FlashMessageContext.Provider>
  );
}

export function useFlashMessage() {
  const context = useContext(FlashMessageContext);
  if (!context) {
    throw new Error('useFlashMessage must be used within FlashMessageProvider');
  }
  return context;
}
