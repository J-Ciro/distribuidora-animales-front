import axios from 'axios';
import store from '../redux/store';
import { logout as logoutAction } from '../redux/actions/auth-actions';
import { toast } from '../utils/toast';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies HTTP-only
});

const apiClient2 = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies HTTP-only
});

// Request interceptor - Agregar token si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    // Attach Authorization header globally when token exists.
    // Some endpoints/clients may still remove it intentionally (see apiClient2).
    try {
      const url = config && config.url ? config.url.toString() : '';
      // Debug: log login request headers for /auth/login during development
      if (url && url.includes('/auth/login')) {
        try {
          // eslint-disable-next-line no-console
          console.debug('[apiClient] Debug login request headers:', { method: config.method, url, headers: config.headers });
        } catch (e) {}
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // If no token, do not modify Authorization header (leave as-is or absent)
    } catch (e) {
      // ignore errors and don't modify headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient2.interceptors.request.use(
  (config) => {
    // Ensure we DO NOT send the Authorization header for public requests
    // using this client (e.g. resend verification code).
    if (config && config.headers) {
      delete config.headers.Authorization;
      delete config.headers.authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Manejo de errores
apiClient.interceptors.response.use(
  (response) => {
    // Show backend success messages for mutating requests (POST/PUT/PATCH/DELETE)
    try {
      const method = response.config?.method?.toLowerCase();
      const status = response.status;
      const data = response.data;
      const isMutating = ['post', 'put', 'patch', 'delete'].includes(method);
      const hasMessage = data && (typeof data.message === 'string' && data.message.trim() !== '');
      const explicitSuccess = data && data.status === 'success';

      if (isMutating && hasMessage && (explicitSuccess || status === 201 || status === 200)) {
        // Avoid duplicate toasts if already shown
        try {
          const msg = data.message;
          if (msg) toast.success(msg);
          response._toastsShown = true;
        } catch (e) {
          // ignore toast errors
        }
      }
    } catch (e) {
      // ignore
    }
    return response;
  },
  (error) => {
    // Extract backend error messages and show them in toasts
    try {
      const msgs = [];
      if (!error.response) {
        // Network or CORS error
        msgs.push(error.message || 'Network error');
      } else {
        const data = error.response.data;
        if (!data) {
          if (error.response.statusText) msgs.push(error.response.statusText);
        } else if (typeof data === 'string') {
          msgs.push(data);
        } else if (data.message) {
          msgs.push(data.message);
        } else if (data.error) {
          if (typeof data.error === 'string') msgs.push(data.error);
          else if (data.error.message) msgs.push(data.error.message);
        } else if (data.detail) {
          msgs.push(data.detail);
        } else if (data.errors) {
          // could be array or object
          if (Array.isArray(data.errors)) {
            data.errors.forEach((it) => {
              if (typeof it === 'string') msgs.push(it);
              else if (it && it.message) msgs.push(it.message);
            });
          } else if (typeof data.errors === 'object') {
            Object.values(data.errors).forEach((val) => {
              if (Array.isArray(val)) val.forEach((v) => msgs.push(typeof v === 'string' ? v : v.message || JSON.stringify(v)));
              else msgs.push(typeof val === 'string' ? val : val.message || JSON.stringify(val));
            });
          }
        } else if (typeof data === 'object') {
          // try to collect any string values
          Object.values(data).forEach((val) => {
            if (typeof val === 'string') msgs.push(val);
          });
        }
      }

      // show collected messages
      const unique = [...new Set(msgs.filter(Boolean))];
      unique.forEach((m) => toast.error(m));
      // mark the error so callers know we've already shown backend messages
      try {
        error._toastsShown = true;
        error._backendMessages = unique;
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore toast errors
      console.error('Error showing toasts from api-client interceptor', e);
    }

    if (error.response?.status === 401) {
      // Si hay un token en localStorage, probablemente el token expiró o es inválido:
      // en ese caso redirigimos a login. Si no hay token (petición pública),
      // no forzamos la redirección para permitir páginas públicas (ej. verification-code).
      const token = localStorage.getItem('access_token');
      if (token) {
        // Clear auth data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        // Dispatch redux logout so the app can react (clear state, navigate, etc.)
        try {
          store.dispatch(logoutAction());
        } catch (e) {
          // Fallback to direct redirect if store dispatch fails
          if (window.location.pathname !== '/login') window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { apiClient2 };


