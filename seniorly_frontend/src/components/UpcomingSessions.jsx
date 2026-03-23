import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function FeatureTag({ label }) {
  const colors = {
    'Live Session':    { bg: '#EEF1F8', color: '#5038C8' },
    'Live Mentorship': { bg: '#E8F8EF', color: '#22A55B' },
    'Certification':   { bg: '#FFF3E8', color: '#D4700A' },
    'Razma':           { bg: '#FFF3E8', color: '#D4700A' },
  };
  const c = colors[label] || { bg: '#f0f0f5', color: '#666' };
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: '0.65rem', fontWeight: 600, padding: '3px 9px', borderRadius: 50, letterSpacing: '0.03em' }}>
      {label}
    </span>
  );
}

function SessionCard({ s, onToast }) {
  const [hov, setHov] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notified, setNotified] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  // Check if user already logged in
  useEffect(() => {
    const stored = localStorage.getItem('seniorly_notified_' + s.id);
    if (stored) setNotified(true);
    // Pre-fill email if logged in
    const user = localStorage.getItem('seniorly_user');
    if (user) {
      try { setEmail(JSON.parse(user).email); } catch (e) {}
    }
  }, [s.id]);

  const handleNotify = async () => {
    if (notified) return;

    // If no email yet, show input
    const user = localStorage.getItem('seniorly_user');
    const userEmail = user ? JSON.parse(user).email : '';

    if (!userEmail && !email) {
      setShowEmailInput(true);
      return;
    }

    const finalEmail = userEmail || email;
    if (!finalEmail.includes('@')) { onToast('Please enter a valid email!'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/sessions/${s._id || s.id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: finalEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setNotified(true);
        setShowEmailInput(false);
        localStorage.setItem('seniorly_notified_' + s.id, '1');
        onToast(`🔔 You'll be notified when "${s.title}" launches!`);
      } else {
        onToast(data.message || 'Something went wrong');
      }
    } catch (err) {
      // Fallback — save locally if backend unreachable
      setNotified(true);
      localStorage.setItem('seniorly_notified_' + s.id, '1');
      onToast(`🔔 Notification saved for "${s.title}"!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', border: '1px solid',
        borderColor: hov ? '#6C4EE4' : '#e2e4ee',
        borderRadius: 16, overflow: 'hidden',
        transition: 'all 0.22s',
        boxShadow: hov ? '0 8px 28px rgba(108,78,228,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hov ? 'translateY(-3px)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}>

      {/* Thumb */}
      <div style={{
        height: 120, background: 'linear-gradient(135deg,#EEF1F8,#E0E4F5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', borderBottom: '1px solid #eee',
      }}>
        {s.isEarlyBird && (
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: '#6C4EE4', color: '#fff',
            fontSize: '0.65rem', fontWeight: 700,
            padding: '3px 10px', borderRadius: 50, letterSpacing: '0.04em',
          }}>Early Access</span>
        )}
        <span style={{ fontSize: '1.8rem', opacity: 0.3 }}>📚</span>
      </div>

      {/* Body */}
      <div style={{ padding: '0.9rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ background: '#EEF1F8', color: '#5038C8', fontSize: '0.65rem', fontWeight: 600, padding: '2px 9px', borderRadius: 50, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {s.level}
          </span>
          <span style={{ background: '#FFF3E8', color: '#D4700A', fontSize: '0.65rem', fontWeight: 600, padding: '2px 9px', borderRadius: 50 }}>
            {s.launchLabel || 'Launching Soon'}
          </span>
        </div>

        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e', lineHeight: 1.3, margin: '4px 0 2px' }}>
          {s.title}
        </h3>
        <p style={{ fontSize: '0.72rem', color: '#888899' }}>by —</p>

        {s.prerequisites?.length > 0 && (
          <div style={{ marginTop: 4 }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#888899', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prerequisites:</p>
            {s.prerequisites.map((p, i) => <div key={i} style={{ fontSize: '0.75rem', color: '#555570' }}>• {p}</div>)}
          </div>
        )}

        {s.courseFeatures?.length > 0 && (
          <div style={{ marginTop: 6 }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#888899', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course Features:</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {s.courseFeatures.map((f, i) => <FeatureTag key={i} label={f} />)}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: '#888899', marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f5' }}>
          <span>🪑 {s.seatsLimit - (s.seatsBooked || 0)} spots left</span>
          <span>₹{s.price}+</span>
        </div>

        {/* Email input — shows when not logged in */}
        {showEmailInput && !notified && (
          <div style={{ marginTop: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '0.5rem 0.75rem',
                border: '1.5px solid #6C4EE4', borderRadius: 8,
                fontSize: '0.82rem', outline: 'none', marginBottom: 6,
              }}
            />
          </div>
        )}

        {/* Notify button */}
        <button
          onClick={handleNotify}
          disabled={loading || notified}
          style={{
            marginTop: 8, padding: '0.5rem', borderRadius: 50,
            background: notified ? '#E8F8EF' : '#F4F6FB',
            border: `1.5px solid ${notified ? '#22A55B' : '#6C4EE4'}`,
            color: notified ? '#22A55B' : '#6C4EE4',
            fontSize: '0.8rem', fontWeight: 600,
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: notified ? 'default' : 'pointer',
          }}
          onMouseEnter={e => { if (!notified) { e.currentTarget.style.background = '#6C4EE4'; e.currentTarget.style.color = '#fff'; } }}
          onMouseLeave={e => { if (!notified) { e.currentTarget.style.background = '#F4F6FB'; e.currentTarget.style.color = '#6C4EE4'; } }}>
          {loading ? '...' : notified ? '✓ Notified' : '🔔 Notify Me'}
        </button>
      </div>
    </div>
  );
}

export default function UpcomingSessions({ onToast }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static fallback data
  const fallback = [
    { id: 1, title: 'Types of Development', level: 'Beginner', launchLabel: 'Launching Soon', prerequisites: ['Find your path in dev'], courseFeatures: ['Live Session', 'Razma', 'Certification'], price: 400, seatsLimit: 120, seatsBooked: 0, isEarlyBird: false },
    { id: 2, title: 'Knowing Fundamentals', level: 'Beginner', launchLabel: 'Launching Soon', prerequisites: ['Own a little corner'], courseFeatures: ['Live Session', 'Live Mentorship', 'Certification'], price: 400, seatsLimit: 500, seatsBooked: 0, isEarlyBird: false },
    { id: 3, title: 'Revealing Soon', level: 'Beginner to Advanced', launchLabel: 'Launching Soon', prerequisites: ['Role', 'Creator'], courseFeatures: ['Live Session', 'Live Mentorship', 'Certification'], price: 400, seatsLimit: 400, seatsBooked: 0, isEarlyBird: true },
    { id: 4, title: 'Soon...', level: 'Intermediate', launchLabel: 'Launching Soon', prerequisites: ['—'], courseFeatures: ['Live Session', 'Razma', 'Certification'], price: 400, seatsLimit: 110, seatsBooked: 0, isEarlyBird: false },
    { id: 5, title: 'Soon...', level: 'Intermediate', launchLabel: 'Launching Soon', prerequisites: ['—'], courseFeatures: ['Live Session', 'Live Mentorship', 'Certification'], price: 400, seatsLimit: 400, seatsBooked: 0, isEarlyBird: true },
    { id: 6, title: 'Soon...', level: 'Advanced', launchLabel: 'Launching Soon', prerequisites: ['—'], courseFeatures: ['Live Session', 'Certification'], price: 400, seatsLimit: 250, seatsBooked: 0, isEarlyBird: false },
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${API}/api/sessions?status=upcoming`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSessions(data.data);
        } else {
          setSessions(fallback);
        }
      } catch (err) {
        setSessions(fallback); // Use fallback if backend unreachable
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <section id="upcoming" style={{ padding: '72px 6%', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: '#1a1a2e', letterSpacing: '-0.02em', marginBottom: 10 }}>
            Upcoming Sessions
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#888899', maxWidth: 440, margin: '0 auto', lineHeight: 1.65, fontWeight: 300 }}>
            Get ready for our latest Sessions coming soon. Be the first to know and secure your spot!
          </p>
        </div>

        {/* Early Bird Banner */}
        <div style={{
          background: '#FFF8E6', border: '1.5px solid #F0CC72',
          borderRadius: 12, padding: '1rem 1.4rem',
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36,
        }}>
          <span style={{ fontSize: '1.2rem' }}>🌟</span>
          <div>
            <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: '0.95rem', color: '#92620A', marginBottom: 2 }}>
              Early Bird Benefits
            </div>
            <div style={{ fontSize: '0.8rem', color: '#B07820', fontWeight: 300 }}>
              Subscribe to get notified about Session launches and receive exclusive early access!
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888899' }}>Loading sessions...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {sessions.map(s => <SessionCard key={s._id || s.id} s={s} onToast={onToast} />)}
          </div>
        )}
      </div>
    </section>
  );
}