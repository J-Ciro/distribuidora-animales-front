````markdown
# 📦 Instrucciones Técnicas para Implementar la HU Frontend: "Mis Pedidos - Vista de Cliente"

**Objetivo**: Implementar la interfaz frontend en React para que un cliente autenticado pueda visualizar todos sus pedidos, ver el detalle de cada pedido, rastrear el estado de envío y acceder al historial completo de compras. Este documento complementa la HU de backend.

---

## ⚙️ Alcance Frontend

### Componentes React
- **MyOrdersPage**: Página principal con lista de pedidos
- **OrderCard**: Tarjeta resumida de cada pedido
- **OrderDetailModal**: Modal con detalle completo y tracking
- **OrderStatusBadge**: Badge con color por estado
- **OrderTimeline**: Componente de seguimiento visual
- **EmptyOrdersState**: Estado vacío cuando no hay pedidos

### Servicios
- **pedidos-service.js**: Cliente API para endpoints de pedidos

---

## 🎨 Componentes Detallados

### 1. **MyOrdersPage Component**

**Ubicación**: `src/pages/MyOrdersPage.jsx`

**Ruta**: `/mi-cuenta/pedidos` o `/mis-pedidos`

**Código Completo**:
```jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { pedidosService } from '../services/pedidos-service';
import OrderCard from '../components/OrderCard';
import OrderDetailModal from '../components/OrderDetailModal';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filterEstado, setFilterEstado] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, [filterEstado, page]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getMyOrders({
        skip: (page - 1) * 20,
        limit: 20,
        estado: filterEstado || undefined
      });
      
      setPedidos(data.data || data);
      setHasMore((data.meta?.total || 0) > page * 20);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error(error.response?.data?.message || 'Error al cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (pedidoId) => {
    try {
      const detail = await pedidosService.getMyOrderDetail(pedidoId);
      setSelectedPedido(detail.data || detail);
      setDetailModalOpen(true);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      toast.error(error.response?.data?.message || 'Error al cargar detalle del pedido');
    }
  };

  const handleFilterChange = (newEstado) => {
    setFilterEstado(newEstado);
    setPage(1);
  };

  return (
    <div className="mis-pedidos-page">
      <div className="page-header">
        <h1>Mis Pedidos</h1>
        <p className="subtitle">Historial completo de tus compras</p>
      </div>

      {/* Filtros */}
      <div className="filters">
        <select 
          value={filterEstado} 
          onChange={(e) => handleFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente de envío">Pendiente de envío</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {/* Lista de pedidos */}
      {loading && <Spinner />}
      
      {!loading && pedidos.length === 0 && (
        <EmptyState 
          icon="📦"
          title="No tienes pedidos aún"
          message="Explora nuestro catálogo y realiza tu primera compra"
          actionText="Ver Productos"
          actionLink="/productos"
        />
      )}

      {!loading && pedidos.length > 0 && (
        <>
          <div className="orders-list">
            {pedidos.map(pedido => (
              <OrderCard 
                key={pedido.id}
                pedido={pedido}
                onViewDetail={() => handleViewDetail(pedido.id)}
              />
            ))}
          </div>

          {/* Paginación */}
          {hasMore && (
            <div className="pagination">
              <button 
                onClick={() => setPage(p => p + 1)}
                className="btn btn-secondary"
              >
                Cargar Más
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalle */}
      <OrderDetailModal 
        isOpen={detailModalOpen}
        pedido={selectedPedido}
        onClose={() => setDetailModalOpen(false)}
        onRefresh={fetchPedidos}
      />
    </div>
  );
};

export default MyOrdersPage;
```

**Estado**:
```javascript
{
  pedidos: [],              // Array de pedidos del usuario
  loading: true,            // Estado de carga
  selectedPedido: null,     // Pedido seleccionado para ver detalle
  detailModalOpen: false,   // Modal abierto/cerrado
  filterEstado: '',         // Filtro por estado
  page: 1,                  // Página actual
  hasMore: true             // Hay más pedidos para cargar
}
```

---

### 2. **OrderCard Component**

**Ubicación**: `src/components/OrderCard.jsx`

