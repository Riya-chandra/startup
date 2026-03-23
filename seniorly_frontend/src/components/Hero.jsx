import React from 'react';

export default function Hero({ onRegister }) {
  return (
    <section style={{
      background: 'linear-gradient(160deg, #8B6FF0 0%, #6C4EE4 45%, #5038C8 100%)',
      minHeight: '52vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', textAlign: 'center',
      padding: '110px 6% 70px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle background circles */}
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,0.05)', top:-100, right:-80, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.04)', bottom:-60, left:-40, pointerEvents:'none' }} />

      <h1 style={{
        fontFamily: "'Fraunces', serif",
        fontWeight: 700, fontSize: 'clamp(1.9rem, 5vw, 3rem)',
        color: '#fff', lineHeight: 1.18, marginBottom: 18, maxWidth: 600,
        letterSpacing: '-0.02em',
      }}>
        Learn Better, Grow Smarter —<br />You're in the Right Place!
      </h1>

      <p style={{
        fontSize: '0.96rem', color: 'rgba(255,255,255,0.82)',
        maxWidth: 440, lineHeight: 1.65, marginBottom: 36, fontWeight: 300,
      }}>
        Discover smarter ways to study with curated resources and proven strategies. Here, we help you learn efficiently and achieve more with less stress.
      </p>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onRegister} style={{
          padding: '0.7rem 2rem', borderRadius: 50,
          background: 'rgba(255,255,255,0.18)', color: '#fff',
          border: '1.5px solid rgba(255,255,255,0.5)',
          fontSize: '0.92rem', fontWeight: 500, transition: 'all 0.2s',
          backdropFilter: 'blur(4px)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}>
          Start
        </button>
        <a href="#upcoming" style={{
          padding: '0.7rem 2rem', borderRadius: 50,
          background: '#fff', color: '#6C4EE4',
          fontSize: '0.92rem', fontWeight: 600,
          display: 'inline-flex', alignItems: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          Upcoming
        </a>
      </div>
    </section>
  );
}
