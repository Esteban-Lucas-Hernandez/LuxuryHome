import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

/**
 * Hook personalizado para cargar los detalles individuales de un mueble por su ID.
 * Maneja el estado de carga, errores, navegación y vista previa 3D.
 * 
 * @returns {{
 *   furniture: object|null,
 *   loading: boolean,
 *   error: string|null,
 *   show3D: boolean,
 *   toggleView: function(boolean): void
 * }} Estado del detalle del mueble y funciones de alternancia.
 */
export function useFurnitureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [furniture, setFurniture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadFurniture = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        setError(null);
        setFurniture(null);
        setShow3D(false);
        
        const response = await api.get(`/store/furniture/${id}/`);
        
        if (!isMounted) return;
        
        // Usar ruta relativa (/static/...) para que el proxy de Vite la intercepte.
        // URL absoluta (http://localhost:8000/...) bypasea el proxy -> CORS error en el GLB.
        const furnitureData = {
          ...response.data,
          image: response.data.image_url ?? null,
          model_3d: response.data.model_3d_url ?? null
        };
        
        setFurniture(furnitureData);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading furniture:', err);
        setError('Error al cargar el producto');
        setTimeout(() => navigate('/products'), 2000);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFurniture();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  /** Alterna la vista entre la imagen del producto y el visor 3D */
  const toggleView = (view3D) => {
    setShow3D(view3D);
  };

  return {
    furniture,
    loading,
    error,
    show3D,
    toggleView
  };
}