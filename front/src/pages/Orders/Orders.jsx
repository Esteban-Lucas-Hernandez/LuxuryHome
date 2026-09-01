import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, getOrderTracking } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';

/**
 * Componente de la Página de Mis Pedidos (Orders).
 * Muestra el historial de compras del usuario autenticado, estado actual,
 * desglose de productos y modal interactivo de seguimiento de alta gama (Tracking).
 * 
 * @returns {JSX.Element} Vista del historial de pedidos.
 */
export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del modal de tracking
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingList, setTrackingList] = useState([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('No se pudieron cargar tus pedidos en este momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  /** Abre el modal de tracking y consulta los eventos de la orden */
  const handleOpenTracking = async (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
    setTrackingLoading(true);
    try {
      const trackingData = await getOrderTracking(order.id);
      setTrackingList(Array.isArray(trackingData) ? trackingData : []);
    } catch (err) {
      console.error('Error fetching tracking:', err);
      setTrackingList([]);
    } finally {
      setTrackingLoading(false);
    }
  };

  /** Devuelve el badge estilizado según el estado de la orden */
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="badge badge-status-paid"><i className="fas fa-check-circle me-1"></i> Pagado</span>;
      case 'PREPARING':
        return <span className="badge badge-status-prep"><i className="fas fa-box-open me-1"></i> En Preparación</span>;
      case 'SHIPPED':
        return <span className="badge badge-status-ship"><i className="fas fa-truck me-1"></i> En Camino</span>;
      case 'DELIVERED':
        return <span className="badge badge-status-deliv"><i className="fas fa-house-chimney me-1"></i> Entregado</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  /** Pasos del ciclo de vida del pedido para la barra de progreso */
  const statusSteps = [
    { key: 'PAID', label: 'Confirmado', desc: 'Pago procesado', icon: 'fas fa-receipt' },
    { key: 'PREPARING', label: 'Preparación', desc: 'Empaque y taller', icon: 'fas fa-boxes-packing' },
    { key: 'SHIPPED', label: 'En Camino', desc: 'Despacho en ruta', icon: 'fas fa-truck-fast' },
    { key: 'DELIVERED', label: 'Entregado', desc: 'Recibido en destino', icon: 'fas fa-circle-check' }
  ];

  /** Índice del estado actual para el stepper */
  const getStepIndex = (status) => {
    switch (status) {
      case 'PAID': return 0;
      case 'PREPARING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-page py-5">
        <div className="container py-5 text-center">
          <div className="orders-empty-card p-5 bg-white rounded-4 shadow-sm border mx-auto" style={{ maxWidth: '550px' }}>
            <i className="fas fa-user-lock fa-3x text-gold mb-3"></i>
            <h2 className="fw-bold mb-3">Inicia Sesión</h2>
            <p className="text-muted mb-4">Debes estar registrado para ver el historial y seguimiento de tus pedidos.</p>
            <Link to="/" className="btn btn-gold-solid px-4 py-2">
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  return (
    <div className="orders-page py-5 bg-light-soft">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="section-subtitle-gold">ÁREA DE CLIENTE</span>
            <h1 className="display-6 fw-bold mt-1 text-dark">Historial de Pedidos</h1>
            <p className="text-muted mb-0">Revisa el estado de tus compras y haz seguimiento a tus despachos.</p>
          </div>
          <Link to="/products" className="btn btn-outline-dark mt-3 mt-md-0">
            <i className="fas fa-plus me-2"></i> Explorar Más Muebles
          </Link>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-gold" role="status">
              <span className="visually-hidden">Cargando pedidos...</span>
            </div>
            <p className="mt-3 text-muted">Cargando tus compras...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger p-4 rounded-4 text-center">
            <i className="fas fa-triangle-exclamation me-2"></i>
            {error}
          </div>
        ) : orders.length > 0 ? (
          <div className="orders-list d-flex flex-column gap-4">
            {orders.map((order) => {
              const items = order.items || [];
              const totalAmount = parseFloat(order.total_amount || 0);
              const totalItems = order.total_items || items.reduce((acc, i) => acc + i.quantity, 0);

              return (
                <div key={order.id} className="order-card p-4 bg-white rounded-4 shadow-sm border">
                  {/* Top Bar of Order */}
                  <div className="order-card-header d-flex flex-wrap justify-content-between align-items-center pb-3 border-bottom mb-3 gap-2">
                    <div>
                      <span className="text-muted small">ORDEN:</span>
                      <h5 className="fw-bold mb-0 text-dark">#NEX-{order.id.toString().padStart(5, '0')}</h5>
                      <span className="text-muted small">
                        Realizado el {new Date(order.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {getStatusBadge(order.status)}
                      <button
                        className="btn btn-gold-solid btn-sm px-3 py-2"
                        onClick={() => handleOpenTracking(order)}
                      >
                        <i className="fas fa-location-dot me-1"></i> Rastrear Pedido
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="order-items-grid row g-3 mb-3">
                    {items.map((item) => {
                      const furniture = item.furniture || {};
                      const price = parseFloat(item.price_at_purchase || 0);

                      return (
                        <div key={item.id} className="col-md-6 col-lg-4">
                          <div className="order-item-chip p-2 rounded-3 bg-light border d-flex align-items-center gap-3">
                            <img
                              src={furniture.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'}
                              alt={furniture.name || 'Mueble'}
                              className="rounded"
                              style={{ width: '55px', height: '55px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop';
                              }}
                            />
                            <div className="overflow-hidden">
                              <h6 className="mb-0 text-truncate fw-bold">{furniture.name || 'Mueble de Colección'}</h6>
                              <span className="small text-muted">{item.quantity} x ${price.toLocaleString('es-CO')}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Bar of Order */}
                  <div className="order-card-footer pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
                    </span>
                    <div>
                      <span className="text-muted me-2 small">Total Pagado:</span>
                      <span className="h5 fw-bold text-gold mb-0">${totalAmount.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
            <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
            <h3 className="fw-bold mb-2">Aún no tienes pedidos registrados</h3>
            <p className="text-muted mb-4">Tus compras confirmadas aparecerán aquí con seguimiento en vivo.</p>
            <Link to="/products" className="btn btn-gold-solid px-4 py-3">
              Descubrir Colecciones 3D
            </Link>
          </div>
        )}
      </div>

      {/* Modal de Seguimiento Profesional (Tracking Modal) */}
      {showTrackingModal && selectedOrder && (
        <div className="tracking-modal-backdrop" onClick={() => setShowTrackingModal(false)}>
          <div className="tracking-modal-dialog" onClick={(e) => e.stopPropagation()}>
            
            {/* Header de Lujo con Alto Contraste */}
            <div className="tracking-modal-header">
              <div className="tracking-header-left">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="order-code-badge">
                    <i className="fas fa-cube me-1"></i> #NEX-{selectedOrder.id.toString().padStart(5, '0')}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <h4 className="modal-title-luxury mb-1">
                  Seguimiento de Pedido
                </h4>
                <p className="tracking-header-date mb-0">
                  <i className="far fa-calendar-alt me-1"></i>
                  Orden registrada el {new Date(selectedOrder.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button 
                className="tracking-modal-close-btn" 
                onClick={() => setShowTrackingModal(false)}
                aria-label="Cerrar modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="tracking-modal-body">
              
              {/* Barra de Resumen Rápido */}
              <div className="tracking-quick-bar row g-2 mb-4">
                <div className="col-4">
                  <div className="quick-info-box">
                    <span className="quick-info-label">Artículos</span>
                    <span className="quick-info-val">
                      {selectedOrder.total_items || selectedOrder.items?.reduce((acc, i) => acc + i.quantity, 0) || 1} uds.
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="quick-info-box">
                    <span className="quick-info-label">Total Pagado</span>
                    <span className="quick-info-val text-gold-accent">
                      ${parseFloat(selectedOrder.total_amount || 0).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="quick-info-box">
                    <span className="quick-info-label">Envío</span>
                    <span className="quick-info-val text-success">VIP Gratis</span>
                  </div>
                </div>
              </div>

              {/* Stepper Visual de 4 Etapas */}
              <div className="stepper-section mb-4">
                <div className="stepper-title-row d-flex justify-content-between align-items-center mb-3">
                  <span className="stepper-section-title">ETAPAS DEL DESPACHO</span>
                  <span className="stepper-status-note">
                    {currentStepIdx === 3 ? 'Completado' : `Paso ${currentStepIdx + 1} de 4`}
                  </span>
                </div>

                <div className="stepper-progress-container">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const isUpcoming = idx > currentStepIdx;

                    let stepClass = 'step-upcoming';
                    if (isCompleted) stepClass = 'step-completed';
                    if (isCurrent) stepClass = 'step-current';

                    return (
                      <div key={step.key} className={`stepper-node ${stepClass}`}>
                        <div className="stepper-icon-circle">
                          {isCompleted ? (
                            <i className="fas fa-check"></i>
                          ) : (
                            <i className={step.icon}></i>
                          )}
                        </div>
                        <div className="stepper-label-wrapper">
                          <span className="stepper-label">{step.label}</span>
                          <span className="stepper-desc d-none d-sm-block">{step.desc}</span>
                        </div>
                        {idx < statusSteps.length - 1 && (
                          <div className={`stepper-connector ${idx < currentStepIdx ? 'connector-filled' : ''}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mini vista previa de productos en la orden */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="order-items-mini-section mb-4">
                  <h6 className="section-mini-heading mb-2">PIEZAS DE ESTA ORDEN</h6>
                  <div className="items-mini-list d-flex flex-column gap-2">
                    {selectedOrder.items.map((item) => {
                      const furniture = item.furniture || {};
                      const price = parseFloat(item.price_at_purchase || 0);

                      return (
                        <div key={item.id} className="item-mini-card d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border">
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={furniture.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'}
                              alt={furniture.name || 'Mueble'}
                              className="rounded"
                              style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop';
                              }}
                            />
                            <div>
                              <p className="item-mini-title mb-0 fw-bold">{furniture.name || 'Mueble de Autor'}</p>
                              <small className="text-muted">{item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'} • ${price.toLocaleString('es-CO')} c/u</small>
                            </div>
                          </div>
                          <span className="fw-bold small text-dark">${(price * item.quantity).toLocaleString('es-CO')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Timeline Detallado de Novedades */}
              <div className="timeline-section">
                <h6 className="section-mini-heading mb-3">HISTORIAL DE EVENTOS</h6>
                
                {trackingLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-gold" role="status"></div>
                    <p className="mt-2 text-muted small">Consultando bitácora de despacho...</p>
                  </div>
                ) : trackingList.length > 0 ? (
                  <div className="timeline-container position-relative">
                    {trackingList.map((track, idx) => (
                      <div key={track.id || idx} className="timeline-step d-flex gap-3 mb-3">
                        <div className="timeline-bullet-wrapper d-flex flex-column align-items-center">
                          <div className={`timeline-bullet ${idx === 0 ? 'bullet-latest' : ''}`}>
                            <i className="fas fa-check"></i>
                          </div>
                          {idx < trackingList.length - 1 && <div className="timeline-line"></div>}
                        </div>
                        <div className="timeline-content-box p-3 rounded-3 bg-white border flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="fw-bold mb-0 text-dark">{track.message}</h6>
                            {idx === 0 && (
                              <span className="badge bg-gold-subtle text-dark small px-2 py-1">Última Novedad</span>
                            )}
                          </div>
                          <span className="timeline-timestamp small text-muted">
                            <i className="far fa-clock me-1"></i>
                            {new Date(track.timestamp).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-tracking-box text-center py-4 bg-light rounded-3 border">
                    <i className="fas fa-clock text-gold fs-4 mb-2 d-block"></i>
                    <p className="fw-semibold mb-1 text-dark">Pedido en Proceso</p>
                    <small className="text-muted">Tu pedido está confirmado. En breve nuestro equipo de logística registrará las novedades de despacho.</small>
                  </div>
                )}
              </div>

            </div>

            {/* Footer de Acciones */}
            <div className="tracking-modal-footer d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center text-muted small">
                <i className="fas fa-shield-alt text-gold me-2"></i>
                <span>Garantía & Cobertura Nexora Care</span>
              </div>
              <button className="btn btn-gold-solid px-4 py-2" onClick={() => setShowTrackingModal(false)}>
                Entendido
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

