import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../../services/auth-service";
import { useToast } from "../../hooks/use-toast";
import './style.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el token de la URL (CP-24)
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setTokenValid(false);
      showToast("Enlace de recuperación caducado o inválido. Solicita uno nuevo.", "error");
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, navigate, showToast]);

  // Validar contraseña
  const validatePassword = (pwd) => {
    const passwordErrors = [];
    if (pwd.length < 10) {
      passwordErrors.push("Al menos 10 caracteres");
    }
    if (!/[A-Z]/.test(pwd)) {
      passwordErrors.push("Una mayúscula");
    }
    if (!/\d/.test(pwd)) {
      passwordErrors.push("Un número");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd)) {
      passwordErrors.push("Un carácter especial");
    }
    return passwordErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validar campos vacíos
    if (!password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        newErrors.password = `Debe incluir: ${passwordErrors.join(", ")}`;
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // CP-24: Restablecer contraseña con token
      await authService.resetPassword({
        token,
        new_password: password
      });

      showToast("Contraseña actualizada exitosamente. Ya puedes iniciar sesión.", "success");
      
      // Redirigir a login después de 1.5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.detail?.message ||
                          error.response?.data?.message ||
                          error?.message ||
                          "Error al restablecer la contraseña";
      
      // CP-25: Token expirado
      if (error.response?.status === 400 && errorMessage.includes("caducado")) {
        setTokenValid(false);
        showToast("Enlace de recuperación caducado. Solicita uno nuevo.", "error");
        setTimeout(() => navigate('/recover-password'), 2000);
      } else {
        showToast(errorMessage, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return null;
  }

  return (
    <div className="reset-page">
      <div className="reset-container">
        <h1 className="reset-title">Restablecer Contraseña</h1>
        <form onSubmit={handleSubmit} className="reset-form" noValidate>
          <div className="form-group">
            <label htmlFor="password" className="reset-label">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              className={`reset-input ${errors.password ? 'error' : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: "" });
                }
              }}
              required
              disabled={loading}
              placeholder="Mínimo 10 caracteres"
            />
            {errors.password && (
              <div className="reset-error">{errors.password}</div>
            )}
            <div className="password-requirements">
              <div className={`requirement ${password.length >= 10 ? 'met' : ''}`}>
                ✓ Al menos 10 caracteres
              </div>
              <div className={`requirement ${/[A-Z]/.test(password) ? 'met' : ''}`}>
                ✓ Una mayúscula
              </div>
              <div className={`requirement ${/\d/.test(password) ? 'met' : ''}`}>
                ✓ Un número
              </div>
              <div className={`requirement ${/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? 'met' : ''}`}>
                ✓ Un carácter especial
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="reset-label">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              className={`reset-input ${errors.confirmPassword ? 'error' : ''}`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: "" });
                }
              }}
              required
              disabled={loading}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <div className="reset-error">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="reset-button"
            disabled={loading || !token}
          >
            {loading ? "Actualizando..." : "Restablecer Contraseña"}
          </button>
        </form>

        <div className="reset-links">
          <Link to="/login" className="reset-link">
            ¿Recordaste tu contraseña? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
