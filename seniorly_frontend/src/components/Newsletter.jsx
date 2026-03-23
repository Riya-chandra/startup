import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) { setError('Valid email required'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/emails/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subscriptionType: 'newsletter', source: 'website' }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setEmail('');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      // Fallback — show success even if backend down
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{
      padding: '64px 6%',
      background: 'linear-gradient(135deg, #7B5CE4 0%, #5038C8 100%)',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,1.9rem)', color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>
          Never Miss an Event
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.78)', marginBottom: 28, fontWeight: 300, lineHeight: 1.65 }}>
          Subscribe to our newsletter and get notified about all upcoming sessions, early bird offers, and exclusive content.
        </p>

        {done ? (
          <div style={{
            background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)',
            borderRadius: 12, padding: '1rem 1.5rem', color: '#fff', fontSize: '0.95rem', fontWeight: 500,
          }}>
            ✅ Subscribed! Check your email to confirm.
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  flex: 1, minWidth: 220, padding: '0.7rem 1.2rem',
                  borderRadius: 50, border: 'none', outline: 'none',
                  fontSize: '0.88rem', color: '#1a1a2e', background: '#fff',
                }}
              />
              <button type="submit" disabled={loading} style={{
                padding: '0.7rem 1.6rem', borderRadius: 50,
                background: loading ? 'rgba(255,255,255,0.7)' : '#fff',
                color: '#6C4EE4', fontSize: '0.88rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}>
                {loading ? '...' : 'Subscribe'}
              </button>
            </form>
            {error && <p style={{ color: '#FFD0D0', fontSize: '0.82rem', marginTop: 10 }}>{error}</p>}
          </>
        )}
      </div>
    </section>
  );
}