import React, { useState } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { useStripePayment } from '../../../hooks/use-stripe-payment';
import { Button } from '../../ui/button';
import './CheckoutForm.css';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

export const CheckoutForm = ({ pedidoId, amount, currency = 'COP', onSuccess, onCancel }) => {
  const { processPayment, isProcessing, paymentState } = useStripePayment();
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cardComplete) {
      setCardError('Por favor, completa la información de tu tarjeta');
      return;
    }

    const result = await processPayment(pedidoId, amount, currency);
    
    if (result.success && onSuccess) {
      onSuccess(result.paymentIntent);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : null);
  };

  const amountInDollars = (amount / 100).toFixed(2);

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="checkout-form__header">
        <h3>Información de Pago</h3>
        <p className="checkout-form__secure-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Pago seguro con Stripe
        </p>
      </div>

      <div className="checkout-form__card-element">
        <label htmlFor="card-element">Información de Tarjeta</label>
        <div className="card-element-wrapper">
          <CardElement
            id="card-element"
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleCardChange}
          />
        </div>
        {cardError && (
          <div className="checkout-form__field-error">
            {cardError}
          </div>
        )}
      </div>

      {paymentState.error && (
        <div className="checkout-form__error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {paymentState.error}
        </div>
      )}

      <div className="checkout-form__actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!cardComplete || isProcessing}
          className={isProcessing ? 'btn-loading' : ''}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Procesando...
            </>
          ) : (
            `Pagar $${amountInDollars}`
          )}
        </Button>
      </div>

      <div className="checkout-form__footer">
        <p>Al confirmar el pago, aceptas nuestros términos y condiciones.</p>
      </div>
    </form>
  );
};
