import Swal from 'sweetalert2';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useFurnitureDetail } from '../../api/hooks/useFurnitureDetail';
import { addToCart } from '../../api/cart';
import './Details.css';

/**
 * Componente de respaldo en caso de que un modelo 3D no pueda cargarse.
 * Renderiza un cubo de alambre ligero con un mensaje informativo.
 * 
 * @returns {JSX.Element} Geometría 3D de reemplazo.
 */
function ModelFallback() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e9ecef" wireframe />
      </mesh>
      <Html center>
        <div className="text-center" style={{ background: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '5px' }}>
          <small className="text-muted">Modelo 3D no disponible</small>
        </div>
      </Html>
    </group>
  );
}

/**
 * Componente para renderizar modelos 3D en formato GLB/GLTF mediante Three.js.
 * Procesa automáticamente materiales, sombras y escalado de objetos.
 * 
 * @param {{ url: string, scale?: number }} props Propiedades del modelo.
 * @returns {JSX.Element} Escena 3D procesada.
 */
function Model3D({ url, scale = 1 }) {
  const { scene, loading, error } = useGLTF(url, true);
  
  // Manejo de error al cargar el archivo .glb 3D
  if (error) {
    console.warn('3D Model failed to load:', error);
    return <ModelFallback />;
  }
  
  // Spinner de carga dentro de la escena Canvas de Three.js
  if (loading) {
    return (
      <Html center>
        <div className="text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Html>
    );
  }
  
  // Recorrer los nodos del modelo 3D para optimizar sombras, rugosidad y brillo
  scene.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        child.material.side = THREE.DoubleSide;
        
        // Ajustar propiedades de respuesta a la luz en materiales estándar
        if (child.material.type === 'MeshStandardMaterial') {
          if (child.material.metalness !== undefined) {
            child.material.metalness = Math.min(child.material.metalness + 0.1, 1);
          }
          if (child.material.roughness !== undefined) {
            child.material.roughness = Math.max(child.material.roughness - 0.1, 0.1);
          }
        }
        
        // Aplicar emisión suave para evitar mallas excesivamente oscuras
        if (!child.material.emissive || child.material.emissive.getHex() === 0) {
          child.material.emissive = new THREE.Color(0x111111);
          child.material.emissiveIntensity = 0.2;
        }
        
        child.material.needsUpdate = true;
      }
    }
  });
  
  return <primitive object={scene} scale={scale} />;
}


/**
 * Componente de la Página de Detalle del Mueble (Details).
 * Permite alternar entre la imagen fotográfica y el visor 3D interactivo,
 * ver especificaciones completas del producto y agregar al carrito.
 * 
 * @returns {JSX.Element} Vista detallada del producto.
 */
