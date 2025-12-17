import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * Tests para el servicio de autenticación
 */

// Mock del apiClient ANTES de importar cualquier cosa
vi.mock('../services/api-client', () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

import { authService } from '../services/auth-service';
import apiClient from '../services/api-client';

describe('AuthService - Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('debe hacer login y guardar token en localStorage', async () => {
    const mockResponse = {
      data: {
        status: 'success',
        access_token: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com' }
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    const result = await authService.login('test@example.com', 'password123');

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    expect(localStorage.getItem('access_token')).toBe('mock-jwt-token');
    expect(result).toEqual(mockResponse.data);
  });

  test('debe manejar diferentes formatos de respuesta de token', async () => {
    const mockResponse = {
      data: {
        token: 'alternative-token-format'
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    await authService.login('test@example.com', 'password123');

    expect(localStorage.getItem('access_token')).toBe('alternative-token-format');
  });

  test('debe manejar token en data.access_token', async () => {
    const mockResponse = {
      data: {
        data: {
          access_token: 'nested-token'
        }
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    await authService.login('test@example.com', 'password123');

    expect(localStorage.getItem('access_token')).toBe('nested-token');
  });

  test('debe lanzar error cuando login falla', async () => {
    const mockError = {
      response: {
        data: {
          status: 'error',
          message: 'Credenciales inválidas'
        }
      }
    };

    apiClient.post.mockRejectedValue(mockError);

    await expect(
      authService.login('test@example.com', 'wrongpassword')
    ).rejects.toEqual(mockError);
  });
});

describe('AuthService - Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe registrar usuario exitosamente', async () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      nombre: 'New User',
      cedula: '12345678'
    };

    const mockResponse = {
      data: {
        status: 'success',
        message: 'Usuario registrado exitosamente'
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    const result = await authService.register(userData);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
    expect(result).toEqual(mockResponse.data);
  });

  test('debe manejar error de email duplicado', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'SecurePass123!',
      nombre: 'User'
    };

    const mockError = {
      response: {
        data: {
          status: 'error',
          message: 'Email ya registrado'
        }
      }
    };

    apiClient.post.mockRejectedValue(mockError);

    await expect(authService.register(userData)).rejects.toEqual(mockError);
  });
});

describe('AuthService - Verify Email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe verificar email con código correcto', async () => {
    const verificationData = {
      email: 'test@example.com',
      code: '123456'
    };

    const mockResponse = {
      data: {
        status: 'success',
        message: 'Email verificado'
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    const result = await authService.verifyEmail(verificationData);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/verify-email', verificationData);
    expect(result).toEqual(mockResponse.data);
  });
});

describe('AuthService - Resend Verification Code', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe reenviar código de verificación', async () => {
    const data = { email: 'test@example.com' };

    const mockResponse = {
      data: {
        status: 'success',
        message: 'Código reenviado'
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    const result = await authService.resendVerificationCode(data);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/resend-code', data);
    expect(result).toEqual(mockResponse.data);
  });
});

describe('AuthService - Logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('debe hacer logout exitosamente', async () => {
    localStorage.setItem('access_token', 'some-token');

    const mockResponse = {
      data: {
        status: 'success'
      }
    };

    apiClient.post.mockResolvedValue(mockResponse);

    const result = await authService.logout();

    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    expect(result).toEqual(mockResponse.data);
  });
});

describe('AuthService - Listar Productos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe listar productos exitosamente', async () => {
    const mockProducts = [
      { id: 1, nombre: 'Producto 1', precio: 1000 },
      { id: 2, nombre: 'Producto 2', precio: 2000 }
    ];

    const mockResponse = {
      data: mockProducts
    };

    apiClient.get.mockResolvedValue(mockResponse);

    const result = await authService.listarProductos();

    expect(apiClient.get).toHaveBeenCalledWith('/admin/productos');
    expect(result).toEqual(mockProducts);
  });

  test('debe manejar error al listar productos', async () => {
    const mockError = {
      response: {
        data: {
          status: 'error',
          message: 'Error al obtener productos'
        }
      }
    };

    apiClient.get.mockRejectedValue(mockError);

    await expect(authService.listarProductos()).rejects.toEqual(mockError.response.data);
  });

  test('debe manejar error sin response', async () => {
    const mockError = new Error('Network error');

    apiClient.get.mockRejectedValue(mockError);

    await expect(authService.listarProductos()).rejects.toEqual({
      status: 'error',
      message: 'Error al listar productos.'
    });
  });
});
