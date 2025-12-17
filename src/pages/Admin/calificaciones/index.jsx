import React, { useEffect, useState } from 'react';
import { calificacionesService } from '../../../services/calificaciones-service';
import { Button, Modal } from '../../../components/ui/index';
import StarRating from '../../../components/ui/star-rating';
import { formatDate } from '../../../utils/validation';
import { toast } from '../../../utils/toast';
import './style.css';

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'visible', label: 'Visibles' },
  { value: 'hidden', label: 'Ocultas' }
];

export const AdminCalificacionesPage = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCalificacion, setSelectedCalificacion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCalificaciones();
  }, [filter]);

  const loadCalificaciones = async () => {
    setIsLoading(true);
    try {
      const visibleOnly = filter === 'visible' ? true : filter === 'hidden' ? false : undefined;
      const response = await calificacionesService.getAllRatingsAdmin({ visibleOnly });
      setCalificaciones(response.data || []);
    } catch (error) {
      console.error('Error loading calificaciones:', error);
      if (!error?._toastsShown) {
        toast.error('Error al cargar las calificaciones');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCalificacion = (calificacion) => {
    setSelectedCalificacion(calificacion);
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (calificacionId) => {
    try {
      await calificacionesService.toggleRatingVisibility(calificacionId);
      toast.success('Visibilidad actualizada exitosamente');
      loadCalificaciones();
      
      // Si el modal está abierto, actualizar la calificación seleccionada
      if (selectedCalificacion?.id === calificacionId) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      if (!error?._toastsShown) {
        toast.error('Error al cambiar la visibilidad');
      }
    }
  };

  const handleDelete = async (calificacionId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta calificación?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await calificacionesService.deleteRatingAdmin(calificacionId);
      toast.success('Calificación eliminada exitosamente');
      loadCalificaciones();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting calificacion:', error);
      if (!error?._toastsShown) {
        toast.error('Error al eliminar la calificación');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const getStarsDistribution = () => {
    if (calificaciones.length === 0) return [];
    
    const distribution = [0, 0, 0, 0, 0];
    calificaciones.forEach(cal => {
      if (cal.calificacion >= 1 && cal.calificacion <= 5) {
        distribution[cal.calificacion - 1]++;
      }
    });
    
    return distribution.reverse().map((count, idx) => ({
      stars: 5 - idx,
      count,
      percentage: calificaciones.length > 0 ? (count / calificaciones.length) * 100 : 0
    }));
  };

  const avgRating = calificaciones.length > 0
    ? calificaciones.reduce((sum, cal) => sum + cal.calificacion, 0) / calificaciones.length
    : 0;

  const starsDistribution = getStarsDistribution();

  return (
    <div className="admin-calificaciones-page">
      <div className="page-header">
        <div className="page-badge">⭐ Panel Administrativo</div>
        <div className="page-title-wrapper">
          <svg className="page-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h1 className="page-title">Gestión de Calificaciones</h1>
        </div>
        <p className="page-subtitle">Administra y modera las calificaciones de productos</p>
      </div>

      {/* Estadísticas generales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Calificaciones</p>
            <p className="stat-value">{calificaciones.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Promedio General</p>
            <p className="stat-value">{avgRating.toFixed(1)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <p className="stat-label">Visibles</p>
            <p className="stat-value">
              {calificaciones.filter(c => c.visible).length}
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚫</div>
          <div className="stat-content">
            <p className="stat-label">Ocultas</p>
            <p className="stat-value">
              {calificaciones.filter(c => !c.visible).length}
            </p>
          </div>
        </div>
      </div>

      {/* Distribución de estrellas */}
      {calificaciones.length > 0 && (
        <div className="stars-distribution">
          <h3>Distribución de Calificaciones</h3>
          {starsDistribution.map(item => (
            <div key={item.stars} className="distribution-row">
              <span className="distribution-label">{item.stars} estrellas</span>
              <div className="distribution-bar">
                <div 
                  className="distribution-fill" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="distribution-count">{item.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="filters">
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'primary' : 'outline'}
            size="medium"
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Lista de calificaciones */}
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando calificaciones...</p>
        </div>
      ) : calificaciones.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3>No hay calificaciones</h3>
          <p>No se encontraron calificaciones con ese filtro.</p>
        </div>
      ) : (
        <div className="calificaciones-table-container">
          <table className="calificaciones-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Usuario</th>
                <th>Calificación</th>
                <th>Comentario</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((calificacion) => (
                <tr key={calificacion.id}>
                  <td>{calificacion.id}</td>
                  <td>
                    <div className="product-info">
                      {calificacion.producto_nombre || `Producto #${calificacion.producto_id}`}
                    </div>
                  </td>
                  <td>{calificacion.usuario_nombre || 'Usuario'}</td>
                  <td>
                    <StarRating rating={calificacion.calificacion} showCount={false} size="small" />
                  </td>
                  <td>
                    <div className="comment-preview">
                      {calificacion.comentario ? (
                        calificacion.comentario.length > 50 
                          ? `${calificacion.comentario.substring(0, 50)}...` 
                          : calificacion.comentario
                      ) : (
                        <span className="no-comment">Sin comentario</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(calificacion.fecha_creacion)}</td>
                  <td>
                    <span className={`status-badge ${calificacion.visible ? 'visible' : 'hidden'}`}>
                      {calificacion.visible ? '👁️ Visible' : '🚫 Oculta'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleViewCalificacion(calificacion)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleToggleVisibility(calificacion.id)}
                      >
                        {calificacion.visible ? 'Ocultar' : 'Mostrar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalles */}
      {isModalOpen && selectedCalificacion && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Calificación #${selectedCalificacion.id}`}
          size="medium"
        >
          <div className="calificacion-details">
            <div className="detail-section">
              <h3>Información General</h3>
              <p><strong>Usuario:</strong> {selectedCalificacion.usuario_nombre || 'Usuario'}</p>
              <p><strong>Producto:</strong> {selectedCalificacion.producto_nombre || `Producto #${selectedCalificacion.producto_id}`}</p>
              <p><strong>Pedido:</strong> #{selectedCalificacion.pedido_id}</p>
              <p><strong>Fecha:</strong> {formatDate(selectedCalificacion.fecha_creacion)}</p>
            </div>

            <div className="detail-section">
              <h3>Calificación</h3>
              <StarRating rating={selectedCalificacion.calificacion} showCount={false} size="large" />
            </div>

            {selectedCalificacion.comentario && (
              <div className="detail-section">
                <h3>Comentario</h3>
                <p className="comment-full">{selectedCalificacion.comentario}</p>
              </div>
            )}

            <div className="detail-section">
              <h3>Estado</h3>
              <p>
                <strong>Visible:</strong>{' '}
                <span className={`status-badge ${selectedCalificacion.visible ? 'visible' : 'hidden'}`}>
                  {selectedCalificacion.visible ? '👁️ Sí' : '🚫 No'}
                </span>
              </p>
              <p><strong>Aprobado:</strong> {selectedCalificacion.aprobado ? 'Sí' : 'No'}</p>
            </div>

            <div className="modal-actions">
              <Button
                variant="outline"
                onClick={() => handleToggleVisibility(selectedCalificacion.id)}
              >
                {selectedCalificacion.visible ? 'Ocultar' : 'Mostrar'}
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(selectedCalificacion.id)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
