import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global stylesheets, loaded once here in cascade order: tokens and base
// styles first, then the per-area styles that build on them.
import './styles/index.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/locations.css';
import './styles/details.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
