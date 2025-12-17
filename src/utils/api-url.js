/**
 * API URL Utilities
 * Centraliza el manejo de URLs del API y recursos estáticos
 */

/**
 * Obtiene la URL base del API sin el sufijo /api
 * @returns {string} URL base del API
 */
export const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

/**
 * Construye la URL completa para una imagen del backend
 * @param {string} path - Ruta de la imagen (puede ser relativa o absoluta)
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (path) => {
  if (!path) return '/no-image.svg';
  if (typeof path !== 'string') return '/no-image.svg';
  
  const cleaned = path.trim();
  if (!cleaned) return '/no-image.svg';
  
  // Si ya es una URL completa, devolverla tal cual
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }
  
  // Si es una ruta relativa, construir URL completa
  const baseUrl = getApiBaseUrl();
  const separator = cleaned.startsWith('/') ? '' : '/';
  return `${baseUrl}${separator}${cleaned}`;
};

/**
 * Construye la URL completa del API para un endpoint específico
 * @param {string} endpoint - Endpoint del API (ej: '/products')
 * @returns {string} URL completa del endpoint
 */
export const getApiUrl = (endpoint = '') => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${apiUrl}${cleanEndpoint}`;
};

/**
 * Verifica si una URL es válida
 * @param {string} url - URL a verificar
 * @returns {boolean} true si es válida, false en caso contrario
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
