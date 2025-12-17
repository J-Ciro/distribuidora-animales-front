import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../header';
import { Footer } from '../footer';
import { ToastContainer } from '../../ui/toast';
import { useToast } from '../../../hooks/use-toast';
import './style.css';

const adminMenuItems = [
  { 
    path: '/admin/pedidos', 
    label: 'Pedidos', 
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  },
  { 
    path: '/admin/usuarios', 
    label: 'Usuarios', 
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/></svg>
  },
  { 
    path: '/admin/productos', 
    label: 'Productos', 
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  },
  { 
    path: '/admin/categorias', 
    label: 'Categorías', 
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
  },
  { 
    path: '/admin/carrusel', 
    label: 'Carrusel', 
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  },
  { 
    path: '/admin/calificaciones', 
    label: 'Calificaciones', 
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  },
  { 
    path: '/admin/estadisticas', 
    label: 'Estadísticas', 
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
  },
];

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { toasts } = useToast();

  const handleRemoveToast = () => {};

  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-container">
        <aside className="admin-sidebar" role="complementary" aria-label="Menú de administración">
          <nav className="admin-nav">
            <div className="admin-nav-header">
              <svg className="admin-nav-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m5.2-14.2l-4.2 4.2m-1.8 1.8l-4.2 4.2m12.4 0l-4.2-4.2m-1.8-1.8l-4.2-4.2"/>
              </svg>
              <h2 className="admin-nav-title">Administración</h2>
            </div>
            <ul className="admin-nav-list">
              {adminMenuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`admin-nav-link ${ location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="admin-nav-icon">{item.svg}</span>
                    <span className="admin-nav-label">{item.label}</span>
                    {location.pathname === item.path && (
                      <svg className="admin-nav-active-indicator" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="admin-main-content" role="main">
          {children}
        </main>
      </div>
      <Footer />
      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  );
};

