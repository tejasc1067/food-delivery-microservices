'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Restaurant } from '@/lib/types';

export default function AdminPage() {
  const { token, isAdmin, isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', address: '', city: '', cuisineType: '', rating: '', imageUrl: '' });

  useEffect(() => {
    api.get<Restaurant[]>('/api/restaurants')
      .then(data => { setRestaurants(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin access required</h2>
      </div>
    );
  }

  const resetForm = () => {
    setForm({ name: '', description: '', address: '', city: '', cuisineType: '', rating: '', imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, rating: parseFloat(form.rating) || 0 };
    try {
      if (editingId) {
        const updated = await api.put<Restaurant>(`/api/restaurants/${editingId}`, body, token!);
        setRestaurants(prev => prev.map(r => r.id === editingId ? updated : r));
      } else {
        const created = await api.post<Restaurant>('/api/restaurants', body, token!);
        setRestaurants(prev => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleEdit = (r: Restaurant) => {
    setForm({ name: r.name, description: r.description || '', address: r.address || '', city: r.city || '', cuisineType: r.cuisineType || '', rating: String(r.rating), imageUrl: r.imageUrl || '' });
    setEditingId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this restaurant?')) return;
    try {
      await api.del(`/api/restaurants/${id}`, token!);
      setRestaurants(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Restaurant'}
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>{editingId ? 'Edit Restaurant' : 'New Restaurant'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="input" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input className="input" placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              <input className="input" placeholder="Cuisine Type" value={form.cuisineType} onChange={e => setForm(f => ({ ...f, cuisineType: e.target.value }))} />
              <input className="input" placeholder="Rating (e.g. 4.5)" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
              <input className="input" placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={{ gridColumn: '1 / -1' }} />
              <input className="input" placeholder="Image URL" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} style={{ gridColumn: '1 / -1' }} />
              <textarea className="input" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ gridColumn: '1 / -1', minHeight: '80px', resize: 'vertical' }} />
              <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>
                {editingId ? 'Update Restaurant' : 'Create Restaurant'}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>{restaurants.length} restaurants</p>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '80px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {restaurants.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={r.imageUrl} alt={r.name} style={{ width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600 }}>{r.name}</h3>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{r.cuisineType} • {r.city} • ⭐{r.rating}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/restaurant/${r.id}`}>
                    <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Menu</button>
                  </Link>
                  <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEdit(r)}>Edit</button>
                  <button className="btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