```jsx
import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import './OrderCard.css';

const OrderCard = ({ pedido, onViewDetail }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h3>Pedido #{pedido.id}</h3>
          <span className="order-date">{formatDate(pedido.fecha_creacion)}</span>
        </div>
        <OrderStatusBadge estado={pedido.estado} />
      </div>

      <div className="order-body">
        <div className="order-summary">
          <div className="summary-item">
            <span className="label">Total:</span>
            <span className="value total">${pedido.total?.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Items:</span>
            <span className="value">{pedido.items_count}</span>
          </div>
          {pedido.fecha_entrega && (
            <div className="summary-item">
              <span className="label">Entregado:</span>
              <span className="value">{formatDate(pedido.fecha_entrega)}</span>
            </div>
          )}
          {pedido.fecha_estimada_entrega && pedido.estado === 'Enviado' && (
            <div className="summary-item">
              <span className="label">Entrega estimada:</span>
              <span className="value">
                {new Date(pedido.fecha_estimada_entrega).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
        </div>

        <div className="order-address">
          <span className="label">📍 Dirección:</span>
          <span className="value">{pedido.direccion_envio}</span>
        </div>
      </div>

      <div className="order-footer">
        <button 
          onClick={onViewDetail}
          className="btn btn-primary btn-sm"
        >
          Ver Detalle
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
```

---

### 3. **OrderStatusBadge Component**

**Ubicación**: `src/components/OrderStatusBadge.jsx`

```jsx
import React from 'react';
import './OrderStatusBadge.css';

const OrderStatusBadge = ({ estado }) => {
  const getStatusConfig = (estado) => {
    const configs = {
      'Pendiente de envío': {
        color: 'warning',
        icon: '⏳',
        label: 'Pendiente de envío'
      },
      'Enviado': {
        color: 'info',
        icon: '🚚',
        label: 'En camino'
      },
      'Entregado': {
        color: 'success',
        icon: '✅',
        label: 'Entregado'
      },
      'Cancelado': {
        color: 'danger',
        icon: '❌',
        label: 'Cancelado'
      }
    };
    return configs[estado] || { color: 'secondary', icon: '📦', label: estado };
  };

  const config = getStatusConfig(estado);

  return (
    <span className={`badge badge-${config.color}`}>
      <span className="badge-icon">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
```

---

### 4. **OrderDetailModal Component**

**Ubicación**: `src/components/OrderDetailModal.jsx`

```jsx
import React from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';
import { pedidosService } from '../services/pedidos-service';
import './OrderDetailModal.css';

const OrderDetailModal = ({ isOpen, pedido, onClose, onRefresh }) => {
  if (!isOpen || !pedido) return null;

  const handleCancelOrder = async () => {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas cancelar este pedido?\nEsta acción no se puede deshacer.'
    );
    
    if (!confirmacion) return;
    
    try {
      await pedidosService.cancelMyOrder(pedido.id, {
        motivo: 'Cancelado por el cliente desde la interfaz web'
      });
      toast.success('Pedido cancelado exitosamente');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      toast.error(error.response?.data?.message || 'Error al cancelar el pedido');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="order-detail-modal">
        <div className="modal-header">
          <div>
            <h2>Pedido #{pedido.id}</h2>
            <p className="order-date">
              {new Date(pedido.fecha_creacion).toLocaleString('es-ES')}
            </p>
          </div>
          <OrderStatusBadge estado={pedido.estado} />
        </div>

        <div className="modal-body">
          {/* Información general */}
          <section className="order-info-section">
            <h3>Información del Pedido</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Total:</label>
                <span className="total-amount">{formatCurrency(pedido.total)}</span>
              </div>
              <div className="info-item">
                <label>Dirección de Envío:</label>
                <span>{pedido.direccion_envio}</span>
              </div>
              {pedido.fecha_actualizacion && (
                <div className="info-item">
                  <label>Última actualización:</label>
                  <span>
                    {new Date(pedido.fecha_actualizacion).toLocaleString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Items del pedido */}
          <section className="order-items-section">
            <h3>Productos ({pedido.items?.length || 0})</h3>
            <div className="items-list">
              {pedido.items?.map(item => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.producto_imagen || '/placeholder-product.png'} 
                    alt={item.producto_nombre}
                    className="item-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                  <div className="item-info">
                    <h4>{item.producto_nombre}</h4>
                    <p className="item-quantity">Cantidad: {item.cantidad}</p>
                    <p className="item-price">
                      {formatCurrency(item.precio_unitario)} c/u
                    </p>
                  </div>
                  <div className="item-subtotal">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="items-total">
              <span className="total-label">Total:</span>
              <span className="total-value">{formatCurrency(pedido.total)}</span>
            </div>
          </section>

          {/* Tracking / Historial de estados */}
          {pedido.historial_estado && pedido.historial_estado.length > 0 && (
            <section className="order-tracking-section">
              <h3>Seguimiento del Pedido</h3>
              <OrderTimeline historial={pedido.historial_estado} />
            </section>
          )}

          {/* Acciones */}
          <section className="order-actions-section">
            {pedido.puede_calificar && pedido.estado === 'Entregado' && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  // Navegar a página de calificaciones
                  window.location.href = `/calificar-productos/${pedido.id}`;
                }}
              >
                ⭐ Calificar Productos
              </button>
            )}

            {pedido.estado === 'Pendiente de envío' && (
              <button 
                className="btn btn-danger btn-outline"
                onClick={handleCancelOrder}
              >
                ❌ Cancelar Pedido
              </button>
            )}
          </section>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
```

