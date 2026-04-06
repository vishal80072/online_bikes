import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import { useCart } from '../../context/CartContext';
import ChatbotWidget from '../../components/shared/ChatbotWidget';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart();

  return (
    <div style={{ background: 'var(--bb-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4 page-enter" style={{ maxWidth: 900 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="bb-display mb-0" style={{ fontWeight: 800, fontSize: '1.8rem' }}>
            <i className="bi bi-bag me-2 bb-accent-text" />Your Cart
          </h2>
          {cart.length > 0 && (
            <button onClick={clearCart} className="btn btn-outline-accent btn-sm">
              <i className="bi bi-trash me-1" /> Clear All
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: 'var(--bb-border)' }} />
            <p className="bb-muted mt-3">Your cart is empty</p>
            <Link to="/" className="btn btn-accent mt-2">
              <i className="bi bi-bicycle me-2" /> Browse Bikes
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {cart.map((item) => (
                  <div key={item.id} className="bb-card p-3 d-flex gap-3 align-items-center">
                    <img
                      src={item.image_url || PLACEHOLDER}
                      alt={item.name}
                      style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                    />
                    <div className="flex-grow-1">
                      <div className="bb-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.brand}</div>
                      <div className="bb-display" style={{ fontWeight: 700, fontSize: '1rem' }}>{item.name}</div>
                      <div className="bb-muted" style={{ fontSize: '0.8rem' }}>
                        <span className="bb-badge bb-badge-accent me-2">{item.category}</span>
                        {item.engine_cc && `${item.engine_cc}cc`}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="bb-accent-text bb-display" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                        ₹{item.price_per_day.toLocaleString()}<span className="bb-muted" style={{ fontSize: '0.72rem', fontWeight: 400 }}>/day</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-sm mt-1"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontSize: '0.75rem' }}
                      >
                        <i className="bi bi-trash" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bb-card p-4" style={{ position: 'sticky', top: 80 }}>
                <h6 className="bb-display mb-3" style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Order Summary
                </h6>
                <div className="d-flex flex-column gap-2 mb-3">
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
                      <span className="bb-muted">{item.name}</span>
                      <span>₹{item.price_per_day.toLocaleString()}/day</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--bb-border)', paddingTop: '0.75rem' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="bb-display" style={{ fontWeight: 700 }}>Total/day</span>
                    <span className="bb-accent-text bb-display" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button className="btn btn-accent w-100 mt-3">
                  <i className="bi bi-calendar-check me-2" /> Confirm Booking
                </button>
                <Link to="/" className="btn btn-outline-accent w-100 mt-2" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-arrow-left me-1" /> Continue Browsing
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <ChatbotWidget />
    </div>
  );
}