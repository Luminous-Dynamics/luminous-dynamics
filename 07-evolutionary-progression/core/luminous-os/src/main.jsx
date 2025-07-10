// LuminousOS Main Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize sacred root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render with love
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Signal app ready for loader removal
window.dispatchEvent(new Event('app-ready'));