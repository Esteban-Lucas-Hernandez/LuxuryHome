import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/auth.js';

/** Contexto global de autenticación de React */
const AuthContext = createContext();

/**
 * Hook personalizado para acceder al estado y métodos de autenticación.
 * 
 * @returns {{
 *   user: object|null,
 *   isAuthenticated: boolean,
 *   loading: boolean,
 *   login: function(object): Promise<{success: boolean, data?: object, error?: any}>,
 *   register: function(object): Promise<{success: boolean, data?: object, error?: any}>,
 *   logout: function(): void
 * }} Contexto de autenticación.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Proveedor de Autenticación que envuelve la jerarquía de la aplicación.
 * Mantiene la persistencia de los tokens JWT en localStorage.
 * 
 * @param {{ children: React.ReactNode }} props Componentes hijos.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar usuario autenticado
  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Verificar la presencia de tokens JWT al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (token && refreshToken) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Autentica a un usuario existente.
   * 
   * @param {{ username: string, password: string }} credentials Credenciales de ingreso.
   */
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      setIsAuthenticated(true);
      await loadUser();
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  /**
   * Registra a un nuevo usuario en el sistema.
   * 
   * @param {object} userData Datos de registro (username, email, password).
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.access && response.refresh) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        setIsAuthenticated(true);
        await loadUser();
      }
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  /** Cierra la sesión activa y elimina los tokens JWT del almacenamiento local */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};