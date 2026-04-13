'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { OrderResponse } from '@/lib/types';

export default function CheckoutPage() {
  const { token, isAuthenticated } = useAuth();
  const { items, total, clearCart, restaurantId } = useCart();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Please login to checkout</h2>
        <Link href="/login"><button className="btn-primary">Login</button></Link>
      </div>
    );
  }

  if (items.length === 0 && !order) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Cart is empty</h2>
        <Link href="/"><button className="btn-primary">Browse Restaurants</button></Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        restaurantId,
        items: items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      };
      const result = await api.post<OrderResponse>('/api/orders', orderData, token!);
      setOrder(result);
      clearCart();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</p>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed!</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Your order has been confirmed</p>
            <div style={{ background: 'var(--background)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Order ID</p>
              <p className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>#{order.id}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Total: ₹{order.totalAmount}</p>
              <p style={{ marginTop: '0.5rem' }}>
                <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => router.push('/orders')}>View Orders</button>
              <button className="btn-secondary" onClick={() => router.push('/')}>Back to Home</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#f87171', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            From: <span style={{ color: 'var(--accent)' }}>{items[0]?.restaurantName}</span>
          </p>
          {items.map(item => (
            <div key={item.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span>{item.name} × {item.quantity}</span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0 0', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total</span>
            <span className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={handlePlaceOrder} disabled={loading}>
          {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
        </button>
      </motion.div>
    </div>
  );
}
