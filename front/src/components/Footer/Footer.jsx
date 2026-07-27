import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Componente Pie de Página (Footer).
 * Presenta el mapa del sitio, información de la marca Nexora X,
 * canales de contacto VIP, redes sociales y créditos de copyright.
 * Paleta de colores: Charcoal #111111 y Gold #c5a059.
 * 
 * @returns {JSX.Element} Pie de página global para la aplicación.
 */
export default function Footer() {
  return (
    <footer className="main-footer bg-dark-luxury text-white position-relative">
      <div className="footer-gold-line"></div>
      
      <div className="container py-5">
        <div className="row g-4 justify-content-between">
          {/* 1. BRAND & DESCRIPTION */}
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <div className="footer-brand mb-3">
              <Link to="/">
                <img src="/logo.png" alt="Nexora X Logo" style={{ height: '38px', objectFit: 'contain' }} />
              </Link>
            </div>
            <p className="footer-description text-light-muted mb-4">
              Redefiniendo el diseño de interiores mediante la fusión de arquitectura contemporánea, 
              artesanía en materiales nobles y tecnología de visualización 3D interactiva en tiempo real.
            </p>
            <div className="footer-social-links d-flex gap-2">
              <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#linkedin" className="social-icon-btn" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#pinterest" className="social-icon-btn" aria-label="Pinterest">
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
          </div>

          {/* 2. NAVEGACIÓN RÁPIDA */}
          <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
            <h5 className="footer-title text-gold fw-bold mb-3">Navegación</h5>
            <ul className="list-unstyled footer-links mb-0">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/about">Nosotros</Link></li>
              <li><Link to="/products">Catálogo 3D</Link></li>
              <li><Link to="/products">Categorías</Link></li>
              <li><Link to="/about">Contacto</Link></li>
            </ul>
          </div>

          {/* 3. COLECCIONES */}
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="footer-title text-gold fw-bold mb-3">Colecciones</h5>
            <ul className="list-unstyled footer-links mb-0">
              <li><Link to="/products">Salas de Estar</Link></li>
              <li><Link to="/products">Comedores de Lujo</Link></li>
              <li><Link to="/products">Dormitorios Premium</Link></li>
              <li><Link to="/products">Espacios de Oficina</Link></li>
              <li><Link to="/products">Mobiliario 3D Interactivo</Link></li>
            </ul>
          </div>

          {/* 4. ATENCIÓN VIP & CONTACTO */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title text-gold fw-bold mb-3">Contacto VIP</h5>
            <ul className="list-unstyled footer-contact-info mb-0">
              <li className="d-flex align-items-start mb-3">
                <i className="fas fa-map-marker-alt text-gold me-3 mt-1"></i>
                <span className="text-light-muted">Zona Rosa, Bogotá — Colombia</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <i className="fas fa-phone-alt text-gold me-3"></i>
                <span className="text-light-muted">+57 (601) 800-NEXORA</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <i className="fas fa-envelope text-gold me-3"></i>
                <span className="text-light-muted">contacto@nexorax.com</span>
              </li>
              <li className="d-flex align-items-center">
                <i className="fas fa-clock text-gold me-3"></i>
                <span className="text-light-muted">Lun - Sáb: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="footer-bottom-bar py-3 border-top border-secondary-subtle">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p className="small text-light-muted mb-0">
                &copy; {new Date().getFullYear()} <strong>Nexora X</strong>. Todos los derechos reservados.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-legal-links small text-light-muted">
                <a href="#privacy" className="text-light-muted me-3 text-decoration-none">Privacidad</a>
                <a href="#terms" className="text-light-muted me-3 text-decoration-none">Términos de Servicio</a>
                <a href="#cookies" className="text-light-muted text-decoration-none">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
