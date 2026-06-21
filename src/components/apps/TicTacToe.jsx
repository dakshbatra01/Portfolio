import React, { useState } from 'react';

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(board) || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : board.every(Boolean) ? 'Draw!' : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Tic-Tac-Toe</h2>
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>{status}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', backgroundColor: '#333', padding: '5px', borderRadius: '8px' }}>
        {board.map((square, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: square === 'X' ? '#ef4444' : '#3b82f6',
              borderRadius: '4px'
            }}
          >
            {square}
          </div>
        ))}
      </div>
      <button 
        onClick={resetGame}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
      >
        Restart Game
      </button>
    </div>
  );
}
