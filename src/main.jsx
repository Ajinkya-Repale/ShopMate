import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import WakeUpSplash from './WakeUpSplash.jsx'

const Root = () => {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  // App only mounts AFTER backend confirmed alive
  if (!ready) return <WakeUpSplash onReady={handleReady} />;
  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)