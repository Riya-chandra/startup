import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background:'#1a1a2e', padding:'32px 6%', textAlign:'center' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:12 }}>
        <div style={{ width:28, height:28, borderRadius:7, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:13, color:'#6C4EE4', fontStyle:'italic' }}>S</span>
        </div>
        <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:'1rem', color:'#fff', letterSpacing:'-0.3px' }}>Seniorly</span>
      </div>
      <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.35)', fontWeight:300 }}>
        © 2026 Seniorly. Made by Seniorly Team.
      </p>
    </footer>
  );
}
