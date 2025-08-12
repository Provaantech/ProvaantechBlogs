/**
 * TextInput Component
 * Styled text input with label and validation
 */

import React from 'react';

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  className = '',
  error = '',
  required = false,
  disabled = false,
  'data-test-id': dataTestId,
  ...props
}) {
  return (
    <div className={`Input__wrapper ${className}`}>
      {label && (
        <label className="Input__label">
          {label}
          {required && <span className="Input__required">*</span>}
        </label>
      )}
      <input
        type="text"
        className={`Input__input ${error ? 'Input__input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        data-test-id={dataTestId}
        {...props}
      />
      {error && <div className="Input__error">{error}</div>}
    </div>
  );
}
