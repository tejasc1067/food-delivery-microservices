'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();



  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Your cart is empty</h2>
        <Link href="/"><button className="btn-primary">Browse Restaurants</button></Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Your Cart</h1>
          <button className="btn-danger" onClick={clearCart}>Clear Cart</button>
        </div>

        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
          From: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{items[0]?.restaurantName}</span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {items.map(item => (
            <div key={item.menuItemId} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '0.75rem', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  className="btn-secondary"
                  style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                >−</button>
                <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                <button
                  className="btn-secondary"
                  style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                >+</button>
              </div>
              <span style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeItem(item.menuItemId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1.2rem' }}>✕</button>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--muted)' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>₹{total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total</span>
            <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{total.toFixed(2)}</span>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => {
            if (!isAuthenticated) {
              alert('Please login to place your order.');
              router.push('/login?redirect=/checkout');
            } else {
              router.push('/checkout');
            }
          }}>
            Proceed to Checkout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
