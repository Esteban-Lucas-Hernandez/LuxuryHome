import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import Modal from '../../Modal/Modal.jsx';
import '../auth-modals.css';

/** Componente auxiliar para renderizar el logotipo corporativo */
const BrandLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingBottom: '10px' }}>
    <img src="/logo.png" alt="Nexora Logo" style={{ height: '35px', objectFit: 'contain' }} />
  </div>
);

/**
 * Componente Modal de Inicio de Sesión (Login).
 * Permite a los usuarios ingresar sus credenciales JWT (usuario/contraseña),
 * procesar la autenticación y cambiar al modal de registro si no tienen cuenta.
 * 
 * @param {{ isOpen: boolean, onClose: function, onOpenRegister: function }} props Props del modal.
 * @returns {JSX.Element} Modal de inicio de sesión.
 */
const Login = ({ isOpen, onClose, onOpenRegister }) => {
  // estado: datos del formulario, carga, manejo de errores
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
    // autenticación y enrutamiento
  const { login } = useAuth();
  const navigate = useNavigate();

    // función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    // función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
        // intentar iniciar sesión
    try {
      const result = await login(formData);
      
            // si el inicio de sesión es exitoso
      if (result.success) {
        onClose(); // cierra el modal después de un inicio de sesión exitoso
        navigate('/'); // redirige a la página de inicio después de un inicio de sesión exitoso
      } else {
        // si hay un error en el inicio de sesión
        setError(result.error);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

    // función para cambiar al modal de registro
  const handleRegisterClick = () => {
    onClose(); // cierra el modal de inicio de sesión
    onOpenRegister(); // abre el modal de registro
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<BrandLogo />} imageSrc="/auth-bg.png">
      {error && (
        <div className="advanced-error-alert" role="alert">
          <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error.detail || 'An error occurred during login'}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="advanced-form-group">
          <label htmlFor="username" className="advanced-form-label">Username</label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="advanced-form-input"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
            <span className="advanced-form-input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </span>
          </div>
        </div>
        <div className="advanced-form-group">
          <label htmlFor="password" className="advanced-form-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              className="advanced-form-input"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <span className="advanced-form-input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </span>
          </div>
        </div>
        <button 
          type="submit" 
          className={`advanced-submit-btn ${loading ? 'advanced-submit-btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login' }
        </button>
      </form>
      
      <div className="advanced-switch-link">
        <p>Don't have an account?
          <button 
            type="button" 
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default Login;