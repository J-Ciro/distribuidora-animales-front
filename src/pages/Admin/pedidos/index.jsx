import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pedidosService } from '../../../services/pedidos-service';
import { Button, OrderStatusBadge, Modal, Select } from '../../../components/ui/index';
import { formatPrice, formatDate } from '../../../utils/validation';
import { toast } from '../../../utils/toast';
import './style.css';

const ORDER_STATUSES = ['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];
const FILTER_OPTIONS = ['Todos', ...ORDER_STATUSES];

const getValidTransitions = (currentStatus) => {
  const transitions = {
    'Pendiente': [],  // Solo el sistema de pago puede cambiar a 'Pagado'
    'Pagado': ['Enviado', 'Cancelado'],
    'Enviado': ['Entregado', 'Cancelado'],
    'Entregado': [],  // Estado final
    'Cancelado': [],  // Estado final
  };
  return transitions[currentStatus] || [];
};

export const AdminPedidosPage = () => {
  const dispatch = useDispatch();
  const { orders, filter, isLoading } = useSelector((state) => state.pedidos);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      dispatch({ type: 'FETCH_ORDERS_REQUEST' });
      const data = await pedidosService.getAllOrders();
      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: data });
    } catch (error) {
      console.error('Error loading orders:', error);
      dispatch({ type: 'FETCH_ORDERS_FAILURE', payload: error.message });
      if (!error?._toastsShown) toast.error('Error al cargar los pedidos');
    }
  };

  const handleFilterChange = (newFilter) => {
    dispatch({ type: 'SET_ORDER_FILTER', payload: newFilter });
  };

  const handleViewOrder = async (orderId) => {
    try {
      const order = await pedidosService.getAdminOrderById(orderId);
      setSelectedOrder(order);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading order:', error);
      if (!error?._toastsShown) toast.error('Error al cargar el pedido');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const updatedOrder = await pedidosService.updateOrderStatus(orderId, newStatus);
      dispatch({ type: 'UPDATE_ORDER_STATUS_SUCCESS', payload: updatedOrder });
      toast.success('Estado del pedido actualizado exitosamente');
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      if (!error?._toastsShown) toast.error('Error al actualizar el estado del pedido');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = filter === 'Todos'
    ? orders
    : orders.filter(order => order.estado === filter);

  return (
    <div className="admin-pedidos-page">
      <div className="page-header">
        <div className="page-badge">📦 Panel Administrativo</div>
        <div className="page-title-wrapper">
          <svg className="page-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          <h1 className="page-title">Gestión de Pedidos</h1>
        </div>
        <p className="page-subtitle">Administra y actualiza el estado de todos los pedidos</p>
      </div>

      <div className="filters">
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={filter === option ? 'primary' : 'outline'}
            size="medium"
            onClick={() => handleFilterChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando pedidos...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <h3>No hay pedidos</h3>
          <p>No se encontraron pedidos con ese estado.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="9" x2="20" y2="9"/>
                      <line x1="4" y1="15" x2="20" y2="15"/>
                      <line x1="10" y1="3" x2="8" y2="21"/>
                      <line x1="16" y1="3" x2="14" y2="21"/>
                    </svg>
                    ID
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Cliente
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Fecha
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    Total
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Método Pago
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Teléfono
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    Estado
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="19" cy="12" r="1"/>
                      <circle cx="5" cy="12" r="1"/>
                    </svg>
                    Acciones
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const validTransitions = getValidTransitions(order.estado);
                const canEdit = validTransitions.length > 0;

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.clienteNombre}</td>
                    <td>{formatDate(order.fecha_creacion)}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>{order.metodo_pago || 'N/A'}</td>
                    <td>{order.telefono_contacto || 'N/A'}</td>
                    <td>
                      <OrderStatusBadge status={order.estado} />
                    </td>
                    <td>
                      <div className="table-actions">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          Ver
                        </Button>
                        {canEdit && (
                          <Select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusChange(order.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            options={[
                              { value: '', label: 'Cambiar estado' },
                              ...validTransitions.map(status => ({ value: status, label: status }))
                            ]}
                            className="status-select"
                            disabled={isUpdating}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Pedido ${selectedOrder.id}`}
          size="large"
        >
          <div className="order-details">
            <div className="order-detail-section">
              <h3>Cliente</h3>
              <p><strong>Nombre:</strong> {selectedOrder.clienteNombre}</p>
              <p><strong>ID:</strong> {selectedOrder.usuario_id}</p>
            </div>
            
            <div className="order-detail-section">
              <h3>Información de Envío</h3>
              <p><strong>Dirección:</strong> {selectedOrder.direccion_entrega || 'No especificada'}</p>
              {selectedOrder.municipio && <p><strong>Ciudad:</strong> {selectedOrder.municipio}</p>}
              {selectedOrder.departamento && <p><strong>Departamento:</strong> {selectedOrder.departamento}</p>}
              {selectedOrder.pais && <p><strong>País:</strong> {selectedOrder.pais}</p>}
              <p><strong>Teléfono:</strong> {selectedOrder.telefono_contacto || 'No especificado'}</p>
              <p><strong>Método de Pago:</strong> {selectedOrder.metodo_pago || 'No especificado'}</p>
            </div>

            <div className="order-detail-section">
              <h3>Productos</h3>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>Producto #{item.producto_id}</td>
                      <td>{item.cantidad}</td>
                      <td>{formatPrice(item.precio_unitario)}</td>
                      <td>{formatPrice(item.precio_unitario * item.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-detail-section">
              <h3>Resumen del Pedido</h3>
              <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
              <p><strong>Estado:</strong> <OrderStatusBadge status={selectedOrder.estado} /></p>
              <p><strong>Fecha:</strong> {formatDate(selectedOrder.fecha_creacion)}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

