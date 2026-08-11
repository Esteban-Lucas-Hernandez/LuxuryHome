import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './About.css';

/**
 * Componente de la Página "Nosotros" (About).
 * Rediseño editorial de alta gama en paleta Charcoal & Gold (#1a1a1a y #c5a059).
 * Muestra la historia de Nexora X, pilares de marca, línea de tiempo,
 * equipo creativo y reconocimientos de la industria.
 * 
 * @returns {JSX.Element} Página About de estética luxury.
 */
export default function About() {
  const navigate = useNavigate();

  /** Integrantes del equipo directivo, ingenieros y artesanos */
  const teamMembers = [
    {
      name: "Carlos Rodríguez",
      position: "Fundador & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Más de 15 años de liderazgo en arquitectura de interiores y dirección empresarial."
    },
    {
      name: "Esteban Lucas",
      position: "Desarrollador y Creador de NEXORA",
      image: "https://portafolio-esteban-lucas.netlify.app/img/foto.jpeg",
      description: "Ingeniero de Software"
    },
    {
      name: "Luis Martínez",
      position: "Maestro Artesano de Producción",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "Experto en selección de maderas nobles, estructuras metálicas y control de calidad."
    },
    {
      name: "Ana Silva",
      position: "Directora de Interiorismo VIP",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Asesora de proyectos residenciales de lujo y personalización de espacios."
    }
  ];

  /** Hitos históricos en la trayectoria de la empresa */
  const milestones = [
    {
      year: "2015",
      title: "Fundación del Taller",
      desc: "Nace Nexora X en Bogotá con un taller artesanal dedicado al mobiliario de diseño de autor."
    },
    {
      year: "2018",
      title: "Colección Contemporánea",
      desc: "Lanzamiento de nuestras primeras líneas de salas y comedores con acabados en maderas nobles."
    },
    {
      year: "2022",
      title: "Revolución 3D Interactivo",
      desc: "Integración de nuestra plataforma de renderizado e inspección 360° en tiempo real."
    },
    {
      year: "2026",
      title: "Liderazgo en Latinoamérica",
      desc: "Más de 50,000 espacios transformados y exportación a más de 15 países."
    }
  ];

  /** Principios éticos y pilares fundamentales de la marca */
  const values = [
    {
      icon: "fas fa-gem",
      title: "Artesanía de Alta Gama",
      description: "Cada pieza es construida con madera maciza seleccionada, telas de alta durabilidad y cuero genuino."
    },
    {
      icon: "fas fa-cube",
      title: "Innovación 3D Real-Time",
      description: "Visualiza tus muebles en 3D antes de comprar, eliminando la incertidumbre de proporción y espacio."
    },
    {
      icon: "fas fa-leaf",
      title: "Sostenibilidad Certificada",
      description: "Utilizamos madera de bosques gestionados responsablemente y procesos de bajo impacto ambiental."
    },
    {
      icon: "fas fa-award",
      title: "Garantía de Excelencia",
      description: "Ofrecemos respaldo extendido y control de calidad riguroso en cada etapa de fabricación."
    }
  ];


  return (
    <div className="about-luxury-page">
      {/* 1. HERO HEADER */}
      <section className="about-hero-section position-relative">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content text-white position-relative z-2 text-center">
          <div className="about-badge-pill mx-auto mb-3">
            <i className="fas fa-sparkles text-gold me-2"></i> SOBRE NEXORA X
          </div>
          <h1 className="display-3 fw-bold mb-4 about-hero-title">
            Fusión de Artesanía y <span className="text-gold-gradient">Tecnología 3D</span>
          </h1>
          <p className="lead mx-auto text-light-muted mb-4" style={{ maxWidth: "720px" }}>
            Desde 2015 redefiniendo el diseño de interiores con mobiliario de alta gama y experiencias de interacción tridimensional en tiempo real.
          </p>
        </div>
      </section>

      {/* 2. NUESTRA HISTORIA & CONCEPTO */}
      <section className="about-story-section py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="section-subtitle-gold">NUESTRA TRAYECTORIA</span>
              <h2 className="section-title-dark mb-4">
                Pasión por la Perfection y el Confort
              </h2>
              <p className="section-body-text mb-4">
                Nexora X nació con una misión audaz: transformar la forma en que las personas conciben y viven sus espacios. Combinamos técnicas artesanales tradicionales con herramientas digitales de vanguardia para crear piezas únicas que duran generaciones.
              </p>
              <p className="section-body-text mb-4">
                Creemos que el verdadero lujo no solo radica en la belleza estética, sino en la certeza de saber exactamente cómo lucirá y encajará cada mueble en tu hogar antes de tomar una decisión.
              </p>

              <div className="row g-4 mt-2">
                <div className="col-6">
                  <div className="about-stat-card p-3 rounded-3 bg-light border-gold-subtle">
                    <h3 className="gold-accent-text fw-bold mb-0">10+ Años</h3>
                    <p className="small text-muted mb-0">De Experiencia y Liderazgo</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="about-stat-card p-3 rounded-3 bg-light border-gold-subtle">
                    <h3 className="gold-accent-text fw-bold mb-0">50,000+</h3>
                    <p className="small text-muted mb-0">Hogares Transformados</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-editorial-image position-relative">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=900&fit=crop"
                  alt="Taller de Diseño Nexora X"
                  className="img-fluid rounded-4 shadow-lg w-100"
                />
                <div className="about-floating-badge p-4 rounded-4 shadow position-absolute bottom-0 start-0 ms-4 mb-4 text-white">
                  <h4 className="gold-accent-text fw-bold mb-0">100% Calidad</h4>
                  <p className="small mb-0 text-uppercase tracking-1">Garantía Certificada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PILARES & VALORES DE MARCA */}
      <section className="about-values-section py-5 bg-dark-luxury text-white">
        <div className="container py-5 text-center">
          <span className="section-subtitle-gold">VALORES FUNDAMENTALES</span>
          <h2 className="display-5 fw-bold mb-3 text-white">Nuestros Pilares de Excelencia</h2>
          <p className="lead text-light-muted mx-auto mb-5" style={{ maxWidth: "650px" }}>
            Principios que rigen la creación de cada una de nuestras colecciones y experiencias digitales.
          </p>

          <div className="row g-4 text-start">
            {values.map((v, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="about-value-card p-4 rounded-4 h-100">
                  <div className="about-icon-circle mb-4">
                    <i className={v.icon}></i>
                  </div>
                  <h4 className="fw-bold mb-3 text-white">{v.title}</h4>
                  <p className="text-light-muted mb-0">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EVOLUCIÓN HISTÓRICA / TIMELINE */}
      <section className="about-timeline-section py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="section-subtitle-gold">HITOS DE LA MARCA</span>
            <h2 className="section-title-dark">Nuestra Evolución</h2>
          </div>

          <div className="row g-4">
            {milestones.map((m, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="timeline-card p-4 bg-white rounded-4 shadow-sm border h-100 position-relative">
                  <span className="timeline-year badge bg-dark-luxury text-gold px-3 py-2 fs-6 mb-3">
                    {m.year}
                  </span>
                  <h5 className="fw-bold text-dark mb-2">{m.title}</h5>
                  <p className="text-muted small mb-0">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EQUIPO LÍDER Y ARTESANOS */}
      <section className="about-team-section py-5 bg-light-soft">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="section-subtitle-gold">TALENTO CREATIVO</span>
            <h2 className="section-title-dark">Mentes detrás de Nexora X</h2>
            <p className="text-muted">Un equipo apasionado por el diseño, la artesanía y la innovación tecnológica</p>
          </div>

          <div className="row g-4">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="team-card bg-white rounded-4 overflow-hidden shadow-sm h-100 border text-center p-4">
                  <div className="team-avatar-wrapper mb-3 mx-auto overflow-hidden rounded-circle shadow" style={{ width: "120px", height: "120px" }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{member.name}</h5>
                  <span className="text-gold small fw-semibold text-uppercase d-block mb-3">
                    {member.position}
                  </span>
                  <p className="text-muted small mb-0">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FINAL */}
      <section className="about-cta-section py-5 bg-dark-luxury text-white">
        <div className="container py-4 text-center">
          <div className="about-cta-box p-5 rounded-4 mx-auto" style={{ maxWidth: "850px" }}>
            <span className="section-subtitle-gold mb-2 d-block">VIVE LA EXPERIENCIA</span>
            <h2 className="display-5 fw-bold mb-4 text-white">¿Deseas Asesoría Personalizada?</h2>
            <p className="lead text-light-muted mb-5">
              Descubre cómo nuestras colecciones 3D pueden transformar la estética y el confort de tus proyectos.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                className="btn btn-gold-solid btn-lg px-5 py-3 fw-bold"
                onClick={() => navigate("/products")}
              >
                <i className="fas fa-cube me-2"></i> Ver Catálogo 3D
              </button>
              <button
                className="btn btn-outline-custom btn-lg px-5 py-3 fw-bold"
                onClick={() => navigate("/contact")}
              >
                Contactar Asesor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
