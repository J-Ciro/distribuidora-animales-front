import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/auth-service";
import { useToast } from "../../hooks/use-toast";
import './style.css';

const RecoverPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = require('react-router-dom').useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resendVerificationCode(email);
      showToast("Código reenviado. Revisa tu correo.", "success");
      setTimeout(() => {
        navigate('/verification-code', { state: { email } });
      }, 1200);
    } catch (error) {
      if (!error?._toastsShown) showToast(error?.message || "Error al enviar el código.", "error");
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
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            placeholder="usuario@ejemplo.com"
          />
          <button
            type="submit"
            className="recover-button"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar código de verificación"}
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
