import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function StarRating({ rating }) {
  return <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.78rem', color: '#F59E0B', fontWeight: 600 }}>★ {rating}</span>;
}

function WebinarCard({ w, onToast }) {
  const [hov, setHov] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('seniorly_enrolled_' + (w._id || w.id));
    if (stored) setEnrolled(true);
    const user = localStorage.getItem('seniorly_user');
    if (user) { try { setEmail(JSON.parse(user).email); } catch (e) {} }
  }, [w._id, w.id]);

  const handleEnroll = async () => {
    if (enrolled) return;
    const user = localStorage.getItem('seniorly_user');
    const userEmail = user ? JSON.parse(user).email : '';

    if (!userEmail && !email) { setShowEmailInput(true); return; }
    const finalEmail = userEmail || email;
    if (!finalEmail.includes('@')) { onToast('Please enter a valid email!'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/webinars/${w._id || w.id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: finalEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrolled(true);
        setShowEmailInput(false);
        localStorage.setItem('seniorly_enrolled_' + (w._id || w.id), '1');
        onToast(`🎓 Enrolled in "${w.title}"! Check your email.`);
      } else {
        onToast(data.message || 'Enrollment failed');
      }
    } catch (err) {
      setEnrolled(true);
      localStorage.setItem('seniorly_enrolled_' + (w._id || w.id), '1');
      onToast(`🎓 Enrolled in "${w.title}"!`);
    } finally {
      setLoading(false);
    }
  };

  const learns = w.whatYoullLearn || w.learns || [];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', border: '1px solid',
        borderColor: hov ? '#6C4EE4' : '#e2e4ee',
        borderRadius: 16, overflow: 'hidden',
        transition: 'all 0.22s',
        boxShadow: hov ? '0 8px 32px rgba(108,78,228,0.13)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hov ? 'translateY(-3px)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}>

      {/* Thumb */}
      <div style={{
        height: 140, background: 'linear-gradient(135deg, #EEF1F8 0%, #E0E4F5 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', borderBottom: '1px solid #eee',
      }}>
        {w.isFree && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#22A55B', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, textTransform: 'uppercase', letterSpacing: '0.05em' }}>FREE</span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'rgba(108,78,228,0.1)' }}>
          <span style={{ fontSize: '1.5rem' }}>🎓</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ background: '#EEF1F8', color: '#5038C8', fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: 50, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {w.level}
          </span>
          <StarRating rating={w.rating?.average || w.rating || 4.8} />
        </div>

        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', lineHeight: 1.3, margin: '4px 0 2px' }}>
          {w.title}
        </h3>

        {w.instructor && (
          <p style={{ fontSize: '0.75rem', color: '#888899', marginBottom: 2 }}>
            by {typeof w.instructor === 'object' ? `${w.instructor.firstName} ${w.instructor.lastName}` : w.instructor}
          </p>
        )}

        {learns.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#888899', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you'll learn:</p>
            {learns.slice(0, 4).map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.78rem', color: '#444466', marginBottom: 3 }}>
                <span style={{ color: '#6C4EE4', fontWeight: 700 }}>✓</span> {l}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.74rem', color: '#888899', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #f0f0f5' }}>
          <span>👥 {w.enrollmentCount > 0 ? `${(w.enrollmentCount / 1000).toFixed(1)}K` : '0'} students</span>
          <span>⏱ {w.duration}</span>
        </div>

        {/* Email input if not logged in */}
        {showEmailInput && !enrolled && (
          <input
            type="email" placeholder="your@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #6C4EE4', borderRadius: 8, fontSize: '0.82rem', outline: 'none', marginTop: 6 }}
          />
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: '#22A55B', fontWeight: 500 }}>
            <span>✓</span> Certificate Included
          </div>
          <button onClick={handleEnroll} disabled={loading || enrolled} style={{
            padding: '0.45rem 1.1rem', borderRadius: 50,
            background: enrolled ? '#E8F8EF' : '#6C4EE4',
            color: enrolled ? '#22A55B' : '#fff',
            fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.2s',
            cursor: enrolled ? 'default' : 'pointer', border: 'none',
          }}>
            {loading ? '...' : enrolled ? '✓ Enrolled' : 'Start Learning'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Webinars({ onToast }) {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallback = [
    { id: 1, title: 'Introduction to Seniorly', instructor: { firstName: 'Mukul', lastName: 'Preethi' }, level: 'Beginner', rating: { average: 4.8 }, enrollmentCount: 2400, duration: '1 hour', isFree: true, whatYoullLearn: ['Who we are', 'What we do', 'What you get'] },
    { id: 2, title: 'The Beginners', instructor: { firstName: 'Priyanshu', lastName: 'Singh' }, level: 'Beginner', rating: { average: 4.7 }, enrollmentCount: 1800, duration: '1 hour', isFree: true, whatYoullLearn: ['Resource Database', 'Mentor Insights', 'Management Tips'] },
    { id: 3, title: 'Upcoming...', instructor: null, level: 'Beginner', rating: { average: 4.6 }, enrollmentCount: 0, duration: '0 hours', isFree: true, whatYoullLearn: [] },
  ];

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API}/api/webinars?free=true`);
        const data = await res.json();
        if (data.success && data.data.length > 0) setWebinars(data.data);
        else setWebinars(fallback);
      } catch { setWebinars(fallback); }
      finally { setLoading(false); }
    };
    fetch_();
  }, []);

  return (
    <section id="webinars" style={{ padding: '72px 6%', background: '#F4F6FB' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: '#1a1a2e', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Our Webinars
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#888899', maxWidth: 480, margin: '0 auto', lineHeight: 1.65, fontWeight: 300 }}>
            Guidance you can trust, from those who've walked the path.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888899' }}>Loading webinars...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 36 }}>
            {webinars.map(w => <WebinarCard key={w._id || w.id} w={w} onToast={onToast} />)}
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <button style={{
            padding: '0.65rem 2rem', borderRadius: 50,
            border: '1.5px solid #6C4EE4', color: '#6C4EE4', background: 'transparent',
            fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#6C4EE4'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6C4EE4'; }}>
            View All Free Courses
          </button>
        </div>
      </div>
    </section>
  );
}