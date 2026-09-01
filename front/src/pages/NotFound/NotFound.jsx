import { Link } from 'react-router-dom';
import './NotFound.css';

/**
 * Componente de la Página de Error 404 (NotFound).
 * Presenta un diseño elegante de lujo con enlaces para retornar al inicio o al catálogo 3D.
 * 
 * @returns {JSX.Element} Vista de error 404.
 */
export default function NotFound() {
  return (
    <div className="notfound-page py-5 d-flex align-items-center justify-content-center text-center">
      <div className="container py-5">
        <div className="notfound-content p-5 mx-auto rounded-4 shadow-sm border bg-white" style={{ maxWidth: '600px' }}>
          <span className="notfound-code display-1 fw-bold text-gold d-block mb-2">404</span>
          <h2 className="fw-bold mb-3 text-dark">Espacio no encontrado</h2>
          <p className="text-muted mb-4 lead fs-6">
            La página que intentas consultar no existe o ha sido trasladada a otra colección.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/" className="btn btn-gold-solid px-4 py-2">
              <i className="fas fa-home me-2"></i> Ir al Inicio
            </Link>
            <Link to="/products" className="btn btn-outline-dark px-4 py-2">
              <i className="fas fa-cube me-2"></i> Catálogo 3D
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
