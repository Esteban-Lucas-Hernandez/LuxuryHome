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

  // Mostrar indicador de carga mientras se valida la sesión
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Validando sesión...</span>
        </div>
      </div>
    );
  }

  // Renderizar componentes protegidos si la sesión es válida; de lo contrario redirigir al inicio
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;


