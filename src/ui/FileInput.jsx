/**
 * FileInput Component
 * File upload input with drag & drop support
 */

import React, { useRef, useState } from 'react';

export default function FileInput({
  label,
  onChange,
  accept = '*/*',
  className = '',
  multiple = false,
  'data-test-id': dataTestId,
  ...props
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      onChange(multiple ? files : files[0]);
    }
  };

  const handleInputChange = (event) => {
    handleFileChange(event.target.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileChange(event.dataTransfer.files);
  };

  return (
    <div className={`FileInput__wrapper ${className}`}>
      {label && <label className="Input__label">{label}</label>}
      <div
        className={`FileInput__dropzone ${isDragging ? 'FileInput__dropzone--dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="FileInput__content">
          <div className="FileInput__icon">📁</div>
          <div className="FileInput__text">
            Click to upload or drag and drop
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="FileInput__hidden"
          data-test-id={dataTestId}
          {...props}
        />
      </div>
    </div>
  );
}
