import React from 'react';
import { upcoming } from '../data';

const TAG_STYLE = {
  Live: { bg: '#fdf3dc', color: '#c8820a', border: '#f0d090' },
  Workshop: { bg: '#eff3fe', color: '#1d4ed8', border: '#bfcffb' },
  Cohort: { bg: '#eaf4ee', color: '#2d6a4f', border: '#b7dfca' },
};

export default function Upcoming({ onNotify }) {
  return (
    <section id="upcoming" style={{ padding: '100px 5%', background: '#f3f2ef' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 52 }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Coming Soon</p>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#0f0f0f', lineHeight: 1.1 }}>
              Upcoming launches
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#9a9a9a', fontWeight: 300 }}>
            Reserve your spot early.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid #e2e1dd', borderRadius: 18, overflow: 'hidden' }}>
          {upcoming.map((u, i) => {
            const tag = TAG_STYLE[u.tag] || TAG_STYLE.Live;
            return (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', gap: 28,
                padding: '1.5rem 2rem', background: '#fafaf8',
                borderBottom: i < upcoming.length - 1 ? '1px solid #e2e1dd' : 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8f7f4'}
              onMouseLeave={e => e.currentTarget.style.background = '#fafaf8'}>

                {/* Date */}
                <div style={{ textAlign: 'center', minWidth: 48, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: '1.5rem', color: '#0f0f0f', lineHeight: 1 }}>{u.day}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>{u.month}</div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 44, background: '#e2e1dd', flexShrink: 0 }} />

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '2px 9px', borderRadius: 50,
                      background: tag.bg, color: tag.color, border: `1px solid ${tag.border}`,
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>{u.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '1rem', color: '#0f0f0f', letterSpacing: '-0.01em', marginBottom: 3 }}>{u.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#9a9a9a', fontWeight: 300 }}>
                    {u.instructor} &nbsp;·&nbsp; {u.seats} seats
                  </p>
                </div>

                {/* Action */}
                <button onClick={() => onNotify(u.title)} style={{
                  padding: '0.45rem 1.1rem', borderRadius: 50, flexShrink: 0,
                  border: '1px solid #d0cec9', background: 'transparent',
                  color: '#3a3a3a', fontSize: '0.8rem', fontWeight: 400,
                  transition: 'all 0.18s', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f0f0f'; e.currentTarget.style.color = '#0f0f0f'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0cec9'; e.currentTarget.style.color = '#3a3a3a'; }}>
                  Notify me
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
