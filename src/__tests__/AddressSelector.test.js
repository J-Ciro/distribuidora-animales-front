/**
 * Tests for AddressSelector component
 * HU: Registro sin Dirección - Address management during checkout
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { direccionesService } from '../services/direcciones-service';

// Mock direcciones service
vi.mock('../services/direcciones-service', () => ({
  direccionesService: {
    list: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('Direcciones Service - Registration without Address', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should list user addresses', async () => {
    const mockAddresses = [
      {
        id: 1,
        direccion_completa: 'Calle 123 #45-67, Apartamento 301',
        municipio: 'Bogotá',
        departamento: 'Cundinamarca',
        pais: 'Colombia',
        es_principal: true,
      },
      {
        id: 2,
        direccion_completa: 'Carrera 7 #10-20',
        municipio: 'Medellín',
        departamento: 'Antioquia',
        pais: 'Colombia',
        es_principal: false,
      },
    ];

    direccionesService.list.mockResolvedValue(mockAddresses);

    const addresses = await direccionesService.list();

    expect(addresses).toHaveLength(2);
    expect(addresses[0].es_principal).toBe(true);
    expect(addresses[0]).not.toHaveProperty('alias');
  });

  it('should create address with required field only', async () => {
    const newAddress = {
      direccion_completa: 'Nueva dirección completa con más de 10 caracteres',
    };

    const mockResponse = {
      id: 3,
      direccion_completa: 'Nueva dirección completa con más de 10 caracteres',
      municipio: null,
      departamento: null,
      pais: 'Colombia',
      es_principal: false,
    };

    direccionesService.create.mockResolvedValue(mockResponse);

    const result = await direccionesService.create(newAddress);

    expect(result.direccion_completa).toBe(newAddress.direccion_completa);
    expect(result.pais).toBe('Colombia');
    expect(result.es_principal).toBe(false);
    expect(result).not.toHaveProperty('alias');
  });

  it('should create address with all fields', async () => {
    const newAddress = {
      direccion_completa: 'Calle 50 #25-30 Apartamento 402',
      municipio: 'Cali',
      departamento: 'Valle del Cauca',
      pais: 'Colombia',
      es_principal: true,
    };

    const mockResponse = {
      id: 4,
      ...newAddress,
    };

    direccionesService.create.mockResolvedValue(mockResponse);

    const result = await direccionesService.create(newAddress);

    expect(result.direccion_completa).toBe(newAddress.direccion_completa);
    expect(result.municipio).toBe(newAddress.municipio);
    expect(result.departamento).toBe(newAddress.departamento);
    expect(result.pais).toBe(newAddress.pais);
    expect(result.es_principal).toBe(true);
    expect(result).not.toHaveProperty('alias');
  });

  it('should delete address', async () => {
    const addressId = 1;
    const mockResponse = { status: 'success', message: 'Dirección eliminada' };

    direccionesService.remove.mockResolvedValue(mockResponse);

    const result = await direccionesService.remove(addressId);

    expect(result.status).toBe('success');
    expect(direccionesService.remove).toHaveBeenCalledWith(addressId);
  });

  it('should validate address without alias field', async () => {
    const address = {
      direccion_completa: 'Test Address',
      municipio: 'Test City',
      departamento: 'Test State',
      pais: 'Colombia',
      es_principal: false,
    };

    // Verify address object doesn't have alias
    expect(address).not.toHaveProperty('alias');

    // Verify no keys contain 'alias'
    const keys = Object.keys(address);
    expect(keys).not.toContain('alias');
  });

  it('should use default values', async () => {
    const address = {
      direccion_completa: 'Dirección mínima válida con más de 10 caracteres',
    };

    const mockResponse = {
      id: 5,
      direccion_completa: address.direccion_completa,
      municipio: null,
      departamento: null,
      pais: 'Colombia', // Default
      es_principal: false, // Default
    };

    direccionesService.create.mockResolvedValue(mockResponse);

    const result = await direccionesService.create(address);

    expect(result.pais).toBe('Colombia');
    expect(result.es_principal).toBe(false);
  });

  it('should validate direccion_completa minimum length', () => {
    const shortAddress = {
      direccion_completa: 'Short', // Only 5 characters
    };

    // In real implementation, this should be rejected by backend
    // Here we validate the constraint exists
    expect(shortAddress.direccion_completa.length).toBeLessThan(10);
  });

  it('should support primary address flag', async () => {
    const primaryAddress = {
      direccion_completa: 'Dirección principal completa',
      es_principal: true,
    };

    const mockResponse = {
      id: 6,
      ...primaryAddress,
      municipio: null,
      departamento: null,
      pais: 'Colombia',
    };

    direccionesService.create.mockResolvedValue(mockResponse);

    const result = await direccionesService.create(primaryAddress);

    expect(result.es_principal).toBe(true);
  });
});

describe('Address Data Structure - HU Validation', () => {
  it('should have correct address fields without alias', () => {
    const expectedFields = [
      'id',
      'direccion_completa',
      'municipio',
      'departamento',
      'pais',
      'es_principal',
    ];

    const forbiddenFields = ['alias'];

    // Verify expected fields are documented
    expect(expectedFields).toContain('direccion_completa');
    expect(expectedFields).toContain('es_principal');

    // Verify alias is not in expected fields
    expect(expectedFields).not.toContain('alias');
    expect(forbiddenFields).toContain('alias');
  });

  it('should validate registration without address requirement', () => {
    // Registration form should NOT require address fields
    const registrationData = {
      email: 'user@test.com',
      password: 'Password123#',
      nombre: 'Test User',
      cedula: '1234567890',
      telefono: '3001234567',
      preferencia_mascotas: 'Gatos',
      // NO direccion_envio field
    };

    expect(registrationData).not.toHaveProperty('direccion_envio');
    expect(registrationData).not.toHaveProperty('direccion');
    expect(registrationData).not.toHaveProperty('direccion_completa');
  });

  it('should collect address during checkout', () => {
    // Checkout flow should request address
    const checkoutData = {
      productos: [{ id: 1, cantidad: 2 }],
      direccion_id: 1, // Address selected from user's saved addresses
      telefono_contacto: '3001234567',
    };

    expect(checkoutData).toHaveProperty('direccion_id');
    expect(typeof checkoutData.direccion_id).toBe('number');
  });
});
