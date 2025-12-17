
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth-service";
import { useToast } from "../../hooks/use-toast";
import './style.css';

const RecoverPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validar formato de email (CP-23)
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // CP-23: Validación de formato de correo
    if (!email.trim()) {
      setValidationError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("El formato del correo electrónico es incorrecto.");
      return;
    }

    setLoading(true);
    try {
      // CP-21 y CP-22: Mensaje uniforme sin revelar si el correo existe
      await authService.forgotPassword({ email });
      showToast("Se ha enviado a tu correo el enlace de recuperación", "success");
      
      // Esperar un poco y redirigir a login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Mostrar mensaje uniforme incluso en caso de error
      showToast("Se ha enviado a tu correo el enlace de recuperación", "success");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-page">
      <div className="recover-container">
        <h1 className="recover-title">Recuperar Contraseña</h1>
        <form onSubmit={handleSubmit} className="recover-form" noValidate>
          <label htmlFor="email" className="recover-label">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            className="recover-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationError(""); // Limpiar error al escribir
            }}
            required
            autoComplete="email"
            disabled={loading}
            placeholder="usuario@ejemplo.com"
          />
          {validationError && (
            <div className="recover-error">{validationError}</div>
          )}
          <button
            type="submit"
            className="recover-button"
            disabled={loading || !email.trim()}
          >
            {loading ? "Enviando..." : "Enviar código de recuperación"}
          </button>
        </form>
        <div className="recover-links">
          <Link to="/login" className="recover-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
