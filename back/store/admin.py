from django.contrib import admin
from .models import Furniture, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent']
    list_filter = ['parent']
    search_fields = ['name']

@admin.register(Furniture)
class FurnitureAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_3d_active']
    list_filter = ['category', 'is_3d_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock']
    readonly_fields = ['created_at']
