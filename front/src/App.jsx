import Navbar from './components/Navbar/Navbar';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import Footer from './components/Footer/Footer.jsx';
import { useState } from 'react';
import Login from './components/Auth/Login/Login';
import Registro from './components/Auth/Registro/Registro';

/**
 * Componente Principal de la Aplicación (App).
 * Administra los modales globales de autenticación (Login/Registro),
 * envuelve la aplicación en el proveedor de autenticación y captura de errores,
 * y estructura la navegación general con la barra de navegación, las rutas y el pie de página.
 * 
 * @returns {JSX.Element} Estructura principal de la aplicación React.
 */
function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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
        <>
          <Navbar 
            openLoginModal={openLoginModal}
            openRegisterModal={openRegisterModal}
          />
          <div className="container-fluid p-0 main-content">
            <AppRoutes />
          </div>
          <Footer />
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
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;