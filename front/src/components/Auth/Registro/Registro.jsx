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
 * Componente Modal de Registro de Usuario (Registro).
 * Permite a nuevos usuarios ingresar sus datos (username, email, password),
 * valida coincidencias de contraseña y procesa la creación de cuenta con autenticación.
 * 
 * @param {{ isOpen: boolean, onClose: function, onOpenLogin: function }} props Props del modal.
 * @returns {JSX.Element} Modal de registro.
 */
const Registro = ({ isOpen, onClose, onOpenLogin }) => {
  // Estados locales del formulario de registro y control de errores
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hooks de autenticación y navegación
  const { register } = useAuth();
  const navigate = useNavigate();

  /** Actualiza el estado local al escribir en los campos de texto */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /** Valida las contraseñas y procesa la creación de cuenta en el backend */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Verificar que las dos contraseñas ingresadas sean idénticas
    if (formData.password !== formData.password2) {
      setError({ detail: 'Passwords do not match' });
      setLoading(false);
      return;
    }
    
    // Omitir 'password2' al enviar el payload a la API
    const { password2, ...registerData } = formData;
    
    try {
      const result = await register(registerData);
      
      if (result.success) {
        onClose(); // Cierra el modal de registro
        onOpenLogin(); // Abre automáticamente el modal de inicio de sesión
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /** Cierra el modal de registro y abre la ventana de inicio de sesión */
  const handleLoginClick = () => {
    onClose();
    onOpenLogin();
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<BrandLogo />} imageSrc="/auth-bg.png">
      {error && (
        <div className="advanced-error-alert" role="alert">
          <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error.detail || 'An error occurred during registration'}
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
              placeholder="Choose a username"
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
          <label htmlFor="email" className="advanced-form-label">Email</label>
          <div style={{ position: "relative" }}>
            <input
              type="email"
              className="advanced-form-input"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <span className="advanced-form-input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
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
              placeholder="Create a password"
              required
            />
            <span className="advanced-form-input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </span>
          </div>
        </div>
        <div className="advanced-form-group">
          <label htmlFor="password2" className="advanced-form-label">Confirm Password</label>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              className="advanced-form-input"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Confirm your password"
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
          {loading ? 'Registering...' : 'Register' }
        </button>
      </form>
      
      <div className="advanced-switch-link">
        <p>Already have an account?
          <button 
            type="button" 
            onClick={handleLoginClick}
          >
            Login
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default Registro;