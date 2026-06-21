import React, { useState, useRef, useEffect } from 'react';

export default function Window({ title, children, onClose, onMinimize, onFocus, zIndex = 50, initialSize = { width: 700, height: 450 }, initialPos = { x: 100, y: 100 } }) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState(initialPos);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const windowRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleMouseDown = (e) => {
    onFocus?.();
    if (isMaximized) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: pos.x,
      initialY: pos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({
        x: dragRef.current.initialX + dx,
        y: Math.max(0, dragRef.current.initialY + dy)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const windowStyle = isMaximized ? {
    top: 28,
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 70px)',
    zIndex: 1000,
    borderRadius: 0,
  } : {
    top: pos.y,
    left: pos.x,
    width: initialSize.width,
    height: initialSize.height,
    zIndex: zIndex,
    borderRadius: '10px',
  };

  return (
    <div
      ref={windowRef}
      className="glass-panel window"
      onMouseDown={() => onFocus?.()}
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: isDragging ? 'none' : 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        ...windowStyle
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="window-titlebar"
        style={{ cursor: isMaximized ? 'default' : 'grab' }}
      >
        {/* Window Controls */}
        <div className="window-controls">
          <button 
            className="window-btn"
            onClick={(e) => { e.stopPropagation(); onClose?.(); }}
            style={{ backgroundColor: '#ef4444' }} 
            title="Close"
          />
          <button 
            className="window-btn"
            onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
            style={{ backgroundColor: '#f59e0b' }} 
            title="Minimize"
          />
          <button 
            className="window-btn"
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            style={{ backgroundColor: '#22c55e' }} 
            title="Maximize"
          />
        </div>
        
        <div style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8', letterSpacing: '0.3px' }}>
          {title}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--window-bg)', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}
