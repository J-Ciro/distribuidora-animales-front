import apiClient from './api-client';

export const authService = {
      // Crear producto
          async createProduct(formData) {
            // create product (formData may include imagenFile)
            const response = await apiClient.post('/admin/productos', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            let created = response.data;

            // determine id
            let createdId = null;
            if (created && typeof created === 'object') {
              if (created.id) createdId = created.id;
              else if (Array.isArray(created) && created.length) createdId = created[created.length - 1]?.id;
              else if (created.producto && created.producto.id) createdId = created.producto.id;
            }

            // fallback: fetch list and take last id
            if (!createdId) {
              try {
                const listResp = await apiClient.get('/admin/productos');
                const list = listResp.data;
                if (Array.isArray(list) && list.length) createdId = list[list.length - 1]?.id;
              } catch (err) {
                console.error('Could not determine created product id after create:', err);
              }
            }

            // if an image was provided in the formData and we have an id, upload it
            try {
              const file = formData.get && formData.get('imagenFile');
              if (file && createdId) {
                const imgForm = new FormData();
                imgForm.append('file', file);
                const imgResp = await apiClient.post(`/admin/productos/${createdId}/images`, imgForm, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                const imageData = imgResp.data;
                const url = imageData?.imagen_url ?? imageData?.url ?? imageData?.path ?? null;
                if (url && created && typeof created === 'object') {
                  created.imagenUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
                }
              }
            } catch (err) {
              console.error('Image upload failed after create:', err);
            }

            return created;
          },
    // Resend verification code
    async resendVerificationCode(data) {
      const response = await apiClient.post('/auth/resend-code', data);
      return response.data;
    },
    
    // Forgot password (request recovery link)
    async forgotPassword(data) {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response.data;
    },
    
    // Reset password (with token)
    async resetPassword(data) {
      const response = await apiClient.post('/auth/reset-password', data);
      return response.data;
    },
    
    // Listar productos (admin)
    async listarProductos() {
      try {
        const response = await apiClient.get('/admin/productos');
        return response.data;
      } catch (error) {
        throw error.response?.data || { status: 'error', message: 'Error al listar productos.' };
      }
    },
  // Login
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    // Try to persist token under common keys returned by different backends
    const data = response.data || {};
    const tokenCandidates = [
      data.access_token,
      data.token,
      data.accessToken,
      data.access_token ?? data.token ?? data.accessToken,
      data.data && data.data.access_token,
      data.data && data.data.token,
    ];
    const token = tokenCandidates.find(t => typeof t === 'string' && t.length > 0);
    if (token) {
      localStorage.setItem('access_token', token);
    }

    return response.data;
  },

  // Register
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Verify email
  async verifyEmail(data) {
    const response = await apiClient.post('/auth/verify-email', data);
    return response.data;
  },

  // Logout
  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current user
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Export individual functions for convenience
export const verificarEmail = authService.verifyEmail.bind(authService);
export const reenviarCodigo = authService.resendVerificationCode.bind(authService);

