import React, { useState } from 'react';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import './index.css';

function App() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {isBooting ? (
        <BootScreen onComplete={() => setIsBooting(false)} />
      ) : (
        <Desktop />
      )}
    </div>
  );
}

export default App;
