import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import CartModal from '../Cart/CartModal.jsx';
import api from '../../api/axios.js';
import './Navbar.css';

/**
 * Componente Barra de Navegación (Navbar).
 * Incluye el logo de la marca, enlaces de navegación global, mega menú desplegable
 * interactivo con categorías y subcategorías paginadas, acceso al modal de carrito
 * y acciones de autenticación (Login/Registro/Logout).
 * 
 * @param {{ openLoginModal: function(): void, openRegisterModal: function(): void }} props
 * @returns {JSX.Element} Barra de navegación fija con mega menú.
 */
function Navbar({ openLoginModal, openRegisterModal }) {
  // Estados para el efecto de scroll y datos de categorías/muebles del mega menú
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [currentSubcatPage, setCurrentSubcatPage] = useState(0);
  const [forceCloseMegaMenu, setForceCloseMegaMenu] = useState(false);

  // Hooks de enrutamiento y autenticación
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar categorías y muebles desde el backend para renderizar el mega menú
    const fetchData = async () => {
      try {
        const [catsRes, furnRes] = await Promise.all([
          api.get('/store/categories/'),
          api.get('/store/furniture/all/')
        ]);
        const catsData = catsRes.data;
        const allCategories = Array.isArray(catsData)
          ? catsData
          : (catsData?.results && Array.isArray(catsData.results) ? catsData.results : []);

        const furnData = furnRes.data;
        const allFurniture = Array.isArray(furnData)
          ? furnData
          : (furnData?.results && Array.isArray(furnData.results) ? furnData.results : []);

        setCategories(allCategories);
        setFurniture(allFurniture);
        const mainCats = allCategories.filter(c => c && c.parent === null);
        if (mainCats.length > 0) {
          setActiveCategoryId(mainCats[0].id);
        }
      } catch (err) {
        console.error('Error fetching data for mega menu:', err);
        setCategories([]);
        setFurniture([]);
      }
    };
    fetchData();

    // Detectar el desplazamiento vertical para alterar la sombra/padding del navbar
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /** Verifica si una ruta coincide con la ubicación actual para resaltar el enlace activo */
  const isActive = (path) => location.pathname === path;


  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <nav className={`navbar navbar-expand-lg fixed-top transition-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <Link className="navbar-brand brand-logo" to="/">
            <img src="/logo.png" alt="Nexora Logo" style={{ height: '35px', objectFit: 'contain' }} />
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto align-items-center navbar-center-links">
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${isActive('/') ? 'active' : ''}`} to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${isActive('/about') ? 'active' : ''}`} to="/about">Nosotros</Link>
              </li>
              <li 
                className="nav-item dropdown-mega-wrapper"
                onMouseLeave={() => setForceCloseMegaMenu(false)}
              >
                <Link className={`nav-link nav-link-custom ${isActive('/categories') ? 'active' : ''}`} to="/categories">
                  Categorías <i className="fas fa-chevron-down ms-1" style={{ fontSize: '0.7rem' }}></i>
                </Link>

                <div className="mega-menu" style={forceCloseMegaMenu ? { display: 'none' } : {}}>
                  <div className="mega-menu-content">
                    <div className="mega-menu-left">
                      <h5 className="mega-menu-title">Colecciones</h5>
                      <ul className="mega-menu-links">
                        {(Array.isArray(categories) ? categories.filter(c => c && c.parent === null) : []).map(cat => (
                          <li key={cat.id} onMouseEnter={() => { setActiveCategoryId(cat.id); setCurrentSubcatPage(0); }}>
                            <Link 
                              to={`/products?category=${cat.id}`} 
                              style={{ fontWeight: activeCategoryId === cat.id ? '700' : '500' }}
                              onClick={() => setForceCloseMegaMenu(true)}
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link to="/products" className="btn-view-all" onClick={() => setForceCloseMegaMenu(true)}>Ver Todos <i className="fas fa-arrow-right ms-2"></i></Link>
                    </div>
                    <div className="mega-menu-right">
                      {(() => {
                        const safeCategories = Array.isArray(categories) ? categories : [];
                        const activeCat = safeCategories.find(c => c && c.id === activeCategoryId);
                        const subcats = activeCat?.subcategories || [];

                        if (subcats.length === 0) {
                          return (
                            <div className="text-muted w-100 d-flex align-items-center justify-content-center" style={{ height: '100%', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Sin subcategorías</span>
                            </div>
                          );
                        }

                        const ITEMS_PER_PAGE = 4;
                        const totalPages = Math.ceil(subcats.length / ITEMS_PER_PAGE);
                        const paginatedSubcats = subcats.slice(currentSubcatPage * ITEMS_PER_PAGE, (currentSubcatPage + 1) * ITEMS_PER_PAGE);

                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
                              {paginatedSubcats.map(subcat => (
                                <Link 
                                  to={`/products?category=${subcat.id}`} 
                                  key={`subcat-${subcat.id}`} 
                                  className="mega-menu-image-card" 
                                  style={{ textDecoration: 'none' }}
                                  onClick={() => setForceCloseMegaMenu(true)}
                                >
                                  <img src={subcat.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop'} alt={subcat.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop'; }} />
                                  <div className="mega-menu-image-overlay">
                                    <span style={{ textTransform: 'uppercase' }}>{subcat.name}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            {totalPages > 1 && (
                              <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                                <button 
                                  className="btn btn-outline-dark btn-sm rounded-circle" 
                                  style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  disabled={currentSubcatPage === 0} 
                                  onClick={(e) => { e.preventDefault(); setCurrentSubcatPage(p => Math.max(0, p - 1)); }}
                                >
                                  <i className="fas fa-chevron-left" style={{ fontSize: '0.7rem' }}></i>
                                </button>
                                <div className="d-flex gap-2">
                                  {Array.from({ length: totalPages }).map((_, idx) => (
                                    <div 
                                      key={idx} 
                                      style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        backgroundColor: currentSubcatPage === idx ? '#1a1a1a' : '#ccc',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s'
                                      }}
                                      onClick={(e) => { e.preventDefault(); setCurrentSubcatPage(idx); }}
                                    />
                                  ))}
                                </div>
                                <button 
                                  className="btn btn-outline-dark btn-sm rounded-circle" 
                                  style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  disabled={currentSubcatPage === totalPages - 1} 
                                  onClick={(e) => { e.preventDefault(); setCurrentSubcatPage(p => Math.min(totalPages - 1, p + 1)); }}
                                >
                                  <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item ms-2">
                <CartModal />
              </li>

              {isAuthenticated ? (
                <li className="nav-item ms-3">
                  <button className="btn nav-btn-outline" onClick={() => { logout(); navigate('/'); }}>
                    Salir
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item ms-3">
                    <button className="btn nav-link-custom" onClick={openLoginModal}>
                      Login
                    </button>
                  </li>
                  <li className="nav-item ms-2">
                    <button className="btn nav-btn-solid" onClick={openRegisterModal}>
                      Sign Up
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>



      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
    </>
  );
}

export default Navbar;
