/**
 * @file main.jsx
 * @description Punto de entrada principal de la aplicación React.
 * Inicializa el nodo raíz de ReactDOM, envuelve el componente App en el proveedor
 * de enrutamiento BrowserRouter e importa los estilos globales y Bootstrap.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Importación de estilos globales y utilidades JS de Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/global.css';

import App from './App.jsx';

// Renderizado del componente raíz en el elemento DOM 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

