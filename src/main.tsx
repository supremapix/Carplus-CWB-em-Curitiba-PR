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

// React 19 hoists Helmet links natively and does not adopt static data-rh links.
// Remove only the crawler canonical before React owns it during navigation.
document.head.querySelectorAll('link[rel="canonical"]').forEach(tag => tag.remove());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
