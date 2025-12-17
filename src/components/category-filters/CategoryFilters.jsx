import React, { useState, useEffect } from 'react';
import { categoriasService } from '../../services/categorias-service';
import './style.css';

const CategoryFilters = ({ onFilterChange, activeFilter }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      let data;
      
      try {
        // Try public endpoint first
        data = await categoriasService.getAllPublic();
      } catch (publicError) {
        console.log('Public endpoint not available, trying admin endpoint');
        // Fallback to admin endpoint if public endpoint doesn't exist yet
        try {
          data = await categoriasService.getAll();
        } catch (adminError) {
          console.error('Both endpoints failed:', { publicError, adminError });
          throw adminError;
        }
      }
      
      // Filtrar solo categorías principales (tipo: 'categoria')
      const categorias = Array.isArray(data) 
        ? data.filter(cat => cat.tipo === 'categoria' || !cat.categoriaId)
        : [];
      
      setCategories(categorias);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterClick = (categoryId) => {
    if (onFilterChange) {
      onFilterChange(categoryId);
    }
  };

  if (isLoading) {
    return (
      <div className="category-filters-loading">
        <div className="filter-skeleton"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="category-filters-container">
      <div className="category-filters-wrapper">
        <button
          className={`category-filter-btn ${!activeFilter ? 'active' : ''}`}
          onClick={() => handleFilterClick(null)}
        >
          <span className="filter-icon">🏠</span>
          <span className="filter-text">Todos</span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-filter-btn ${activeFilter === category.id ? 'active' : ''}`}
            onClick={() => handleFilterClick(category.id)}
          >
            <span className="filter-icon">
              {getCategoryIcon(category.nombre)}
            </span>
            <span className="filter-text">{category.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Helper function to get icon based on category name
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('perro')) return '🐕';
  if (name.includes('gato')) return '🐈';
  if (name.includes('ave') || name.includes('pájaro')) return '🦜';
  if (name.includes('pez') || name.includes('acuario')) return '🐠';
  if (name.includes('roedor') || name.includes('hámster')) return '🐹';
  if (name.includes('reptil')) return '🦎';
  if (name.includes('conejo')) return '🐰';
  if (name.includes('veterinaria') || name.includes('salud')) return '⚕️';
  if (name.includes('juguete')) return '🎾';
  if (name.includes('alimento') || name.includes('comida')) return '🍖';
  if (name.includes('accesorio')) return '🎀';
  if (name.includes('higiene') || name.includes('limpieza')) return '🧼';
  
  return '🐾';
};

export default CategoryFilters;
