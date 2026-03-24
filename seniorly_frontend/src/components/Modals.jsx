import React, { useState } from 'react';

// Get API URL from env, warn if not set in production
const getAPIUrl = () => {
  const url = process.env.REACT_APP_API_URL;
  if (!url && process.env.NODE_ENV === 'production') {
    console.error('⚠️ REACT_APP_API_URL not set in production. Login will fail.');
    return null;
  }
  return url || 'http://localhost:5000';
};
const API = getAPIUrl();

function Overlay({ children, onClose }) {
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(26,26,46,0.55)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '2rem',
        maxWidth: 420, width: '100%', position: 'relative',
        boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          width: 28, height: 28, borderRadius: '50%',
          background: '#f0f0f5', border: 'none', color: '#888',
          fontSize: '0.9rem', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
        }}>✕</button>
        {children}
      </div>
    </div>
  );
}

function FInput({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: '0.78rem', color: '#888899', marginBottom: 5, fontWeight: 500 }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          width: '100%', padding: '0.65rem 1rem',
          border: '1.5px solid #e2e4ee', borderRadius: 10,
          color: '#1a1a2e', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#6C4EE4'}
        onBlur={e => e.target.style.borderColor = '#e2e4ee'}
      />
    </div>
  );
}

function PrimaryBtn({ onClick, children, loading }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: '100%', padding: '0.78rem', borderRadius: 10,
      background: loading ? '#9B89E8' : '#6C4EE4', color: '#fff', border: 'none',
      fontSize: '0.9rem', fontWeight: 600, marginTop: 6, cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s',
    }}>
      {loading ? 'Please wait...' : children}
    </button>
  );
}

export function LoginModal({ onClose, onSwitch, onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || 'Login failed'); return; }
      localStorage.setItem('seniorly_token', data.token);
      localStorage.setItem('seniorly_user', JSON.stringify(data.user));
      onSuccess(`Welcome back, ${data.user.firstName}!`);
    } catch (err) {
      console.error('Login error:', err);
      if (!API) {
        setError('🔧 Backend URL not configured. Ask admin to set REACT_APP_API_URL.');
      } else if (err.message.includes('fetch')) {
        setError(`Cannot reach backend at ${API}. Check your internet or backend status.`);
      } else {
        setError('Connection failed. ' + (err.message || 'Please try again'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: '1.35rem', color: '#1a1a2e', marginBottom: 4 }}>Welcome back</h2>
      <p style={{ fontSize: '0.82rem', color: '#888899', marginBottom: 22, fontWeight: 300 }}>Log in to your Seniorly account</p>

      {error && (
        <div style={{ background: '#FFF0F0', border: '1px solid #FFB3B3', borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: '0.82rem', color: '#CC0000', marginBottom: 14 }}>
          {error}
        </div>
      )}

      <FInput label="Email" type="email" placeholder="you@example.com"
        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <FInput label="Password" type="password" placeholder="••••••••"
        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

      <PrimaryBtn onClick={handleLogin} loading={loading}>Log in →</PrimaryBtn>

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888899', marginTop: 14, fontWeight: 300 }}>
        No account? <span onClick={onSwitch} style={{ color: '#6C4EE4', fontWeight: 600, cursor: 'pointer' }}>Sign up free</span>
      </p>
    </Overlay>
  );
}

export function RegisterModal({ onClose, onSwitch, onSuccess }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!form.firstName || !form.email || !form.password) { setError('Please fill all fields'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || (data.errors && data.errors[0]?.msg) || 'Registration failed');
        return;
      }
      localStorage.setItem('seniorly_token', data.token);
      localStorage.setItem('seniorly_user', JSON.stringify(data.user));
      onSuccess(`Welcome to Seniorly, ${data.user.firstName}!`);
    } catch (err) {
      console.error('Register error:', err);
      if (!API) {
        setError('🔧 Backend URL not configured. Ask admin to set REACT_APP_API_URL.');
      } else if (err.message.includes('fetch')) {
        setError(`Cannot reach backend at ${API}. Check your internet or backend status.`);
      } else {
        setError('Connection failed. ' + (err.message || 'Please try again'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: '1.35rem', color: '#1a1a2e', marginBottom: 4 }}>Create account</h2>
      <p style={{ fontSize: '0.82rem', color: '#888899', marginBottom: 22, fontWeight: 300 }}>Join Seniorly for free</p>

      {error && (
        <div style={{ background: '#FFF0F0', border: '1px solid #FFB3B3', borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: '0.82rem', color: '#CC0000', marginBottom: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FInput label="First name" placeholder="Rahul"
          value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <FInput label="Last name" placeholder="Sharma"
          value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
      </div>
      <FInput label="Email" type="email" placeholder="you@example.com"
        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <FInput label="Password" type="password" placeholder="Min 6 characters"
        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

      <PrimaryBtn onClick={handleRegister} loading={loading}>Create account →</PrimaryBtn>

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888899', marginTop: 14, fontWeight: 300 }}>
        Already have an account? <span onClick={onSwitch} style={{ color: '#6C4EE4', fontWeight: 600, cursor: 'pointer' }}>Log in</span>
      </p>
    </Overlay>
  );
}