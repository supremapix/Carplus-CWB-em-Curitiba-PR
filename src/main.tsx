import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import App from './App.tsx';
import './index.css';
import './carplus-theme.css';
import './inner-pages.css';

// Crawlers receive static social tags; React owns them after the app starts.
document.head.querySelectorAll('meta[data-carplus-social-fallback]').forEach(tag => tag.remove());

// Adopt the crawler canonical into Helmet's managed set. Otherwise the static
// link survives client navigation beside a second, conflicting canonical.
document.head.querySelectorAll('link[rel="canonical"]').forEach(tag => tag.setAttribute('data-rh', 'true'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
