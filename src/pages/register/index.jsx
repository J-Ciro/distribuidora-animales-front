import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '../../components/ui/index';
import { useAuth } from '../../hooks/use-auth';
import {
  validateEmail,
  validatePassword,
  validateCedula,
  validateTelefono,
  validateNombreCompleto,
} from '../../utils/validation';
import { toast } from '../../utils/toast';
import './style.css';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    cedula: '',
    email: '',
    telefono: '',
    direccion_envio: '',
    password: '',
    confirmPassword: '',
    tienePerros: false,
    tieneGatos: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate nombreCompleto
    if (!formData.nombreCompleto) {
      newErrors.nombreCompleto = 'El nombre completo es requerido';
    } else if (!validateNombreCompleto(formData.nombreCompleto)) {
      newErrors.nombreCompleto = 'El nombre debe tener al menos 2 caracteres y solo letras';
    }

    // Validate cedula
    if (!formData.cedula) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!validateCedula(formData.cedula)) {
      newErrors.cedula = 'La cédula debe tener al menos 6 dígitos';
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El correo debe contener "@" y un dominio válido';
    }

    // Validate telefono
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!validateTelefono(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener al menos 8 dígitos';
    }

    if (!formData.direccion_envio) {
      newErrors.direccion_envio = 'La dirección de envío es requerida';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        const errorMessages = Object.values(passwordValidation.errors).filter(Boolean);
        newErrors.password = errorMessages[0] || 'Contraseña inválida';
      }
    }

    // Validate confirmPassword
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);

    let preferencia_mascotas = '';
    if (formData.tienePerros && formData.tieneGatos) {
      preferencia_mascotas = 'Ambos';
    } else if (formData.tienePerros) {
      preferencia_mascotas = 'Perros';
    } else if (formData.tieneGatos) {
      preferencia_mascotas = 'Gatos';
    }

    const registerData = {
      email: formData.email,
      password: formData.password,
      nombre: formData.nombreCompleto,
      cedula: formData.cedula,
      telefono: formData.telefono,
      direccion_envio: formData.direccion_envio,
      preferencia_mascotas: preferencia_mascotas,
    };

    const result = await register(registerData);
    setIsLoading(false);

    if (result.success) {
      // Redirigir a verificación de email si el registro fue exitoso
      toast.success('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
      setTimeout(() => {
        navigate('/verify-email', { state: { email: formData.email } });
      }, 1500);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Registro de Nuevo Cliente</h1>
        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <Input
            label="Nombre completo"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            error={errors.nombreCompleto}
            placeholder="Juan Pérez"
            required
            disabled={isLoading}
          />

          <Input
            label="Cédula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            error={errors.cedula}
            placeholder="12345678"
            required
            disabled={isLoading}
          />

          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="usuario@ejemplo.com"
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            error={errors.telefono}
            placeholder="+56 9 1234 5678"
            required
            disabled={isLoading}
          />

          <Input
            label="Dirección de envío"
            name="direccion_envio"
            value={formData.direccion_envio}
            onChange={handleChange}
            error={errors.direccion_envio}
            placeholder="Calle 123, Ciudad"
            required
            disabled={isLoading}
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Mínimo 10 caracteres, 1 mayúscula, 1 número, 1 especial"
            required
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Repite tu contraseña"
            required
            autoComplete="new-password"
            disabled={isLoading}
          />

          <div className="register-checkboxes">
            <label className="register-checkbox">
              <input
                type="checkbox"
                name="tienePerros"
                checked={formData.tienePerros}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span>Perros</span>
            </label>
            <label className="register-checkbox">
              <input
                type="checkbox"
                name="tieneGatos"
                checked={formData.tieneGatos}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span>Gatos</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={isLoading}
            className="register-button"
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>

        <div className="register-links">
          <Link to="/login" className="register-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

