import React, { useEffect, useState } from 'react';
import { Button, Input } from '../../../components/ui/index';
import { direccionesService } from '../../../services/direcciones-service';
import { toast } from '../../../utils/toast';
import './address-selector.css';

export const AddressSelector = ({ selectedDireccionId, onAddressChange }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    direccion_completa: '',
    municipio: '',
    departamento: '',
    pais: 'Colombia',
    es_principal: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const list = await direccionesService.list();
      setAddresses(list || []);
      // Auto-select primary or first if none selected
      if (!selectedDireccionId && list && list.length > 0) {
        const primary = list.find(a => a.es_principal) || list[0];
        if (primary) onAddressChange(primary.id);
      }
    } catch (e) {
      // errors already toasted by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!formData.direccion_completa || formData.direccion_completa.trim().length < 10) {
      toast.error('La dirección debe tener al menos 10 caracteres');
      return;
    }
    setCreating(true);
    try {
      const payload = {
        direccion_completa: formData.direccion_completa.trim(),
        municipio: formData.municipio.trim() || null,
        departamento: formData.departamento.trim() || null,
        pais: formData.pais.trim() || 'Colombia',
        es_principal: addresses.length === 0 ? true : formData.es_principal,
      };
      const created = await direccionesService.create(payload);
      // Reset form
      setFormData({
        direccion_completa: '',
        municipio: '',
        departamento: '',
        pais: 'Colombia',
        es_principal: false,
      });
      // Update local state instead of reloading to maintain selection
      setAddresses(prev => [...prev, created]);
      // Auto-select the new address
      if (created?.id) {
        onAddressChange(created.id);
      }
      toast.success('Dirección agregada');
      setShowCreateForm(false);
    } catch (e) {
      // already handled by interceptor
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await direccionesService.remove(id);
      // Update local state instead of reloading
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (selectedDireccionId === id) {
        // select another if possible
        const rest = addresses.filter(a => a.id !== id);
        if (rest.length > 0) {
          onAddressChange(rest[0].id);
        } else {
          onAddressChange(null);
        }
      }
      toast.success('Dirección eliminada');
    } catch (e) {
      // handled globally
    }
  };

  return (
    <div className="address-selector">
      {loading ? (
        <div className="address-loading">Cargando direcciones...</div>
      ) : (
        <>
          {/* Header with Add Button */}
          <div className="address-header">
            <h3 className="address-title">Dirección de Entrega *</h3>
            {addresses.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => setShowCreateForm(v => !v)}
              >
                {showCreateForm ? '✕ Cancelar' : '+ Agregar Dirección'}
              </Button>
            )}
          </div>

          {/* Empty State */}
          {addresses.length === 0 && !showCreateForm ? (
            <div className="address-empty-box">
              <p className="address-empty-text">No has seleccionado una dirección de entrega</p>
              <Button
                type="button"
                variant="primary"
                onClick={() => setShowCreateForm(true)}
              >
                + Agregar Dirección
              </Button>
            </div>
          ) : null}

          {/* Address List */}
          {addresses.length > 0 && !showCreateForm && (
            <ul className="address-list">
              {addresses.map(addr => (
                <li key={addr.id} className={`address-item ${selectedDireccionId === addr.id ? 'selected' : ''}`}>
                  <label className="address-radio">
                    <input
                      type="radio"
                      name="direccion_id"
                      checked={selectedDireccionId === addr.id}
                      onChange={() => onAddressChange(addr.id)}
                    />
                    <span className="address-text">
                      {addr.direccion_completa}
                      {addr.es_principal ? ' (Principal)' : ''}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="address-delete"
                    aria-label="Eliminar dirección"
                    onClick={() => handleDelete(addr.id)}
                    title="Eliminar"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Create Form */}
          {showCreateForm && (
            <div className="address-new">
              <div className="address-create-form">
                  <div className="form-field">
                    <label>Dirección Completa *</label>
                    <Input
                      placeholder="Ej: Calle 20 #21-47 Pereira"
                      value={formData.direccion_completa}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccion_completa: e.target.value }))}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Municipio</label>
                      <Input
                        placeholder="Ej: Pereira"
                        value={formData.municipio}
                        onChange={(e) => setFormData(prev => ({ ...prev, municipio: e.target.value }))}
                      />
                    </div>
                    <div className="form-field">
                      <label>Departamento</label>
                      <Input
                        placeholder="Ej: Risaralda"
                        value={formData.departamento}
                        onChange={(e) => setFormData(prev => ({ ...prev, departamento: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>País</label>
                    <Input
                      placeholder="Colombia"
                      value={formData.pais}
                      onChange={(e) => setFormData(prev => ({ ...prev, pais: e.target.value }))}
                    />
                  </div>

                  {addresses.length > 0 && (
                    <div className="form-field-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.es_principal}
                          onChange={(e) => setFormData(prev => ({ ...prev, es_principal: e.target.checked }))}
                        />
                        <span>Establecer como dirección principal</span>
                      </label>
                    </div>
                  )}

                  <div className="form-actions-inline">
                    <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>
                      Cancelar
                    </Button>
                    <Button type="button" onClick={handleCreate} disabled={creating}>
                      {creating ? 'Guardando...' : 'Guardar Dirección'}
                    </Button>
                  </div>
                </div>
              </div>
          )}
        </>
      )}
    </div>
  );
};
