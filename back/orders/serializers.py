from rest_framework import serializers
from .models import Order, OrderItem, OrderTracking
from store.serializers import FurnitureSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    """Serializador para items de orden"""
    furniture = FurnitureSerializer(read_only=True)
    furniture_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'furniture', 'furniture_id', 'quantity', 'price_at_purchase', 'subtotal']
        read_only_fields = ['id', 'price_at_purchase']
    
    def get_subtotal(self, obj):
        return float(obj.price_at_purchase * obj.quantity)

class OrderTrackingSerializer(serializers.ModelSerializer):
    """Serializador para seguimiento de ordenes"""
    class Meta:
        model = OrderTracking
        fields = ['id', 'message', 'timestamp']
        read_only_fields = ['id', 'timestamp']

class OrderSerializer(serializers.ModelSerializer):
    """Serializador principal para ordenes"""
    items = OrderItemSerializer(many=True, read_only=True)
    tracking = OrderTrackingSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'created_at', 'items', 'tracking', 'total_items', 'total_amount']
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())
    
    def get_total_amount(self, obj):
        return float(sum(item.price_at_purchase * item.quantity for item in obj.items.all()))