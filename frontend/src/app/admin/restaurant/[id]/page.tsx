'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Restaurant, MenuItem } from '@/lib/types';

export default function AdminMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token, isAdmin, isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true });

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

  if (!isAuthenticated || !isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin access required</h2>
      </div>
    );
  }

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, price: parseFloat(form.price) || 0 };
    try {
      if (editingId) {
        const updated = await api.put<MenuItem>(`/api/menu-items/${editingId}`, body, token!);
        setMenuItems(prev => prev.map(m => m.id === editingId ? updated : m));
      } else {
        const created = await api.post<MenuItem>(`/api/restaurants/${id}/menu`, body, token!);
        setMenuItems(prev => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setForm({ name: item.name, description: item.description || '', price: String(item.price), category: item.category || '', imageUrl: item.imageUrl || '', isAvailable: item.isAvailable });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await api.del(`/api/menu-items/${itemId}`, token!);
      setMenuItems(prev => prev.filter(m => m.id !== itemId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <Link href="/admin" style={{ color: 'var(--accent)', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{restaurant?.name || 'Loading...'}</h1>
          <p style={{ color: 'var(--muted)' }}>Manage menu items</p>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>{editingId ? 'Edit Item' : 'New Item'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="input" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input className="input" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
              <input className="input" placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} />
                <label style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Available</label>
              </div>
              <input className="input" placeholder="Image URL" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} style={{ gridColumn: '1 / -1' }} />
              <textarea className="input" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ gridColumn: '1 / -1', minHeight: '60px', resize: 'vertical' }} />
              <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>
                {editingId ? 'Update Item' : 'Create Item'}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '80px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {menuItems.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600 }}>{item.name}</h3>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.category} • ₹{item.price} • {item.isAvailable ? '✅ Available' : '❌ Unavailable'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
          {menuItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
              <p>No menu items yet. Click &quot;+ Add Item&quot; to start.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
