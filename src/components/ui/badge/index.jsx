import React from 'react';
import './style.css';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const classNames = `badge badge-${variant} ${className}`.trim();

  return <span className={classNames}>{children}</span>;
};

// Badge específico para estados de pedidos
export const OrderStatusBadge = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'Pendiente de envío':
        return 'warning';
      case 'Enviado':
        return 'info';
      case 'Entregado':
        return 'success';
      case 'Cancelado':
        return 'danger';
      default:
        return 'default';
    }
  };

  return <Badge variant={getVariant()}>{status}</Badge>;
};

