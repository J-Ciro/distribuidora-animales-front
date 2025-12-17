import apiClient from './api-client';

export const pedidosService = {
  // Create order
  async createOrder(orderData) {
    const response = await apiClient.post('/pedidos/', orderData);
    return response.data;
  },

  // Get user orders
  async getUserOrders() {
    const response = await apiClient.get('/pedidos/mis-pedidos');
    return response.data;
  },

  // Get order by id
  async getOrderById(id) {
    const response = await apiClient.get(`/pedidos/${id}/`);
    return response.data;
  },

  // Alias for getOrderById (for consistency)
  async getById(id) {
    return this.getOrderById(id);
  },

  // Admin: Get all orders
  async getAllOrders() {
    const response = await apiClient.get('/admin/pedidos/');
    return response.data;
  },

  // Admin: Get order by id
  async getAdminOrderById(id) {
    const response = await apiClient.get(`/admin/pedidos/${id}/`);
    return response.data;
  },

  // Admin: Update order status
  async updateOrderStatus(id, status) {
    const response = await apiClient.put(`/admin/pedidos/${id}/status/`, { estado: status });
    return response.data;
  },
};

