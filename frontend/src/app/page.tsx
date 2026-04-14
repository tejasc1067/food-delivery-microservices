'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';
import { api } from '@/lib/api';
import { Restaurant } from '@/lib/types';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { location } = useLocation();

  useEffect(() => {
    setLoading(true);
    api.get<Restaurant[]>(`/api/restaurants/city/${location}`)
      .then(data => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location]);

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

      {/* Results count */}
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {restaurants.length} restaurants in {location}
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
              transition={{ delay: (i % 20) * 0.03 }}
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
        </div>
      )}
    </div>
  );
}

