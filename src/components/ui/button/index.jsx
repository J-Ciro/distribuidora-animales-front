import React from 'react';
import './style.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  round = false,
  icon = null,
  ...props
}) => {
  const classNames = `btn btn-${variant} btn-${size} ${round ? 'btn-round' : ''} ${className}`.trim();

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

