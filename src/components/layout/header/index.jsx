import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../../ui/index';
import { useAuth } from '../../../hooks/use-auth';
import { isAdminUser } from '../../../utils/auth';
import { useCartModule } from '../../../modules/cart/context/CartContext';
import './style.css';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCartModule();
  const isAdmin = isAdminUser(user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <Link to="/" className="header-logo" aria-label="Inicio">
          <img src="/logo3.webp" alt="Soft PetPlace" className="logo-image" />
          <span className="logo-text">
            <span className="logo-main">Soft PetPlace</span>
          </span>
        </Link>

        <nav className="header-nav" role="navigation" aria-label="Navegación principal">
        </nav>

        <div className="header-actions">
          <Link to="/carrito" className="header-cart-link" aria-label="Carrito de compras">
            <span className="cart-icon-wrapper">
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && (
                <span className="header-cart-badge" aria-label={`${itemCount} productos en el carrito`}>
                  {itemCount}
                </span>
              )}
            </span>
            <span className="cart-text">Carrito</span>
          </Link>

          {isAuthenticated && (
            <Link to="/mis-pedidos" className="header-cart-link" aria-label="Mis pedidos">
              <span className="cart-icon-wrapper">
                <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-9M14 3v4M6 21V10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11M3 21h18"/>
                </svg>
              </span>
              <span className="cart-text">Mis Pedidos</span>
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link to="/admin/pedidos" className="header-cart-link" aria-label="Administración">
              <span className="cart-icon-wrapper">
                <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m5.2-14.2l-4.2 4.2m-1.8 1.8l-4.2 4.2m12.4 0l-4.2-4.2m-1.8-1.8l-4.2-4.2"/>
                </svg>
              </span>
              <span className="cart-text">Administración</span>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <div className="header-user">
                <span className="user-icon">👤</span>
                <span className="user-name">Hola, {user?.nombreCompleto?.split(' ')[0] || user?.email?.split('@')[0]}</span>
              </div>
              <Button variant="ghost" size="small" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/registro">
                <Button variant="ghost" size="small">Registro</Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="small">Iniciar Sesión</Button>
              </Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {isAuthenticated && isAdmin && (
            <Link to="/admin/pedidos" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-icon">⚙️</span>
              Administración
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

