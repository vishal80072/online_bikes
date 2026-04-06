import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Navbar from '../../components/shared/Navbar';
import BikeFormModal from '../../components/admin/BikeFormModal';
import { bikesAPI } from '../../services/api';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80';

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 0, page: 1 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editBike, setEditBike] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBikes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (search) params.search = search;
      const { data } = await bikesAPI.list(params);
      setBikes(data.items);
      setMeta({ total: data.total, pages: data.pages, page: data.page });
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchBikes(); }, [fetchBikes]);

  const handleSubmit = async (payload) => {
    try {
      if (editBike) {
        await bikesAPI.update(editBike.id, payload);
        showToast('Bike updated successfully');
      } else {
        await bikesAPI.create(payload);
        showToast('Bike added successfully');
      }
      fetchBikes();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Operation failed', 'error');
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bikesAPI.delete(deleteTarget.id);
      showToast('Bike deleted successfully');
      setDeleteTarget(null);
      fetchBikes();
    } catch {
      showToast('Failed to delete bike', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const openAdd = () => { setEditBike(null); setShowModal(true); };
  const openEdit = (bike) => { setEditBike(bike); setShowModal(true); };

  return (
    <div style={{ background: 'var(--bb-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 p-4 page-enter">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="bb-display mb-0" style={{ fontWeight: 800, fontSize: '1.8rem' }}>Manage Bikes</h2>
              <p className="bb-muted" style={{ fontSize: '0.85rem' }}>{meta.total} bikes in fleet</p>
            </div>
            <button className="btn btn-accent" onClick={openAdd}>
              <i className="bi bi-plus-circle me-2" />Add Bike
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <div className="alert mb-3" style={{
              background: toast.type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
              color: toast.type === 'error' ? '#fca5a5' : '#86efac',
              borderRadius: 8, fontSize: '0.85rem', padding: '0.65rem 1rem',
            }}>
              <i className={`bi ${toast.type === 'error' ? 'bi-x-circle' : 'bi-check-circle'} me-2`} />
              {toast.msg}
            </div>
          )}

          {/* Search */}
          <div className="d-flex gap-2 mb-4">
            <input
              className="bb-input"
              placeholder="Search bikes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
              style={{ maxWidth: 320 }}
            />
            <button className="btn btn-outline-accent" onClick={() => { setSearch(searchInput); setPage(1); }}>
              <i className="bi bi-search" />
            </button>
            {search && (
              <button className="btn btn-outline-accent" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
                <i className="bi bi-x" /> Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bb-table">
            {loading ? (
              <div className="bb-spinner"><div className="spinner-border" style={{ color: 'var(--bb-accent)' }} /></div>
            ) : bikes.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-bicycle" style={{ fontSize: '2.5rem', color: 'var(--bb-border)' }} />
                <p className="bb-muted mt-2">No bikes found</p>
                <button className="btn btn-accent btn-sm mt-1" onClick={openAdd}>Add First Bike</button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Bike</th>
                    <th>Category</th>
                    <th>Engine</th>
                    <th>Price/Day</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bikes.map((bike) => (
                    <tr key={bike.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={bike.image_url || PLACEHOLDER}
                            alt={bike.name}
                            style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }}
                            onError={(e) => { e.target.src = PLACEHOLDER; }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{bike.name}</div>
                            <div className="bb-muted" style={{ fontSize: '0.75rem' }}>{bike.brand} · {bike.model}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="bb-badge bb-badge-accent" style={{ textTransform: 'capitalize' }}>{bike.category}</span>
                      </td>
                      <td className="bb-muted">{bike.engine_cc ? `${bike.engine_cc}cc` : '—'}</td>
                      <td className="bb-accent-text" style={{ fontWeight: 700 }}>₹{bike.price_per_day.toLocaleString()}</td>
                      <td className="bb-muted">{bike.stock}</td>
                      <td>
                        <span className={`bb-badge ${bike.available ? 'bb-badge-green' : 'bb-badge-red'}`}>
                          {bike.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            onClick={() => openEdit(bike)}
                            className="btn btn-sm"
                            style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--bb-accent)', border: '1px solid rgba(249,115,22,0.3)', fontSize: '0.75rem' }}
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(bike)}
                            className="btn btn-sm"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontSize: '0.75rem' }}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {meta.pages > 1 && (
            <div className="d-flex justify-content-center mt-3 gap-2">
              <button className="btn btn-outline-accent btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <i className="bi bi-chevron-left" />
              </button>
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`btn btn-sm ${page === p ? 'btn-accent' : 'btn-outline-accent'}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="btn btn-outline-accent btn-sm" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <BikeFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        bike={editBike}
      />

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="modal show d-block bb-modal" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 400 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title bb-display" style={{ fontWeight: 800 }}>Confirm Delete</h5>
                <button className="btn-close" onClick={() => setDeleteTarget(null)} />
              </div>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem' }}>
                  Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-accent" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button
                  className="btn"
                  style={{ background: 'var(--bb-red)', color: 'white', border: 'none' }}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? <><span className="spinner-border spinner-border-sm me-2" />Deleting...</> : <><i className="bi bi-trash me-2" />Delete</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}