import React from 'react';
import './style.css';
import { Button } from '../ui';

const Hero = ({ title = 'Amor y cuidado para tu mascota', subtitle = 'Alimentos, accesorios y todo lo que necesita para su bienestar', imageUrl }) => {
  const hasImage = Boolean(imageUrl);

  return (
    <section className="site-hero" style={ hasImage ? { backgroundImage: `url(${imageUrl})` } : undefined }>
      <div className="site-hero-overlay">
        <div className="site-hero-container container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span className="badge-text">Los mejores productos para tu mascota</span>
            </div>
            <h1 className="hero-title">
              {title}
              <span className="title-decoration">🐾</span>
            </h1>
            <p className="hero-subtitle">{subtitle}</p>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">Envío rápido</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span className="feature-text">Calidad garantizada</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💜</span>
                <span className="feature-text">Atención personalizada</span>
              </div>
            </div>
            <div className="hero-ctas">
              <a href="#destacados" className="cta-link">
                <Button variant="primary" size="large">
                  <span>Ver Destacados</span>
                  <svg className="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Button>
              </a>
              <a href="/carrito" className="cta-link">
                <Button variant="ghost" size="large">
                  <svg className="cta-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <span>Ir al carrito</span>
                </Button>
              </a>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="decoration-circle decoration-1"></div>
            <div className="decoration-circle decoration-2"></div>
            <div className="decoration-circle decoration-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
