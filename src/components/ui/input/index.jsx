import React from 'react';
import './style.css';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = props.id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;
  const hasError = !!error;

  return (
    <div className={`input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input ${hasError ? 'input-error' : ''}`.trim()}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export const Textarea = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) => {
  const textareaId = props.id || `textarea-${label?.toLowerCase().replace(/\s/g, '-')}`;
  const hasError = !!error;

  return (
    <div className={`input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={textareaId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`input input-textarea ${hasError ? 'input-error' : ''}`.trim()}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export const Select = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  options = [],
  required = false,
  disabled = false,
  placeholder,
  className = '',
  ...props
}) => {
  const selectId = props.id || `select-${label?.toLowerCase().replace(/\s/g, '-')}`;
  const hasError = !!error;

  return (
    <div className={`input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        className={`input input-select ${hasError ? 'input-error' : ''}`.trim()}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${selectId}-error` : undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

