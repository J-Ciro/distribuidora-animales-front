import React, { useEffect, useState } from 'react';
import { productosService } from '../../../services/productos-service';
import { useToast } from '../../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import './style.css';

const ListarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    
    // Auto-refresh every 3 seconds for the first 10 seconds after mounting
    // This helps catch newly created products from RabbitMQ worker
    let refreshCount = 0;
    const maxRefreshes = 3;
    const refreshInterval = setInterval(() => {
      refreshCount++;
      if (refreshCount <= maxRefreshes) {
        fetchProductos();
      } else {
        clearInterval(refreshInterval);
      }
    }, 3000);

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const data = await productosService.getAllProducts();
      setProductos(data);
    } catch (error) {
      if (!error?._toastsShown) toast.error(error.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await productosService.eliminarProducto(id);
      toast.success('Producto eliminado correctamente');
      fetchProductos();
    } catch (error) {
      if (!error?._toastsShown) toast.error(error.message || 'Error al eliminar producto');
    }
  };

  return (
    <div className="admin-productos-listar">
      <div className="lista-header">
        <svg className="lista-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
        <h2>Lista de Productos</h2>
      </div>
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="productos-table">
            <thead>
              <tr>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    Imagen
                  </div>
                </th>
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
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    Nombre
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    Categoría
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    Precio
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    Stock
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
            {productos.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  <div className="empty-state">
                    <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                    <p>No hay productos registrados</p>
                  </div>
                </td>
              </tr>
            ) : (
              productos.map((prod) => {
                // Get first image from imagenes array
                const primeraImagen = prod.imagenes && prod.imagenes.length > 0 ? prod.imagenes[0] : null;
                const imagenUrl = primeraImagen 
                  ? (primeraImagen.startsWith('http') ? primeraImagen : `http://localhost:8000${primeraImagen}`)
                  : null;
                
                return (
                  <tr key={prod.id}>
                    <td>
                      <div className="product-image-wrapper">
                        {imagenUrl ? (
                          <img 
                            src={imagenUrl} 
                            alt={prod.nombre} 
                            className="product-image"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="no-image">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{prod.id}</td>
                    <td>{prod.nombre}</td>
                    <td>{prod.categoria?.nombre || (typeof prod.categoria === 'string' ? prod.categoria : '')}</td>
                    <td>{prod.precio}</td>
                    <td>{prod.cantidad_disponible}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-editar" onClick={() => navigate(`/admin/productos/editar/${prod.id}`)}>
                          <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Editar
                        </button>
                        <button className="btn-eliminar" onClick={() => handleEliminar(prod.id)}>
                          <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default ListarProductos;
