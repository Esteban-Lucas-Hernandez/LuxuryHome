import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Products from '../pages/Products/Products';
import Details from '../pages/Details/Details';
import Checkout from '../pages/Checkout/Checkout';
import Orders from '../pages/Orders/Orders';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../pages/NotFound/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

/**
 * Componente de Enrutamiento Principal de la Aplicación.
 * Mapea las rutas URL a las páginas correspondientes (Home, About, Products, Details 3D, Checkout, Orders, Dashboard).
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

      {/* Rutas de E-Commerce Protegidas */}
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } 
      />

      {/* Ruta de Administración y Analítica Protegida */}
      <Route 
        path="/dashboard" 
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } 
      />

      {/* Alias de navegación */}
      <Route path="/categories" element={<Navigate to="/products" replace />} />
      <Route path="/contact" element={<Navigate to="/about" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;

