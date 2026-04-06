import React, { useState, useEffect, useCallback } from 'react';
import { bikesAPI } from '../../services/api';
import BikeCard from '../../components/user/BikeCard';
import Navbar from '../../components/shared/Navbar';
import ChatbotWidget from '../../components/shared/ChatbotWidget';
import BikeFilters from '../../components/user/BikeFilter';

const DEFAULT_FILTERS = {
  search: '', category: '', brand: '', min_price: '', max_price: '',
  available: '', sort_by: 'created_at', sort_order: 'desc', page: 1, size: 12,
};

export default function HomePage() {
  const [bikes, setBikes] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 0, page: 1 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const fetchBikes = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(f).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) params[k] = v; });
      const { data } = await bikesAPI.list(params);
      setBikes(data.items);
      setMeta({ total: data.total, pages: data.pages, page: data.page });
    } catch {
      setBikes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBikes(filters);
  }, [filters, fetchBikes]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  };

  return (
    <div style={{ background: 'var(--bb-bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero search bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a00 100%)',
        borderBottom: '1px solid var(--bb-border)',
        padding: '2.5rem 0 2rem',
      }}>
        <div className="container-fluid px-4">
          <div className="text-center mb-4">
            <h1 className="bb-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Find Your <span className="bb-accent-text">Perfect Ride</span>
            </h1>
            <p className="bb-muted" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
              Search from our curated collection of bikes — or ask BikeBot AI for recommendations
            </p>
          </div>

          <form onSubmit={handleSearch} className="d-flex gap-2 mx-auto" style={{ maxWidth: 580 }}>
            <input
              className="bb-input"
              placeholder="Search by name, brand, or type..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            />
            <button type="submit" className="btn btn-accent" style={{ whiteSpace: 'nowrap' }}>
              <i className="bi bi-search me-1" /> Search
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="container-fluid px-4 py-4 page-enter">
        <div className="row g-4">
          {/* Filters sidebar */}
          <div className="col-lg-3 col-md-4">
            <BikeFilters filters={filters} onChange={setFilters} onReset={handleReset} />
          </div>

          {/* Bike grid */}
          <div className="col-lg-9 col-md-8">
            {/* Sort + result count */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <span className="bb-muted" style={{ fontSize: '0.85rem' }}>
                {loading ? 'Loading...' : `${meta.total} bike${meta.total !== 1 ? 's' : ''} found`}
              </span>
              <div className="d-flex gap-2 align-items-center">
                <span className="bb-muted" style={{ fontSize: '0.78rem' }}>Sort:</span>
                <select
                  className="bb-input"
                  style={{ width: 'auto', fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}
                  value={`${filters.sort_by}:${filters.sort_order}`}
                  onChange={(e) => {
                    const [sort_by, sort_order] = e.target.value.split(':');
                    setFilters((f) => ({ ...f, sort_by, sort_order, page: 1 }));
                  }}
                >
                  <option value="created_at:desc">Newest</option>
                  <option value="price_per_day:asc">Price: Low → High</option>
                  <option value="price_per_day:desc">Price: High → Low</option>
                  <option value="name:asc">Name A–Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="bb-spinner">
                <div className="spinner-border" style={{ color: 'var(--bb-accent)', width: 40, height: 40 }} />
              </div>
            ) : bikes.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-bicycle" style={{ fontSize: '3rem', color: 'var(--bb-border)' }} />
                <p className="bb-muted mt-2">No bikes found. Try adjusting your filters.</p>
                <button onClick={handleReset} className="btn btn-outline-accent btn-sm mt-2">Clear Filters</button>
              </div>
            ) : (
              <div className="row g-3">
                {bikes.map((bike) => (
                  <div key={bike.id} className="col-xl-4 col-lg-6 col-md-6">
                    <BikeCard bike={bike} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta.pages > 1 && (
              <div className="d-flex justify-content-center mt-4 gap-2">
                <button
                  className="btn btn-outline-accent btn-sm"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                >
                  <i className="bi bi-chevron-left" />
                </button>
                {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`btn btn-sm ${filters.page === p ? 'btn-accent' : 'btn-outline-accent'}`}
                    onClick={() => setFilters((f) => ({ ...f, page: p }))}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="btn btn-outline-accent btn-sm"
                  disabled={filters.page >= meta.pages}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatbotWidget />
    </div>
  );
}