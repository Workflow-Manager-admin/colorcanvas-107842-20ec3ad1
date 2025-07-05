import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// No service worker registration for this app

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
