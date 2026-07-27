import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

export function useFurnitureCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [furniture, setFurniture] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('-created_at');
  const [stockFilter, setStockFilter] = useState('');

  // Fetch categories once
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

  // Sync state from URL when URL changes externally (e.g. clicking navbar links while already on /products)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams.get('category')]);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, setSearchParams]);

  // Fetch furniture data
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

        // Usar ruta relativa (/static/...) para que el proxy de Vite la intercepte.
        // Si se usa URL absoluta (http://localhost:8000/...) el browser bypasea el proxy → CORS error.
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