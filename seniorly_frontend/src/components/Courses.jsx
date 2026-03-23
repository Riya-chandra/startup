import React, { useState } from 'react';
import { courses } from '../data';

const FILTERS = ['All', 'Development', 'Design', 'Data', 'Business'];
const LEVEL_COLOR = { Beginner: '#2d6a4f', Intermediate: '#c8820a', Advanced: '#8B4513' };

function CourseCard({ course, onEnroll }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fafaf8', border: '1px solid',
        borderColor: hovered ? '#0f0f0f' : '#e2e1dd',
        borderRadius: 18, overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'default',
      }}>

      {/* Thumb */}
      <div style={{
        height: 160, background: '#eae9e5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid #e2e1dd', position: 'relative'
      }}>
        <span style={{ fontSize: '2.5rem', opacity: 0.35 }}>{course.emoji}</span>
        {course.free && (
          <span style={{
            position: 'absolute', top: 14, right: 14,
            background: '#eaf4ee', color: '#2d6a4f',
            border: '1px solid #b7dfca',
            fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 50,
            letterSpacing: '0.04em', textTransform: 'uppercase'
          }}>Free</span>
        )}
      </div>

      <div style={{ padding: '1.25rem 1.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, color: LEVEL_COLOR[course.level] || '#6b6b6b',
            textTransform: 'uppercase', letterSpacing: '0.07em'
          }}>{course.level}</span>
          <span style={{ fontSize: '0.78rem', color: '#9a9a9a' }}>
            ★ {course.rating} <span style={{ color: '#c0bdb8' }}>({course.reviews})</span>
          </span>
        </div>

        <h3 style={{
          fontFamily: 'Fraunces', fontWeight: 700, fontSize: '0.97rem', color: '#0f0f0f',
          marginBottom: 7, lineHeight: 1.35, letterSpacing: '-0.01em'
        }}>{course.title}</h3>

        <p style={{ fontSize: '0.83rem', color: '#9a9a9a', marginBottom: 14, lineHeight: 1.55, fontWeight: 300 }}>
          {course.sub}
        </p>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#9a9a9a', marginBottom: 18 }}>
          <span>⏱ {course.duration}</span>
          <span>👥 {(course.students / 1000).toFixed(1)}K students</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e1dd', paddingTop: 14 }}>
          <div>
            {course.free
              ? <span style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '1rem', color: '#2d6a4f' }}>Free</span>
              : <>
                  <span style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: '1rem', color: '#0f0f0f' }}>₹{course.price.toLocaleString()}</span>
                  <span style={{ fontSize: '0.78rem', color: '#c0bdb8', marginLeft: 6, textDecoration: 'line-through' }}>₹{course.originalPrice.toLocaleString()}</span>
                </>
            }
          </div>
          <button onClick={() => onEnroll(course.title)} style={{
            padding: '0.4rem 1rem', borderRadius: 50,
            background: 'transparent', border: '1px solid #0f0f0f',
            color: '#0f0f0f', fontSize: '0.78rem', fontWeight: 500,
            transition: 'all 0.2s', cursor: 'pointer'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0f0f0f'; e.currentTarget.style.color = '#fafaf8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0f0f0f'; }}>
            Enroll →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Courses({ onEnroll }) {
  const [active, setActive] = useState('All');

  const filtered = active === 'All'
    ? courses
    : courses.filter(c => c.cat.toLowerCase() === active.toLowerCase());

  return (
    <section id="courses" style={{ padding: '100px 5%', background: '#fafaf8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 52 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
            Course Catalog
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', color: '#0f0f0f', lineHeight: 1.1 }}>
              {filtered.length} course{filtered.length !== 1 ? 's' : ''}
              {active !== 'All' && <span style={{ color: '#9a9a9a', fontStyle: 'italic', fontWeight: 600 }}> in {active}</span>}
            </h2>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActive(f)} style={{
                  padding: '0.4rem 1rem', borderRadius: 50, fontSize: '0.82rem',
                  border: '1px solid', cursor: 'pointer',
                  borderColor: active === f ? '#0f0f0f' : '#d0cec9',
                  background: active === f ? '#0f0f0f' : 'transparent',
                  color: active === f ? '#fafaf8' : '#6b6b6b',
                  fontWeight: active === f ? 500 : 400,
                  transition: 'all 0.18s',
                }}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(c => <CourseCard key={c.id} course={c} onEnroll={onEnroll} />)}
        </div>

      </div>
    </section>
  );
}
