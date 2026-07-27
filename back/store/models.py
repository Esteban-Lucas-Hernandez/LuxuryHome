"""
Modelos para la aplicación de tienda de muebles 'store'.
Define la jerarquía de categorías de productos y el catálogo de muebles
con soporte para imágenes y modelos 3D (.glb / .gltf).
"""
from django.db import models
from django.core.validators import FileExtensionValidator
import os

class Category(models.Model):
    """
    Modelo de Categoría de productos.
    Soporta categorías jerárquicas mediante autorreferencia (parent).
    """
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='subcategories'
    )
    image_path = models.CharField(
        max_length=255,
        help_text="Ruta relativa a la imagen (ej: category_salas.jpg)",
        blank=True,
        null=True
    )
    
    @property
    def image_url(self):
        """Devuelve la URL completa o ruta estática de la imagen de la categoría"""
        if self.image_path:
            if self.image_path.startswith('http://') or self.image_path.startswith('https://'):
                return self.image_path
            return f"/static/furniture_images/{self.image_path}"
        return None

    def __str__(self):
        return self.name

class Furniture(models.Model):
    """
    Modelo para representaciones de Muebles en el catálogo.
    Almacena metadatos del producto, precios, stock y rutas para recursos 3D.
    """
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_path = models.CharField(
        max_length=255,
        help_text="Ruta relativa a la imagen (ej: chair.jpg)",
        blank=True
    )
    model_3d_path = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Ruta relativa al archivo 3D (ej: chair.glb)"
    )
    stock = models.PositiveIntegerField(default=1)
    is_3d_active = models.BooleanField(default=True, help_text="¿Mostrar botón Ver en 3D?")
    scale_factor = models.FloatField(default=1.0, help_text="Escala para el visor 3D")
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def model_3d_url(self):
        """Devuelve la URL estática del archivo 3D"""
        if self.model_3d_path:
            return f"/static/furniture_models/{self.model_3d_path}"
        return None
    
    @property
    def image_url(self):
        """Devuelve la URL estática de la imagen"""
        if self.image_path:
            return f"/static/furniture_images/{self.image_path}"
        return None

    def __str__(self):
        return self.name