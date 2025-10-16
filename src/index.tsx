import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/text-color-fix.css';  // FORCE BLACK TEXT ON WHITE, WHITE TEXT ON DARK
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
