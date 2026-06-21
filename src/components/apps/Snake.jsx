import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_DIRECTION = [0, -1];
const SPEED = 140;

export default function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState([5, 5]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [started, setStarted] = useState(false);
  const gameAreaRef = useRef(null);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ];
      const onSnake = currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
    if (gameAreaRef.current) gameAreaRef.current.focus();
  };

  useEffect(() => {
    if (gameAreaRef.current) gameAreaRef.current.focus();
  }, []);

  useEffect(() => {
    if (gameOver || !started) return;
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction[1] !== 1) setDirection([0, -1]); break;
        case 'ArrowDown': if (direction[1] !== -1) setDirection([0, 1]); break;
        case 'ArrowLeft': if (direction[0] !== 1) setDirection([-1, 0]); break;
        case 'ArrowRight': if (direction[0] !== -1) setDirection([1, 0]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, started]);

  useEffect(() => {
    if (gameOver || !started) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = [head[0] + direction[0], head[1] + direction[1]];
        if (
          newHead[0] < 0 || newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 || newHead[1] >= GRID_SIZE ||
          prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
        ) {
          setGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }
        const newSnake = [newHead, ...prevSnake];
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, generateFood, started, score]);

  const cellSize = 100 / GRID_SIZE;

  return (
    <div
      ref={gameAreaRef}
      tabIndex="0"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', background: '#0a0a0a', padding: '20px', outline: 'none', color: '#fff',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '320px', marginBottom: '12px', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#10b981', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>Score</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#10b981', textShadow: '0 0 10px rgba(16,185,129,0.5)', fontFamily: 'var(--font-mono)' }}>{score}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>Best</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#334155', fontFamily: 'var(--font-mono)' }}>{highScore}</div>
        </div>
      </div>

      {/* Game Board */}
      <div style={{
        width: '320px', height: '320px',
        position: 'relative',
        border: '2px solid #10b981',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(16,185,129,0.15), inset 0 0 30px rgba(0,0,0,0.5)',
        background: '#0a0a0a',
      }}>
        {/* Grid lines */}
        {Array.from({length: GRID_SIZE - 1}).map((_, i) => (
          <div key={`h${i}`} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${(i + 1) * cellSize}%`,
            height: '1px', background: 'rgba(16,185,129,0.04)',
          }} />
        ))}
        {Array.from({length: GRID_SIZE - 1}).map((_, i) => (
          <div key={`v${i}`} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${(i + 1) * cellSize}%`,
            width: '1px', background: 'rgba(16,185,129,0.04)',
          }} />
        ))}

        {/* Snake */}
        {snake.map((segment, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${segment[0] * cellSize}%`,
            top: `${segment[1] * cellSize}%`,
            width: `${cellSize}%`,
            height: `${cellSize}%`,
            background: i === 0 ? '#10b981' : '#059669',
            borderRadius: i === 0 ? '3px' : '2px',
            boxShadow: i === 0 ? '0 0 8px rgba(16,185,129,0.6)' : 'none',
            transition: 'left 0.05s linear, top 0.05s linear',
          }} />
        ))}

        {/* Food */}
        <div style={{
          position: 'absolute',
          left: `${food[0] * cellSize}%`,
          top: `${food[1] * cellSize}%`,
          width: `${cellSize}%`,
          height: `${cellSize}%`,
          background: '#ef4444',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(239,68,68,0.6), 0 0 20px rgba(239,68,68,0.3)',
          animation: 'foodPulse 1.5s ease-in-out infinite',
        }} />

        {/* Start Screen */}
        {!started && !gameOver && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981', marginBottom: '8px', textShadow: '0 0 15px rgba(16,185,129,0.5)' }}>SNAKE</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '24px' }}>Use arrow keys to move</div>
            <button onClick={resetGame} style={{
              padding: '10px 28px', background: 'transparent',
              border: '1px solid #10b981', borderRadius: '4px',
              color: '#10b981', cursor: 'pointer', fontSize: '13px',
              fontFamily: 'var(--font-mono)', letterSpacing: '2px',
              textTransform: 'uppercase', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#10b981'; }}
            >Start</button>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: '12px', color: '#ef4444', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Game Over</div>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>{score}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '24px' }}>points</div>
            <button onClick={resetGame} style={{
              padding: '10px 28px', background: 'transparent',
              border: '1px solid #10b981', borderRadius: '4px',
              color: '#10b981', cursor: 'pointer', fontSize: '13px',
              fontFamily: 'var(--font-mono)', letterSpacing: '2px',
              textTransform: 'uppercase', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#10b981'; }}
            >Retry</button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
        {['↑', '←', '↓', '→'].map(k => (
          <div key={k} style={{
            width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #1e293b', borderRadius: '4px', color: '#475569', fontSize: '12px',
            background: 'rgba(15,23,42,0.5)',
          }}>{k}</div>
        ))}
      </div>

      <style>{`
        @keyframes foodPulse {
          0%, 100% { transform: scale(0.8); opacity: 1; }
          50% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
