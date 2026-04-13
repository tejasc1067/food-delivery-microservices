'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { location, setLocation, locations } = useLocation();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🍔</span>
          <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            FoodieExpress
          </span>
        </Link>

        {/* Location Dropdown */}
        {pathname === '/' && ( // Only show on homepage to act like Swiggy
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--muted)', fontWeight: 600, fontSize: '0.95rem' }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>📍 {location}</span>
              <span style={{ fontSize: '0.7rem' }}>▼</span>
            </div>
            
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '1rem',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '0.5rem',
                minWidth: '180px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 60,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <div style={{ padding: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  CHOOSE LOCATION
                </div>
                {locations.map(loc => (
                  <div
                    key={loc}
                    onClick={() => {
                      setLocation(loc);
                      setDropdownOpen(false);
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                      color: location === loc ? 'var(--accent)' : 'var(--foreground)',
                      background: location === loc ? 'rgba(255,107,0,0.1)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = location === loc ? 'rgba(255,107,0,0.1)' : 'var(--card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = location === loc ? 'rgba(255,107,0,0.1)' : 'transparent'}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" style={{ color: pathname === '/' ? 'var(--accent)' : 'var(--muted)', fontSize: '0.95rem', fontWeight: pathname === '/' ? 700 : 500, transition: 'all 0.2s' }}>
          Home
        </Link>

        {!isAdmin && (
          <>
            <Link href="/cart" style={{ position: 'relative', color: pathname === '/cart' ? 'var(--accent)' : 'var(--muted)', fontSize: '0.95rem', fontWeight: pathname === '/cart' ? 700 : 500, transition: 'all 0.2s' }}>
              🛒 Cart
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-12px',
                  background: 'var(--accent)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>
                  {itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <Link href="/orders" style={{ color: pathname === '/orders' ? 'var(--accent)' : 'var(--muted)', fontSize: '0.95rem', fontWeight: pathname === '/orders' ? 700 : 500, transition: 'all 0.2s' }}>
                Orders
              </Link>
            )}
          </>
        )}

        {isAdmin && (
          <Link href="/admin" style={{ color: 'var(--accent)', fontSize: '0.95rem', fontWeight: 600 }}>
            Admin
          </Link>
        )}

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Hi, {user?.name}
            </span>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/login">
              <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Login</button>
            </Link>
            <Link href="/register">
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Sign Up</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
