import React, { useState } from 'react';
import { Modal, Button, Textarea } from '../ui/index';
import RatingInput from '../ui/rating-input';
import { calificacionesService } from '../../services/calificaciones-service';
import { toast } from '../../utils/toast';
import './RatingModal.css';

/**
 * Modal para calificar un producto
 */
const RatingModal = ({ isOpen, onClose, producto, pedidoId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    try {
      const ratingData = {
        producto_id: producto.id,
        pedido_id: pedidoId,
        calificacion: rating,
        comentario: comentario.trim() || null
      };

      await calificacionesService.createRating(ratingData);
      toast.success('¡Gracias por tu calificación!');
      
      // Reset form
      setRating(0);
      setComentario('');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating rating:', error);
      const errorMsg = error.response?.data?.detail || 'Error al enviar la calificación';
      if (!error?._toastsShown) {
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setComentario('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Califica este producto"
      size="medium"
    >
      <div className="rating-modal-content">
        {producto && (
          <div className="product-info-section">
            {producto.imagen && (
              <img 
                src={producto.imagen} 
                alt={producto.nombre}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
            )}
            <h3 className="product-name">{producto.nombre}</h3>
          </div>
        )}

        <div className="rating-section">
          <label className="rating-label">¿Qué te pareció el producto?</label>
          <RatingInput
            initialRating={rating}
            onChange={setRating}
            size="large"
          />
        </div>

        <div className="comment-section">
          <label className="comment-label">
            Cuéntanos más sobre tu experiencia (opcional)
          </label>
          <Textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comparte tu opinión sobre el producto..."
            rows={4}
            maxLength={500}
          />
          <div className="char-count">
            {comentario.length}/500 caracteres
          </div>
        </div>

        <div className="modal-actions">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar calificación'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RatingModal;
