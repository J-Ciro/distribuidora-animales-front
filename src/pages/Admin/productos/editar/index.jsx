import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productosService } from '../../../../services/productos-service';
import { useToast } from '../../../../hooks/use-toast';
import '../style.css';

const MAX_IMAGE_SIZE = 10485760; // 10 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];

const EditarProductoPage = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', peso_gramos: '', stock: '', categoria: '', subcategoria: '', imagenFile: null, imagenUrl: '' });
  const [imagenMode, setImagenMode] = useState("file"); // "file" o "url"
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imagenEliminada, setImagenEliminada] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
      const fetchProducto = async () => {
      try {
        const data = await productosService.getProductById(id);
        setProducto(data);
        
        // Obtener la primera imagen del array imagenes
        const primeraImagen = data.imagenes && data.imagenes.length > 0 ? data.imagenes[0] : null;
        const existingUrl = primeraImagen 
          ? (primeraImagen.startsWith('http') ? primeraImagen : `http://localhost:8000${primeraImagen}`)
          : '';
        
        // Si existe una imagen, determinar el modo
        if (existingUrl) {
          setImagenMode(primeraImagen.startsWith('http') ? 'url' : 'file');
        }
        
        setForm({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          precio: data.precio || '',
          peso_gramos: data.peso_gramos || '',
          stock: data.cantidad_disponible ?? data.stock ?? '',
          categoria: data.categoria?.id || data.categoria_id || data.categoria || '',
          subcategoria: data.subcategoria?.id || data.subcategoria_id || '',
          imagenFile: null,
          imagenUrl: primeraImagen && primeraImagen.startsWith('http') ? primeraImagen : '',
        });
        
        // set preview to existing image if present
        if (existingUrl) {
          setPreviewUrl(existingUrl);
        }
      } catch (error) {
        // toast may change identity between renders; keep effect deps minimal
        // use navigate or console for debug
        console.error('Error al cargar producto', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
      setForm({ ...form, [e.target.name]: file });
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setImagenEliminada(false);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
      // Si es el campo de URL, actualizar preview
      if (e.target.name === 'imagenUrl' && e.target.value.trim()) {
        setPreviewUrl(e.target.value);
        setImagenEliminada(false);
      }
    }
  };

  const handleLimpiarImagen = () => {
    setPreviewUrl(null);
    setForm({ ...form, imagenFile: null, imagenUrl: '' });
    setImagenEliminada(true);
    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    toast.success('Imagen eliminada. Recuerda guardar los cambios.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        peso_gramos: form.peso_gramos ? Number(form.peso_gramos) : undefined,
        categoria_id: form.categoria ? Number(form.categoria) : undefined,
        subcategoria_id: form.subcategoria ? Number(form.subcategoria) : undefined,
        cantidad_disponible: form.stock ? Number(form.stock) : undefined,
      };
      
      // Manejar la imagen según el estado
      if (imagenEliminada) {
        // Si se eliminó la imagen, enviar cadena vacía
        payload.imagenUrl = '';
      } else if (form.imagenFile) {
        // Si hay un archivo nuevo, enviarlo (tiene prioridad)
        payload.imagenFile = form.imagenFile;
      } else if (imagenMode === "url" && form.imagenUrl) {
        // Si hay una URL nueva, enviarla
        payload.imagenUrl = form.imagenUrl;
      }
      
      // Remove undefined fields so backend keeps existing values when not provided
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      await productosService.updateProduct(id, payload);
      toast.success('Producto actualizado');
      navigate('/admin/productos');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        if (!error?._toastsShown) toast.error('Error al actualizar producto');
    }
  };

  if (loading) return <div className="admin-productos-listar"><p>Cargando...</p></div>;
  if (!producto) return <div className="admin-productos-listar"><p>No se encontró el producto</p></div>;

  return (
    <div className="admin-productos-listar">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit} className="form-producto">
        <div>
          <label>Nombre:</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Precio:</label>
          <input name="precio" type="number" value={form.precio} onChange={handleChange} required />
        </div>
        <div>
          <label>Stock (cantidad disponible):</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
        </div>
        <div>
          <label>Categoría (ID):</label>
          <input name="categoria" value={form.categoria} onChange={handleChange} required />
        </div>
        <div>
          <label>Subcategoría (ID):</label>
          <input name="subcategoria" value={form.subcategoria} onChange={handleChange} />
        </div>
        <div>
          <label>Peso (gramos):</label>
          <input name="peso_gramos" type="number" value={form.peso_gramos} onChange={handleChange} />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>
        <div>
          <label>Imagen actual / Preview:</label>
          {previewUrl ? (
            <div style={{ marginBottom: 8 }}>
              <img src={previewUrl} alt="preview" style={{ maxWidth: 260, maxHeight: 180, objectFit: 'cover', borderRadius: 6 }} />
              <div style={{ marginTop: 8 }}>
                <button 
                  type="button" 
                  onClick={handleLimpiarImagen}
                  className="btn-eliminar"
                  style={{ fontSize: '14px', padding: '6px 12px' }}
                >
                  🗑️ Eliminar imagen
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: '#6b7280', marginBottom: 8 }}>No hay imagen</div>
          )}
          
          <div style={{ marginBottom: '12px', marginTop: '12px' }}>
            <label style={{ marginRight: '20px', fontWeight: 'normal' }}>
              <input 
                type="radio" 
                value="file" 
                checked={imagenMode === "file"} 
                onChange={(e) => setImagenMode(e.target.value)}
                style={{ marginRight: '6px' }}
              />
              Subir archivo
            </label>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="radio" 
                value="url" 
                checked={imagenMode === "url"} 
                onChange={(e) => setImagenMode(e.target.value)}
                style={{ marginRight: '6px' }}
              />
              URL de imagen
            </label>
          </div>
          
          {imagenMode === "file" ? (
            <>
              <input 
                name="imagenFile" 
                type="file" 
                accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp" 
                onChange={handleChange} 
              />
              <small style={{ display: 'block', marginTop: '6px', color: '#666' }}>
                Formatos permitidos: JPG, JPEG, PNG, SVG, WebP (máx. 10 MB). La imagen se actualizará al hacer clic en "Guardar cambios".
              </small>
            </>
          ) : (
            <>
              <input 
                name="imagenUrl" 
                type="url" 
                placeholder="https://ejemplo.com/imagen.jpg" 
                value={form.imagenUrl} 
                onChange={handleChange}
                style={{ width: '100%' }}
              />
              <small style={{ display: 'block', marginTop: '6px', color: '#666' }}>
                Formatos permitidos en URL: .jpg, .jpeg, .png, .svg, .webp
              </small>
            </>
          )}
        </div>
        <button type="submit" className="btn-editar">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarProductoPage;
