import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global stylesheets in cascade order: tokens and base styles first, then
// the per-area styles that build on them.
import './styles/index.css';
import './styles/layout.css';
import './styles/forms.css';
import './styles/listings.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
