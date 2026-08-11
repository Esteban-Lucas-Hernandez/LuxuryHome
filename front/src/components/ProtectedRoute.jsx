import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Componente Guard de Ruta Protegida (ProtectedRoute).
 * Verifica si el usuario actual se encuentra autenticado mediante AuthContext.
 * Si la sesión se encuentra cargando, muestra un indicador de carga; si no está autenticado,
 * redirige automáticamente a la pantalla de inicio de sesión (/login).
 * 
 * @param {{ children: React.ReactNode }} props Componentes hijos protegidos.
 * @returns {JSX.Element} Componentes hijos si está autenticado o redirección a /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar mensaje de espera mientras se verifica el token JWT en localStorage
  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  // Renderizar componentes protegidos si la sesión es válida; de lo contrario redirigir
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

