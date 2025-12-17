import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import './PaymentFailedPage.css';

export const PaymentFailedPage = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate(`/checkout/${pedidoId}`);
  };

  const handleGoToOrders = () => {
    navigate('/mis-pedidos');
  };

  return (
    <div className="payment-failed">
      <div className="payment-failed__container">
        <div className="payment-failed__content">
          <div className="payment-failed__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>

          <h1>Pago No Procesado</h1>
          <p className="payment-failed__message">
            No pudimos procesar tu pago. Por favor, verifica los datos de tu tarjeta e intenta nuevamente.
          </p>

          <div className="payment-failed__reasons">
            <h3>Posibles causas:</h3>
            <ul>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Fondos insuficientes en la tarjeta
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Datos de la tarjeta incorrectos
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Tarjeta vencida o bloqueada
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Límite de compras excedido
              </li>
            </ul>
          </div>

          <div className="payment-failed__actions">
            <Button onClick={handleRetry}>
              Intentar Nuevamente
            </Button>
            <Button variant="outline" onClick={handleGoToOrders}>
              Volver a Mis Pedidos
            </Button>
          </div>

          <div className="payment-failed__help">
            <p>
              Si el problema persiste, contacta a tu banco o{' '}
              <a href="/contact">contáctanos</a> para recibir ayuda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
