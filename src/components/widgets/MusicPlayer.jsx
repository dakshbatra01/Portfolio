import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Loader } from 'lucide-react';

const FALLBACK_TRACKS = [
  { title: 'Chill Vibes', artist: 'Lo-Fi Radio', artwork: '', previewUrl: '' },
  { title: 'Midnight Code', artist: 'SynthWave', artwork: '', previewUrl: '' },
  { title: 'Night Drive', artist: 'RetroWave', artwork: '', previewUrl: '' },
];

export default function MusicPlayer() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  // Fetch songs from iTunes API
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=peaceful+gaming+music&limit=10&media=music`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const mapped = data.results
            .filter(t => t.previewUrl)
            .map(t => ({
              title: t.trackName,
              artist: t.artistName,
              artwork: t.artworkUrl100?.replace('100x100', '200x200') || '',
              previewUrl: t.previewUrl,
            }));
          setTracks(mapped.length > 0 ? mapped : FALLBACK_TRACKS);
        } else {
          setTracks(FALLBACK_TRACKS);
        }
      } catch {
        setTracks(FALLBACK_TRACKS);
      }
      setLoading(false);
    };
    fetchTracks();
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => nextTrack();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [tracks, currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !tracks[currentTrack]?.previewUrl) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length;
    setCurrentTrack(next);
    setIsPlaying(false);
    setProgress(0);
    setTimeout(() => {
      if (audioRef.current && tracks[next]?.previewUrl) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 100);
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + tracks.length) % tracks.length;
    setCurrentTrack(prev);
    setIsPlaying(false);
    setProgress(0);
    setTimeout(() => {
      if (audioRef.current && tracks[prev]?.previewUrl) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 100);
  };

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = pct * audioRef.current.duration;
    }
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const track = tracks[currentTrack] || { title: 'Loading...', artist: '', artwork: '' };

  return (
    <div style={{
      width: '280px',
      background: 'rgba(8, 12, 24, 0.9)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px',
      overflow: 'hidden',
      color: '#fff',
      fontFamily: 'var(--font-ui)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      {/* Album art banner */}
      <div style={{
        height: '80px',
        position: 'relative',
        overflow: 'hidden',
        background: '#111827',
      }}>
        {track.artwork ? (
          <img src={track.artwork} alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'blur(10px) brightness(0.4)',
            transform: 'scale(1.3)',
          }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }} />
        )}
        {/* Overlay album art + info */}
        <div style={{
          position: 'absolute', bottom: '0', left: '0', right: '0',
          padding: '10px 14px',
          display: 'flex', gap: '12px', alignItems: 'flex-end',
          background: 'linear-gradient(transparent, rgba(8,12,24,0.95))',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '8px',
            overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            {track.artwork ? (
              <img src={track.artwork} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Music size={20} color="#475569" />
              </div>
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1, paddingBottom: '2px' }}>
            <div style={{
              fontSize: '13px', fontWeight: '600', color: '#f1f5f9',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{track.title}</div>
            <div style={{
              fontSize: '11px', color: '#64748b',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{track.artist}</div>
          </div>
        </div>
      </div>

      {/* Controls section */}
      <div style={{ padding: '10px 14px 14px' }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '9px', color: '#475569', minWidth: '28px' }}>{formatTime(currentTime)}</span>
          <div onClick={seekTo} style={{
            flex: 1, height: '4px', background: '#1e293b', borderRadius: '2px',
            cursor: 'pointer', position: 'relative',
          }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: '#60a5fa', borderRadius: '2px',
              transition: 'width 0.1s linear',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', right: '-4px', top: '-3px',
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#60a5fa', boxShadow: '0 0 6px rgba(96,165,250,0.5)',
                opacity: isPlaying ? 1 : 0,
                transition: 'opacity 0.2s',
              }} />
            </div>
          </div>
          <span style={{ fontSize: '9px', color: '#475569', minWidth: '28px', textAlign: 'right' }}>{formatTime(duration)}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setMuted(!muted)} style={{ background: 'none', border: 'none', color: muted ? '#ef4444' : '#475569', cursor: 'pointer', padding: '4px' }}>
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={prevTrack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              <SkipBack size={16} fill="#94a3b8" />
            </button>
            <button onClick={togglePlay} style={{
              background: '#f1f5f9', border: 'none', borderRadius: '50%',
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#0f172a', transition: 'transform 0.15s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> :
               isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
            </button>
            <button onClick={nextTrack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              <SkipForward size={16} fill="#94a3b8" />
            </button>
          </div>
          <span style={{ fontSize: '9px', color: '#334155', minWidth: '30px', textAlign: 'right' }}>
            {currentTrack + 1}/{tracks.length}
          </span>
        </div>
      </div>

      {/* Hidden audio element */}
      {tracks[currentTrack]?.previewUrl && (
        <audio ref={audioRef} src={tracks[currentTrack].previewUrl} muted={muted} preload="auto" />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
