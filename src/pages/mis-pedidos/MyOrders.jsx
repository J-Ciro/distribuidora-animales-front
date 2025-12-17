import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosService } from '../../services/pedidos-service';
import RatingModal from '../../components/RatingModal';
import { Button } from '../../components/ui/index';
import { Badge } from '../../components/ui/badge';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidosService.getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
      if (err.response?.status === 401) {
        setError('Debes iniciar sesión para ver tus pedidos');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Error al cargar los pedidos. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getEstadoClass = (estado) => {
    const classes = {
      'Pendiente': 'status-pending',
      'Enviado': 'status-shipped',
      'Entregado': 'status-delivered',
      'Cancelado': 'status-cancelled'
    };
    return classes[estado] || 'status-default';
  };

  const getEstadoPagoVariant = (estadoPago) => {
    const variants = {
      'Pendiente de Pago': 'warning',
      'Pagado': 'success',
      'paid': 'success',
      'Fallido': 'danger',
      'failed': 'danger',
      'Reembolsado': 'info',
    };
    return variants[estadoPago] || 'default';
  };

  const getEstadoPagoText = (estadoPago) => {
    const texts = {
      'paid': 'Pagado',
      'failed': 'Fallido',
      'Pendiente de Pago': 'Pendiente de Pago',
      'Pagado': 'Pagado',
      'Fallido': 'Fallido',
      'Reembolsado': 'Reembolsado',
    };
    return texts[estadoPago] || estadoPago;
  };

  const handlePayNow = (pedidoId) => {
    navigate(`/checkout/${pedidoId}`);
  };

  const getEstadoIcon = (estado) => {
    const icons = {
      'Pendiente': '⏳',
      'Enviado': '🚚',
      'Entregado': '✅',
      'Cancelado': '❌'
    };
    return icons[estado] || '📦';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleRateProduct = (producto, pedidoId) => {
    setSelectedProduct(producto);
    setSelectedPedidoId(pedidoId);
    setIsRatingModalOpen(true);
  };

  const handleRatingSuccess = () => {
    // Recargar pedidos para reflejar que ya fue calificado
    loadOrders();
  };

  const COSTO_ENVIO = 5000; // Costo de envío estándar en COP

  if (loading) {
    return (
      <div className="mis-pedidos-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-pedidos-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={loadOrders} className="btn-retry">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-pedidos-container">
      <div className="orders-header">
        <div className="orders-badge">📦 Seguimiento de Pedidos</div>
        <div className="orders-title-wrapper">
          <svg className="orders-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7h-9M14 17H5"/>
            <circle cx="17" cy="17" r="3"/>
            <circle cx="7" cy="7" r="3"/>
          </svg>
          <h1 className="orders-title">Mis Pedidos</h1>
        </div>
        <p className="orders-subtitle">Revisa el estado de tus pedidos</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h2>No tienes pedidos aún</h2>
          <p>Cuando realices un pedido, aparecerá aquí</p>
          <button onClick={() => navigate('/')} className="btn-shop">
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Ir a la tienda
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-id-wrapper">
                    <svg className="order-id-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M9 12h6M9 16h6"/>
                    </svg>
                    <h3>Pedido #{order.id}</h3>
                  </div>
                  <div className="order-date-wrapper">
                    <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="order-date">{formatDate(order.fecha_creacion)}</span>
                  </div>
                </div>
                <div className="order-status-badges">
                  <div className={`order-status ${getEstadoClass(order.estado)}`}>
                    <span className="status-icon">{getEstadoIcon(order.estado)}</span>
                    <span className="status-text">{order.estado}</span>
                  </div>
                  {order.estado_pago && (
                    <Badge variant={getEstadoPagoVariant(order.estado_pago)}>
                      {getEstadoPagoText(order.estado_pago)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="order-details">
                {(() => {
                  const subtotal = order.items?.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0) || 0;
                  const totalConEnvio = subtotal + COSTO_ENVIO;
                  
                  return (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">
                          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                          </svg>
                          Subtotal productos:
                        </span>
                        <span className="detail-value">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">
                          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13"/>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                            <circle cx="5.5" cy="18.5" r="2.5"/>
                            <circle cx="18.5" cy="18.5" r="2.5"/>
                          </svg>
                          Costo de envío:
                        </span>
                        <span className="detail-value envio-costo">
                          {formatCurrency(COSTO_ENVIO)}
                        </span>
                      </div>
                      <div className="detail-row total-row">
                        <span className="detail-label">
                          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                          Total del pedido:
                        </span>
                        <span className="detail-value total-amount">{formatCurrency(totalConEnvio)}</span>
                      </div>
                    </>
                  );
                })()}
                <div className="detail-row">
                  <span className="detail-label">
                    <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Método de pago:
                  </span>
                  <span className="detail-value">{order.metodo_pago}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Dirección de entrega:
                  </span>
                  <span className="detail-value">{order.direccion_entrega}</span>
                </div>
                {order.municipio && (
                  <div className="detail-row">
                    <span className="detail-label">Ciudad:</span>
                    <span className="detail-value">
                      {order.municipio}{order.departamento ? `, ${order.departamento}` : ''}
                    </span>
                  </div>
                )}
              </div>

              {order.items && order.items.length > 0 && (
                <div className="order-items">
                  <h4>Productos ({order.items.length})</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={item.id || index} className="order-item">
                        {item.producto_imagen && (
                          <div className="item-image">
                            <img 
                              src={item.producto_imagen} 
                              alt={item.producto_nombre || 'Producto'}
                              onError={(e) => {
                                e.target.src = '/placeholder-product.png';
                              }}
                            />
                          </div>
                        )}
                        <div className="item-details">
                          <p className="item-name">{item.producto_nombre || `Producto #${item.producto_id}`}</p>
                          <p className="item-quantity">Cantidad: {item.cantidad}</p>
                          <p className="item-price-mobile">{formatCurrency(item.precio_unitario * item.cantidad)}</p>
                        </div>
                        <div className="item-right">
                          <div className="item-price">
                            {formatCurrency(item.precio_unitario * item.cantidad)}
                          </div>
                          {order.estado === 'Entregado' && (
                            <div className="item-actions">
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => handleRateProduct({
                                  id: item.producto_id,
                                  nombre: item.producto_nombre || `Producto #${item.producto_id}`,
                                  imagen: item.producto_imagen
                                }, order.id)}
                              >
                                ⭐ Calificar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Action Button */}
              {(order.estado === 'Pendiente' || order.estado_pago === 'Pendiente de Pago') && (
                <div className="order-actions">
                    <div className="payment-notice">
                      <svg className="notice-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span>Este pedido está pendiente de pago. Completa tu pago para procesarlo.</span>
                    </div>
                  <Button 
                    onClick={() => handlePayNow(order.id)}
                    className="btn-pay-now"
                  >
                    💳 Completar Pago
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        producto={selectedProduct}
        pedidoId={selectedPedidoId}
        onSuccess={handleRatingSuccess}
      />
    </div>
  );
};

export default MyOrders;
