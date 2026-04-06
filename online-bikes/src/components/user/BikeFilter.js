import React from 'react';

const CATEGORIES = ['sport', 'cruiser', 'adventure', 'electric', 'scooter', 'touring'];

export default function BikeFilters({ filters, onChange, onReset }) {
  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 });

  return (
    <div style={{
      background: 'var(--bb-surface)',
      border: '1px solid var(--bb-border)',
      borderRadius: 'var(--bb-radius-lg)',
      padding: '1.25rem',
    }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="bb-display mb-0" style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <i className="bi bi-funnel me-2" />Filters
        </h6>
        <button onClick={onReset} className="btn-outline-accent btn btn-sm" style={{ fontSize: '0.72rem' }}>Reset</button>
      </div>

      <div className="mb-3">
        <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</label>
        <div className="d-flex flex-wrap gap-1 mt-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => set('category', filters.category === c ? '' : c)}
              className="bb-badge"
              style={{
                cursor: 'pointer', border: '1px solid',
                background: filters.category === c ? 'var(--bb-accent)' : 'transparent',
                borderColor: filters.category === c ? 'var(--bb-accent)' : 'var(--bb-border)',
                color: filters.category === c ? 'white' : 'var(--bb-text-muted)',
                textTransform: 'capitalize',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Brand</label>
        <input
          className="bb-input mt-1"
          placeholder="e.g. Royal Enfield"
          value={filters.brand || ''}
          onChange={(e) => set('brand', e.target.value)}
          style={{ fontSize: '0.85rem' }}
        />
      </div>

      <div className="mb-3">
        <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price / Day (₹)</label>
        <div className="d-flex gap-2 mt-1">
          <input
            className="bb-input"
            type="number"
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) => set('min_price', e.target.value)}
            style={{ fontSize: '0.85rem' }}
          />
          <input
            className="bb-input"
            type="number"
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) => set('max_price', e.target.value)}
            style={{ fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <div className="mb-2">
        <label className="bb-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Availability</label>
        <div className="d-flex gap-2 mt-1">
          {[['All', ''], ['Available', 'true'], ['Unavailable', 'false']].map(([label, val]) => (
            <button
              key={label}
              onClick={() => set('available', val)}
              className="bb-badge"
              style={{
                cursor: 'pointer', border: '1px solid',
                background: String(filters.available) === val ? 'var(--bb-accent)' : 'transparent',
                borderColor: String(filters.available) === val ? 'var(--bb-accent)' : 'var(--bb-border)',
                color: String(filters.available) === val ? 'white' : 'var(--bb-text-muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}