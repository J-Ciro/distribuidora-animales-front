import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * Tests unitarios para utilidades de autenticación
 */

import isAdminUser from '../utils/auth';

describe('isAdminUser', () => {
  test('debe retornar false para usuario null', () => {
    expect(isAdminUser(null)).toBe(false);
  });

  test('debe retornar false para usuario undefined', () => {
    expect(isAdminUser(undefined)).toBe(false);
  });

  test('debe retornar true para usuario con rol "admin"', () => {
    const user = { rol: 'admin' };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar true para usuario con rol "ADMIN" (case insensitive)', () => {
    const user = { rol: 'ADMIN' };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar true para usuario con role "admin"', () => {
    const user = { role: 'admin' };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar true para usuario con roleName "admin"', () => {
    const user = { roleName: 'admin' };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar true para usuario con rol "role_admin"', () => {
    const user = { rol: 'role_admin' };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar true para usuario con rol "role:admin"', () => {
    const user = { rol: 'role:admin' };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar true para usuario con array de roles que incluye admin', () => {
    const user = { roles: ['user', 'admin'] };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar true para usuario con roles como objetos', () => {
    const user = { roles: [{ name: 'user' }, { name: 'admin' }] };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar true para usuario con roles que contiene "admin" en el nombre', () => {
    const user = { rol: 'super_admin' };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe retornar false para usuario con rol "user"', () => {
    const user = { rol: 'user' };
    expect(isAdminUser(user)).toBe(false);
  });

  test('debe retornar false para usuario con rol "cliente"', () => {
    const user = { rol: 'cliente' };
    expect(isAdminUser(user)).toBe(false);
  });

  test('debe retornar false para usuario con array de roles sin admin', () => {
    const user = { roles: ['user', 'cliente'] };
    expect(isAdminUser(user)).toBe(false);
  });

  test('debe retornar false para usuario sin rol', () => {
    const user = { id: 1, nombre: 'Test User' };
    expect(isAdminUser(user)).toBe(false);
  });

  test('debe retornar false para usuario con rol vacío', () => {
    const user = { rol: '' };
    expect(isAdminUser(user)).toBe(false);
  });

  test('debe retornar false para usuario con roles vacío', () => {
    const user = { roles: [] };
    expect(isAdminUser(user)).toBe(false);
  });

  test('debe manejar roles como string', () => {
    const user = { roles: 'admin' };
    expect(isAdminUser(user)).toBe(true);
  });

  test('debe verificar múltiples propiedades de rol', () => {
    const user = { 
      rol: 'user',
      role: 'admin'  // Debe encontrar admin en role
    };
    expect(isAdminUser(user)).toBe(true);
  });
});
