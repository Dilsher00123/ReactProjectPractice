import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root for concurrent rendering
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
