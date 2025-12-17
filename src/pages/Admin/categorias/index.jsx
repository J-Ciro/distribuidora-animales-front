import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategorias, createCategoria, createSubcategoria, updateCategoria, deleteCategoria } from '../../../redux/actions/categorias-actions';
import { useToast } from '../../../hooks/use-toast';
import './style.css';

const AdminCategoriasPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items: categorias = [], isLoading: loading } = useSelector(state => state.categorias || { items: [], isLoading: false });

  const [newNombre, setNewNombre] = useState('');
  const [parentForSub, setParentForSub] = useState('');
  const [newSubNombre, setNewSubNombre] = useState('');

  useEffect(() => {
    dispatch(fetchCategorias());
  }, [dispatch]);

  const onCreateCategoria = async () => {
    const nombre = newNombre.trim();
    if (!nombre || nombre.length < 2) return toast.error('Ingrese un nombre válido (mínimo 2 caracteres)');
    try {
      await dispatch(createCategoria(nombre));
      setNewNombre('');
      toast.success('Categoría creada');
      dispatch(fetchCategorias());
    } catch (err) {
      // backend may send structured error
      const code = err?.response?.data?.error || err?.error;
      if (!err?._toastsShown) {
        if (code === 'nombre_duplicado') toast.error('Nombre de categoría ya existe');
        else toast.error(err?.message || 'Error al crear categoría');
      }
    }
  };

  const onCreateSub = async () => {
    const nombre = newSubNombre.trim();
    if (!parentForSub) return toast.error('Seleccione una categoría padre');
    if (!nombre || nombre.length < 2) return toast.error('Ingrese un nombre válido (mínimo 2 caracteres)');
    try {
      await dispatch(createSubcategoria(parentForSub, nombre));
      setNewSubNombre('');
      toast.success('Subcategoría creada');
      dispatch(fetchCategorias());
    } catch (err) {
      const code = err?.response?.data?.error || err?.error;
      if (!err?._toastsShown) {
        if (code === 'nombre_duplicado') toast.error('Nombre de subcategoría ya existe');
        else toast.error(err?.message || 'Error al crear subcategoría');
      }
    }
  };

  const onRename = async (id, nombre) => {
    const value = (nombre || '').trim();
    if (!value || value.length < 2) return toast.error('Nombre inválido (mínimo 2 caracteres)');
    try {
      await dispatch(updateCategoria(id, value));
      toast.success('Categoría actualizada');
      dispatch(fetchCategorias());
    } catch (err) {
      const code = err?.response?.data?.error || err?.error;
      if (!err?._toastsShown) {
        if (code === 'nombre_duplicado') toast.error('Nombre ya existe');
        else toast.error(err?.message || 'Error al actualizar');
      }
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('¿Eliminar categoría? Esta acción eliminará la categoría y sus subcategorías.')) return;
    try {
      await dispatch(deleteCategoria(id));
      toast.success('Categoría eliminada');
      dispatch(fetchCategorias());
    } catch (err) {
      if (!err?._toastsShown) toast.error(err?.message || 'Error al eliminar categoría');
    }
  };

  return (
    <div className="admin-categorias-page">
      <div className="page-header">
        <div className="page-badge">📁 Organización de Catálogo</div>
        <div className="page-title-wrapper">
          <svg className="page-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <h2 className="page-title">Gestión de Categorías</h2>
        </div>
      </div>

      <div className="forms-container">
        <div className="form-card">
          <div className="form-card-header">
            <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <h3>Nueva Categoría</h3>
          </div>
          <div className="form-inline">
            <input value={newNombre} onChange={e => setNewNombre(e.target.value)} placeholder="Nombre de categoría" />
            <button className="btn-crear" onClick={onCreateCategoria}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Crear
            </button>
          </div>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <h3>Nueva Subcategoría</h3>
          </div>
          <div className="form-inline">
            <select value={parentForSub} onChange={e => setParentForSub(e.target.value)}>
              <option value="">Seleccionar categoría padre</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <input value={newSubNombre} onChange={e => setNewSubNombre(e.target.value)} placeholder="Nombre de subcategoría" />
            <button className="btn-crear" onClick={onCreateSub}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Crear subcategoría
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      ) : (
        <div className="categorias-list">
          {(categorias || []).map(cat => (
            <div className="categoria-block" key={cat.id}>
              <div className="categoria-header">
                <div className="categoria-info">
                  <svg className="categoria-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  <div>
                    <strong className="categoria-nombre">{cat.nombre}</strong>
                    <div className="categoria-meta">ID: {cat.id}</div>
                  </div>
                </div>
                <div className="categoria-actions">
                  <InlineRename initial={cat.nombre} onSave={(name) => onRename(cat.id, name)} />
                  <button className="btn-eliminar" onClick={() => onDelete(cat.id)}>
                    <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
              {(cat.subcategorias || []).length > 0 && (
                <ul className="subcategoria-list">
                  {cat.subcategorias.map(sub => (
                    <li key={sub.id}>
                      <svg className="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      <span className="sub-nombre">{sub.nombre}</span>
                      <small className="categoria-meta">(ID: {sub.id})</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InlineRename = ({ initial, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);

  useEffect(() => setValue(initial), [initial]);

  return (
    <div>
      {editing ? (
        <div className="editing-controls">
          <input className="editing-input" value={value} onChange={e => setValue(e.target.value)} />
          <button className="btn-guardar" onClick={() => { onSave(value); setEditing(false); }}>
            <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Guardar
          </button>
          <button className="btn-cancelar" onClick={() => { setValue(initial); setEditing(false); }}>
            <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancelar
          </button>
        </div>
      ) : (
        <button className="btn-editar" onClick={() => setEditing(true)}>
          <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </button>
      )}
    </div>
  );
};

export default AdminCategoriasPage;
export { AdminCategoriasPage };





