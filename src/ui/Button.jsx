/**
 * Button Component
 * Essential UI component used throughout the playground
 */

import React from 'react';

export default function Button({
  children,
  className = '',
  disabled = false,
  onClick,
  title,
  'aria-label': ariaLabel,
  'data-test-id': dataTestId,
  small = false,
  variant = 'primary', // primary, secondary, danger
  ...props
}) {
  const baseClass = 'Button';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    small ? `${baseClass}--small` : '',
    disabled ? `${baseClass}--disabled` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      data-test-id={dataTestId}
      {...props}
    >
      {children}
    </button>
  );
}
