import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

/**
 * Componente de la Página de Inicio (Home) - Edición de Diseño Avanzado Editorial.
 * Muestra el Hero Showcase, filosofía arquitectónica de marca, tecnología interactiva 3D,
 * muestrario de ambientes, métricas de excelencia, testimonios VIP y llamados a la acción.
 * Paleta de colores: Charcoal #1a1a1a, Gold #c5a059, Dark Luxury #111111.
 * 
 * @returns {JSX.Element} Diseño avanzado editorial para la página principal.
 */
export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop",
      badge: "TECNOLOGÍA INTERACTIVA 3D",
      title: "El Futuro del Diseño de Interiores",
      subtitle: "Sumérgete en una experiencia donde la arquitectura contemporánea se encuentra con la visualización 3D en tiempo real.",
      ctaPrimary: "Explorar Colecciones 3D",
      ctaSecondary: "Conocer la Marca"
    },
    {
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&h=1080&fit=crop",
      badge: "EXCLUSIVIDAD Y ARTESANÍA",
      title: "Elegancia en Cada Detalle",
      subtitle: "Piezas esculpidas con materiales nobles de la más alta calidad, diseñadas para elevar la estética de tus espacios.",
      ctaPrimary: "Ver Colecciones",
      ctaSecondary: "Nuestra Filosofía"
    },
    {
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop",
      badge: "CONFORT DE VANGUARDIA",
      title: "Armonía entre Arte y Ergonomía",
      subtitle: "Espacios concebidos para transformar tu estilo de vida con un equilibrio perfecto entre estética y funcionalidad.",
      ctaPrimary: "Descubrir Más",
      ctaSecondary: "Contacto VIP"
    }
  ];

  const collections = [
    {
      id: "salas",
      name: "Salas de Estar",
      desc: "Sofás modulares y conjuntos contemporáneos creados para el máximo confort.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop"
    },
    {
      id: "comedores",
      name: "Comedores de Lujo",
      desc: "Mesas de roble macizo y sillas de diseño ergonómico para momentos memorables.",
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&h=600&fit=crop"
    },
    {
      id: "dormitorios",
      name: "Dormitorios Premium",
      desc: "Cabeceros acolchados y estructuras minimalistas para un descanso reparador.",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop"
    },
    {
      id: "oficina",
      name: "Espacios de Oficina",
      desc: "Escritorios de alto nivel y sillería ejecutiva con soporte ergonómico.",
      image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=600&fit=crop"
    }
  ];

  const testimonials = [
    {
      quote: "La posibilidad de inspeccionar cada mueble en 3D antes de comprarlo transformó por completo nuestra remodelación. La precisión y calidad son insuperables.",
      author: "Arq. Sofia Mendoza",
      role: "Diseñadora de Interiores",
      location: "Estudio Luxe Home"
    },
    {
      quote: "Nexora X ofrece el estándar más alto en acabados y tecnología. Los materiales y el confort superaron todas nuestras expectativas.",
      author: "Carlos E. Gutiérrez",
      role: "Propietario Residencia Penthouse",
      location: "Medellín"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="home-advanced-page">
      {/* 1. HERO SLIDER EDITORIAL */}
      <section className="hero-section">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="hero-overlay"></div>
            <div className="container hero-content text-white">
              <div className="row">
                <div className="col-lg-8 col-xl-7">
                  <div className="hero-badge-pill">
                    <span className="gold-dot"></span>
                    {slide.badge}
                  </div>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <div className="hero-actions d-flex flex-wrap gap-3">
                    <button
                      className="btn btn-gold-solid btn-lg px-4 py-3"
                      onClick={() => navigate('/products')}
                    >
                      <i className="fas fa-cube me-2"></i>
                      {slide.ctaPrimary}
                    </button>
                    <button
                      className="btn btn-outline-custom btn-lg px-4 py-3"
                      onClick={() => navigate('/about')}
                    >
                      {slide.ctaSecondary}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Indicadores de diapositivas */}
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. FILOSOFÍA DE MARCA & CONCEPTO ARQUITECTÓNICO */}
      <section className="philosophy-section py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="editorial-image-frame position-relative">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=1000&fit=crop"
                  alt="Arquitectura Interior Nexora"
                  className="img-fluid rounded-4 shadow-lg w-100"
                />
                <div className="editorial-glass-badge p-4 rounded-4 shadow position-absolute bottom-0 end-0 me-4 mb-4 text-white">
                  <h3 className="gold-accent-text fw-bold mb-0">100%</h3>
                  <p className="small mb-0 text-uppercase tracking-1">Artesanía de Alta Gama</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="section-subtitle-gold">CONCEPTO & ARQUITECTURA</span>
              <h2 className="section-title-dark mt-2 mb-4">
                Redefiniendo el Lujo Contemporáneo
              </h2>
              <p className="section-body-text mb-4">
                En Nexora X fusionamos la precisión técnica del modelado 3D con la calidez del diseño interior de alta gama. Cada silueta, textura y proporción es concebida para transformar espacios comunes en santuarios de confort y distinción.
              </p>

              <div className="row g-4 mb-4">
                <div className="col-6">
                  <div className="concept-mini-card p-3 rounded-3 bg-light border-gold-subtle">
                    <i className="fas fa-gem text-gold display-6 mb-2"></i>
                    <h6 className="fw-bold mb-1">Materiales Nobles</h6>
                    <p className="small text-muted mb-0">Maderas macizas y cuero genuino seleccionado.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="concept-mini-card p-3 rounded-3 bg-light border-gold-subtle">
                    <i className="fas fa-cube text-gold display-6 mb-2"></i>
                    <h6 className="fw-bold mb-1">Visor 3D Interactivo</h6>
                    <p className="small text-muted mb-0">Inspección precisa en 360° en tiempo real.</p>
                  </div>
                </div>
              </div>

              <Link to="/about" className="btn-link-gold fw-bold text-decoration-none h6">
                Descubre Más Sobre Nuestra Historia <i className="fas fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE DE TECNOLOGÍA INTERACTIVA 3D */}
      <section className="tech-showcase-section py-5 bg-dark-luxury text-white">
        <div className="container py-5 text-center">
          <span className="section-subtitle-gold">INNOVACIÓN DIGITAL</span>
          <h2 className="display-5 fw-bold mb-3 text-white">La Experiencia Nexora 3D</h2>
          <p className="lead text-light-muted mx-auto mb-5" style={{ maxWidth: '650px' }}>
            Explora una nueva dimensión interactiva antes de tomar decisiones de diseño para tu hogar.
          </p>

          <div className="row g-4 text-start">
            <div className="col-md-4">
              <div className="tech-feature-card p-4 rounded-4 h-100">
                <div className="tech-icon-circle mb-4">
                  <i className="fas fa-arrows-spin"></i>
                </div>
                <h4 className="fw-bold mb-3 text-white">Interacción 360°</h4>
                <p className="text-light-muted mb-0">
                  Gira, acerca y examina cada detalle del mobiliario desde cualquier perspectiva con respuesta fluida.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tech-feature-card p-4 rounded-4 h-100">
                <div className="tech-icon-circle mb-4">
                  <i className="fas fa-layer-group"></i>
                </div>
                <h4 className="fw-bold mb-3 text-white">Texturas Realistas</h4>
                <p className="text-light-muted mb-0">
                  Renderizado de materiales con simulación de luz natural, vetas de madera y acabado de tejidos.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tech-feature-card p-4 rounded-4 h-100">
                <div className="tech-icon-circle mb-4">
                  <i className="fas fa-compass-drafting"></i>
                </div>
                <h4 className="fw-bold mb-3 text-white">Escala Arquitectónica</h4>
                <p className="text-light-muted mb-0">
                  Modelos construidos a escala exacta para asegurar el ajuste perfecto en tus planos e interiorismo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MUESTRARIO DE COLECCIONES DE DISEÑO */}
      <section className="collections-grid-section py-5">
        <div className="container py-5">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-5">
            <div>
              <span className="section-subtitle-gold">COLECCIONES EXCLUSIVAS</span>
              <h2 className="section-title-dark mb-0">Explora por Ambientes</h2>
            </div>
            <Link to="/products" className="btn-link-gold text-decoration-none fw-bold mt-3 mt-md-0">
              Ver Catálogo Completo <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="row g-4">
            {collections.map((item) => (
              <div key={item.id} className="col-lg-6">
                <div className="collection-editorial-card rounded-4 overflow-hidden position-relative shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-100 collection-img"
                  />
                  <div className="collection-overlay p-5 d-flex flex-column justify-content-end text-white">
                    <h3 className="fw-bold display-6 mb-2">{item.name}</h3>
                    <p className="text-light-muted mb-4">{item.desc}</p>
                    <div>
                      <button
                        className="btn btn-gold-solid px-4 py-2 fw-bold"
                        onClick={() => navigate('/products')}
                      >
                        Explorar Ambiente <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MÉTRICAS DE EXCELENCIA & RESEÑAS VIP */}
      <section className="metrics-testimonials-section py-5 bg-light-soft">
        <div className="container py-5">
          {/* Métricas */}
          <div className="row g-4 text-center mb-5 pb-4 border-bottom">
            <div className="col-6 col-md-3">
              <div className="metric-box">
                <h2 className="display-4 fw-bold gold-accent-text mb-1">2,500+</h2>
                <p className="text-muted fw-semibold small text-uppercase tracking-1 mb-0">Espacios Diseñados</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="metric-box">
                <h2 className="display-4 fw-bold gold-accent-text mb-1">100%</h2>
                <p className="text-muted fw-semibold small text-uppercase tracking-1 mb-0">Satisfacción Garantizada</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="metric-box">
                <h2 className="display-4 fw-bold gold-accent-text mb-1">360°</h2>
                <p className="text-muted fw-semibold small text-uppercase tracking-1 mb-0">Visualización 3D</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="metric-box">
                <h2 className="display-4 fw-bold gold-accent-text mb-1">5 Años</h2>
                <p className="text-muted fw-semibold small text-uppercase tracking-1 mb-0">Garantía Premium</p>
              </div>
            </div>
          </div>

          {/* Testimonios Editorial */}
          <div className="text-center mb-5">
            <span className="section-subtitle-gold">EXPERIENCIAS VIP</span>
            <h2 className="section-title-dark">Lo que Dicen Nuestros Clientes</h2>
          </div>

          <div className="row g-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="col-md-6">
                <div className="testimonial-card p-5 bg-white rounded-4 shadow-sm h-100 border">
                  <div className="text-warning mb-3">
                    <i className="fas fa-star me-1"></i>
                    <i className="fas fa-star me-1"></i>
                    <i className="fas fa-star me-1"></i>
                    <i className="fas fa-star me-1"></i>
                    <i className="fas fa-star me-1"></i>
                  </div>
                  <p className="testimonial-quote fst-italic mb-4 text-dark fs-5">
                    "{t.quote}"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="author-avatar me-3">
                      <i className="fas fa-user-tie text-gold"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{t.author}</h6>
                      <span className="small text-muted">{t.role} — {t.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FINAL */}
      <section className="cta-banner-section py-5 bg-dark-luxury text-white">
        <div className="container py-4 text-center">
          <div className="cta-glass-container p-5 rounded-4 border-gold-glow mx-auto" style={{ maxWidth: '850px' }}>
            <span className="section-subtitle-gold mb-2 d-block">SUMÉRGETE EN LA EXPERIENCIA</span>
            <h2 className="display-5 fw-bold mb-4 text-white">¿Listo para Transformar tu Espacio?</h2>
            <p className="lead text-light-muted mb-5">
              Accede a nuestro catálogo 3D interactivo y descubre piezas de mobiliario que elevan el valor y confort de tu hogar.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                className="btn btn-gold-solid btn-lg px-5 py-3 fw-bold"
                onClick={() => navigate('/products')}
              >
                <i className="fas fa-cube me-2"></i> Explorar Catálogo 3D
              </button>
              <button
                className="btn btn-outline-custom btn-lg px-5 py-3 fw-bold"
                onClick={() => navigate('/about')}
              >
                Sobre Nosotros
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
