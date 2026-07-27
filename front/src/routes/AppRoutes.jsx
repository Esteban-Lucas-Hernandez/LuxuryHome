import { Routes, Route, Navigate } from 'react-router-dom';
import About from '../pages/About/About';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';
import Details from '../pages/Details/Details';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Componente de Enrutamiento Principal de la Aplicación.
 * Mapea las rutas URL a las páginas correspondientes (Home, About, Products, Details 3D).
 * Redirige automáticamente rutas desconocidas o legacy al Home.
 * 
 * @returns {JSX.Element} Configuración de rutas de React Router.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<Details />} />
      {/* Redirección: /login redirige al inicio ya que el login opera en modal */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      {/* Catch-all: cualquier ruta no registrada redirige al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
