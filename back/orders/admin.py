from django.contrib import admin
from .models import Order, OrderItem, OrderTracking

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'id']
    readonly_fields = ['created_at']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'furniture', 'quantity', 'price_at_purchase']
    list_filter = ['order__status']
    search_fields = ['furniture__name', 'order__id']

@admin.register(OrderTracking)
class OrderTrackingAdmin(admin.ModelAdmin):
    list_display = ['order', 'message', 'timestamp']
    list_filter = ['timestamp']
    search_fields = ['order__id', 'message']
    readonly_fields = ['timestamp']
