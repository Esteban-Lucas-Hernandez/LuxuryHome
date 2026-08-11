/**
 * @file api.js
 * @description Módulo de configuración de la URL base del servicio API del backend.
 * Obtiene la dirección del servidor desde las variables de entorno de Vite (VITE_API_URL)
 * o utiliza la dirección local por defecto (http://127.0.0.1:8000).
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default API_URL;