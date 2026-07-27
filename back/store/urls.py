from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FurnitureViewSet, CategoryViewSet

# Crear router para ViewSets
router = DefaultRouter()
router.register(r'furniture', FurnitureViewSet, basename='furniture')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]