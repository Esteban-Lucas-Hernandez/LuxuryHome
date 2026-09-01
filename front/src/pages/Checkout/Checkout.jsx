import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../api/orders';
import './Checkout.css';

/**
 * Componente de la Página de Checkout (Finalización de Compra).
 * Recoge información de envío, opciones de pago simuladas, muestra el desglose
 * del pedido y procesa la creación de la orden en Django.
 * 
 * @returns {JSX.Element} Vista de Checkout.
 */
export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Bogotá D.C.',
    postalCode: '',
    paymentMethod: 'credit_card',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '•••',
    orderNotes: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.address.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Dirección requerida',
        text: 'Por favor ingresa la dirección de entrega de tu pedido.',
        confirmButtonColor: '#c5a059'
      });
      return;
    }

    setLoading(true);

    try {
      const order = await createOrder();
      clearCart();

      await Swal.fire({
        title: '¡Orden Confirmada!',
        html: `
          <p class="mb-2">Tu pedido <strong>#${order.id}</strong> ha sido procesado con éxito.</p>
          <p class="small text-muted mb-0">Hemos registrado tu compra y el depósito está preparando el despacho.</p>
        `,
        icon: 'success',
        confirmButtonText: 'Ver Mis Pedidos',
        confirmButtonColor: '#c5a059',
        background: '#1a1a1a',
        color: '#ffffff'
      });

      navigate('/orders');
    } catch (err) {
      console.error('Error placing order:', err);
      const errorMessage = typeof err === 'object' && err?.error ? err.error : 'Ocurrió un error al procesar tu pedido.';
      Swal.fire({
        icon: 'error',
        title: 'Error en la compra',
        text: errorMessage,
        confirmButtonColor: '#c5a059'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="checkout-page py-5">
        <div className="container py-5 text-center">
          <div className="checkout-auth-card p-5 bg-white rounded-4 shadow-sm border mx-auto" style={{ maxWidth: '550px' }}>
            <i className="fas fa-lock fa-3x text-gold mb-3"></i>
            <h2 className="fw-bold mb-3">Inicia Sesión para Comprar</h2>
            <p className="text-muted mb-4">
              Debes estar registrado para poder procesar la compra y realizar el seguimiento de tu pedido en tiempo real.
            </p>
            <Link to="/" className="btn btn-gold-solid px-4 py-2">
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page py-5">
        <div className="container py-5 text-center">
          <div className="checkout-empty-card p-5 bg-white rounded-4 shadow-sm border mx-auto" style={{ maxWidth: '550px' }}>
            <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
            <h2 className="fw-bold mb-3">Tu carrito está vacío</h2>
            <p className="text-muted mb-4">
              No tienes artículos en el carrito para procesar una compra.
            </p>
            <Link to="/products" className="btn btn-gold-solid px-4 py-2">
              Explorar Catálogo 3D
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page py-5 bg-light-soft">
      <div className="container py-4">
        {/* Breadcrumb Header */}
        <div className="mb-4">
          <Link to="/products" className="text-decoration-none text-muted small">
            <i className="fas fa-arrow-left me-2"></i> Volver al Catálogo
          </Link>
          <h1 className="display-6 fw-bold mt-2 text-dark">Finalizar Compra</h1>
          <p className="text-muted">Ingresa tus datos para coordinar el envío de tus piezas exclusivas.</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="row g-4">
            {/* Columna Izquierda: Datos de Envío y Facturación */}
            <div className="col-lg-7">
              <div className="checkout-card p-4 bg-white rounded-4 shadow-sm border mb-4">
                <h4 className="fw-bold mb-4 d-flex align-items-center">
                  <span className="checkout-step-number me-2">1</span>
                  Información de Entrega VIP
                </h4>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="+57 300 000 0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Ciudad / Región</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Dirección de Entrega</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="Calle, Carrera, Número, Apto / Casa"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Instrucciones Especiales de Entrega (Opcional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="orderNotes"
                      placeholder="Ej: Dejar en portería o piso 4 con ascensor"
                      value={formData.orderNotes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="checkout-card p-4 bg-white rounded-4 shadow-sm border">
                <h4 className="fw-bold mb-4 d-flex align-items-center">
                  <span className="checkout-step-number me-2">2</span>
                  Método de Pago Seguro
                </h4>

                <div className="payment-methods-grid mb-4">
                  <label className={`payment-method-card ${formData.paymentMethod === 'credit_card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="d-none"
                    />
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-credit-card text-gold fs-5"></i>
                        <span className="fw-semibold">Tarjeta de Crédito VIP</span>
                      </div>
                      <span className="badge bg-success-subtle text-success">Seguro SSL</span>
                    </div>
                  </label>

                  <label className={`payment-method-card ${formData.paymentMethod === 'bank_transfer' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      className="d-none"
                    />
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-building-columns text-gold fs-5"></i>
                        <span className="fw-semibold">Transferencia Bancaria / PSE</span>
                      </div>
                      <span className="badge bg-secondary-subtle text-secondary">Aprobación Rápida</span>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'credit_card' && (
                  <div className="card-details-mock p-3 bg-light rounded-3 border">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">Número de Tarjeta</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          value={formData.cardNumber}
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-muted">Expiración</label>
                        <input
                          type="text"
                          className="form-control bg-white"
                          value={formData.cardExpiry}
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-muted">CVC / CVV</label>
                        <input
                          type="password"
                          className="form-control bg-white"
                          value={formData.cardCvc}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Resumen del Pedido */}
            <div className="col-lg-5">
              <div className="checkout-summary-card p-4 bg-white rounded-4 shadow-sm border position-sticky" style={{ top: '90px' }}>
                <h4 className="fw-bold mb-3">Resumen de la Compra</h4>

                <div className="order-items-preview mb-4">
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const productName = item.product_name || product.name || 'Mueble';
                    const price = parseFloat(item.price || product.price || 0);
                    const quantity = item.quantity || 1;
                    const imageUrl = product.image_url || '/placeholder.png';

                    return (
                      <div key={item.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={imageUrl}
                            alt={productName}
                            className="rounded"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop';
                            }}
                          />
                          <div>
                            <h6 className="mb-0 fw-bold">{productName}</h6>
                            <small className="text-muted">{quantity} x ${price.toLocaleString('es-CO')}</small>
                          </div>
                        </div>
                        <span className="fw-bold">${(price * quantity).toLocaleString('es-CO')}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="order-totals-breakdown mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal:</span>
                    <span className="fw-semibold">${cartTotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Envío Especializado & Armado:</span>
                    <span className="text-success fw-semibold">Gratis</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Garantía Extendida 5 Años:</span>
                    <span className="text-success fw-semibold">Incluida</span>
                  </div>
                  <div className="d-flex justify-content-between pt-3 border-top mt-3">
                    <span className="h5 fw-bold mb-0">Total a Pagar:</span>
                    <span className="h4 fw-bold text-gold mb-0">${cartTotal.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-gold-solid btn-lg w-100 py-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Procesando Pedido...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shield-halved me-2"></i>
                      Confirmar Compra Segura
                    </>
                  )}
                </button>

                <div className="text-center mt-3">
                  <small className="text-muted d-block">
                    <i className="fas fa-lock me-1"></i> Transacción cifrada con encriptación de 256 bits.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
