import React, { useState, useEffect } from 'react';

export default function Navbar({ onLogin, onRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('seniorly_user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch (e) {} }
    const handleUserChange = () => {
      const u = localStorage.getItem('seniorly_user');
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('seniorly_auth', handleUserChange);
    return () => window.removeEventListener('seniorly_auth', handleUserChange);
  }, []);

  const logoUrl = `${process.env.PUBLIC_URL || ''}/seniorly_logo.png`;

  const handleLogout = () => {
    localStorage.removeItem('seniorly_token');
    localStorage.removeItem('seniorly_user');
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event('seniorly_auth'));
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 5%',
      background: '#8b6ff0',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>

      {/* ── LOGO ── */}
      <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img
          src={logoUrl}
          alt="Seniorly"
          style={{
            height: 44,
            width: 'auto',
            objectFit: 'contain',
            marginRight: 12,
            // Make sure logo is visible on both transparent and white nav backgrounds
            filter: 'none',
            transition: 'all 0.3s ease',
          }}
        />
      </a>

      {/* ── RIGHT SIDE ── */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.38rem 0.75rem 0.38rem 0.38rem',
                borderRadius: 50,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.35)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: '#6C4EE4', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 700,
              }}>{initials}</div>
              <span style={{
                fontSize: '0.85rem', fontWeight: 500,
                color: '#fff',
              }}>{user.firstName}</span>
              <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)' }}>▼</span>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '115%', right: 0,
                background: '#fff', border: '1px solid #e2e4ee',
                borderRadius: 14, padding: '0.5rem',
                minWidth: 210, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 200,
              }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f0f0f5', marginBottom: '0.4rem' }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e' }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888899', marginTop: 2 }}>{user.email}</div>
                  <span style={{
                    display: 'inline-block', marginTop: 6,
                    background: '#f0edff', color: '#6C4EE4',
                    fontSize: '0.65rem', fontWeight: 600,
                    padding: '2px 8px', borderRadius: 50, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{user.role}</span>
                </div>
                {[{ icon: '👤', label: 'My Profile' }, { icon: '📚', label: 'My Webinars' }, { icon: '🔔', label: 'Notifications' }].map((item, i) => (
                  <button key={i} style={{
                    width: '100%', textAlign: 'left', padding: '0.6rem 1rem', borderRadius: 8,
                    background: 'transparent', border: 'none', fontSize: '0.85rem', color: '#444466',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f4f6fb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span>{item.icon}</span>{item.label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #f0f0f5', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                  <button onClick={handleLogout} style={{
                    width: '100%', textAlign: 'left', padding: '0.6rem 1rem', borderRadius: 8,
                    background: 'transparent', border: 'none', fontSize: '0.85rem', color: '#e53e3e',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span>🚪</span>Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={onLogin} style={{
              padding: '0.48rem 1.2rem', borderRadius: 50,
              border: '1px solid rgba(255,255,255,0.5)',
              color: '#fff',
              background: 'transparent', fontSize: '0.85rem', fontWeight: 500,
              transition: 'all 0.2s', cursor: 'pointer',
            }}>Log in</button>
            <button onClick={onRegister} style={{
              padding: '0.48rem 1.25rem', borderRadius: 50,
              background: '#fff',
              color: '#6C4EE4',
              fontSize: '0.85rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 2px 10px rgba(108,78,228,0.25)',
            }}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
}