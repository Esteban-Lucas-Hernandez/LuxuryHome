import Navbar from './components/Navbar/Navbar';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import CartModal from './components/Cart/CartModal.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import Footer from './components/Footer/Footer.jsx';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './components/Auth/Login/Login';
import Registro from './components/Auth/Registro/Registro';

/**
 * Componente Principal de la Aplicación (App).
 * Administra los modales globales de autenticación (Login/Registro),
 * envuelve la aplicación en los proveedores de autenticación, carrito y captura de errores,
 * y estructura la navegación general con la barra de navegación, las rutas y el pie de página.
 * Oculta la barra pública cuando se navega en el Portal de Administración (/dashboard).
 * 
 * @returns {JSX.Element} Estructura principal de la aplicación React.
 */
function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  /** Abre el modal de inicio de sesión y cierra el de registro */
  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  /** Abre el modal de registro y cierra el de inicio de sesión */
  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  /** Cierra todos los modales de autenticación */
  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <>
            {!isDashboard && (
              <Navbar 
                openLoginModal={openLoginModal}
                openRegisterModal={openRegisterModal}
              />
            )}
            <div className={`container-fluid p-0 ${!isDashboard ? 'main-content' : 'dashboard-main-content'}`}>
              <AppRoutes />
            </div>
            {!isDashboard && <Footer />}
            {!isDashboard && <CartModal />}
            <Login 
              isOpen={showLoginModal}
              onClose={closeModal}
              onOpenRegister={openRegisterModal}
            />
            <Registro 
              isOpen={showRegisterModal}
              onClose={closeModal}
              onOpenLogin={openLoginModal}
            />
          </>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
