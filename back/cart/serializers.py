from rest_framework import serializers
from .models import Cart, CartItem
from store.serializers import FurnitureSerializer

class CartItemSerializer(serializers.ModelSerializer):
    """Serializador para items del carrito"""
    product = FurnitureSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']
        read_only_fields = ['id']
    
    def get_subtotal(self, obj):
        return float(obj.product.price * obj.quantity)
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value

class CartSerializer(serializers.ModelSerializer):
    """Serializador para el carrito completo"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'updated_at', 'items', 'total_items', 'total_amount']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())
    
    def get_total_amount(self, obj):
        return float(sum(item.product.price * item.quantity for item in obj.items.all()))