const Details = () => {
  const navigate = useNavigate();
  const { furniture, loading, error, show3D, toggleView } = useFurnitureDetail();

  /** Muestra aviso e inicia el renderizado 3D */
  const handleToggle3DView = () => {
    Swal.fire({
      title: '¡Atención!',
      text: 'Tenga paciencia mientras carga la imagen 3D para la demo.',
      icon: 'info',
      confirmButtonText: 'Entendido'
    }).then(() => {
      toggleView(true);
    });
  };

  /** Agrega el producto actual al carrito de compras */
  const handleAddToCart = async () => {
    if (furniture.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }
    try {
      await addToCart(furniture.id, 1);
      alert(`¡${furniture.name} añadido al carrito!`);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      alert('Error al agregar al carrito');
    }
  };

  /** Inicia el flujo directo de compra */
  const handleBuyNow = async () => {
    if (furniture.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }
    await handleAddToCart();
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando mueble...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-container">
        <div className="container py-5 text-center">
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!furniture) {
    return null;
  }

  return (
    <div className="details-container">
      <div className="container">
        <button 
          className="btn btn-link mb-3 p-0"
          onClick={() => navigate('/products')}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Volver al catálogo
        </button>
        
        <div className="details-content row">
          {/* Sección de Visualización */}
          <div className="col-lg-7">
            <div className="visualization-section mb-4">
              <ul className="nav nav-tabs" id="viewTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${!show3D ? 'active' : ''}`}
                    onClick={() => toggleView(false)}
                  >
                    <i className="fas fa-image me-2"></i>
                    Imagen 2D
                  </button>
                </li>
                {furniture.is_3d_active && furniture.model_3d && (
                  <li className="nav-item" role="presentation">
                    <button 
                      className={`nav-link ${show3D ? 'active' : ''}`}
                      onClick={handleToggle3DView}
                    >
                      <i className="fas fa-cube me-2"></i>
                      Vista 3D
                      <span className="badge bg-primary ms-2">Beta</span>
                    </button>
                  </li>
                )}
              </ul>
              
              <div className="tab-content mt-3">
                {/* Vista 2D */}
                {!show3D && (
                  <div className="tab-pane fade show active">
                    <div className="image-container text-center">
                      <img 
                        src={furniture.image}
                        alt={furniture.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/600x400?text=Imagen+no+disponible';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Vista 3D */}
                {show3D && furniture.is_3d_active && furniture.model_3d && (
                  <div className="tab-pane fade show active">
                    <div className="model-3d-container" style={{ height: '500px', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                      <Canvas 
                        camera={{ position: [0, 0, 5], fov: 50 }}
                        onCreated={({ gl }) => {
                          gl.setClearColor('#ffffff');
                          gl.shadowMap.enabled = true;
                          gl.shadowMap.type = THREE.PCFSoftShadowMap;
                          gl.toneMapping = THREE.ACESFilmicToneMapping;
                          gl.toneMappingExposure = 1.2;
                          gl.outputEncoding = THREE.sRGBEncoding;
                        }}
                      >
                        {/* Enhanced lighting setup for maximum clarity */}
                        <ambientLight intensity={2.5} />
                        <directionalLight 
                          position={[15, 15, 15]} 
                          intensity={3} 
                          castShadow
                          shadow-mapSize-width={4096}
                          shadow-mapSize-height={4096}
                          shadow-camera-left={-20}
                          shadow-camera-right={20}
                          shadow-camera-top={20}
                          shadow-camera-bottom={-20}
                          color="#ffffff"
                        />
                        <directionalLight 
                          position={[-15, 10, -15]} 
                          intensity={2.5} 
                          color="#ffffff"
                        />
                        <directionalLight 
                          position={[0, -15, 0]} 
                          intensity={1.5} 
                          color="#f0f0f0"
                        />
                        <pointLight position={[0, 15, 0]} intensity={2} distance={30} decay={2} color="#ffffff" />
                        <pointLight position={[10, 5, 10]} intensity={1.5} distance={20} decay={2} color="#ffffff" />
                        <pointLight position={[-10, 5, -10]} intensity={1.5} distance={20} decay={2} color="#ffffff" />
                        <hemisphereLight 
                          skyColor="#ffffff" 
                          groundColor="#e0e0e0" 
                          intensity={2} 
                        />
                        
                        {/* Environment lighting for realistic reflections */}
                        <Environment preset="apartment" intensity={1.2} />
                        
                        {/* Contact shadows for better grounding */}
                        <ContactShadows 
                          position={[0, -1.5, 0]} 
                          opacity={0.6} 
                          scale={15} 
                          blur={2} 
                          far={10} 
                        />
                        
                        <Suspense fallback={<ModelFallback />}>
                          <group position={[0, -0.7, 0]}>
                            <Model3D url={furniture.model_3d} scale={furniture.scale_factor || 1} />
                          </group>
                        </Suspense>
                        <OrbitControls 
                          enablePan={true} 
                          enableZoom={true} 
                          enableRotate={true} 
                          autoRotate={false}
                          minDistance={2}
                          maxDistance={10}
                        />
                      </Canvas>
                    </div>
                    <div className="mt-2 text-muted small">
                      <i className="fas fa-mouse me-1"></i>
                      Arrastra para rotar • Haz scroll para zoom
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Información del Producto */}
          <div className="col-lg-5">
            <div className="product-info">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge bg-secondary">{furniture.category_name}</span>
                {furniture.is_3d_active && (
                  <span className="badge bg-success">
                    <i className="fas fa-check-circle me-1"></i>
                    Modelo 3D Disponible
                  </span>
                )}
              </div>
              
              <h1 className="product-title mb-3">{furniture.name}</h1>
              
              <div className="price-section mb-4">
                <div className="display-5 fw-bold text-primary">
                  ${parseFloat(furniture.price).toLocaleString('es-CO')}
                </div>
                <small className="text-muted">IVA incluido</small>
              </div>
              
              <p className="product-description mb-4">
                {furniture.description || 'Descripción no disponible'}
              </p>
              
              <div className="specs-grid mb-4">
                <div className="spec-item">
                  <i className="fas fa-box text-muted me-2"></i>
                  <span className="fw-medium">Stock:</span>
                  <span className={`ms-2 ${furniture.stock > 0 ? 'text-success' : 'text-danger'}`}>
                    {furniture.stock > 0 ? `${furniture.stock} unidades` : 'Agotado'}
                  </span>
                </div>
                <div className="spec-item">
                  <i className="fas fa-calendar-plus text-muted me-2"></i>
                  <span className="fw-medium">Publicado:</span>
                  <span className="ms-2 text-muted">
                    {new Date(furniture.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="btn btn-primary btn-lg w-100 mb-3"
                  onClick={handleAddToCart}
                  disabled={furniture.stock <= 0}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  {furniture.stock > 0 ? 'Agregar al Carrito' : 'Producto Agotado'}
                </button>
                
                <button 
                  className="btn btn-success btn-lg w-100"
                  onClick={handleBuyNow}
                  disabled={furniture.stock <= 0}
                >
                  <i className="fas fa-bolt me-2"></i>
                  Comprar Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;