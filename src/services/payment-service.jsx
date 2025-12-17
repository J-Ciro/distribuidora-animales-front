import apiClient from './api-client';

/**
 * Payment Service
 * Handles all payment-related API calls to the backend
 */
export const paymentService = {
  /**
   * Creates a Payment Intent in Stripe
   * @param {number} pedidoId - Order ID
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code (USD, COP)
   * @returns {Promise<{client_secret: string, payment_intent_id: string}>}
   */
  async createPaymentIntent(pedidoId, amount, currency = 'COP') {
    try {
      const response = await apiClient.post('/pagos/create-payment-intent', {
        pedido_id: pedidoId,
        amount,
        currency
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw this._handleError(error, 'No se pudo crear la intención de pago');
    }
  },

  /**
   * Confirms the payment on the backend after Stripe confirmation
   * @param {string} paymentIntentId - Stripe Payment Intent ID
   * @param {number} pedidoId - Order ID
   * @returns {Promise<Object>}
   */
  async confirmPayment(paymentIntentId, pedidoId) {
    try {
      const response = await apiClient.post('/pagos/confirm-payment', {
        payment_intent_id: paymentIntentId,
        pedido_id: pedidoId
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw this._handleError(error, 'No se pudo confirmar el pago');
    }
  },

  /**
   * Gets the current payment status
   * @param {string} paymentIntentId - Stripe Payment Intent ID
   * @returns {Promise<Object>}
   */
  async getPaymentStatus(paymentIntentId) {
    try {
      const response = await apiClient.get(`/pagos/payment-status/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw this._handleError(error, 'No se pudo obtener el estado del pago');
    }
  },

  /**
   * Gets transaction history for an order (admin only)
   * @param {number} pedidoId - Order ID
   * @returns {Promise<Array>}
   */
  async getTransactionHistory(pedidoId) {
    try {
      const response = await apiClient.get(`/pagos/transactions/${pedidoId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw this._handleError(error, 'No se pudo obtener el historial de transacciones');
    }
  },

  /**
   * Handles API errors and returns a user-friendly error object
   * @private
   */
  _handleError(error, defaultMessage) {
    const errorData = {
      message: defaultMessage,
      statusCode: null,
      details: null
    };

    if (error.response) {
      // Server responded with error status
      errorData.statusCode = error.response.status;
      errorData.message = error.response.data?.detail || error.response.data?.message || defaultMessage;
      errorData.details = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      errorData.message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else {
      // Something else happened
      errorData.message = error.message || defaultMessage;
    }

    return errorData;
  }
};

export default paymentService;
