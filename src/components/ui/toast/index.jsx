import React from 'react';
import './style.css';

const Toast = ({ toast, onRemove }) => {
  React.useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

