import axios from 'axios';
import API_URL from '../services/api';

/**
 * Instancia de Axios preconfigurada para las peticiones a la API del backend.
 * Incluye la URL base y cabeceras por defecto.
 */
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Solicitud (Request).
 * Inyecta automáticamente el token de acceso JWT ('Bearer <token>')
 * en la cabecera 'Authorization' si existe en localStorage.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuesta (Response).
 * Captura errores HTTP 401 (No Autorizado) e intenta renovar el token JWT
 * utilizando el refresh_token almacenado. Si falla la renovación, limpia los tokens
 * y redirige al usuario a la pantalla de inicio de sesión.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/users/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return api(originalRequest);
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          return Promise.reject(error);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;