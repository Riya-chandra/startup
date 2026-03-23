import React from 'react';

const features = [
  { icon: '○', title: 'Course Management', desc: 'Create, publish, and organize courses with rich multimedia, quizzes, and structured learning paths.' },
  { icon: '◈', title: 'Analytics Dashboard', desc: 'Track learner progress, engagement metrics, completion rates, and revenue with real-time reporting.' },
  { icon: '◇', title: 'Certificate Engine', desc: 'Auto-issue verified certificates on completion. Learners can share directly to LinkedIn.' },
  { icon: '◎', title: 'Email Campaigns', desc: 'Automated newsletters, drip sequences, and re-engagement flows. Manage subscriptions cleanly.' },
  { icon: '⬡', title: 'Enrollment & Payments', desc: 'Flexible payment processing with coupon codes, free previews, and subscription tiers.' },
  { icon: '△', title: 'Progress Tracking', desc: 'Granular lesson-level tracking, time-spent analytics, and personalised learning recommendations.' },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '100px 5%', background: '#f3f2ef' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 60 }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              Platform Features
            </p>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#0f0f0f', lineHeight: 1.1 }}>
              Everything an educator<br />needs, nothing they don't.
            </h2>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#6b6b6b', maxWidth: 320, lineHeight: 1.7, fontWeight: 300 }}>
            A focused set of tools built for serious educators and learners. No bloat, no distractions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 1, border: '1px solid #e2e1dd', borderRadius: 18, overflow: 'hidden' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: '2rem 1.75rem', background: '#f3f2ef',
              borderRight: '1px solid #e2e1dd', borderBottom: '1px solid #e2e1dd',
              transition: 'background 0.2s',
              cursor: 'default'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
            onMouseLeave={e => e.currentTarget.style.background = '#f3f2ef'}>
              <div style={{ fontSize: '1.3rem', color: '#9a9a9a', marginBottom: 18, lineHeight: 1 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '1rem', color: '#0f0f0f', marginBottom: 10, letterSpacing: '-0.01em' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6b6b6b', lineHeight: 1.65, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
