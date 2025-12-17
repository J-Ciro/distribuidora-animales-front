import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../config/stripe';
import { CheckoutForm, PaymentSummary, StripeErrorBoundary } from '../../components/checkout';
import { pedidosService } from '../../services/pedidos-service';
import { toast } from '../../utils/toast';
import './CheckoutPage.css';

export const CheckoutPage = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPedido = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await pedidosService.getById(pedidoId);
        
        // Validate order can be paid
        if (!data) {
          setError('Pedido no encontrado');
          toast.show('Pedido no encontrado', 'error');
          setTimeout(() => navigate('/mis-pedidos'), 2000);
          return;
        }

        if (data.estado_pago === 'Pagado' || data.estado_pago === 'paid') {
          toast.show('Este pedido ya fue pagado', 'warning');
          setTimeout(() => navigate(`/mis-pedidos/${pedidoId}`), 2000);
          return;
        }
        
        setPedido(data);
      } catch (error) {
        console.error('Error loading order:', error);
        setError('Error cargando información del pedido');
        toast.show('Error cargando información del pedido', 'error');
        setTimeout(() => navigate('/mis-pedidos'), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId) {
      loadPedido();
    }
  }, [pedidoId, navigate]);

  const handlePaymentSuccess = (paymentIntent) => {
    navigate(`/payment-success/${pedidoId}`, {
      state: { paymentIntentId: paymentIntent.id }
    });
  };

  const handleCancel = () => {
    navigate('/mis-pedidos');
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__loading">
            <div className="spinner-large"></div>
            <p>Cargando información del pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h2>{error || 'Error'}</h2>
            <p>Serás redirigido automáticamente...</p>
          </div>
        </div>
      </div>
    );
  }

  const amountInCents = Math.round(pedido.total * 100);

  return (
    <div className="checkout-page">
      <div className="checkout-page__container">
        <div className="checkout-page__header">
          <h1>Completar Pago</h1>
          <p>Ingresa los datos de tu tarjeta para finalizar la compra</p>
        </div>
        
        <div className="checkout-page__content">
          <div className="checkout-page__summary">
            <PaymentSummary pedido={pedido} />
          </div>

          <div className="checkout-page__form">
            <StripeErrorBoundary>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  pedidoId={parseInt(pedidoId)}
                  amount={amountInCents}
                  currency="COP"
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleCancel}
                />
              </Elements>
            </StripeErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};
