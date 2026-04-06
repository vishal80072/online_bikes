import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await authAPI.register({ full_name: form.full_name, email: form.email, password: form.password });
      const { data } = await authAPI.login(form.email, form.password);
      login(data.user, data.access_token, data.refresh_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center page-enter"
      style={{ background: 'var(--bb-bg)' }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 70%)',
      }} />

      <div style={{ width: '100%', maxWidth: 440, padding: '0 1rem' }}>
        <div className="text-center mb-4">
          <div className="bb-display" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            BIKE<span className="bb-accent-text">BOOK</span>
          </div>
          <div className="bb-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Join the Ride
          </div>
        </div>

        <div className="bb-card p-4">
          <h5 className="bb-display mb-1" style={{ fontWeight: 800, fontSize: '1.3rem' }}>Create account</h5>
          <p className="bb-muted mb-4" style={{ fontSize: '0.85rem' }}>Start booking your perfect ride</p>

          {error && (
            <div className="alert mb-3" style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.85rem',
            }}>
              <i className="bi bi-exclamation-circle me-2" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="bb-muted mb-1 d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full Name</label>
              <input className="bb-input" placeholder="John Doe" value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="bb-muted mb-1 d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email *</label>
              <input className="bb-input" type="email" required placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="bb-muted mb-1 d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password *</label>
              <input className="bb-input" type="password" required placeholder="Min 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="bb-muted mb-1 d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Confirm Password *</label>
              <input className="bb-input" type="password" required placeholder="Repeat password"
                value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            </div>

            <button type="submit" className="btn-accent btn w-100" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                : <><i className="bi bi-person-plus me-2" />Create Account</>}
            </button>
          </form>

          <div className="text-center mt-3" style={{ fontSize: '0.85rem' }}>
            <span className="bb-muted">Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--bb-accent)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}