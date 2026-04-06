import React from 'react';
import { useCart } from '../../context/CartContext';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80';

const CATEGORY_ICONS = {
  sport: 'bi-lightning-charge-fill',
  cruiser: 'bi-star-fill',
  adventure: 'bi-compass-fill',
  electric: 'bi-battery-charging',
  scooter: 'bi-scooter',
  touring: 'bi-map-fill',
};

export default function BikeCard({ bike }) {
  const { addToCart, cart } = useCart();
  const inCart = cart.some((i) => i.id === bike.id);
  const icon = CATEGORY_ICONS[bike.category] || 'bi-bicycle';

  return (
    <div className="bb-card h-100 d-flex flex-column">
      <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
        <img
          src={bike.image_url || PLACEHOLDER}
          alt={bike.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div
          style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(0,0,0,0.75)', borderRadius: 6,
            padding: '3px 8px',
          }}
        >
          <span className="bb-badge bb-badge-accent">
            <i className={`bi ${icon} me-1`} />
            {bike.category}
          </span>
        </div>
        <div
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          <span className={`bb-badge ${bike.available ? 'bb-badge-green' : 'bb-badge-red'}`}>
            {bike.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="bb-muted" style={{ fontSize: '0.75rem', fontFamily: 'var(--bb-font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {bike.brand}
        </div>
        <h6 className="bb-display mt-1 mb-0" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bike.name}</h6>
        <div className="bb-muted" style={{ fontSize: '0.8rem' }}>{bike.model}</div>

        <div className="d-flex gap-3 my-2" style={{ fontSize: '0.78rem', color: 'var(--bb-text-muted)' }}>
          {bike.engine_cc && <span><i className="bi bi-gear me-1" />{bike.engine_cc}cc</span>}
          {bike.mileage && <span><i className="bi bi-fuel-pump me-1" />{bike.mileage} km/l</span>}
          {bike.fuel_type && <span><i className="bi bi-droplet me-1" />{bike.fuel_type}</span>}
        </div>

        {bike.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--bb-text-muted)', lineHeight: 1.5, flexGrow: 1 }}>
            {bike.description.slice(0, 80)}{bike.description.length > 80 ? '…' : ''}
          </p>
        )}

        <div className="d-flex align-items-center justify-content-between mt-3">
          <div>
            <div className="bb-accent-text bb-display" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              ₹{bike.price_per_day.toLocaleString()}
              <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--bb-text-muted)' }}>/day</span>
            </div>
          </div>
          <button
            onClick={() => addToCart(bike)}
            disabled={inCart || !bike.available}
            className="btn-accent btn"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}
          >
            {inCart ? <><i className="bi bi-check2 me-1" />Added</> : <><i className="bi bi-bag-plus me-1" />Book</>}
          </button>
        </div>
      </div>
    </div>
  );
}