
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/index';
import ListarProductos from './listar';
import './style.css';

export const AdminProductosPage = () => {
  return (
    <div className="admin-productos-page">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-badge">🛍️ Catálogo Administrativo</div>
          <div className="page-title-wrapper">
            <svg className="page-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h1 className="page-title">Gestión de Productos</h1>
          </div>
        </div>
        <Link to="/admin/productos/nuevo" className="btn-create-link">
          <Button variant="primary" className="btn-create-product">
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Crear Nuevo Producto
          </Button>
        </Link>
      </div>
        <ListarProductos />
    </div>
  );
};
