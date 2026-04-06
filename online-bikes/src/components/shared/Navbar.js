import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bb-navbar">
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
        <Link to={isAdmin ? '/admin' : '/'} className="brand">
          BIKE<span>BOOK</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              <span className="bb-muted" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-person-circle me-1" />
                {user.full_name || user.email}
                <span
                  className={`bb-badge ms-2 ${isAdmin ? 'bb-badge-accent' : 'bb-badge-green'}`}
                >
                  {user.role}
                </span>
              </span>

              {!isAdmin && (
                <Link to="/cart" className="btn btn-outline-accent btn-sm position-relative">
                  <i className="bi bi-bag" />
                  {count > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style={{ background: 'var(--bb-accent)', fontSize: '0.65rem' }}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              )}

              <button onClick={handleLogout} className="btn btn-sm btn-outline-accent">
                <i className="bi bi-box-arrow-right" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-accent btn-sm">Login</Link>
              <Link to="/register" className="btn btn-accent btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}