---

### 5. **OrderTimeline Component**

**Ubicación**: `src/components/OrderTimeline.jsx`

```jsx
import React from 'react';
import './OrderTimeline.css';

const OrderTimeline = ({ historial }) => {
  if (!historial || historial.length === 0) {
    return <p className="no-tracking">No hay información de seguimiento disponible.</p>;
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="tracking-timeline">
      {historial.map((estado, index) => (
        <div 
          key={index} 
          className={`timeline-item ${index === historial.length - 1 ? 'active' : 'completed'}`}
        >
          <div className="timeline-marker">
            {index === historial.length - 1 ? '🔵' : '✅'}
          </div>
          <div className="timeline-content">
            <h4>{estado.estado}</h4>
            <p className="timeline-date">{formatDateTime(estado.fecha)}</p>
            {estado.comentario && (
              <p className="timeline-comment">{estado.comentario}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
```

---

## 📡 Servicio de API Frontend

**Ubicación**: `src/services/pedidos-service.js`

```javascript
import apiClient from './api-client';

class PedidosService {
  /**
   * Obtener todos los pedidos del usuario autenticado
   * @param {Object} params - skip, limit, estado
   * @returns {Promise<Object>} { data: [...], meta: {...} }
   */
  async getMyOrders({ skip = 0, limit = 20, estado } = {}) {
    try {
      const response = await apiClient.get('/pedidos/mis-pedidos', {
        params: { skip, limit, estado }
      });
      return response.data;
    } catch (error) {
      console.error('Error en getMyOrders:', error);
      throw error;
    }
  }

  /**
   * Obtener detalle completo de un pedido específico
   * @param {number} pedidoId 
   * @returns {Promise<Object>} Pedido con items y tracking
   */
  async getMyOrderDetail(pedidoId) {
    try {
      const response = await apiClient.get(`/pedidos/mis-pedidos/${pedidoId}`);
      return response.data;
    } catch (error) {
      console.error('Error en getMyOrderDetail:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de estados de un pedido
   * @param {number} pedidoId 
   * @returns {Promise<Array>} Historial de estados
   */
  async getMyOrderHistory(pedidoId) {
    try {
      const response = await apiClient.get(`/pedidos/mis-pedidos/${pedidoId}/historial`);
      return response.data;
    } catch (error) {
      console.error('Error en getMyOrderHistory:', error);
      throw error;
    }
  }

  /**
   * Cancelar un pedido (solo si está en 'Pendiente de envío')
   * @param {number} pedidoId 
   * @param {Object} data - { motivo: string }
   * @returns {Promise<Object>} Confirmación
   */
  async cancelMyOrder(pedidoId, data) {
    try {
      const response = await apiClient.post(
        `/pedidos/mis-pedidos/${pedidoId}/cancelar`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error en cancelMyOrder:', error);
      throw error;
    }
  }
}

export const pedidosService = new PedidosService();
```

---

## 🎨 Estilos CSS Completos

### MyOrdersPage.css:
```css
.mis-pedidos-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.filters {
  margin-bottom: 24px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 200px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination {
  margin-top: 24px;
  text-align: center;
}
```

