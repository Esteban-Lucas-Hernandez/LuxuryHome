"""
Este archivo define los serializadores de Django Rest Framework para la aplicación 'store'.
Los serializadores se encargan de convertir las instancias de los modelos (Category, Furniture)
en representaciones nativas de Python (diccionarios) que luego pueden renderizarse en JSON
para la API, y viceversa (parsear JSON entrante a modelos).
"""
from rest_framework import serializers
from .models import Furniture, Category

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializador para categorías de muebles.
    Incluye un campo recursivo o un método para traer subcategorías asociadas.
    """
    image_url = serializers.URLField(read_only=True)
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'image_url', 'parent', 'subcategories']
        
    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.all(), many=True).data
        return []

class FurnitureSerializer(serializers.ModelSerializer):
    """
    Serializador para los muebles.
    Mapea todos los campos del modelo de muebles e incluye información adicional de solo lectura,
    como el nombre de la categoría y las URLs de las imágenes y modelos 3D.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url = serializers.URLField(read_only=True)
    model_3d_url = serializers.URLField(read_only=True)
    
    class Meta:
        model = Furniture
        fields = [
            'id', 
            'name', 
            'description', 
            'price', 
            'image_url',
            'model_3d_url',
            'category',
            'category_name',
            'stock',
            'is_3d_active',
            'scale_factor',
            'created_at'
        ]
        read_only_fields = ['created_at']