import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/api-client';
import './style.css';

export const AdminInventarioPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalIngresos: 0,
    totalPedidos: 0,
    pedidosPendientes: 0,
    pedidosEnviados: 0,
    pedidosEntregados: 0,
    pedidosCancelados: 0,
    totalProductos: 0,
    totalCategorias: 0,
    categorias: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize with default values
      let users = [];
      let orders = [];
      let categories = [];
      let products = [];

      // Fetch users (clients) with error handling
      try {
        const usersResponse = await apiClient.get('/admin/usuarios');
        const usersData = usersResponse.data;
        // API returns {status, data: [...], meta}
        users = Array.isArray(usersData?.data) ? usersData.data : [];
      } catch (err) {
        console.error('Error fetching users:', err);
      }

      // Count all users (backend filters out admins in list endpoint)
      const clientes = users;

      // Fetch orders with error handling
      try {
        const ordersResponse = await apiClient.get('/admin/pedidos');
        const ordersData = ordersResponse.data;
        orders = Array.isArray(ordersData) ? ordersData : (ordersData?.pedidos || ordersData?.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }

      // Count orders by status
      const pedidosPendientes = orders.filter(o => o.estado === 'Pendiente').length;
      const pedidosEnviados = orders.filter(o => o.estado === 'Enviado').length;
      const pedidosEntregados = orders.filter(o => o.estado === 'Entregado');
      const pedidosEntregadosCount = pedidosEntregados.length;
      const pedidosCancelados = orders.filter(o => o.estado === 'Cancelado').length;

      // Calculate total revenue (only delivered orders generate real income)
      const totalIngresos = pedidosEntregados.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);

      // Fetch categories with error handling
      try {
        const categoriesResponse = await apiClient.get('/admin/categorias');
        const categoriesData = categoriesResponse.data;
        categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categorias || categoriesData?.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }

      // Fetch products with error handling
      try {
        const productsResponse = await apiClient.get('/admin/productos');
        const productsData = productsResponse.data;
        products = Array.isArray(productsData) ? productsData : (productsData?.productos || productsData?.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }

      // Calculate sales by category
      const categoriaStats = Array.isArray(categories) ? categories.map(cat => {
        const productosDeCategoria = Array.isArray(products) ? products.filter(p => p.categoria_id === cat.id) : [];
        const productIds = productosDeCategoria.map(p => p.id);
        
        // Count orders with products from this category
        let ventasCategoria = 0;
        if (Array.isArray(orders)) {
          orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach(item => {
                if (productIds.includes(item.producto_id)) {
                  ventasCategoria += item.cantidad || 0;
                }
              });
            }
          });
        }

        return {
          nombre: cat.nombre || 'Sin nombre',
          ventas: ventasCategoria,
          productos: productosDeCategoria.length
        };
      }) : [];

      setStats({
        totalClientes: clientes.length,
        totalIngresos: totalIngresos,
        totalPedidos: pedidosEntregadosCount, // Only count delivered orders
        pedidosPendientes: pedidosPendientes,
        pedidosEnviados: pedidosEnviados,
        pedidosEntregados: pedidosEntregadosCount,
        pedidosCancelados: pedidosCancelados,
        totalProductos: products.length,
        totalCategorias: categories.length,
        categorias: categoriaStats.sort((a, b) => b.ventas - a.ventas)
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-estadisticas-page">
        <div className="page-header">
          <h1 className="page-title">📊 Estadísticas</h1>
        </div>
        <div className="loading-stats">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-estadisticas-page">
        <div className="page-header">
          <h1 className="page-title">📊 Estadísticas</h1>
        </div>
        <div className="error-stats">
          <p>{error}</p>
          <button onClick={loadStatistics} className="btn-retry">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-estadisticas-page">
      <div className="page-header">
        <div>
          <div className="page-badge">📈 Panel de Control</div>
          <div className="page-title-wrapper">
            <svg className="page-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <h1 className="page-title">Estadísticas del Negocio</h1>
          </div>
        </div>
        <button onClick={loadStatistics} className="btn-refresh">
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Actualizar
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-clientes">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Total Clientes</h3>
            <p className="stat-value">{stats.totalClientes}</p>
            <span className="stat-description">Clientes registrados</span>
          </div>
        </div>

        <div className="stat-card stat-ingresos">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Ingresos Totales</h3>
            <p className="stat-value">{formatCurrency(stats.totalIngresos)}</p>
            <span className="stat-description">Desde pedidos entregados</span>
          </div>
        </div>

        <div className="stat-card stat-promedio">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Ticket Promedio</h3>
            <p className="stat-value">
              {formatCurrency(stats.totalPedidos > 0 ? stats.totalIngresos / stats.totalPedidos : 0)}
            </p>
            <span className="stat-description">Por pedido entregado</span>
          </div>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="orders-status-section">
        <h2 className="section-title">Total Pedidos</h2>
        <div className="orders-status-grid">
          <div className="status-card status-pendiente">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="status-content">
              <h3 className="status-label">Pendientes</h3>
              <p className="status-value">{stats.pedidosPendientes}</p>
              <span className="status-description">En espera de procesamiento</span>
            </div>
          </div>

          <div className="status-card status-enviado">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div className="status-content">
              <h3 className="status-label">Enviados</h3>
              <p className="status-value">{stats.pedidosEnviados}</p>
              <span className="status-description">En camino al cliente</span>
            </div>
          </div>

          <div className="status-card status-entregado">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="status-content">
              <h3 className="status-label">Entregados</h3>
              <p className="status-value">{stats.pedidosEntregados}</p>
              <span className="status-description">Completados exitosamente</span>
            </div>
          </div>

          <div className="status-card status-cancelado">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="status-content">
              <h3 className="status-label">Cancelados</h3>
              <p className="status-value">{stats.pedidosCancelados}</p>
              <span className="status-description">No procesados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Sales */}
      <div className="category-stats-section">
        <h2 className="section-title">Ventas por Categoría</h2>
        
        {stats.categorias.length === 0 ? (
          <div className="no-data">
            <p>No hay datos de ventas por categoría</p>
          </div>
        ) : (
          <div className="category-stats-grid">
            {stats.categorias.map((cat, index) => (
              <div key={index} className="category-stat-card">
                <div className="category-rank">#{index + 1}</div>
                <div className="category-info">
                  <h3 className="category-name">{cat.nombre}</h3>
                  <div className="category-metrics">
                    <div className="category-metric">
                      <span className="metric-label">Ventas:</span>
                      <span className="metric-value">{cat.ventas} unidades</span>
                    </div>
                    <div className="category-metric">
                      <span className="metric-label">Productos:</span>
                      <span className="metric-value">{cat.productos}</span>
                    </div>
                  </div>
                </div>
                <div className="category-bar-container">
                  <div 
                    className="category-bar" 
                    style={{
                      width: `${stats.categorias[0].ventas > 0 ? (cat.ventas / stats.categorias[0].ventas) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

