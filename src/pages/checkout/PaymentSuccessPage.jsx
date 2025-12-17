import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { pedidosService } from '../../services/pedidos-service';
import { Button } from '../../components/ui/button';
import './PaymentSuccessPage.css';

export const PaymentSuccessPage = () => {
  const { pedidoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const paymentIntentId = location.state?.paymentIntentId;

  useEffect(() => {
    const loadPedido = async () => {
      try {
        const data = await pedidosService.getById(pedidoId);
        setPedido(data);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId) {
      loadPedido();
    }
  }, [pedidoId]);

  if (loading) {
    return (
      <div className="payment-success">
        <div className="payment-success__container">
          <div className="payment-success__loading">
            <div className="spinner-large"></div>
            <p>Cargando información del pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success">
      <div className="payment-success__container">
        <div className="payment-success__content">
          <div className="payment-success__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1>¡Pago Exitoso!</h1>
          <p className="payment-success__message">
            Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación pronto.
          </p>

          {pedido && (
            <div className="payment-success__details">
              <div className="payment-success__detail-card">
                <div className="payment-success__detail">
                  <span className="payment-success__detail-label">Número de Pedido:</span>
                  <strong className="payment-success__detail-value">#{pedido.id}</strong>
                </div>
                <div className="payment-success__detail">
                  <span className="payment-success__detail-label">Total Pagado:</span>
                  <strong className="payment-success__detail-value">${pedido.total.toFixed(2)}</strong>
                </div>
                <div className="payment-success__detail">
                  <span className="payment-success__detail-label">Estado:</span>
                  <strong className="payment-success__detail-value payment-success__status">
                    {pedido.estado_pago || 'Pagado'}
                  </strong>
                </div>
                {paymentIntentId && (
                  <div className="payment-success__detail">
                    <span className="payment-success__detail-label">ID de Transacción:</span>
                    <strong className="payment-success__detail-value payment-success__transaction">
                      {paymentIntentId}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="payment-success__actions">
            <Button onClick={() => navigate(`/mis-pedidos/${pedidoId}`)}>
              Ver Detalles del Pedido
            </Button>
            <Button variant="outline" onClick={() => navigate('/home')}>
              Continuar Comprando
            </Button>
          </div>

          <div className="payment-success__info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p>
              Recibirás un correo electrónico con los detalles de tu pedido y el comprobante de pago.
              Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
