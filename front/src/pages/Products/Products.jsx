import { useNavigate } from 'react-router-dom';
import { useFurnitureCatalog } from '../../api/hooks/useFurnitureCatalog';
import { addToCart } from '../../api/cart';
import './Products.css';

/**
 * Componente de la Página de Catálogo de Productos (Products).
 * Muestra el buscador, filtros dinámicos por categoría, stock u ordenamiento,
 * y la cuadrícula interactiva de productos con acceso a la vista 3D y agregar al carrito.
 * 
 * @returns {JSX.Element} Catálogo de productos interactivo.
 */
function Products() {
  const navigate = useNavigate();
  const {
    furniture,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    stockFilter,
    setStockFilter,
    categories
  } = useFurnitureCatalog();

  /**
   * Agrega una unidad del mueble especificado al carrito de compras.
   * Verifica la disponibilidad de inventario y dispara el evento 'cartUpdated'.
   * 
   * @param {object} product Objeto con las propiedades del producto.
   */
  const handleAddToCart = async (product) => {
    if (product.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }
    
    try {
      await addToCart(product.id, 1);
      alert(`${product.name} añadido al carrito!`);
      // Disparar evento personalizado para actualizar inmediatamente el carrito modal
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
    }
  };


  if (loading) {
    return (
      <div className="products-page">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando muebles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="container py-5 text-center">
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header Section */}
      <section className="products-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">Catálogo de Muebles</h1>
            <p className="page-subtitle">Explora nuestra colección de muebles premium</p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            <div className="search-box">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar muebles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>
            
            <div className="filters-row">
              <select 
                className="form-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">Todos los stocks</option>
                <option value="1">En stock</option>
                <option value="0">Sin stock</option>
              </select>
              
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="-created_at">Más recientes</option>
                <option value="created_at">Más antiguos</option>
                <option value="price">Precio: Menor a Mayor</option>
                <option value="-price">Precio: Mayor a Menor</option>
                <option value="name">Nombre A-Z</option>
                <option value="-name">Nombre Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <div className="results-info mb-4">
            <p className="mb-0">
              Mostrando <strong>{Array.isArray(furniture) ? furniture.length : 0}</strong> muebles
              {selectedCategory && Array.isArray(categories) && categories.find(c => c?.id?.toString() === selectedCategory.toString()) && (
                <span> en <strong>{categories.find(c => c?.id?.toString() === selectedCategory.toString())?.name}</strong></span>
              )}
            </p>
          </div>
          
          <div className="products-grid">
            {furniture.map(item => (
              <div key={item.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x300?text=Imagen+no+disponible';
                    }}
                  />
                  <div className="product-overlay">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/products/${item.id}`)}
                    >
                      <i className="fas fa-eye me-1"></i>
                      Ver 3D
                    </button>
                    <button 
                      className="btn btn-success btn-sm"
                      disabled={item.stock <= 0}
                      onClick={() => handleAddToCart(item)}
                    >
                      <i className="fas fa-shopping-cart me-1"></i>
                      {item.stock > 0 ? 'Comprar' : 'Agotado'}
                    </button>
                  </div>
                  {item.stock <= 0 && (
                    <span className="stock-badge out-of-stock">
                      Sin Stock
                    </span>
                  )}
                  {item.stock > 0 && item.stock < 5 && (
                    <span className="stock-badge low-stock">
                      ¡Últimas unidades! ({item.stock})
                    </span>
                  )}
                  {item.is_3d_active && (
                    <span className="badge-3d">
                      <i className="fas fa-cube"></i> 3D
                    </span>
                  )}
                </div>
                
                <div className="product-info">
                  <div className="product-category">{item.category_name}</div>
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-description">
                    {item.description?.substring(0, 100)}
                    {item.description?.length > 100 ? '...' : ''}
                  </p>
                  
                  <div className="product-meta">
                    <div className="product-price">
                      ${parseFloat(item.price).toLocaleString('es-CO')}
                    </div>
                    <div className="product-stock">
                      <i className="fas fa-box"></i>
                      {item.stock} disponibles
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {furniture.length === 0 && (
            <div className="no-products">
              <i className="fas fa-couch fa-3x mb-3"></i>
              <h3>No hay muebles disponibles</h3>
              <p>Prueba con otros filtros de búsqueda</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;