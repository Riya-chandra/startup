import React from 'react';
import { whyChoose } from '../data';

export default function WhyChoose() {
  return (
    <section style={{ padding:'72px 6%', background:'#F4F6FB' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:'clamp(1.6rem,3.5vw,2.1rem)', color:'#1a1a2e', textAlign:'center', letterSpacing:'-0.02em', marginBottom:44 }}>
          Why Choose Our Platform?
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:20 }}>
          {whyChoose.map((item, i) => (
            <div key={i} style={{
              background:'#fff', border:'1px solid #e2e4ee',
              borderRadius:16, padding:'2rem 1.5rem',
              textAlign:'center', transition:'all 0.22s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#6C4EE4'; e.currentTarget.style.boxShadow='0 8px 28px rgba(108,78,228,0.1)'; e.currentTarget.style.transform='translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e4ee'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
              <div style={{ fontSize:'2rem', marginBottom:14 }}>{item.icon}</div>
              <h3 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:'1rem', color:'#1a1a2e', marginBottom:10, lineHeight:1.3 }}>
                {item.title}
              </h3>
              <p style={{ fontSize:'0.82rem', color:'#888899', lineHeight:1.65, fontWeight:300 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
