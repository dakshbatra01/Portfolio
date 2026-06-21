import React from 'react';
import { Monitor, Clock, Music, Bell, Eye, EyeOff } from 'lucide-react';

export default function DisplaySettings({ widgets, onToggle, currentWallpaper, onWallpaperChange }) {
  const widgetList = [
    { id: 'clock', label: 'Desktop Clock', description: 'Large date & time display on the right', icon: <Clock size={18} /> },
    { id: 'music', label: 'Music Player', description: 'Mini music player widget on the bottom-left', icon: <Music size={18} /> },
    { id: 'notifications', label: 'Notifications', description: 'Welcome notifications on startup', icon: <Bell size={18} /> },
  ];

  const wallpapers = [
    { name: 'Minimal Peak', url: '/pf_bg.png' },
    { name: 'Default Anime', url: '/anime-wallpaper.png' },
    { name: 'Porche', url: '/wp4.avif' },
    { name: 'Naruto', url: '/Wp5.jpeg' },
  ];

  return (
    <div style={{
      height: '100%', background: '#0a0f1e', color: '#e2e8f0',
      fontFamily: 'var(--font-ui)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Monitor size={20} color="#60a5fa" />
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Display Settings</h2>
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Customize your desktop widgets and appearance</p>
      </div>

      {/* Settings Scroll Area */}
      <div style={{ flex: 1, padding: '16px 24px', overflowY: 'auto' }}>
        <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Widgets
        </div>

        {widgetList.map(w => (
          <div key={w.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', marginBottom: '8px',
            background: 'rgba(30,41,59,0.4)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '12px',
            transition: 'background 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ color: widgets[w.id] ? '#60a5fa' : '#334155', transition: 'color 0.2s' }}>
                {w.icon}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#e2e8f0' }}>{w.label}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{w.description}</div>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => onToggle(w.id)}
              style={{
                width: '44px', height: '24px', borderRadius: '12px',
                border: 'none', cursor: 'pointer',
                background: widgets[w.id] ? '#3b82f6' : '#1e293b',
                position: 'relative', transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff',
                position: 'absolute', top: '3px',
                left: widgets[w.id] ? '23px' : '3px',
                transition: 'left 0.2s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        ))}

        <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '24px', marginBottom: '12px' }}>
          Wallpapers
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {wallpapers.map(wp => (
            <div
              key={wp.url}
              onClick={() => onWallpaperChange(wp.url)}
              style={{
                cursor: 'pointer',
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                aspectRatio: '16/9',
                border: currentWallpaper === wp.url ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <img src={wp.url} alt={wp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {currentWallpaper === wp.url && (
                <div style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: '#3b82f6', borderRadius: '50%', padding: '2px'
                }}>
                  <Eye size={10} color="#fff" />
                </div>
              )}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.6)', padding: '4px 8px', fontSize: '10px'
              }}>
                {wp.name}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '12px', marginBottom: '12px' }}>
          System Info
        </div>

        <div style={{
          padding: '14px 16px',
          background: 'rgba(30,41,59,0.4)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '12px',
          fontSize: '12px', color: '#94a3b8', lineHeight: '1.8',
          marginBottom: '20px'
        }}>
          <div><span style={{ color: '#64748b' }}>OS:</span> DakshOS v2.0</div>
          <div><span style={{ color: '#64748b' }}>Desktop:</span> DakshDE (React 19)</div>
          <div><span style={{ color: '#64748b' }}>Theme:</span> Cyberpunk Dark</div>
          <div><span style={{ color: '#64748b' }}>Resolution:</span> {window.innerWidth}×{window.innerHeight}</div>
        </div>
      </div>
    </div>
  );
}
