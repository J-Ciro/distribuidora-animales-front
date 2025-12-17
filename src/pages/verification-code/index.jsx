import React, { useState, useEffect } from "react";
import { authService } from "../../services/auth-service";
import { useToast } from "../../hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import './style.css';

const VerificationCodePage = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyEmail(email, code);
      showToast("Correo verificado correctamente.", "success");
      navigate("/login");
    } catch (error) {
      if (!error?._toastsShown) showToast(error?.message || "Código inválido o expirado.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      showToast("Por favor ingresa tu correo primero.", "warning");
      return;
    }
    setLoading(true);
    try {
      await authService.resendVerificationCode(email);
      showToast("Código reenviado. Revisa tu correo.", "success");
    } catch (error) {
      if (!error?._toastsShown) showToast(error?.message || "No se pudo reenviar el código.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-page">
      <div className="verification-container">
        <h2 className="verification-title">Verificar correo</h2>
        <form className="verification-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="verification-input"
            required
          />
          <label htmlFor="code">Código de verificación</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="verification-input"
            required
            maxLength={6}
          />
          <button type="submit" className="verification-button" disabled={loading}>
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>
        <div className="verification-actions">
          <button onClick={handleResend} className="verification-button" disabled={loading}>
            Reenviar código
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodePage;
