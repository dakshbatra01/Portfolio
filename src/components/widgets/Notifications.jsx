import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    const notifs = [
      { id: 1, title: 'Welcome to DakshOS', body: 'Try typing "help" in the Terminal', delay: 1500 },
      { id: 2, title: 'Explore Projects', body: 'Open the Browser to see live demos', delay: 4000 },
      { id: 3, title: 'Right-Click Desktop', body: 'Try right-clicking for more options', delay: 7000 },
    ];

    const timers = notifs.map(n =>
      setTimeout(() => {
        setNotifications(prev => [...prev, n]);
        // Auto dismiss after 5s
        setTimeout(() => {
          setDismissed(prev => [...prev, n.id]);
        }, 5000);
      }, n.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const dismiss = (id) => setDismissed(prev => [...prev, id]);
  const visible = notifications.filter(n => !dismissed.includes(n.id));

  if (visible.length === 0) return null;

  return (
    <div style={{
      position: 'absolute', top: '40px', right: '16px', zIndex: 2000,
      display: 'flex', flexDirection: 'column', gap: '8px', width: '280px',
    }}>
      {visible.map((n, i) => (
        <div key={n.id} style={{
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '12px 14px',
          color: '#f1f5f9',
          fontFamily: 'var(--font-ui)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          animation: 'slideIn 0.3s ease-out',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#60a5fa', marginTop: '5px', flexShrink: 0,
            boxShadow: '0 0 6px rgba(96,165,250,0.5)',
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>{n.title}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{n.body}</div>
          </div>
          <button onClick={() => dismiss(n.id)} style={{
            background: 'none', border: 'none', color: '#475569',
            cursor: 'pointer', padding: '2px', flexShrink: 0,
          }}>
            <X size={12} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
