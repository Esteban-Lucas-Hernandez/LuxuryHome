import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

/**
 * Hook personalizado para la gestión y filtrado del catálogo de muebles.
 * Administra el estado de la lista de productos, categorías disponibles,
 * búsqueda por texto, ordenamiento, filtrado por stock y sincronización bidireccional con la URL.
 * 
 * @returns {{
 *   furniture: Array<object>,
 *   loading: boolean,
 *   error: string|null,
 *   selectedCategory: string,
 *   setSelectedCategory: function(string): void,
 *   searchQuery: string,
 *   setSearchQuery: function(string): void,
 *   sortBy: string,
 *   setSortBy: function(string): void,
 *   stockFilter: string,
 *   setStockFilter: function(string): void,
 *   categories: Array<object>,
 *   clearFilters: function(): void
 * }} Estado del catálogo y métodos de control de filtros.
 */
export function useFurnitureCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados principales del catálogo
  const [furniture, setFurniture] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de filtros activados desde la URL o la interfaz de usuario
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('-created_at');
  const [stockFilter, setStockFilter] = useState('');

  // Carga inicial de la lista completa de categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/store/categories/');
        const catsData = response.data;
        const items = Array.isArray(catsData)
          ? catsData
          : (catsData?.results && Array.isArray(catsData.results) ? catsData.results : []);
        setCategories(items);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Sincronizar el estado de la categoría cuando la URL cambie externamente
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams.get('category')]);

  // Actualizar los parámetros de la URL cuando cambien los filtros locales
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, setSearchParams]);

  // Obtener la lista filtrada de muebles desde la API según los parámetros seleccionados
  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (stockFilter) params.stock = stockFilter;
        if (sortBy) params.ordering = sortBy;
        
        const response = await api.get('/store/furniture/all/', { params });

        // DRF puede devolver array directo o { count, results: [] } si hay paginación
        const items = Array.isArray(response.data)
          ? response.data
          : response.data?.results ?? [];

        // Mapear rutas de imagen y modelo 3D utilizando URLs absolutas/relativas procesadas
        const furnitureWithProcessedUrls = items.map(item => ({
          ...item,
          image: item.image_url ?? null,
          model_3d: item.model_3d_url ?? null
        }));
        
        setFurniture(furnitureWithProcessedUrls);
        setError(null);
      } catch (err) {
        console.error('Error fetching furniture:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFurniture();
  }, [selectedCategory, searchQuery, stockFilter, sortBy]);

  /** Restablece todos los filtros de búsqueda a su estado inicial por defecto */
  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setStockFilter('');
    setSortBy('-created_at');
    setSearchParams({});
  };

  return {
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
    categories,
    clearFilters
  };
}