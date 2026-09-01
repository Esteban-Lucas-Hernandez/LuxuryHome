from django.contrib import admin
from .models import Order, OrderItem, OrderTracking

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ['furniture', 'quantity', 'price_at_purchase']
    verbose_name = "Producto en la Orden"
    verbose_name_plural = "Productos en la Orden"

class OrderTrackingInline(admin.TabularInline):
    model = OrderTracking
    extra = 1
    fields = ['message']
    verbose_name = "Novedad de Seguimiento (Tracking)"
    verbose_name_plural = "Historial de Novedades (Tracking)"

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'created_at', 'get_total_items', 'get_total_amount']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'id']
    readonly_fields = ['created_at']
    list_editable = ['status']
    inlines = [OrderItemInline, OrderTrackingInline]

    @admin.display(description='Total Artículos')
    def get_total_items(self, obj):
        if not obj.pk:
            return 0
        return sum(item.quantity for item in obj.items.all())

    @admin.display(description='Monto Total')
    def get_total_amount(self, obj):
        if not obj.pk:
            return "$0.00"
        total = sum((item.price_at_purchase or 0) * item.quantity for item in obj.items.all())
        return f"${float(total):,.2f}"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'furniture', 'quantity', 'price_at_purchase']
    list_filter = ['order__status']
    search_fields = ['furniture__name', 'order__id']

@admin.register(OrderTracking)
class OrderTrackingAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'message', 'timestamp']
    list_filter = ['timestamp']
    search_fields = ['order__id', 'message']
    readonly_fields = ['timestamp']


