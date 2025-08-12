/**
 * DropDown Component
 * Customizable dropdown menu with keyboard navigation
 */

import React, { useEffect, useRef, useState } from 'react';

export function DropDownItem({
  children,
  className = '',
  onClick,
  title,
}) {
  return (
    <button
      className={`DropDown__item ${className}`}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

export default function DropDown({
  disabled = false,
  buttonLabel,
  buttonAriaLabel,
  buttonClassName,
  buttonIconClassName,
  children,
  stopCloseOnClickSelf,
}) {
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleClose = () => {
    setShowDropDown(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;

    if (showDropDown && button !== null && dropDown !== null) {
      const { top, left } = button.getBoundingClientRect();
      dropDown.style.top = `${top + button.offsetHeight + 10}px`;
      dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
    }
  }, [dropDownRef, buttonRef, showDropDown]);

  useEffect(() => {
    const button = buttonRef.current;

    if (button !== null && showDropDown) {
      const handle = (event) => {
        const { target } = event;
        if (stopCloseOnClickSelf) {
          if (dropDownRef.current && dropDownRef.current.contains(target)) {
            return;
          }
        }
        if (!button.contains(target)) {
          setShowDropDown(false);
        }
      };
      document.addEventListener('click', handle);

      return () => {
        document.removeEventListener('click', handle);
      };
    }
  }, [dropDownRef, buttonRef, showDropDown, stopCloseOnClickSelf]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropDown(false);
        buttonRef.current?.focus();
      }
    };

    if (showDropDown) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showDropDown]);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        aria-label={buttonAriaLabel || buttonLabel}
        className={buttonClassName}
        onClick={() => setShowDropDown(!showDropDown)}
        ref={buttonRef}
      >
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {buttonLabel && (
          <span className="text dropdown-button-text">{buttonLabel}</span>
        )}
        <i className={`chevron-down ${showDropDown ? 'expanded' : ''}`} />
      </button>

      {showDropDown && (
        <div className="DropDown" ref={dropDownRef}>
          {children}
        </div>
      )}
    </>
  );
}
