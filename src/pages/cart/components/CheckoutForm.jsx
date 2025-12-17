import React, { useState } from 'react';
import { Button, Input, Select } from '../../../components/ui/index';
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
    direccion_entrega: '',
    municipio: '',
    departamento: '',
    pais: 'Colombia',
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.direccion_entrega || formData.direccion_entrega.length < 10) {
      newErrors.direccion_entrega = 'La dirección debe tener al menos 10 caracteres';
    }

    if (!formData.municipio || formData.municipio.length < 3) {
      newErrors.municipio = 'El municipio es requerido';
    }

    if (!formData.departamento || formData.departamento.length < 3) {
      newErrors.departamento = 'El departamento es requerido';
    }

    if (!formData.pais || formData.pais.length < 3) {
      newErrors.pais = 'El país es requerido';
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
    }
  };

  return (
    <div className="checkout-form-overlay">
      <div className="checkout-form-container">
        <h2 className="checkout-form-title">Información de Envío</h2>
        
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="direccion">Dirección de Entrega *</label>
            <Input
              id="direccion"
              type="text"
              value={formData.direccion_entrega}
              onChange={(e) => handleChange('direccion_entrega', e.target.value)}
              placeholder="Ej: Calle 123 #45-67, Apto 301"
              className={errors.direccion_entrega ? 'input-error' : ''}
              disabled={isProcessing}
            />
            {errors.direccion_entrega && (
              <span className="error-message">{errors.direccion_entrega}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="municipio">Municipio/Ciudad *</label>
              <Input
                id="municipio"
                type="text"
                value={formData.municipio}
                onChange={(e) => handleChange('municipio', e.target.value)}
                placeholder="Ej: Bogotá"
                className={errors.municipio ? 'input-error' : ''}
                disabled={isProcessing}
              />
              {errors.municipio && (
                <span className="error-message">{errors.municipio}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="departamento">Departamento/Estado *</label>
              <Input
                id="departamento"
                type="text"
                value={formData.departamento}
                onChange={(e) => handleChange('departamento', e.target.value)}
                placeholder="Ej: Cundinamarca"
                className={errors.departamento ? 'input-error' : ''}
                disabled={isProcessing}
              />
              {errors.departamento && (
                <span className="error-message">{errors.departamento}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pais">País *</label>
              <Input
                id="pais"
                type="text"
                value={formData.pais}
                onChange={(e) => handleChange('pais', e.target.value)}
                placeholder="Colombia"
                className={errors.pais ? 'input-error' : ''}
                disabled={isProcessing}
              />
              {errors.pais && (
                <span className="error-message">{errors.pais}</span>
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
