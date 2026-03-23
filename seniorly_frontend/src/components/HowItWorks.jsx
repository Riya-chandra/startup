import React from 'react';

const steps = [
  { n: '01', title: 'Create your account', desc: 'Free sign-up. No credit card needed to browse courses and start free content.' },
  { n: '02', title: 'Choose your path', desc: 'Browse 200+ courses across development, design, data science, and business.' },
  { n: '03', title: 'Learn at your pace', desc: 'Video lessons, projects, quizzes. Access lifetime — revisit any time.' },
  { n: '04', title: 'Get certified', desc: 'Earn a verified certificate on completion. Share it directly on LinkedIn.' },
];

export default function HowItWorks() {
  return (
    <section id="how" style={{ padding: '100px 5%', background: '#fafaf8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 60 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Process</p>
          <h2 style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#0f0f0f', lineHeight: 1.1 }}>
            Four steps to your<br />next opportunity.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0, border: '1px solid #e2e1dd', borderRadius: 18, overflow: 'hidden' }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              padding: '2.25rem 2rem',
              borderRight: i < steps.length - 1 ? '1px solid #e2e1dd' : 'none',
              background: '#fafaf8',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f3f2ef'}
            onMouseLeave={e => e.currentTarget.style.background = '#fafaf8'}>
              <div style={{ fontFamily: 'Fraunces', fontSize: '2rem', fontWeight: 800, color: '#e2e1dd', marginBottom: 28, lineHeight: 1 }}>{s.n}</div>
              <h3 style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '1rem', color: '#0f0f0f', marginBottom: 12, letterSpacing: '-0.01em' }}>{s.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#9a9a9a', lineHeight: 1.65, fontWeight: 300 }}>{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
