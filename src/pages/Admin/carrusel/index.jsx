import React, { useEffect, useState } from 'react';
import { carouselService } from '../../../services/carousel-service';
import { useToast } from '../../../hooks/use-toast';
import './style.css';

const MAX_IMAGES = 5;
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
const MAX_SIZE = 10485760; // 10MB

const AdminCarruselPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [imagenUrl, setImagenUrl] = useState('');
  const [enlace, setEnlace] = useState('');
  const [orden, setOrden] = useState(images.length + 1);
  const [createdBy, setCreatedBy] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchCarousel();
  }, []);

  const fetchCarousel = async () => {
    setLoading(true);
    try {
      const data = await carouselService.getCarousel();
      setImages(data);
    } catch (error) {
        if (!error?._toastsShown) showToast('Error al cargar el carrusel', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (!ACCEPTED_FORMATS.includes(selected.type) || selected.size > MAX_SIZE) {
      showToast('Formato o tamaño no válido. Usa JPG, PNG, SVG o WebP (máx. 10 MB).', 'error');
      setFile(null);
      return;
    }
    setFile(selected);
    setImagenUrl(''); // Limpiar URL si se selecciona archivo
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (images.length >= MAX_IMAGES) {
      showToast('El carrusel no puede tener más de 5 imágenes.', 'error');
      return;
    }
    if (!orden) {
      showToast('Por favor, especifica el orden de la imagen.', 'error');
      return;
    }
    if (!file && !imagenUrl) {
      showToast('Por favor, proporciona una imagen (archivo o URL).', 'error');
      return;
    }
    if (file && imagenUrl) {
      showToast('Proporciona solo un método: archivo o URL, no ambos.', 'error');
      return;
    }
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (imagenUrl) {
      formData.append('imagen_url', imagenUrl);
    }
    formData.append('orden', orden);
    formData.append('link_url', enlace);
    formData.append('created_by', createdBy);
    try {
      await carouselService.addImage(formData);
      setFile(null);
      setImagenUrl('');
      setEnlace('');
      setOrden(images.length + 2);
      setCreatedBy('');
      // Limpiar el input de archivo
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      fetchCarousel();
      showToast('Imagen añadida al carrusel.', 'success');
    } catch (error) {
      if (!error?._toastsShown) showToast(error.message || 'Error al subir imagen', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await carouselService.deleteImage(id);
      fetchCarousel();
    } catch (error) {
      if (!error?._toastsShown) showToast('Error al eliminar imagen', 'error');
    }
  };

  const handleOrderChange = (id, value) => {
    const val = parseInt(value, 10);
    if (isNaN(val) || val < 1 || val > 5) return;
    setImages((prev) => prev.map(img => img.id === id ? { ...img, orden: val } : img));
  };

  const handleEnlaceChange = (id, value) => {
    setImages((prev) => prev.map(img => img.id === id ? { ...img, enlaceUrl: value } : img));
  };

  const handleSaveOrder = async () => {
    const orderList = images.map(img => ({ id: img.id, orden: img.orden }));
    try {
      await carouselService.reorderImages(orderList);
      fetchCarousel();
      showToast('Orden actualizado', 'success');
    } catch (error) {
      if (!error?._toastsShown) showToast('Error al guardar el orden', 'error');
    }
  };

  const handleUpdateEnlace = async (id, enlaceUrl) => {
    try {
      await carouselService.updateImage(id, { enlaceUrl });
      fetchCarousel();
      showToast('Enlace actualizado', 'success');
    } catch (error) {
      if (!error?._toastsShown) showToast('Error al actualizar enlace', 'error');
    }
  };

  return (
    <div className="admin-carrusel-page">
      <div className="page-header">
        <div className="page-badge">🎨 Gestión Visual</div>
        <div className="page-title-wrapper">
          <svg className="page-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <h2 className="page-title">Gestión del Carrusel</h2>
        </div>
        <p className="page-subtitle">Administra las imágenes del carrusel principal (máximo 5)</p>
      </div>

      <div className="carrusel-preview">
        <div className="preview-header">
          <svg className="preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <h3>Vista Previa</h3>
        </div>
        {images.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>No hay imágenes en el carrusel.</p>
          </div>
        ) : (
          <div className="carrusel-thumbs">
            {images.sort((a, b) => a.orden - b.orden).map(img => (
              <div key={img.id} className="carrusel-thumb">
                <div className="thumb-badge">{img.orden}</div>
                <img src={typeof img.imagen_url === 'string' && img.imagen_url ? (img.imagen_url.startsWith('http') ? img.imagen_url : `http://localhost:8000${img.imagen_url}`) : '/no-image.svg'} alt="miniatura" />
                {img.link_url && (
                  <div className="thumb-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    Enlace activo
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <form className="carrusel-form" onSubmit={handleAddImage}>
        <div className="form-header">
          <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <h3>Añadir Nueva Imagen</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Archivo de Imagen (opcional)
            </label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.svg,.webp" 
              onChange={handleFileChange}
              disabled={!!imagenUrl}
            />
            <small>JPG, PNG, SVG o WebP (máx. 10MB)</small>
          </div>
          <div className="form-group">
            <label>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              URL de Imagen (opcional)
            </label>
            <input 
              type="text" 
              placeholder="https://ejemplo.com/imagen.jpg" 
              value={imagenUrl} 
              onChange={e => {
                setImagenUrl(e.target.value);
                if (e.target.value && file) {
                  setFile(null);
                  const fileInput = document.querySelector('input[type="file"]');
                  if (fileInput) fileInput.value = '';
                }
              }}
              disabled={!!file}
            />
            <small>Proporciona una URL de imagen o sube un archivo</small>
          </div>
          <div className="form-group">
            <label>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Orden
            </label>
            <input type="number" min="1" max="5" placeholder="1-5" value={orden} onChange={e => setOrden(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Enlace (opcional)
            </label>
            <input type="text" placeholder="https://..." value={enlace} onChange={e => setEnlace(e.target.value)} />
          </div>
          <div className="form-group">
            <label>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Creado por (opcional)
            </label>
            <input type="text" placeholder="Nombre" value={createdBy} onChange={e => setCreatedBy(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn-submit">
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Añadir al Carrusel
        </button>
      </form>
      <div className="carrusel-list">
        <div className="list-header">
          <svg className="list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <h3>Imágenes Actuales</h3>
        </div>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando imágenes...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>No hay imágenes en el carrusel.</p>
          </div>
        ) : (
          <>
            <table className="carrusel-table">
              <thead>
                <tr>
                  <th>
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    </svg>
                    Miniatura
                  </th>
                  <th>
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6"/>
                      <line x1="8" y1="12" x2="21" y2="12"/>
                      <line x1="8" y1="18" x2="21" y2="18"/>
                    </svg>
                    Orden
                  </th>
                  <th>
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    </svg>
                    Enlace
                  </th>
                  <th>
                    <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="19" cy="12" r="1"/>
                      <circle cx="5" cy="12" r="1"/>
                    </svg>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {images.sort((a, b) => a.orden - b.orden).map(img => (
                  <tr key={img.id}>
                    <td>
                      <div className="table-image-wrapper">
                        <img src={typeof img.imagen_url === 'string' && img.imagen_url ? (img.imagen_url.startsWith('http') ? img.imagen_url : `http://localhost:8000${img.imagen_url}`) : '/no-image.svg'} alt="miniatura" className="thumb-img" />
                      </div>
                    </td>
                    <td>
                      <input type="number" min="1" max="5" value={img.orden} onChange={e => handleOrderChange(img.id, e.target.value)} className="table-input" />
                    </td>
                    <td>
                      <input type="text" value={img.link_url || ''} onChange={e => handleEnlaceChange(img.id, e.target.value)} onBlur={e => handleUpdateEnlace(img.id, e.target.value)} className="table-input" placeholder="https://..." />
                    </td>
                    <td>
                      <button className="btn-eliminar" onClick={() => handleDelete(img.id)}>
                        <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-guardar" onClick={handleSaveOrder}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Guardar Cambios de Orden
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCarruselPage;


