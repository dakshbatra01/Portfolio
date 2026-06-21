import React, { useState, useEffect, useRef } from 'react';

// Generate random hex strings
const hex = (n = 8) => Array.from({length: n}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
// Generate random IP
const randIP = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
// Random port
const randPort = () => [22, 80, 443, 3000, 5432, 8080, 8443, 27017, 6379, 9200][Math.floor(Math.random()*10)];
// Random binary chunk
const randBin = () => Array.from({length: 32}, () => Math.random() > 0.5 ? '1' : '0').join('');

const BOOT_SEQUENCE = [
  // BIOS
  { text: '', delay: 100 },
  { text: 'DakshBIOS (C) 2026 Daksh Systems Inc.', color: '#10b981', delay: 50 },
  { text: 'POST: CPU OK | RAM 65536MB OK | GPU OK | DISK OK', color: '#10b981', delay: 50 },
  { text: '', delay: 30 },
  
  // Kernel
  { text: 'Loading kernel image... vmlinuz-6.5.0-daksh', color: '#fff', delay: 80 },
  { text: `[    0.000000] Linux version 6.5.0 (daksh@dev) (gcc 13.2)`, color: '#64748b', delay: 25 },
  { text: `[    0.000001] Command: BOOT_IMAGE=/boot/vmlinuz root=/dev/nvme0n1p2`, color: '#64748b', delay: 20 },
  { text: `[    0.012045] DMI: DakshSystems Portfolio-X/CLI, BIOS v4.2`, color: '#64748b', delay: 20 },
  { text: `[    0.034000] tsc: Detected 5800.000 MHz processor`, color: '#64748b', delay: 20 },
  { text: `[    0.067332] Memory: 65536MB/65536MB available`, color: '#64748b', delay: 20 },
  { text: `[    0.089100] CPU: 24 cores / 32 threads online`, color: '#64748b', delay: 20 },
  { text: `[    0.101244] NVIDIA: Loaded driver 545.29.06 for RTX 4090`, color: '#64748b', delay: 20 },
  { text: `[    0.134500] NET: IPv4/IPv6 protocol stack initialized`, color: '#64748b', delay: 20 },
  { text: `[    0.201003] Freeing unused kernel memory: 2048K`, color: '#64748b', delay: 20 },
  { text: '', delay: 30 },
  
  // systemd
  { text: '[  OK  ] Started Journal Service.', status: 'ok', delay: 60 },
  { text: '[  OK  ] Started Device Manager.', status: 'ok', delay: 60 },
  { text: '[  OK  ] Reached target Local File Systems.', status: 'ok', delay: 60 },
  { text: '[  OK  ] Started NetworkManager.', status: 'ok', delay: 60 },
  { text: '[  OK  ] Started OpenSSH Server.', status: 'ok', delay: 60 },
  { text: '[  OK  ] Started Firewall.', status: 'ok', delay: 60 },
  { text: '', delay: 40 },

  // === THE CRAZY PART ===
  { text: '[ INIT ] DakshOS Security Layer v3.1', color: '#10b981', delay: 100 },
  { text: '', delay: 50 },
  
  // Port scan
  { text: '> Running port scan on local network...', color: '#10b981', delay: 80 },
  ...Array.from({length: 8}, () => ({ 
    text: `  SCAN ${randIP()}:${randPort()} .......... [OPEN]`, 
    color: '#10b981', delay: 30, gen: true 
  })),
  { text: `  8 services detected. All ports secured.`, color: '#fff', delay: 60 },
  { text: '', delay: 40 },

  // Decryption sequence
  { text: '> Decrypting /home/daksh partition...', color: '#10b981', delay: 80 },
  { text: `  KEY: 0x${hex(16)}`, color: '#10b981', delay: 40 },
  { text: `  IV:  0x${hex(16)}`, color: '#10b981', delay: 40 },
  { text: `  AES-256-GCM cipher initialized`, color: '#64748b', delay: 40 },
  ...Array.from({length: 4}, (_, i) => ({
    text: `  Decrypting block ${i+1}/4: ${hex(32)}`,
    color: '#10b981', delay: 50, gen: true
  })),
  { text: '  Partition decrypted successfully.', color: '#fff', delay: 60 },
  { text: '', delay: 40 },

  // Binary dump
  { text: '> Verifying system integrity...', color: '#10b981', delay: 80 },
  ...Array.from({length: 6}, () => ({
    text: `  0x${hex(4)}  ${randBin()}  ${randBin()}`,
    color: '#10b981', delay: 20, gen: true
  })),
  { text: '  SHA-256 checksum: VERIFIED', color: '#fff', delay: 60 },
  { text: '', delay: 40 },

  // Loading modules
  { text: '> Loading portfolio modules...', color: '#10b981', delay: 80 },
  { text: '  [========                ] 33%  terminal.mod', color: '#10b981', delay: 100 },
  { text: '  [================        ] 66%  browser.mod', color: '#10b981', delay: 100 },
  { text: '  [========================] 100% games.mod', color: '#10b981', delay: 100 },
  { text: '', delay: 40 },

  // Final
  { text: '> Establishing secure connection to daksh.dev...', color: '#10b981', delay: 100 },
  { text: `  TLS 1.3 handshake complete | Session: ${hex(12)}`, color: '#10b981', delay: 80 },
  { text: '', delay: 50 },
  { text: '============================================', color: '#10b981', delay: 50 },
  { text: '  All systems operational. Access granted.', color: '#fff', delay: 80 },
  { text: '  Welcome back, Daksh.', color: '#fff', delay: 80 },
  { text: '============================================', color: '#10b981', delay: 50 },
];

export default function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [index, setIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const containerRef = useRef(null);

  // Glitch effect - random screen flickers
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80 + Math.random() * 120);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence runner
  useEffect(() => {
    if (index >= BOOT_SEQUENCE.length) {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => onComplete(), 700);
      }, 500);
      return;
    }

    const entry = BOOT_SEQUENCE[index];
    const timer = setTimeout(() => {
      // For generated entries, regenerate random values
      if (entry.gen) {
        const freshText = entry.text
          .replace(/\d+\.\d+\.\d+\.\d+/g, () => randIP())
          .replace(/0x[0-9a-f]+/gi, () => `0x${hex(entry.text.includes('block') ? 32 : 8)}`);
        setLines(prev => [...prev, { ...entry, text: freshText }]);
      } else {
        setLines(prev => [...prev, entry]);
      }
      setIndex(prev => prev + 1);
    }, entry.delay);

    return () => clearTimeout(timer);
  }, [index, onComplete]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: '#e2e8f0',
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: '13px',
      overflow: 'hidden',
      position: 'relative',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.7s ease-out',
      filter: glitch ? `brightness(1.5) hue-rotate(${Math.random() * 30}deg)` : 'none',
    }}>

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, transparent 1px, transparent 3px)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.7)',
        pointerEvents: 'none', zIndex: 3,
      }} />

      {/* Log content */}
      <div ref={containerRef} style={{
        position: 'relative', zIndex: 1,
        padding: '16px 24px',
        height: '100vh',
        overflowY: 'auto',
        lineHeight: '1.6',
      }}>
        {lines.map((line, i) => (
          <div key={i}>
            {line.status === 'ok' ? (
              <span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>[  OK  ]</span>
                <span style={{ color: '#cbd5e1' }}> {line.text.replace('[  OK  ] ', '')}</span>
              </span>
            ) : (
              <span style={{ color: line.color || '#94a3b8' }}>{line.text}</span>
            )}
          </div>
        ))}
        {index < BOOT_SEQUENCE.length && (
          <span style={{ color: '#10b981', animation: 'blink 0.7s step-end infinite', fontWeight: 'bold' }}>█</span>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
