import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '../../components/ui/index';
import { authService } from '../../services/auth-service';
import { useAuth } from '../../hooks/use-auth';
import { Modal } from '../../components/ui/modal/index';
import { validateEmail } from '../../utils/validation';
import './style.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Eliminado 'from' porque no se usa

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El correo debe contener "@" y un dominio válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    // Modificado para manejar cuenta no verificada
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Redirección ya manejada en useAuth
      } else if (result.error?.includes("Cuenta no verificada") || result.error?.includes("no verificada")) {
        // Redirigir a página de verificación
        navigate('/verify-email', { state: { email: formData.email } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Iniciar Sesión</h1>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
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
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Ingresa tu contraseña"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="login-links">
            <Link to="/registro" className="login-link">
              ¿No tienes cuenta? Regístrate
            </Link>
            <Link to="/recuperar-contrasena" className="login-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        title="Cuenta no verificada"
        footer={null}
      >
        <p>Tu cuenta no está verificada. Revisa tu correo electrónico para el código de verificación.</p>
        {modalError && <p style={{ color: 'red' }}>{modalError}</p>}
        <Button
          onClick={async () => {
            setModalLoading(true);
            setModalError("");
            try {
              await authService.resendVerificationCode(formData.email);
              setShowVerifyModal(false);
              navigate('/verification-code', { state: { email: formData.email } });
            } catch (err) {
              setModalError(err?.message || "Error al reenviar el código.");
            } finally {
              setModalLoading(false);
            }
          }}
          disabled={modalLoading}
        >
          {modalLoading ? "Enviando..." : "Reenviar código de verificación"}
        </Button>
      </Modal>
    </>
  );
};

