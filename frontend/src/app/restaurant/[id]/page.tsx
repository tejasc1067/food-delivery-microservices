'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Restaurant, MenuItem } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();
  const { addItem, items, updateQuantity, removeItem, total } = useCart();
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      api.get<Restaurant>(`/api/restaurants/${id}`),
      api.get<MenuItem[]>(`/api/restaurants/${id}/menu`),
    ]).then(([r, m]) => {
      setRestaurant(r);
      setMenuItems(m);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const getItemQty = (menuItemId: number) => {
    const item = items.find(i => i.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  const cartItemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  if (loading) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div className="skeleton" style={{ height: '300px', marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '240px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) return <div style={{ textAlign: 'center', padding: '4rem' }}>Restaurant not found</div>;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem', paddingBottom: '6rem' }}>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '2.5rem', height: '300px' }}>
        <img src={restaurant.imageUrl} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }} />
        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{restaurant.name}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>{restaurant.description}</p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
            <span>⭐ {restaurant.rating}</span>
            <span>📍 {restaurant.city}</span>
            <span>🍽️ {restaurant.cuisineType}</span>
          </div>
        </div>
      </motion.div>


      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Menu ({menuItems.length} items)</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {menuItems.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ height: '160px', overflow: 'hidden' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.name}</h3>
                  <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1rem' }}>₹{item.price}</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.4 }}>{item.description}</p>
                
                <div style={{ marginTop: 'auto' }}>
                  {!isAdmin && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {getItemQty(item.id) > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--card-hover)', borderRadius: '2rem', padding: '0.25rem' }}>
                          <button
                            className="btn-secondary"
                            style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none' }}
                            onClick={() => {
                              if (getItemQty(item.id) === 1) {
                                removeItem(item.id);
                              } else {
                                updateQuantity(item.id, getItemQty(item.id) - 1);
                              }
                            }}
                          >−</button>
                          <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center', fontSize: '0.95rem' }}>{getItemQty(item.id)}</span>
                          <button
                            className="btn-secondary"
                            style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none' }}
                            onClick={() => updateQuantity(item.id, getItemQty(item.id) + 1)}
                          >+</button>
                        </div>
                      ) : (
                        <button
                          className="btn-primary"
                          style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', borderRadius: '2rem' }}
                          onClick={() => addItem({
                            menuItemId: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                            imageUrl: item.imageUrl,
                            restaurantId: restaurant.id,
                            restaurantName: restaurant.name,
                          })}
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      {cartItemsCount > 0 && !isAdmin && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            background: 'var(--accent)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '320px',
            boxShadow: '0 10px 25px rgba(255, 107, 0, 0.4)',
            zIndex: 50,
            cursor: 'pointer',
          }}
          onClick={() => router.push('/cart')}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'} added</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{total.toFixed(2)}</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View Cart 🛒
          </div>
        </motion.div>
      )}
    </div>
  );
}
