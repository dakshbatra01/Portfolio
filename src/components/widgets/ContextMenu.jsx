import React from 'react';
import { Terminal, Globe, FolderOpen, RefreshCw, Info, Monitor } from 'lucide-react';

export default function ContextMenu({ x, y, onClose, onAction }) {
  const items = [
    { label: 'Open Terminal', icon: <Terminal size={14} />, action: 'terminal' },
    { label: 'Open Browser', icon: <Globe size={14} />, action: 'browser' },
    { label: 'Open Files', icon: <FolderOpen size={14} />, action: 'files' },
    { type: 'separator' },
    { label: 'Refresh Desktop', icon: <RefreshCw size={14} />, action: 'refresh' },
    { label: 'Display Settings', icon: <Monitor size={14} />, action: 'display' },
    { type: 'separator' },
    { label: 'About DakshOS', icon: <Info size={14} />, action: 'about' },
  ];

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000,
      }} />
      <div style={{
        position: 'fixed', top: y, left: x, zIndex: 3001,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '6px',
        minWidth: '180px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
        fontFamily: 'var(--font-ui)',
        animation: 'menuPop 0.15s ease-out',
      }}>
        {items.map((item, i) =>
          item.type === 'separator' ? (
            <div key={i} style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 8px' }} />
          ) : (
            <div
              key={i}
              onClick={() => { onAction(item.action); onClose(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 12px', borderRadius: '6px',
                color: '#cbd5e1', fontSize: '12px', cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#64748b' }}>{item.icon}</span>
              {item.label}
            </div>
          )
        )}
      </div>
      <style>{`
        @keyframes menuPop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
