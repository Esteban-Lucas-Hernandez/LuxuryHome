"""
Este archivo contiene las vistas (ViewSets) de Django Rest Framework para la API de la tienda.
Define la lógica de los controladores para los endpoints relacionados con categorías y muebles.
Permite realizar operaciones CRUD, filtrado, búsqueda, ordenamiento, y expone acciones
personalizadas a través de @action.
"""
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Furniture, Category
from .serializers import FurnitureSerializer, CategorySerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para categorías (solo lectura).
    Expone los endpoints para listar y obtener detalles de categorías.
    Cualquiera puede acceder (AllowAny).
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class FurnitureViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para muebles.
    Permite operaciones CRUD, soporta filtrado por categoría/stock, búsqueda por nombre/descripción,
    y ordenamiento por precio o fecha.
    """
    queryset = Furniture.objects.all()
    serializer_class = FurnitureSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_3d_active', 'stock']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Obtener muebles por categoría específica"""
        category_id = request.query_params.get('category')
        if category_id:
            queryset = self.queryset.filter(category_id=category_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({'error': 'Parámetro category requerido'}, status=400)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Obtener muebles destacados (con stock > 0)"""
        queryset = self.queryset.filter(stock__gt=0)[:10]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_stock(self, request, pk=None):
        """Actualizar stock de un mueble específico"""
        furniture = self.get_object()
        new_stock = request.data.get('stock')
        
        if new_stock is not None and isinstance(new_stock, int) and new_stock >= 0:
            furniture.stock = new_stock
            furniture.save()
            serializer = self.get_serializer(furniture)
            return Response(serializer.data)
        return Response({'error': 'Stock inválido'}, status=400)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def all(self, request):
        """Obtener todos los muebles disponibles públicamente con filtros aplicados"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
