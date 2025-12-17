import React from 'react';
import './PaymentSummary.css';

export const PaymentSummary = ({ pedido }) => {
  if (!pedido) {
    return null;
  }

  const subtotal = pedido.total || 0;
  const shipping = 0; // Add shipping calculation if needed
  const total = subtotal + shipping;

  return (
    <div className="payment-summary">
      <h3 className="payment-summary__title">Resumen del Pedido</h3>

      <div className="payment-summary__order-info">
        <div className="payment-summary__row">
          <span className="payment-summary__label">Pedido:</span>
          <span className="payment-summary__value">#{pedido.id}</span>
        </div>
        <div className="payment-summary__row">
          <span className="payment-summary__label">Fecha:</span>
          <span className="payment-summary__value">
            {new Date(pedido.fecha_creacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {pedido.items && pedido.items.length > 0 && (
        <div className="payment-summary__items">
          <h4>Productos</h4>
          <div className="payment-summary__items-list">
            {pedido.items.map((item, index) => (
              <div key={index} className="payment-summary__item">
                <div className="payment-summary__item-info">
                  <span className="payment-summary__item-name">
                    {item.nombre_producto || item.producto_nombre}
                  </span>
                  <span className="payment-summary__item-quantity">
                    x{item.cantidad}
                  </span>
                </div>
                <span className="payment-summary__item-price">
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="payment-summary__totals">
        <div className="payment-summary__row">
          <span className="payment-summary__label">Subtotal:</span>
          <span className="payment-summary__value">${subtotal.toFixed(2)}</span>
        </div>
        {shipping > 0 && (
          <div className="payment-summary__row">
            <span className="payment-summary__label">Envío:</span>
            <span className="payment-summary__value">${shipping.toFixed(2)}</span>
          </div>
        )}
        <div className="payment-summary__row payment-summary__total">
          <span className="payment-summary__label">Total:</span>
          <span className="payment-summary__value">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-summary__note">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <p>Una vez completado el pago, recibirás una confirmación por correo electrónico.</p>
      </div>
    </div>
  );
};
