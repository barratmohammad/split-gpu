import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/layout.css';
import './styles/panel.css';
import './styles/controls.css';
import './styles/studio.css';
import { useShowcase } from './store/useShowcase';

if (import.meta.env.DEV) {
  // Exposed for scripted screenshots and manual poking in the console.
  (window as unknown as { __showcase: typeof useShowcase }).__showcase = useShowcase;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
