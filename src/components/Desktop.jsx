import React, { useState, useEffect } from 'react';
import Window from './Window';
import TerminalApp from './apps/Terminal';
import SnakeApp from './apps/Snake';
import TicTacToeApp from './apps/TicTacToe';
import BrowserApp from './apps/Browser';
import FileManagerApp from './apps/FileManager';
import DisplaySettings from './apps/DisplaySettings';
import MusicPlayer from './widgets/MusicPlayer';
import Notifications from './widgets/Notifications';
import ContextMenu from './widgets/ContextMenu';
import { Wifi, Battery, Volume2 } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Desktop() {
  const [openApps, setOpenApps] = useState(['terminal']);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [focusedAppId, setFocusedAppId] = useState('terminal');
  const [time, setTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState(null);
  const [widgets, setWidgets] = useState({ clock: true, music: true, notifications: true });
  const [wallpaper, setWallpaper] = useState('/pf_bg.png');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appId) => {
    if (minimizedApps.includes(appId)) {
      setMinimizedApps(minimizedApps.filter(id => id !== appId));
    } else if (!openApps.includes(appId)) {
      setOpenApps([...openApps, appId]);
    }
    setFocusedAppId(appId);
  };

  const closeApp = (appId) => {
    setOpenApps(openApps.filter(id => id !== appId));
    setMinimizedApps(minimizedApps.filter(id => id !== appId));
    if (focusedAppId === appId) setFocusedAppId(null);
  };

  const minimizeApp = (appId) => {
    if (!minimizedApps.includes(appId)) {
      setMinimizedApps([...minimizedApps, appId]);
    }
    if (focusedAppId === appId) setFocusedAppId(null);
  };

  const focusApp = (appId) => {
    setFocusedAppId(appId);
  };

  const toggleWidget = (id) => {
    setWidgets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContextMenu = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.desktop-clock') || e.target.closest('.music-widget')) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleContextAction = (action) => {
    switch (action) {
      case 'terminal': openApp('terminal'); break;
      case 'browser': openApp('browser'); break;
      case 'files': openApp('files'); break;
      case 'refresh': window.location.reload(); break;
      case 'display': openApp('settings'); break;
      case 'about': openApp('terminal'); break;
    }
  };

  const iconStyle = { width: 36, height: 36, borderRadius: 10, objectFit: 'contain' };

  const appsConfig = {
    terminal: { 
      title: 'Terminal', 
      component: <TerminalApp />, 
      icon: <img src="/terminal-logo.png" alt="Terminal" style={iconStyle} />,
      dock: true,
    },
    browser: { title: 'Browser', component: <BrowserApp />, icon: <img src="/browser.png" alt="Browser" style={iconStyle} />, dock: true },
    files: { title: 'Files', component: <FileManagerApp />, icon: <img src="/files.png" alt="Files" style={iconStyle} />, dock: true },
    snake: { title: 'Snake', component: <SnakeApp />, icon: <img src="/snake-game.png" alt="Snake" style={iconStyle} />, dock: true },
    tictactoe: { title: 'Tic-Tac-Toe', component: <TicTacToeApp />, icon: <img src="/tictac.png" alt="Tic-Tac-Toe" style={iconStyle} />, dock: true },
    settings: { 
      title: 'Display Settings', 
      component: <DisplaySettings widgets={widgets} onToggle={toggleWidget} currentWallpaper={wallpaper} onWallpaperChange={setWallpaper} />, 
      icon: null,
      dock: false,
    },
  };

  const dayName = DAYS[time.getDay()];
  const monthName = MONTHS[time.getMonth()];
  const dateNum = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;

  return (
    <div className="desktop-bg" style={{ position: 'relative', backgroundImage: `url(${wallpaper})` }} onContextMenu={handleContextMenu}>
      
      {/* Minimal Top Bar */}
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/D.png" alt="DakshOS Logo" style={{ width: 14, height: 14, objectFit: 'contain' }} />
          <span style={{ fontWeight: '600', fontSize: '12px', color: '#f8fafc' }}>DakshOS</span>
          <span style={{ fontWeight: '400', fontSize: '11px', color: '#475569' }}>|</span>
          <span style={{ fontWeight: '500', fontSize: '12px', color: '#cbd5e1' }}>Activities</span>
        </div>
        <div style={{ fontWeight: '500', fontSize: '12px' }}>
          {dayName.slice(0, 3)} {monthName.slice(0, 3)} {dateNum}  {displayHour}:{minutes} {ampm}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.7 }}>
          <Wifi size={13} strokeWidth={2} />
          <Volume2 size={13} strokeWidth={2} />
          <Battery size={13} strokeWidth={2} />
        </div>
      </div>

      {/* Widgets Container */}
      <div className="widget-container">
        {/* Large Desktop Clock — right side */}
        {widgets.clock && (
          <div className="desktop-clock">
            <div className="clock-month">
              {monthName}
            </div>
            <div className="clock-day-num">
              {dateNum}
            </div>
            <div className="clock-day-name">
              {dayName}
            </div>
            <div className="clock-time">
              {displayHour}:{minutes}<span style={{ fontSize: '0.5em', marginLeft: '4px', opacity: 0.6 }}>{ampm}</span>
            </div>
          </div>
        )}

        {/* Music Player Widget — bottom left */}
        {widgets.music && (
          <div className="music-widget">
            <MusicPlayer />
          </div>
        )}
      </div>

      {/* Notifications */}
      {widgets.notifications && <Notifications />}

      {/* Right-click Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}

      {/* Bottom Dock */}
      <div className="dock">
        {Object.entries(appsConfig).filter(([_, app]) => app.dock).map(([id, app]) => (
          <div key={id} className="dock-item" onClick={() => openApp(id)}>
            <div className="tooltip">{app.title}</div>
            {app.icon}
            {openApps.includes(id) && <div className="dot" />}
          </div>
        ))}
      </div>

      {/* Render Open Windows */}
      {openApps.map(id => {
        if (minimizedApps.includes(id)) return null;
        const app = appsConfig[id];
        return (
          <Window 
            key={id} 
            title={app.title} 
            onClose={() => closeApp(id)}
            onMinimize={() => minimizeApp(id)}
            onFocus={() => focusApp(id)}
            zIndex={focusedAppId === id ? 100 : 50}
            initialPos={{ x: 80 + Math.random() * 60, y: 50 + Math.random() * 30 }}
            initialSize={id === 'settings' ? { width: 420, height: 480 } : { width: 700, height: 460 }}
          >
            {app.component}
          </Window>
        );
      })}
    </div>
  );
}
