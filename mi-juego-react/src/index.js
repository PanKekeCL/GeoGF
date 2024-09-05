import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './.others/App';

// Incluye tu juego

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Si lo prefieres, también puedes renderizar tu juego directamente en el DOM sin utilizar React.
// Esto dependerá de cómo quieras estructurar tu aplicación.
