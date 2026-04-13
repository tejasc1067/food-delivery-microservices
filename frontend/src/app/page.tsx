'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';
import { api } from '@/lib/api';
import { Restaurant } from '@/lib/types';

interface RestaurantPage {
  content: Restaurant[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const { location } = useLocation();
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(0);
  }, [location, search, minRating]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('city', location);
    params.set('page', String(currentPage));
    params.set('size', '20');
    if (search) params.set('q', search);
    if (minRating > 0) params.set('rating', String(minRating));

    api.get<RestaurantPage>(`/api/restaurants/search?${params.toString()}`)
      .then(data => {
        setRestaurants(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location, search, minRating, currentPage]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Discover <span className="gradient-text">Delicious</span> Food
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
          Order from top-rated restaurants in {location}
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '2rem' }}
      >
        <input
          type="text"
          placeholder={`Search restaurants or cuisines in ${location}...`}
          className="input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: '1rem', fontSize: '1rem', padding: '1rem 1.25rem' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Min Rating:</span>
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '0.5rem',
                border: '1px solid',
                borderColor: minRating === r ? 'var(--accent)' : 'var(--border)',
                background: minRating === r ? 'rgba(255,107,0,0.15)' : 'transparent',
                color: minRating === r ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {r === 0 ? 'Any' : `${r}⭐+`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {restaurants.length} restaurants found in {location}
      </p>

      {/* Restaurant Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '320px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {restaurants.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 20) * 0.03 }} // capped delay for performance
            >
              <Link href={`/restaurant/${r.id}`}>
                <div className="card" style={{ cursor: 'pointer' }}>
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}>
                      ⭐ {r.rating}
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{r.name}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      {r.cuisineType} • {r.city}
                    </p>
                    <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                      {r.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && restaurants.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
          <p style={{ fontSize: '1.2rem' }}>No restaurants found</p>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'transparent', color: currentPage === 0 ? 'var(--muted)' : 'var(--text)', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Prev
          </button>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'transparent', color: currentPage === totalPages - 1 ? 'var(--muted)' : 'var(--text)', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
