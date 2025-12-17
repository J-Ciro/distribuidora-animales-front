import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../ui/product-card';
import './style.css';

const FeaturedSection = ({ limit = 6 }) => {
  const catalog = useSelector((state) => state.productos.catalog || {});

  // Flatten catalog into a products array
  const products = Object.values(catalog).flatMap((subcats) =>
    Object.values(subcats).flat()
  );

  const featured = products.slice(0, limit);

  if (featured.length === 0) return null;

  return (
    <section id="destacados" className="featured-section container">
      <div className="featured-header">
        <div className="featured-header-content">
          <span className="featured-badge">✨ Especial para tu mascota</span>
          <h2 className="featured-title">Productos Destacados</h2>
          <p className="featured-subtitle">
            Los mejores productos seleccionados especialmente para el cuidado y felicidad de tus mascotas
          </p>
        </div>
      </div>
      <div className="featured-grid">
        {featured.map((p) => (
          <ProductCard key={p.id || p._id || p.nombre} product={p} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
