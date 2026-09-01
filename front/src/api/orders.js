import axiosInstance from './axios';

/**
 * Crea una orden de compra a partir de los elementos actuales del carrito.
 * 
 * @returns {Promise<object>} Orden creada.
 */
export const createOrder = async () => {
  try {
    const response = await axiosInstance.post('/orders/create/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Obtiene el listado de todas las órdenes del usuario autenticado.
 * 
 * @returns {Promise<Array<object>>} Lista de órdenes.
 */
export const getOrders = async () => {
  try {
    const response = await axiosInstance.get('/orders/list/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Obtiene el detalle completo de una orden por su ID.
 * 
 * @param {number|string} orderId ID de la orden.
 * @returns {Promise<object>} Detalle de la orden.
 */
export const getOrderDetail = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/detail/${orderId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Obtiene el historial de eventos de seguimiento (tracking) de una orden.
 * 
 * @param {number|string} orderId ID de la orden.
 * @returns {Promise<Array<object>>} Lista de eventos de tracking.
 */
export const getOrderTracking = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/tracking/${orderId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


/**
 * Obtiene las métricas consolidadas del Dashboard de Administración (KPIs, Gráficos, Alertas).
 * 
 * @returns {Promise<object>} Objeto con KPIs, sales_timeline, orders_by_status, top_selling, etc.
 */
export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/orders/dashboard-stats/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Obtiene todas las órdenes para el panel de administración con soporte de filtros.
 * 
 * @param {object} params Filtros opcionales (status, search)
 * @returns {Promise<Array<object>>} Lista de órdenes.
 */
export const getAdminOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/orders/admin-orders/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Actualiza el estado y opcionalmente añade un mensaje de tracking a una orden (solo admin).
 * 
 * @param {number|string} orderId ID de la orden.
 * @param {string} status Nuevo estado ('PAID', 'PREPARING', 'SHIPPED', 'DELIVERED').
 * @param {string} [message] Mensaje descriptivo de tracking.
 * @returns {Promise<object>} Orden actualizada.
 */
export const updateOrderStatus = async (orderId, status, message = '') => {
  try {
    const response = await axiosInstance.post(`/orders/status/${orderId}/`, {
      status,
      message
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Actualiza el stock de un mueble específico (solo admin o autorizado).
 * 
 * @param {number|string} furnitureId ID del mueble.
 * @param {number} stock Nueva cantidad en inventario.
 * @returns {Promise<object>} Mueble actualizado.
 */
export const updateFurnitureStock = async (furnitureId, stock) => {
  try {
    const response = await axiosInstance.patch(`/store/furniture/${furnitureId}/update_stock/`, {
      stock: parseInt(stock, 10)
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Obtiene todas las categorías y subcategorías.
 * 
 * @returns {Promise<Array<object>>} Lista de categorías.
 */
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/store/categories/');
    const data = response.data;
    return Array.isArray(data) ? data : (data?.results || []);
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Obtiene el catálogo completo de muebles para administración.
 * 
 * @param {object} params Filtros
 * @returns {Promise<Array<object>>} Lista de muebles.
 */
export const getFurnitureList = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/store/furniture/all/', { params });
    const data = response.data;
    return Array.isArray(data) ? data : (data?.results || []);
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Crea un nuevo mueble en el catálogo.
 * 
 * @param {object} furnitureData Datos del mueble
 * @returns {Promise<object>} Mueble creado.
 */
export const createFurniture = async (furnitureData) => {
  try {
    const response = await axiosInstance.post('/store/furniture/', furnitureData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Actualiza un mueble existente.
 * 
 * @param {number|string} id ID del mueble
 * @param {object} furnitureData Datos actualizados
 * @returns {Promise<object>} Mueble actualizado.
 */
export const updateFurniture = async (id, furnitureData) => {
  try {
    const response = await axiosInstance.patch(`/store/furniture/${id}/`, furnitureData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Elimina un mueble del catálogo.
 * 
 * @param {number|string} id ID del mueble
 * @returns {Promise<object>}
 */
export const deleteFurniture = async (id) => {
  try {
    const response = await axiosInstance.delete(`/store/furniture/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


