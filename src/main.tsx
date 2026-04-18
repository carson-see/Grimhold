import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useGame } from './game/store';
import './styles.css';

if (import.meta.env.DEV) {
  // Playtest escape hatch — only in dev, not production. Lets Playwright
  // tests and browser devtools drive the game without synthesizing clicks.
  window.__GRIMHOLD__ = { store: useGame };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
