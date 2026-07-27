/**
 * Este archivo define el servicio de autenticación para el frontend.
 * Utiliza la instancia configurada de Axios para realizar peticiones HTTP a la API de Django,
 * manejando el registro, inicio de sesión y la actualización del token de acceso (refresh token).
 */
import api from './axios';

export const authService = {
  // Register a new user
  // Función para registrar un nuevo usuario enviando sus datos a la API
  register: async (userData) => {
    try {
      // Realiza petición POST al endpoint de registro
      const response = await api.post('/users/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login user
  // Función para iniciar sesión con credenciales (usuario/email y contraseña)
  login: async (credentials) => {
    try {
      // Realiza petición POST al endpoint de login para obtener los tokens
      const response = await api.post('/users/login/', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Refresh access token
  // Función para obtener un nuevo token de acceso usando el token de refresco
  refreshToken: async (refreshToken) => {
    try {
      // Petición POST al endpoint de refresh para mantener la sesión activa
      const response = await api.post('/users/token/refresh/', {
        refresh: refreshToken,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};