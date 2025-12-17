import React from 'react';
import './StripeErrorBoundary.css';

/**
 * Error Boundary for Stripe payment components
 * Catches and handles errors in Stripe Elements and payment processing
 */
export class StripeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Stripe Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="stripe-error-boundary">
          <div className="stripe-error-boundary__content">
            <div className="stripe-error-boundary__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            
            <h2>Error al Cargar el Sistema de Pagos</h2>
            <p className="stripe-error-boundary__message">
              Ocurrió un error al cargar el sistema de pagos. Por favor, recarga la página o intenta más tarde.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="stripe-error-boundary__details">
                <summary>Detalles del error (solo en desarrollo)</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}

            <div className="stripe-error-boundary__actions">
              <button onClick={this.handleReload} className="btn-reload">
                Recargar Página
              </button>
              <button onClick={this.handleGoBack} className="btn-back">
                Volver Atrás
              </button>
            </div>

            <div className="stripe-error-boundary__help">
              <p>
                Si el problema persiste, por favor{' '}
                <a href="/contact">contáctanos</a> para recibir ayuda.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
