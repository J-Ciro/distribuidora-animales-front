import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verificarEmail, reenviarCodigo } from '../../services/auth-service';
import { useToast } from '../../hooks/use-toast';
import './styles.css';

const VerifyEmail = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      toast.error('Email no encontrado. Por favor, regístrate nuevamente.');
      navigate('/register');
    }
  }, [email, navigate, toast]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Solo números
    
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Solo último dígito
    setCode(newCode);

    // Auto-focus siguiente input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // Focus último input con valor o primero vacío
    const nextEmptyIndex = newCode.findIndex(c => !c);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    document.getElementById(`code-${focusIndex}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      toast.error('Por favor, ingresa los 6 dígitos del código');
      return;
    }

    setLoading(true);
    
    try {
      const response = await verificarEmail({
        email,
        code: verificationCode
      });
      
      toast.success(response.message || '¡Cuenta verificada exitosamente!');
      
      // Esperar 1 segundo y redirigir al login
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            verified: true,
            email: email 
          } 
        });
      }, 1500);
      
    } catch (error) {
      const errorMessage = error.response?.data?.detail?.message || 
                          error.response?.data?.message ||
                          'Error al verificar el código. Inténtalo nuevamente.';
      toast.error(errorMessage);
      
      // Si el código expiró, ofrecer reenvío
      if (error.response?.status === 410) {
        setCountdown(0); // Permitir reenvío inmediato
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    
    try {
      const response = await reenviarCodigo({ email });
      toast.success(response.message || 'Código reenviado. Revisa tu correo.');
      setCode(['', '', '', '', '', '']); // Limpiar código
      setCountdown(60); // 60 segundos de espera
      document.getElementById('code-0')?.focus();
    } catch (error) {
      const errorMessage = error.response?.data?.detail?.message || 
                          error.response?.data?.message ||
                          'Error al reenviar el código.';
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <div className="verify-email-header">
          <div className="verify-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" 
              />
            </svg>
          </div>
          <h1>Verifica tu correo electrónico</h1>
          <p className="verify-description">
            Hemos enviado un código de 6 dígitos a<br />
            <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="verify-form">
          <div className="code-inputs" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                autoFocus={index === 0}
                disabled={loading}
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="verify-button"
            disabled={loading || code.some(c => !c)}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verificando...
              </>
            ) : (
              'Verificar Código'
            )}
          </button>
        </form>

        <div className="verify-footer">
          <p className="resend-text">
            ¿No recibiste el código?{' '}
            {countdown > 0 ? (
              <span className="countdown">Reenviar en {countdown}s</span>
            ) : (
              <button 
                onClick={handleResend}
                className="resend-button"
                disabled={resendLoading}
              >
                {resendLoading ? 'Enviando...' : 'Reenviar código'}
              </button>
            )}
          </p>
          
          <p className="help-text">
            El código expira en 10 minutos
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
