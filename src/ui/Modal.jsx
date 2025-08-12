/**
 * Modal Component
 * Reusable modal for dialogs, popups, and overlays
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
  children,
  closeOnClickOutside = true,
  closeOnEscape = true,
  onClose,
  title,
  className = '',
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [closeOnEscape, onClose]);

  const handleBackdropClick = (event) => {
    if (closeOnClickOutside && event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="Modal__backdrop" onClick={handleBackdropClick}>
      <div className={`Modal__content ${className}`} ref={modalRef}>
        {title && (
          <div className="Modal__header">
            <h3 className="Modal__title">{title}</h3>
            <button
              className="Modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="Modal__body">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