### OrderCard.css:
```css
.order-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.order-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.order-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.order-body {
  margin-bottom: 16px;
}

.order-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item .label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.summary-item .value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.summary-item .value.total {
  color: #10b981;
  font-size: 1.25rem;
}

.order-address {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 0.875rem;
}

.order-address .label {
  font-weight: 500;
  color: #6b7280;
  margin-right: 8px;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
}
```

### OrderStatusBadge.css:
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-icon {
  font-size: 1rem;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-info {
  background: #dbeafe;
  color: #1e40af;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge-secondary {
  background: #f3f4f6;
  color: #4b5563;
}
```

### OrderDetailModal.css:
```css
.order-detail-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.order-detail-modal h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.order-detail-modal .order-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-info-section,
.order-items-section,
.order-tracking-section,
.order-actions-section {
  margin-top: 24px;
}

.order-info-section h3,
.order-items-section h3,
.order-tracking-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-item span {
  font-size: 1rem;
  color: #1f2937;
}

.total-amount {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #10b981 !important;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.item-quantity,
.item-price {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 4px 0;
}

.item-subtotal {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  align-self: center;
}

.items-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 2px solid #e5e7eb;
}

.total-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: #6b7280;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
}

.order-actions-section {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}
```

### OrderTimeline.css:
```css
.tracking-timeline {
  position: relative;
  padding-left: 40px;
}

.timeline-item {
  position: relative;
  padding-bottom: 32px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -25px;
  top: 24px;
  bottom: -8px;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-marker {
  position: absolute;
  left: -34px;
  top: 0;
  font-size: 1.25rem;
}

.timeline-item.active .timeline-marker {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.timeline-content h4 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.timeline-date {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.timeline-comment {
  color: #4b5563;
  font-size: 0.875rem;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 6px;
}

.no-tracking {
  color: #9ca3af;
  font-style: italic;
}
```

---

## 📱 Responsividad

```css
@media (max-width: 768px) {
  .mis-pedidos-page {
    padding: 16px;
  }

  .order-summary {
    grid-template-columns: 1fr;
  }

  .order-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .item-image {
    width: 100px;
    height: 100px;
  }

  .order-actions-section {
    flex-direction: column;
  }

  .order-actions-section .btn {
    width: 100%;
  }
}
```

---

## ✅ Criterios de Aceptación Frontend

### AC 1: Visualización de pedidos
- **Dado**: Usuario autenticado accede a `/mis-pedidos`
- **Cuando**: Página carga
- **Entonces**: Ver lista de pedidos ordenados por fecha (más recientes primero)

### AC 2: Detalle de pedido
- **Dado**: Usuario hace clic en "Ver Detalle"
- **Cuando**: Modal se abre
- **Entonces**: Ver productos, totales, dirección y tracking completo

### AC 3: Timeline de estados
- **Dado**: Pedido tiene historial de estados
- **Cuando**: Usuario ve detalle
- **Entonces**: Timeline visual con fechas y comentarios

### AC 4: Cancelar pedido
- **Dado**: Pedido en estado "Pendiente de envío"
- **Cuando**: Usuario hace clic en "Cancelar"
- **Entonces**: Solicitar confirmación y actualizar estado si acepta

### AC 5: Filtros por estado
- **Dado**: Usuario selecciona un estado en el filtro
- **Cuando**: Dropdown cambia
- **Entonces**: Lista se actualiza mostrando solo pedidos de ese estado

---

## ✅ Checklist Técnico Frontend

- [ ] Página `MyOrdersPage` con routing
- [ ] Componente `OrderCard` implementado
- [ ] Componente `OrderDetailModal` implementado
- [ ] Componente `OrderStatusBadge` implementado
- [ ] Componente `OrderTimeline` implementado
- [ ] Servicio `pedidos-service.js` completo
- [ ] Manejo de estados de carga (loading)
- [ ] Empty state cuando no hay pedidos
- [ ] Paginación con "Cargar Más"
- [ ] Filtro por estado funcional
- [ ] Formateo de moneda (COP)
- [ ] Formateo de fechas (es-ES)
- [ ] Manejo de errores con toasts
- [ ] Confirmación antes de cancelar
- [ ] Estilos CSS completos
- [ ] Responsive design (mobile)
- [ ] Integración con rutas protegidas (requiere auth)

---

**Archivo**: `HU/INSTRUCTIONS_HU_MY_ORDERS_FRONTEND.md`

````
