import React, { useState } from 'react';
import './style.css';

/**
 * Componente para calificar con estrellas (interactivo)
 * @param {number} initialRating - Calificación inicial (0-5)
 * @param {function} onChange - Callback cuando cambia la calificación
 * @param {string} size - Tamaño: 'small', 'medium', 'large' (default: 'medium')
 * @param {boolean} disabled - Deshabilitar interacción
 */
const RatingInput = ({ 
  initialRating = 0, 
  onChange,
  size = 'medium',
  disabled = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (disabled) return;
    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (disabled) return;
    setHover(value);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHover(0);
  };

  const currentRating = hover || rating;

  return (
    <div className={`rating-input rating-input--${size} ${disabled ? 'rating-input--disabled' : ''}`}>
      <div className="rating-input__stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={`rating-input__star ${value <= currentRating ? 'rating-input__star--active' : ''}`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            aria-label={`${value} estrella${value > 1 ? 's' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="rating-input__text">
          {rating === 1 && 'Malo'}
          {rating === 2 && 'Regular'}
          {rating === 3 && 'Bueno'}
          {rating === 4 && 'Muy bueno'}
          {rating === 5 && 'Excelente'}
        </span>
      )}
    </div>
  );
};

export default RatingInput;
