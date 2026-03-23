import React from 'react';
import { testimonials } from '../data';

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: '100px 5%', background: '#0f0f0f' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Outcomes</p>
          <h2 style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#fafaf8', lineHeight: 1.1 }}>
            Real learners,<br />real results.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {testimonials.map(t => (
            <div key={t.id} style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 18, padding: '2rem',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'none'; }}>

              <p style={{ fontSize: '0.95rem', color: '#a0a0a0', lineHeight: 1.72, marginBottom: 28, fontWeight: 300, fontStyle: 'italic' }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: '1px solid #2a2a2a' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#2a2a2a', border: '1px solid #3a3a3a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.78rem', color: '#6b6b6b' }}>{t.initials}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: '0.88rem', color: '#fafaf8' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#c8820a', marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
