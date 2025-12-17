import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * Tests unitarios para utilidades de validación
 */

import {
  validateEmail,
  validatePassword,
  validateCedula,
  validateTelefono,
  validateNombreCompleto,
  validateImageFile,
  formatPrice,
  formatDate,
  formatWeight,
  getPetPreferences
} from '../utils/validation';

describe('Validación de Email', () => {
  test('debe validar email correcto', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
    expect(validateEmail('test+tag@example.com')).toBe(true);
  });

  test('debe rechazar email inválido', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test @example.com')).toBe(false);
  });

  test('debe rechazar email vacío', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
  });
});

describe('Validación de Contraseña', () => {
  test('debe validar contraseña fuerte', () => {
    const result = validatePassword('StrongPass123!@#');
    expect(result.isValid).toBe(true);
    expect(result.errors.minLength).toBeNull();
    expect(result.errors.hasUpperCase).toBeNull();
    expect(result.errors.hasNumber).toBeNull();
    expect(result.errors.hasSpecialChar).toBeNull();
  });

  test('debe rechazar contraseña corta', () => {
    const result = validatePassword('Short1!');
    expect(result.isValid).toBe(false);
    expect(result.errors.minLength).toBeTruthy();
  });

  test('debe rechazar contraseña sin mayúscula', () => {
    const result = validatePassword('lowercase123!@#');
    expect(result.isValid).toBe(false);
    expect(result.errors.hasUpperCase).toBeTruthy();
  });

  test('debe rechazar contraseña sin número', () => {
    const result = validatePassword('NoNumbers!@#');
    expect(result.isValid).toBe(false);
    expect(result.errors.hasNumber).toBeTruthy();
  });

  test('debe rechazar contraseña sin carácter especial', () => {
    const result = validatePassword('NoSpecial123');
    expect(result.isValid).toBe(false);
    expect(result.errors.hasSpecialChar).toBeTruthy();
  });

  test('debe proporcionar errores múltiples', () => {
    const result = validatePassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors.minLength).toBeTruthy();
    expect(result.errors.hasUpperCase).toBeTruthy();
    expect(result.errors.hasNumber).toBeTruthy();
    expect(result.errors.hasSpecialChar).toBeTruthy();
  });
});

describe('Validación de Cédula', () => {
  test('debe validar cédula correcta', () => {
    expect(validateCedula('12345678')).toBe(true);
    expect(validateCedula('123456')).toBe(true);
    expect(validateCedula('1234567890')).toBe(true);
  });

  test('debe rechazar cédula muy corta', () => {
    expect(validateCedula('12345')).toBe(false);
  });

  test('debe rechazar cédula con letras', () => {
    expect(validateCedula('12345A78')).toBe(false);
    expect(validateCedula('ABC12345')).toBe(false);
  });

  test('debe rechazar cédula con caracteres especiales', () => {
    expect(validateCedula('12345-678')).toBe(false);
    expect(validateCedula('12.345.678')).toBe(false);
  });
});

describe('Validación de Teléfono', () => {
  test('debe validar teléfono correcto', () => {
    expect(validateTelefono('12345678')).toBe(true);
    expect(validateTelefono('+56912345678')).toBe(true);
    expect(validateTelefono('123-456-7890')).toBe(true);
    expect(validateTelefono('+1 234 567 8900')).toBe(true);
  });

  test('debe rechazar teléfono muy corto', () => {
    expect(validateTelefono('1234567')).toBe(false);
  });

  test('debe rechazar teléfono con letras', () => {
    expect(validateTelefono('12345ABC')).toBe(false);
  });
});

describe('Validación de Nombre Completo', () => {
  test('debe validar nombre correcto', () => {
    expect(validateNombreCompleto('Juan Pérez')).toBe(true);
    expect(validateNombreCompleto('María José García')).toBe(true);
    expect(validateNombreCompleto('José Ñuñez')).toBe(true);
  });

  test('debe rechazar nombre muy corto', () => {
    expect(validateNombreCompleto('A')).toBe(false);
  });

  test('debe rechazar nombre con números', () => {
    expect(validateNombreCompleto('Juan123')).toBe(false);
  });

  test('debe rechazar nombre con caracteres especiales', () => {
    expect(validateNombreCompleto('Juan@Pérez')).toBe(false);
    expect(validateNombreCompleto('María_José')).toBe(false);
  });
});

describe('Validación de Archivo de Imagen', () => {
  test('debe validar archivo JPG válido', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });

  test('debe validar archivo PNG válido', () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 });
    
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });

  test('debe rechazar archivo muy grande', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }); // 11MB
    
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('10 MB');
  });

  test('debe rechazar formato inválido', () => {
    const file = new File(['content'], 'test.gif', { type: 'image/gif' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 });
    
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Formato');
  });

  test('debe rechazar archivo null', () => {
    const result = validateImageFile(null);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('No se seleccionó');
  });
});

describe('Formateo de Precio', () => {
  test('debe formatear precio en pesos chilenos', () => {
    const formatted = formatPrice(1000);
    expect(formatted).toContain('1');
    expect(formatted).toContain('000');
  });

  test('debe formatear precio decimal', () => {
    const formatted = formatPrice(1234.56);
    expect(formatted).toBeTruthy();
  });

  test('debe manejar cero', () => {
    const formatted = formatPrice(0);
    expect(formatted).toBeTruthy();
  });
});

describe('Formateo de Fecha', () => {
  test('debe formatear fecha ISO', () => {
    const formatted = formatDate('2023-12-25T10:30:00');
    expect(formatted).toBeTruthy();
    expect(formatted).toContain('2023');
  });

  test('debe manejar diferentes formatos de fecha', () => {
    const formatted = formatDate(new Date('2023-12-25'));
    expect(formatted).toBeTruthy();
  });
});

describe('Formateo de Peso', () => {
  test('debe formatear gramos', () => {
    expect(formatWeight(500)).toBe('500 g');
  });

  test('debe formatear kilogramos', () => {
    expect(formatWeight(1500)).toBe('1.5 kg');
    expect(formatWeight(2000)).toBe('2.0 kg');
  });

  test('debe manejar valores grandes', () => {
    expect(formatWeight(15000)).toBe('15.0 kg');
  });
});

describe('Preferencias de Mascotas', () => {
  test('debe retornar "Perros y Gatos" cuando tiene ambos', () => {
    expect(getPetPreferences(true, true)).toBe('Perros y Gatos');
  });

  test('debe retornar "Perros" cuando solo tiene perros', () => {
    expect(getPetPreferences(true, false)).toBe('Perros');
  });

  test('debe retornar "Gatos" cuando solo tiene gatos', () => {
    expect(getPetPreferences(false, true)).toBe('Gatos');
  });

  test('debe retornar mensaje cuando no tiene mascotas', () => {
    expect(getPetPreferences(false, false)).toBe('Sin mascotas registradas');
  });
});
