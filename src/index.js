import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root element from HTML where react will render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render our app component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);