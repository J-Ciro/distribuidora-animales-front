import React, { useState } from 'react';
import { Button, Input, Select } from '../../../components/ui/index';
import { AddressSelector } from './AddressSelector';
import './checkout-form.css';

const PAYMENT_METHODS = [
  { value: 'Efectivo', label: 'Efectivo' },
  { value: 'Tarjeta', label: 'Tarjeta de Crédito/Débito' },
  { value: 'Daviplata', label: 'Daviplata' },
  { value: 'Nequi', label: 'Nequi' },
  { value: 'Addi', label: 'Addi' },
  { value: 'Sistecredito', label: 'Sistecredito' },
];

export const CheckoutForm = ({ onSubmit, onCancel, isProcessing }) => {
  const [formData, setFormData] = useState({
    direccion_id: null, // Cambio de direccion_entrega a direccion_id
    telefono_contacto: '',
    metodo_pago: 'Efectivo',
    nota_especial: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (selectedDireccionId) => {
    setFormData(prev => ({ ...prev, direccion_id: selectedDireccionId }));
    // Clear error when user selects an address
    if (errors.direccion_id) {
      setErrors(prev => ({ ...prev, direccion_id: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.direccion_id) {
      newErrors.direccion_id = 'Debes seleccionar o agregar una dirección de entrega';
    }

    if (!formData.telefono_contacto) {
      newErrors.telefono_contacto = 'El teléfono es requerido';
    } else if (!/^\d{7,15}$/.test(formData.telefono_contacto)) {
      newErrors.telefono_contacto = 'Ingresa un teléfono válido (7-15 dígitos)';
    }

    if (!formData.metodo_pago) {
      newErrors.metodo_pago = 'Selecciona un método de pago';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Show first error in console for debugging
      const firstError = Object.values(errors).find(err => err);
      if (firstError) {
        console.warn('Validation error:', firstError);
      }
    }
  };

  return (
    <div className="checkout-form-overlay">
      <div className="checkout-form-container">
        <h2 className="checkout-form-title">Información de Envío</h2>
        
        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Selector de direcciones - SOLID: Dependency Injection via props */}
          <div className="form-group">
            <label>
              Dirección de Entrega *
              {!formData.direccion_id && <span className="label-required-hint"> (selecciona una)</span>}
            </label>
            <AddressSelector
              selectedDireccionId={formData.direccion_id}
              onAddressChange={handleAddressChange}
            />
            {errors.direccion_id && (
              <span className="error-message">{errors.direccion_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono de Contacto *</label>
            <Input
              id="telefono"
              type="tel"
              value={formData.telefono_contacto}
              onChange={(e) => handleChange('telefono_contacto', e.target.value)}
              placeholder="Ej: 3001234567"
              className={errors.telefono_contacto ? 'input-error' : ''}
              disabled={isProcessing}
            />
            {errors.telefono_contacto && (
              <span className="error-message">{errors.telefono_contacto}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="metodo_pago">Método de Pago *</label>
            <Select
              id="metodo_pago"
              value={formData.metodo_pago}
              onChange={(e) => handleChange('metodo_pago', e.target.value)}
              options={PAYMENT_METHODS}
              className={errors.metodo_pago ? 'input-error' : ''}
              disabled={isProcessing}
            />
            {errors.metodo_pago && (
              <span className="error-message">{errors.metodo_pago}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nota">Nota Especial (Opcional)</label>
            <textarea
              id="nota"
              value={formData.nota_especial}
              onChange={(e) => handleChange('nota_especial', e.target.value)}
              placeholder="Indicaciones adicionales para la entrega..."
              rows="3"
              maxLength="500"
              className="checkout-textarea"
              disabled={isProcessing}
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
