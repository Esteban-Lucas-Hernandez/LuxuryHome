import React from 'react';

/**
 * Componente ErrorBoundary de React.
 * Captura cualquier error de renderizado o en tiempo de ejecución en sus componentes hijos
 * y muestra una interfaz gráfica de respaldo en lugar de una pantalla en blanco.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de repuesto.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Registra el error en la consola o servicio de monitoreo
    console.error('ErrorBoundary ha capturado un error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '1rem' }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Ocurrió un problema inesperado</h2>
          <p style={{ color: '#6c757d', maxWidth: '500px', marginBottom: '1.5rem' }}>
            Hemos detectado un inconveniente al cargar esta sección. Por favor, intenta recargar la página.
          </p>
          <button 
            className="btn btn-primary rounded-pill px-4 py-2"
            onClick={this.handleReload}
          >
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
