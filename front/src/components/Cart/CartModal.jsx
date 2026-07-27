import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItem } from '../../api/cart';
import './CartModal.css';

/**
 * Componente Modal de Carrito de Compras (CartModal).
 * Despliega el panel lateral del carrito, escucha eventos de actualización global ('cartUpdated'),
 * permite modificar cantidades o remover productos y calcula los totales.
 * 
 * @returns {JSX.Element} Botón e interfaz del modal del carrito.
 */
const CartModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /** Abre o cierra la visibilidad del modal e inicia la carga de datos */
  const toggleCart = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadCart();
    }
  };

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isOpen) {
        loadCart();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isOpen]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      console.log('Cart data:', cartData); // Debug log
      const items = cartData.items || [];
      console.log('Cart items:', items); // Debug log
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      setCartCount(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error al eliminar producto');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(itemId, newQuantity);
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      setCartCount(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error al actualizar cantidad');
    }
  };

  const incrementQuantity = (itemId, currentQuantity) => {
    handleUpdateQuantity(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleUpdateQuantity(itemId, currentQuantity - 1);
    }
  };


  return (
    <>
      <button className="btn btn-shopping-cart" onClick={toggleCart}>
        <i className="fas fa-shopping-cart"></i>
        <span className="cart-badge">{cartCount}</span>
      </button>

      <div className={`cart-modal-overlay ${isOpen ? 'open' : ''}`} onClick={toggleCart}>
        <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h3>Tu Carrito</h3>
            <button className="close-btn" onClick={toggleCart}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="cart-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : cartItems.length > 0 ? (
              <>
                {cartItems.map(item => {
                  console.log('Individual item:', item); // Debug log
                  const productName = item.product_name || item.name || item.product?.name || 'Producto desconocido';
                  const price = parseFloat(item.price || item.product?.price || 0);
                  const quantity = item.quantity || 1;
                  
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="item-info">
                        <h5>{productName}</h5>
                        <p className="item-price">${price.toLocaleString('es-CO')}</p>
                      </div>
                      <div className="item-actions">
                        <div className="quantity-controls">
                          <button 
                            className="btn btn-outline-secondary btn-sm qty-btn"
                            onClick={() => decrementQuantity(item.id, quantity)}
                            disabled={quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="quantity-display">{quantity}</span>
                          <button 
                            className="btn btn-outline-secondary btn-sm qty-btn"
                            onClick={() => incrementQuantity(item.id, quantity)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button 
                          className="btn btn-danger btn-sm remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="cart-total mt-3 pt-3 border-top">
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>${cartItems.reduce((sum, item) => {
                      const price = parseFloat(item.price || item.product?.price || 0);
                      const quantity = item.quantity || 1;
                      return sum + (price * quantity);
                    }, 0).toLocaleString('es-CO')}</strong>
                  </div>
                </div>
              </>
            ) : (
              <p className="empty-cart">Tu carrito está vacío</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;