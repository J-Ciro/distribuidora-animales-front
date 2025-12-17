import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { paymentService } from '../services/payment-service';
import { toast } from '../utils/toast';

/**
 * Custom hook for handling Stripe payment processing
 * Manages payment state and coordinates with Stripe.js and backend
 */
export const useStripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [paymentState, setPaymentState] = useState({
    status: 'idle', // idle | processing | succeeded | failed
    error: null,
    paymentIntentId: null
  });

  /**
   * Processes a payment using Stripe
   * @param {number} pedidoId - Order ID
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code (default: COP)
   * @returns {Promise<{success: boolean, paymentIntent?: object, error?: string}>}
   */
  const processPayment = async (pedidoId, amount, currency = 'COP') => {
    // Validate Stripe is loaded
    if (!stripe || !elements) {
      const errorMsg = 'El sistema de pagos no está listo. Por favor, espera un momento e intenta de nuevo.';
      toast.show(errorMsg, 'error');
      setPaymentState({
        status: 'failed',
        error: errorMsg,
        paymentIntentId: null
      });
      return { success: false, error: errorMsg };
    }

    setPaymentState({ status: 'processing', error: null, paymentIntentId: null });

    try {
      // Step 1: Create Payment Intent on backend
      console.log('Creating payment intent for order:', pedidoId);
      const { client_secret, payment_intent_id } = await paymentService.createPaymentIntent(
        pedidoId,
        amount,
        currency
      );

      if (!client_secret) {
        throw new Error('No se recibió el client_secret del servidor');
      }

      // Step 2: Confirm payment with Stripe.js
      console.log('Confirming payment with Stripe...');
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('No se encontró el elemento de tarjeta');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        const errorMessage = getStripeErrorMessage(stripeError);
        setPaymentState({
          status: 'failed',
          error: errorMessage,
          paymentIntentId: payment_intent_id
        });
        toast.show(errorMessage, 'error', 5000);
        return { success: false, error: errorMessage };
      }

      // Step 3: Confirm payment on backend
      console.log('Payment confirmed with Stripe, notifying backend...');
      await paymentService.confirmPayment(paymentIntent.id, pedidoId);

      setPaymentState({
        status: 'succeeded',
        error: null,
        paymentIntentId: paymentIntent.id
      });
      
      toast.show('¡Pago procesado exitosamente!', 'success', 4000);
      return { success: true, paymentIntent };

    } catch (error) {
      console.error('Payment processing error:', error);
      const errorMessage = error.message || error.detail || 'Error procesando el pago. Por favor, intenta nuevamente.';
      
      setPaymentState({
        status: 'failed',
        error: errorMessage,
        paymentIntentId: null
      });
      
      toast.show(errorMessage, 'error', 5000);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Resets the payment state to initial values
   */
  const resetPaymentState = () => {
    setPaymentState({ status: 'idle', error: null, paymentIntentId: null });
  };

  return {
    paymentState,
    processPayment,
    resetPaymentState,
    isProcessing: paymentState.status === 'processing',
    isSucceeded: paymentState.status === 'succeeded',
    isFailed: paymentState.status === 'failed',
    isIdle: paymentState.status === 'idle'
  };
};

/**
 * Converts Stripe error codes to user-friendly Spanish messages
 * @param {object} error - Stripe error object
 * @returns {string} User-friendly error message
 */
function getStripeErrorMessage(error) {
  const errorMessages = {
    card_declined: 'Tu tarjeta fue rechazada. Por favor, intenta con otra tarjeta.',
    expired_card: 'Tu tarjeta ha expirado. Por favor, verifica la fecha de vencimiento.',
    incorrect_cvc: 'El código de seguridad (CVC) es incorrecto.',
    processing_error: 'Ocurrió un error procesando tu tarjeta. Por favor, intenta nuevamente.',
    incorrect_number: 'El número de tarjeta es incorrecto.',
    invalid_number: 'El número de tarjeta no es válido.',
    incomplete_number: 'El número de tarjeta está incompleto.',
    incomplete_cvc: 'El código de seguridad está incompleto.',
    incomplete_expiry: 'La fecha de vencimiento está incompleta.',
    insufficient_funds: 'Fondos insuficientes en tu tarjeta.',
    invalid_expiry_month: 'El mes de vencimiento no es válido.',
    invalid_expiry_year: 'El año de vencimiento no es válido.',
    rate_limit: 'Demasiados intentos. Por favor, espera un momento e intenta de nuevo.',
  };

  const code = error.code || error.decline_code;
  return errorMessages[code] || error.message || 'Error procesando el pago. Por favor, intenta nuevamente.';
}
