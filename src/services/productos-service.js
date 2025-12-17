import apiClient from './api-client';
import { calificacionesService } from './calificaciones-service';

export const productosService = {
  // Get catalog (public - sin autenticación) - para la página de inicio
  async getCatalogPublic({ skip = 0, limit = 20, categoria_id = null, subcategoria_id = null } = {}) {
    const params = { skip, limit };
    if (categoria_id) params.categoria_id = categoria_id;
    if (subcategoria_id) params.subcategoria_id = subcategoria_id;
    const response = await apiClient.get('/home/productos', { params });
    const productos = response.data;

    // If backend already returned rating stats in the product objects, skip extra enrichment
    if (Array.isArray(productos) && productos.length > 0 && productos[0].hasOwnProperty('promedio_calificacion')) {
      // Ensure defaults for any missing stat fields
      productos.forEach(producto => {
        if (producto.promedio_calificacion === undefined) producto.promedio_calificacion = 0;
        if (producto.total_calificaciones === undefined) producto.total_calificaciones = 0;
      });
      return productos;
    }

    // Backward-compat: enrich products by fetching stats per product (kept as fallback)
    if (Array.isArray(productos) && productos.length > 0) {
      try {
        const productIds = productos.map(p => p.id);
        const statsMap = await calificacionesService.getProductsStats(productIds);

        // Agregar stats a cada producto
        productos.forEach(producto => {
          const stats = statsMap[producto.id];
          if (stats && stats.promedio_calificacion !== undefined) {
            producto.promedio_calificacion = stats.promedio_calificacion || 0;
            producto.total_calificaciones = stats.total_calificaciones || 0;
          } else {
            producto.promedio_calificacion = 0;
            producto.total_calificaciones = 0;
          }
        });
      } catch (error) {
        console.error('Error fetching product ratings:', error);
        // Continuar sin calificaciones si falla - agregar valores por defecto
        productos.forEach(producto => {
          producto.promedio_calificacion = 0;
          producto.total_calificaciones = 0;
        });
      }
    }

    return productos;
  },

  // Get catalog (admin - requiere autenticación)
  async getCatalog({ skip = 0, limit = 20, q = '' } = {}) {
    const params = { skip, limit };
    if (q) params.q = q;
    const response = await apiClient.get('/admin/productos', { params });
    return response.data;
  },

  // Get single product
  async getProductById(id) {
    const response = await apiClient.get(`/admin/productos/${id}`);
    return response.data;
  },

  // Admin: Create product (then optionally upload image to /products/{id}/images)
  async createProduct(productData) {
    const { imagenFile, imagenUrl, ...payload } = productData || {};
    
    // Si hay imagenUrl, agregarla al payload
    if (imagenUrl) {
      payload.imagenUrl = imagenUrl;
    }

    const response = await apiClient.post('/admin/productos', payload);
    let created = response.data;

    // Determine created id robustly: response may return the created object, an array, or other shape
    let createdId = null;
    if (created && typeof created === 'object') {
      if (created.id) createdId = created.id;
      else if (Array.isArray(created) && created.length) {
        const last = created[created.length - 1];
        if (last && last.id) createdId = last.id;
      } else if (created.producto && created.producto.id) {
        createdId = created.producto.id;
      }
    }

    // Fallback: fetch list and take last item id
    if (!createdId) {
      try {
        const listResp = await apiClient.get('/admin/productos');
        const list = listResp.data;
        if (Array.isArray(list) && list.length) {
          const last = list[list.length - 1];
          if (last && last.id) createdId = last.id;
        }
      } catch (err) {
        console.error('Could not determine created product id:', err);
      }
    }

    // If we have an image and an id, upload it
    if (imagenFile && createdId) {
      try {
        const form = new FormData();
        form.append('file', imagenFile);
        const imgResp = await apiClient.post(`/admin/productos/${createdId}/images`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageData = imgResp.data;
        const url = imageData?.imagen_url ?? imageData?.url ?? imageData?.path ?? null;
        if (url) {
          // attach imagenUrl to returned created object if possible
          if (!created || typeof created !== 'object') created = {};
          created.imagenUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
        }
      } catch (err) {
        console.error('Image upload failed for created product:', err);
      }
    }

    return created;
  },

  // Admin: Update product
  async updateProduct(id, productData) {
    const { imagenFile, imagenUrl, ...payload } = productData || {};
    
    // Si hay imagenUrl (incluso si está vacía), agregarla al payload
    // Esto permite eliminar imágenes enviando imagenUrl: ''
    if (imagenUrl !== undefined) {
      payload.imagenUrl = imagenUrl;
    }

    const response = await apiClient.put(`/admin/productos/${id}`, payload);
    const updated = response.data;

    // Si hay archivo, subirlo DESPUÉS de actualizar (tiene prioridad sobre imagenUrl)
    if (imagenFile) {
      try {
        const form = new FormData();
        form.append('file', imagenFile);
        const imgResp = await apiClient.post(`/admin/productos/${id}/images`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageData = imgResp.data;
        const url = imageData?.imagen_url ?? imageData?.url ?? imageData?.path ?? null;
        if (url) {
          updated.imagenUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
        }
      } catch (err) {
        console.error('Image upload failed for updated product:', err);
        throw err; // Propagar el error para que el usuario sepa que falló
      }
    }

    return updated;
  },

  // Admin: Upload a single image for a product
  async uploadProductImage(productId, file) {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post(`/admin/productos/${productId}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Admin: Get a specific product image
  async getProductImage(productId, imageId) {
    const response = await apiClient.get(`/admin/productos/${productId}/images/${imageId}`);
    return response.data;
  },

  // Admin: Get all products
  async getAllProducts() {
    const response = await apiClient.get('/admin/productos');
    return response.data;
  },

  // Admin: Get products paged
  async getProductsPage({ skip = 0, limit = 20, q = '' } = {}) {
    const params = { skip, limit };
    if (q) params.q = q;
    const response = await apiClient.get('/admin/productos', { params });
    return response.data;
  },

  // Admin: Eliminar producto
  async eliminarProducto(id) {
    const response = await apiClient.delete(`/admin/productos/${id}`);
    return response.data;
  },
};

export default productosService;

