import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, updateCartItem as apiUpdateCartItem } from '../api/cart';
import { useAuth } from './AuthContext';

// Toast estilizado para notificaciones de carrito
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: '#1a1a1a',
  color: '#ffffff',
  customClass: {
    popup: 'luxury-toast'
  }
});

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Recalcular conteo y total cuando cambien los ítems
  const recalculateTotals = useCallback((items) => {
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = items.reduce((sum, item) => {
      const price = parseFloat(item.price || item.product?.price || 0);
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);

    setCartCount(totalCount);
    setCartTotal(totalPrice);
  }, []);

  // Cargar carrito desde la API
  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      return;
    }

    setLoading(true);
    try {
      const cartData = await getCart();
      const items = cartData.items || [];
      setCartItems(items);
      recalculateTotals(items);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, recalculateTotals]);

  // Cargar carrito al cambiar el estado de autenticación
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Abrir / Cerrar / Alternar Carrito
  const openCart = () => {
    setIsCartOpen(true);
    loadCart();
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(prev => {
      if (!prev) loadCart();
      return !prev;
    });
  };

  // Agregar al carrito
  const addToCart = async (productId, quantity = 1, productName = 'Producto') => {
    if (!isAuthenticated) {
      Toast.fire({
        icon: 'info',
        title: 'Por favor inicia sesión para agregar productos al carrito'
      });
      return { success: false, requireAuth: true };
    }

    try {
      const updatedCart = await apiAddToCart(productId, quantity);
      const items = updatedCart.items || [];
      setCartItems(items);
      recalculateTotals(items);

      Toast.fire({
        icon: 'success',
        title: `¡${productName} añadido al carrito!`
      });

      return { success: true, data: updatedCart };
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = typeof error === 'object' && error?.error ? error.error : 'Error al agregar al carrito';
      Toast.fire({
        icon: 'error',
        title: errorMessage
      });
      return { success: false, error };
    }
  };

  // Remover del carrito
  const removeFromCart = async (itemId, productName = 'Producto') => {
    try {
      await apiRemoveFromCart(itemId);
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      recalculateTotals(updatedItems);

      Toast.fire({
        icon: 'info',
        title: `Se eliminó ${productName} del carrito`
      });

      return { success: true };
    } catch (error) {
      console.error('Error removing item:', error);
      Toast.fire({
        icon: 'error',
        title: 'Error al eliminar producto'
      });
      return { success: false, error };
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const updatedCart = await apiUpdateCartItem(itemId, newQuantity);
      const items = updatedCart.items || [];
      setCartItems(items);
      recalculateTotals(items);
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      const errorMessage = typeof error === 'object' && error?.error ? error.error : 'Error al actualizar cantidad';
      Toast.fire({
        icon: 'error',
        title: errorMessage
      });
      return { success: false, error };
    }
  };

  // Limpiar carrito local (por ejemplo tras completar orden)
  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    setCartTotal(0);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
