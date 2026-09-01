import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Componente Guard de Ruta de Administración (AdminRoute).
 * Verifica que el usuario esté autenticado y cuente con permisos de Staff / Administrador.
 * 
 * @param {{ children: React.ReactNode }} props Componentes hijos protegidos.
 * @returns {JSX.Element} Componentes si tiene privilegios o redirección al inicio.
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Validando privilegios administrativos...</span>
        </div>
      </div>
    );
  }

  // Permitir acceso si está autenticado y es staff (o para desarrollo si se requiere)
  if (!isAuthenticated || !user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
