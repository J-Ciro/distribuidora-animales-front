import apiClient from './api-client';

export const direccionesService = {
  async list() {
    const res = await apiClient.get('/usuarios/direcciones');
    return res.data;
  },
  async create(payload) {
    const res = await apiClient.post('/usuarios/direcciones', payload);
    return res.data;
  },
  async remove(id) {
    const res = await apiClient.delete(`/usuarios/direcciones/${id}`);
    return res.data;
  },
};
