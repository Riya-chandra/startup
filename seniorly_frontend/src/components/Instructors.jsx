import React from 'react';
import { instructors } from '../data';

export default function Instructors() {
  return (
    <section id="instructors" style={{ padding: '100px 5%', background: '#f3f2ef' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 52 }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Instructors</p>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#0f0f0f', lineHeight: 1.1 }}>
              Taught by practitioners,<br />not academics.
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#9a9a9a', maxWidth: 280, lineHeight: 1.65, fontWeight: 300 }}>
            Every instructor has shipped real products and worked at companies you've heard of.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {instructors.map(inst => (
            <div key={inst.id} style={{
              background: '#fafaf8', border: '1px solid #e2e1dd',
              borderRadius: 18, padding: '1.75rem',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f0f0f'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e1dd'; e.currentTarget.style.transform = 'none'; }}>

              {/* Avatar */}
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#0f0f0f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <span style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.9rem', color: '#fafaf8', letterSpacing: '0.02em' }}>{inst.initials}</span>
              </div>

              <h3 style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '1rem', color: '#0f0f0f', marginBottom: 4, letterSpacing: '-0.01em' }}>{inst.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#c8820a', marginBottom: 14, fontWeight: 500 }}>{inst.role}</p>
              <p style={{ fontSize: '0.83rem', color: '#9a9a9a', lineHeight: 1.6, marginBottom: 20, fontWeight: 300 }}>{inst.bio}</p>

              <div style={{ display: 'flex', gap: '1.5rem', paddingTop: 16, borderTop: '1px solid #e2e1dd' }}>
                <div>
                  <div style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.95rem', color: '#0f0f0f' }}>{inst.courses}</div>
                  <div style={{ fontSize: '0.72rem', color: '#c0bdb8', fontWeight: 300 }}>courses</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.95rem', color: '#0f0f0f' }}>{(inst.students / 1000).toFixed(1)}K</div>
                  <div style={{ fontSize: '0.72rem', color: '#c0bdb8', fontWeight: 300 }}>students</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.95rem', color: '#0f0f0f' }}>★ {inst.rating}</div>
                  <div style={{ fontSize: '0.72rem', color: '#c0bdb8', fontWeight: 300 }}>rating</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
