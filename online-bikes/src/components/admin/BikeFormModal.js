import React, { useState, useEffect } from 'react';
import { Modal } from 'bootstrap';

const EMPTY = {
  name: '', brand: '', model: '', category: 'sport',
  engine_cc: '', price_per_day: '', price_purchase: '',
  color: '', mileage: '', fuel_type: 'petrol',
  description: '', features: '', image_url: '',
  available: true, stock: 1,
};

export default function BikeFormModal({ show, onClose, onSubmit, bike }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bike) {
      setForm({ ...EMPTY, ...bike, engine_cc: bike.engine_cc || '', price_purchase: bike.price_purchase || '' });
    } else {
      setForm(EMPTY);
    }
  }, [bike, show]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        engine_cc: form.engine_cc ? Number(form.engine_cc) : null,
        price_per_day: Number(form.price_per_day),
        price_purchase: form.price_purchase ? Number(form.price_purchase) : null,
        mileage: form.mileage ? Number(form.mileage) : null,
        stock: Number(form.stock),
      };
      await onSubmit(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block bb-modal" style={{ background: 'rgba(0,0,0,0.7)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title bb-display" style={{ fontWeight: 800, fontSize: '1.2rem' }}>
              {bike ? 'Edit Bike' : 'Add New Bike'}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ maxHeight: '500px' }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Name *</label>
                  <input className="bb-input" required value={form.name} onChange={(e) => set('name', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Brand *</label>
                  <input className="bb-input" required value={form.brand} onChange={(e) => set('brand', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Model *</label>
                  <input className="bb-input" required value={form.model} onChange={(e) => set('model', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Category *</label>
                  <select className="bb-input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                    {['sport', 'cruiser', 'adventure', 'electric', 'scooter', 'touring'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Engine (cc)</label>
                  <input className="bb-input" type="number" value={form.engine_cc} onChange={(e) => set('engine_cc', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Price/Day (₹) *</label>
                  <input className="bb-input" type="number" required value={form.price_per_day} onChange={(e) => set('price_per_day', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Purchase Price (₹)</label>
                  <input className="bb-input" type="number" value={form.price_purchase} onChange={(e) => set('price_purchase', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Color</label>
                  <input className="bb-input" value={form.color} onChange={(e) => set('color', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Mileage (km/l)</label>
                  <input className="bb-input" type="number" value={form.mileage} onChange={(e) => set('mileage', e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Fuel Type</label>
                  <select className="bb-input" value={form.fuel_type} onChange={(e) => set('fuel_type', e.target.value)}>
                    <option value="petrol">Petrol</option>
                    <option value="electric">Electric</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Image URL</label>
                  <input className="bb-input" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://..." />
                </div>
                <div className="col-12">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Description</label>
                  <textarea className="bb-input" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Features</label>
                  <textarea className="bb-input" rows={2} value={form.features} onChange={(e) => set('features', e.target.value)} placeholder="ABS, LED lights, Bluetooth..." />
                </div>
                <div className="col-md-4">
                  <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Stock</label>
                  <input className="bb-input" type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
                </div>
                <div className="col-md-4 d-flex align-items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={form.available}
                    onChange={(e) => set('available', e.target.checked)}
                    style={{ accentColor: 'var(--bb-accent)', width: 16, height: 16 }}
                  />
                  <label htmlFor="available" className="bb-muted" style={{ fontSize: '0.85rem' }}>Available for booking</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-accent" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-accent" disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : (bike ? 'Update Bike' : 'Add Bike')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}