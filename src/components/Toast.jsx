/**
 * Toast Notification Component
 * Shows temporary feedback messages
 */

import React, { useState, useEffect } from 'react';

export default function Toast({ message, isVisible, onClose, type = 'info' }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto-hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
