import React, { useEffect } from 'react';

export default function Toast({ message, visible, onHide }) {
  useEffect(() => {
    if (visible) { const t = setTimeout(onHide, 3200); return () => clearTimeout(t); }
  }, [visible, onHide]);

  return (
    <div style={{
      position:'fixed', bottom:26, right:26, zIndex:2000,
      background:'#1a1a2e', color:'#fff',
      border:'1px solid rgba(255,255,255,0.1)', borderRadius:12,
      padding:'0.82rem 1.25rem', fontSize:'0.86rem', fontWeight:400,
      boxShadow:'0 8px 32px rgba(0,0,0,0.25)',
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      opacity: visible ? 1 : 0,
      transition:'all 0.32s ease',
      pointerEvents: visible ? 'auto' : 'none',
      maxWidth:300,
    }}>
      {message}
    </div>
  );
}
