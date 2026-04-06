import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Navbar from '../../components/shared/Navbar';
import { bikesAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, available: 0, categories: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await bikesAPI.list({ size: 100 });
        const avail = data.items.filter((b) => b.available).length;
        const cats = data.items.reduce((acc, b) => {
          acc[b.category] = (acc[b.category] || 0) + 1;
          return acc;
        }, {});
        setStats({ total: data.total, available: avail, categories: cats });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    { icon: 'bi-bicycle', label: 'Total Bikes', value: stats.total, color: 'var(--bb-accent)' },
    { icon: 'bi-check-circle', label: 'Available', value: stats.available, color: 'var(--bb-green)' },
    { icon: 'bi-x-circle', label: 'Unavailable', value: stats.total - stats.available, color: 'var(--bb-red)' },
    { icon: 'bi-grid', label: 'Categories', value: Object.keys(stats.categories).length, color: '#a78bfa' },
  ];

  return (
    <div style={{ background: 'var(--bb-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 p-4 page-enter">
          <h2 className="bb-display mb-1" style={{ fontWeight: 800, fontSize: '1.8rem' }}>Dashboard</h2>
          <p className="bb-muted mb-4" style={{ fontSize: '0.85rem' }}>Welcome to the BikeBook Admin Console</p>

          {loading ? (
            <div className="bb-spinner"><div className="spinner-border" style={{ color: 'var(--bb-accent)' }} /></div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="row g-3 mb-4">
                {statCards.map((s) => (
                  <div key={s.label} className="col-md-3 col-sm-6">
                    <div className="bb-card p-3 d-flex align-items-center gap-3">
                      <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: `${s.color}18`,
                        border: `1px solid ${s.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <i className={`bi ${s.icon}`} style={{ fontSize: '1.3rem', color: s.color }} />
                      </div>
                      <div>
                        <div className="bb-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                        <div className="bb-display" style={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category breakdown */}
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="bb-card p-4">
                    <h6 className="bb-display mb-3" style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <i className="bi bi-grid me-2 bb-accent-text" />Bikes by Category
                    </h6>
                    {Object.keys(stats.categories).length === 0
                      ? <p className="bb-muted" style={{ fontSize: '0.85rem' }}>No bikes yet</p>
                      : Object.entries(stats.categories).map(([cat, count]) => (
                        <div key={cat} className="mb-2">
                          <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
                            <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                            <span className="bb-muted">{count}</span>
                          </div>
                          <div style={{ height: 6, background: 'var(--bb-border)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: 3,
                              width: `${(count / stats.total) * 100}%`,
                              background: 'var(--bb-accent)',
                              transition: 'width 0.6s ease',
                            }} />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bb-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="bb-display mb-2" style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <i className="bi bi-lightning me-2 bb-accent-text" />Quick Actions
                      </h6>
                      <p className="bb-muted" style={{ fontSize: '0.82rem' }}>Manage your bike inventory</p>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <Link to="/admin/bikes" className="btn btn-accent">
                        <i className="bi bi-plus-circle me-2" />Add New Bike
                      </Link>
                      <Link to="/admin/bikes" className="btn btn-outline-accent">
                        <i className="bi bi-table me-2" />View All Bikes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}