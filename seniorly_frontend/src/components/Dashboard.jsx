import React, { useState, useEffect } from 'react';
import { activities, progressData, chartData } from '../data';

function BarChart() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 400); }, []);
  const max = Math.max(...chartData.map(d => d.val));

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100, marginTop: 16 }}>
      {chartData.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            width: '100%', borderRadius: '4px 4px 0 0',
            background: i === chartData.length - 1 ? '#0f0f0f' : '#e2e1dd',
            height: animated ? `${(d.val / max) * 90}%` : '0%',
            transition: `height 0.8s ease ${i * 0.08}s`,
          }} />
          <span style={{ fontSize: '0.65rem', color: '#c0bdb8' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ onAction }) {
  return (
    <section id="dashboard" style={{ padding: '100px 5%', background: '#fafaf8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 52 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Analytics</p>
          <h2 style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#0f0f0f', lineHeight: 1.1 }}>
            Everything you need<br />to track and grow.
          </h2>
        </div>

        {/* Metric row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { val: '2,840', lbl: 'Enrollments this month', trend: '+18%' },
            { val: '94%', lbl: 'Learner satisfaction', trend: '+2%' },
            { val: '₹4.2L', lbl: 'Revenue MTD', trend: '+24%' },
            { val: '186', lbl: 'Certificates issued', trend: '+31%' },
          ].map((m, i) => (
            <div key={i} style={{ background: '#f3f2ef', borderRadius: 14, padding: '1.1rem 1.2rem', border: '1px solid #e2e1dd' }}>
              <div style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: '1.4rem', color: '#0f0f0f', letterSpacing: '-0.02em', marginBottom: 4 }}>{m.val}</div>
              <div style={{ fontSize: '0.73rem', color: '#9a9a9a', fontWeight: 300, marginBottom: 8 }}>{m.lbl}</div>
              <div style={{ fontSize: '0.7rem', color: '#2d6a4f', fontWeight: 600, background: '#eaf4ee', padding: '2px 8px', borderRadius: 50, display: 'inline-block', border: '1px solid #b7dfca' }}>{m.trend}</div>
            </div>
          ))}
        </div>

        {/* Main 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Enrollments chart */}
          <div style={{ background: '#f3f2ef', border: '1px solid #e2e1dd', borderRadius: 18, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <h4 style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.9rem', color: '#0f0f0f' }}>Monthly Enrollments</h4>
              <span style={{ fontSize: '0.72rem', color: '#c0bdb8' }}>Last 6 months</span>
            </div>
            <BarChart />
          </div>

          {/* Live activity */}
          <div style={{ background: '#f3f2ef', border: '1px solid #e2e1dd', borderRadius: 18, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <h4 style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.9rem', color: '#0f0f0f' }}>Live Activity</h4>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2d6a4f', animation: 'pulse 2s infinite' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activities.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: '0.82rem', color: '#6b6b6b', fontWeight: 300 }}>{a.text}</div>
                  <div style={{ fontSize: '0.72rem', color: '#c0bdb8', flexShrink: 0 }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Progress */}
          <div style={{ background: '#f3f2ef', border: '1px solid #e2e1dd', borderRadius: 18, padding: '1.5rem' }}>
            <h4 style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.9rem', color: '#0f0f0f', marginBottom: 20 }}>Your Progress</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {progressData.map((p, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: '0.82rem' }}>
                    <span style={{ color: '#6b6b6b', fontWeight: 300 }}>{p.title}</span>
                    <span style={{ fontFamily: 'Fraunces', fontWeight: 700, color: '#0f0f0f' }}>{p.pct}%</span>
                  </div>
                  <div style={{ background: '#e2e1dd', borderRadius: 50, height: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: '#0f0f0f', borderRadius: 50, transition: 'width 1.2s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#f3f2ef', border: '1px solid #e2e1dd', borderRadius: 18, padding: '1.5rem' }}>
            <h4 style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.9rem', color: '#0f0f0f', marginBottom: 16 }}>Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Enroll in new course', action: 'enroll' },
                { label: 'Download certificate', action: 'cert' },
                { label: 'Generate report', action: 'report' },
                { label: 'Manage notifications', action: 'notify' },
              ].map((btn, i) => (
                <button key={i} onClick={() => onAction(btn.action)} style={{
                  width: '100%', textAlign: 'left', padding: '0.7rem 1rem',
                  border: '1px solid #d0cec9', borderRadius: 10, background: '#fafaf8',
                  color: '#3a3a3a', fontSize: '0.85rem', fontWeight: 400,
                  transition: 'all 0.18s', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f0f0f'; e.currentTarget.style.background = '#0f0f0f'; e.currentTarget.style.color = '#fafaf8'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0cec9'; e.currentTarget.style.background = '#fafaf8'; e.currentTarget.style.color = '#3a3a3a'; }}>
                  {btn.label} →
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </section>
  );
}
