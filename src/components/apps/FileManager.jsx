import React, { useState } from 'react';
import { Folder, FileText, ArrowLeft, Eye } from 'lucide-react';
import { fileSystem } from '../../data/resumeData';

export default function FileManager() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);

  const files = Object.keys(fileSystem);

  const getFileIcon = (name) => {
    return <FileText size={32} color="#60a5fa" />;
  };

  const getFileSize = (name) => {
    const bytes = fileSystem[name].length;
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  if (viewingFile) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: '#0a0f1e', color: '#e2e8f0', fontFamily: 'var(--font-ui)',
      }}>
        {/* File viewer toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 16px',
          background: 'rgba(15,23,42,0.9)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button onClick={() => setViewingFile(null)} style={{
            background: 'none', border: 'none', color: '#94a3b8',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', padding: '4px 8px', borderRadius: '6px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ fontSize: '12px', color: '#64748b' }}>~/home/daksh/{viewingFile}</div>
        </div>
        {/* File content */}
        <div style={{
          flex: 1, padding: '20px 24px', overflowY: 'auto',
          fontFamily: 'var(--font-mono)', fontSize: '13px',
          lineHeight: '1.7', whiteSpace: 'pre-wrap', color: '#cbd5e1',
        }}>
          {fileSystem[viewingFile]}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#0a0f1e', color: '#e2e8f0', fontFamily: 'var(--font-ui)',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 16px',
        background: 'rgba(15,23,42,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Folder size={16} color="#facc15" />
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>~/home/daksh</span>
        <span style={{ fontSize: '11px', color: '#475569', marginLeft: 'auto' }}>{files.length} items</span>
      </div>

      {/* File grid */}
      <div style={{
        flex: 1, padding: '20px', overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '8px',
        alignContent: 'start',
      }}>
        {files.map(name => (
          <div
            key={name}
            onClick={() => setSelectedFile(name)}
            onDoubleClick={() => setViewingFile(name)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '14px 8px', borderRadius: '10px', cursor: 'pointer',
              background: selectedFile === name ? 'rgba(96,165,250,0.12)' : 'transparent',
              border: selectedFile === name ? '1px solid rgba(96,165,250,0.3)' : '1px solid transparent',
              transition: 'all 0.15s',
              gap: '8px',
              width: '100%',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              if (selectedFile !== name) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
            onMouseLeave={e => {
              if (selectedFile !== name) e.currentTarget.style.background = 'transparent';
            }}
          >
            {getFileIcon(name)}
            <div style={{
              fontSize: '11px', color: '#cbd5e1', textAlign: 'center',
              width: '100%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap',
              lineHeight: '1.3',
            }} title={name}>{name}</div>
            <div style={{ fontSize: '9px', color: '#475569' }}>{getFileSize(name)}</div>
          </div>
        ))}
      </div>

      {/* Bottom status bar */}
      {selectedFile && (
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(15,23,42,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{selectedFile} — {getFileSize(selectedFile)}</span>
          <button onClick={() => setViewingFile(selectedFile)} style={{
            background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)',
            borderRadius: '6px', padding: '4px 12px', color: '#60a5fa',
            cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Eye size={12} /> Open
          </button>
        </div>
      )}
    </div>
  );
}
