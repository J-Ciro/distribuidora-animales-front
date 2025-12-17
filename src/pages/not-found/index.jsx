import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/index';
import './style.css';

export const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Página no encontrada</p>
      <Link to="/">
        <Button variant="primary">Volver al inicio</Button>
      </Link>
    </div>
  );
};

