import axiosInstance from './axios';

/**
 * Obtiene la información completa del carrito de compras del usuario autenticado.
 * 
 * @returns {Promise<object>} Datos del carrito e ítems incluidos.
 */
export const getCart = async () => {
  try {
    const response = await axiosInstance.get('/cart/view/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Agrega una cantidad específica de un producto al carrito del usuario.
 * 
 * @param {number|string} productId ID del mueble/producto.
 * @param {number} [quantity=1] Cantidad a agregar.
 * @returns {Promise<object>} Carrito actualizado.
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axiosInstance.post('/cart/add/', {
      product_id: productId,
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Elimina un ítem específico del carrito por su ID de ítem.
 * 
 * @param {number|string} itemId ID del ítem en el carrito.
 * @returns {Promise<object>} Carrito actualizado.
 */
export const removeFromCart = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`/cart/remove/${itemId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Actualiza la cantidad de un ítem existente en el carrito.
 * 
 * @param {number|string} itemId ID del ítem en el carrito.
 * @param {number} quantity Nueva cantidad deseada.
 * @returns {Promise<object>} Carrito actualizado.
 */
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await axiosInstance.put(`/cart/update/${itemId}/`, {
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};