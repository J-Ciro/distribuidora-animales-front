import { paymentService } from '../services/payment-service';
import apiClient from '../services/api-client';

// Mock the api-client
jest.mock('../services/api-client');

describe('Payment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent successfully', async () => {
      const mockResponse = {
        data: {
          client_secret: 'pi_test_secret_123',
          payment_intent_id: 'pi_123456789'
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await paymentService.createPaymentIntent(1, 10000, 'USD');

      expect(apiClient.post).toHaveBeenCalledWith('/pagos/create-payment-intent', {
        pedido_id: 1,
        amount: 10000,
        currency: 'USD'
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when creating payment intent', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            detail: 'Invalid order ID'
          }
        }
      };

      apiClient.post.mockRejectedValue(mockError);

      await expect(paymentService.createPaymentIntent(999, 10000, 'USD'))
        .rejects
        .toMatchObject({
          message: 'Invalid order ID'
        });
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Payment confirmed'
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await paymentService.confirmPayment('pi_123456789', 1);

      expect(apiClient.post).toHaveBeenCalledWith('/pagos/confirm-payment', {
        payment_intent_id: 'pi_123456789',
        pedido_id: 1
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when confirming payment', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            detail: 'Server error'
          }
        }
      };

      apiClient.post.mockRejectedValue(mockError);

      await expect(paymentService.confirmPayment('pi_123456789', 1))
        .rejects
        .toMatchObject({
          message: 'Server error'
        });
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status successfully', async () => {
      const mockResponse = {
        data: {
          status: 'succeeded',
          amount: 10000
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await paymentService.getPaymentStatus('pi_123456789');

      expect(apiClient.get).toHaveBeenCalledWith('/pagos/payment-status/pi_123456789');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('_handleError', () => {
    it('should format error with response data', () => {
      const error = {
        response: {
          status: 400,
          data: {
            detail: 'Invalid request'
          }
        }
      };

      const result = paymentService._handleError(error, 'Default message');

      expect(result).toMatchObject({
        message: 'Invalid request',
        statusCode: 400
      });
    });

    it('should use default message when no response', () => {
      const error = {
        request: {}
      };

      const result = paymentService._handleError(error, 'Default message');

      expect(result.message).toContain('conectar con el servidor');
    });

    it('should handle generic errors', () => {
      const error = new Error('Network error');

      const result = paymentService._handleError(error, 'Default message');

      expect(result.message).toBe('Network error');
    });
  });
});
