import React from 'react';
import './Modal.css';

/**
 * Componente Modal Reutilizable (Modal).
 * Crea una ventana emergente superpuesta con soporte para título personalizado,
 * botón de cierre en la esquina superior derecha, contenido hijo dinámico y
 * opcionalmente una columna con imagen gráfica lateral.
 * 
 * @param {{
 *   isOpen: boolean,
 *   onClose: function(): void,
 *   title: React.ReactNode,
 *   children: React.ReactNode,
 *   imageSrc?: string
 * }} props Propiedades del modal.
 * @returns {JSX.Element|null} Estructura del modal o null si no está abierto.
 */
const Modal = ({ isOpen, onClose, title, children, imageSrc }) => {
  if (!isOpen) return null;


  return (
    <div className="advanced-modal-overlay" onClick={onClose}>
      <div className={`advanced-modal-content ${imageSrc ? 'modal-with-image' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* El botón de cerrar se movió aquí para que flote en la esquina superior derecha del modal entero */}
        <button type="button" className="advanced-modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div className="modal-content-left">
          <div className="advanced-modal-header">
            <h5 className="advanced-modal-title">{title}</h5>
          </div>
          <div className="advanced-modal-body">
            {children}
          </div>
        </div>
        {imageSrc && (
          <div className="modal-content-right">
            <img src={imageSrc} alt="Modal visual" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;