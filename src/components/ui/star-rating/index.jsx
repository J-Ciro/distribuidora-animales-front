import React from 'react';
import './style.css';

/**
 * Componente para mostrar estrellas de calificación (solo visualización)
 * @param {number} rating - Calificación (0-5)
 * @param {number} maxStars - Número máximo de estrellas (default: 5)
 * @param {number} totalReviews - Total de reseñas (opcional)
 * @param {string} size - Tamaño: 'small', 'medium', 'large' (default: 'medium')
 * @param {boolean} showCount - Mostrar conteo de reseñas (default: true)
 */
const StarRating = ({ 
  rating = 0, 
  maxStars = 5, 
  totalReviews = null,
  size = 'medium',
  showCount = true 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`star-rating star-rating--${size}`} role="img" aria-label={`Calificación: ${rating} de ${maxStars} estrellas`}>
      <div className="star-rating__stars">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="star star--full" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="star star--half" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`half-grad-${rating}`}>
                <stop offset="50%" stopColor="#FBBF24"/>
                <stop offset="50%" stopColor="#E5E7EB"/>
              </linearGradient>
            </defs>
            <path fill={`url(#half-grad-${rating})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="star star--empty" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
      {showCount && (
        <span className="star-rating__text">
          {rating > 0 ? `${rating.toFixed(1)}` : 'Sin calificación'}
          {totalReviews !== null && totalReviews > 0 && ` (${totalReviews})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
