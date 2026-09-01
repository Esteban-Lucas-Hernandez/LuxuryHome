import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartModal.css';

/**
 * Componente Modal Lateral de Carrito de Compras (CartModal).
 * Conectado globalmente mediante CartContext. Permite visualizar ítems con miniatura,
 * modificar cantidades, eliminar productos y navegar al flujo de Checkout.
 * 
 * @returns {JSX.Element} Panel lateral del carrito.
 */
const CartModal = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity
  } = useCart();

  /** Navega a la vista de Checkout y cierra el panel lateral */
  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  /** Navega al catálogo */
  const handleContinueShopping = () => {
    closeCart();
    navigate('/products');
  };

  return (
    <div className={`cart-modal-overlay ${isCartOpen ? 'open' : ''}`} onClick={closeCart}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Encabezado */}
        <div className="cart-header">
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-shopping-bag text-gold"></i>
            <h3 className="cart-title mb-0">Tu Carrito ({cartCount})</h3>
          </div>
          <button className="close-btn" onClick={closeCart} aria-label="Cerrar carrito">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Cuerpo del Carrito */}
        <div className="cart-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-gold" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted small">Actualizando carrito...</p>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const product = item.product || {};
                const productName = item.product_name || product.name || 'Mueble Exclusivo';
                const price = parseFloat(item.price || product.price || 0);
                const quantity = item.quantity || 1;
                const imageUrl = product.image_url || '/placeholder.png';

                return (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-img-wrapper">
                      <img
                        src={imageUrl}
                        alt={productName}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop';
                        }}
                      />
                    </div>
                    <div className="cart-item-details">
                      <h5 className="cart-item-name">{productName}</h5>
                      <span className="cart-item-unit-price">${price.toLocaleString('es-CO')} c/u</span>

                      <div className="cart-item-footer">
                        <div className="qty-pill-group">
                          <button
                            type="button"
                            className="qty-btn"
                            disabled={quantity <= 1}
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            aria-label="Reducir cantidad"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="qty-number">{quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            aria-label="Aumentar cantidad"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item.id, productName)}
                          title="Eliminar producto"
                        >
                          <i className="fas fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-cart-state text-center py-5">
              <div className="empty-cart-icon mb-3">
                <i className="fas fa-couch fa-3x text-muted"></i>
              </div>
              <h4 className="fw-bold mb-2">Tu carrito está vacío</h4>
              <p className="text-muted small mb-4">
                Explora nuestro catálogo 3D y descubre piezas únicas para transformar tu espacio.
              </p>
              <button className="btn btn-gold-solid px-4 py-2" onClick={handleContinueShopping}>
                Explorar Catálogo
              </button>
            </div>
          )}
        </div>

        {/* Pie del Carrito con Totales y Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row mb-2">
              <span className="text-muted">Subtotal:</span>
              <span className="fw-semibold">${cartTotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="cart-summary-row mb-3">
              <span className="text-muted">Envío & Seguro VIP:</span>
              <span className="text-success fw-semibold">Gratis</span>
            </div>
            <div className="cart-total-row pt-2 border-top mb-4">
              <span className="h6 fw-bold mb-0">Total Estimado:</span>
              <span className="h5 fw-bold text-gold mb-0">${cartTotal.toLocaleString('es-CO')}</span>
            </div>

            <div className="cart-actions-group d-flex flex-column gap-2">
              <button
                type="button"
                className="btn btn-gold-solid w-100 py-3 fw-bold"
                onClick={handleProceedToCheckout}
              >
                <i className="fas fa-lock me-2"></i>
                Proceder al Pago
              </button>
              <button
                type="button"
                className="btn btn-outline-dark w-100 py-2 small"
                onClick={handleContinueShopping}
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;