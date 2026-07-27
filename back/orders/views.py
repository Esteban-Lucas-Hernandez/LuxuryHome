"""
Vistas de API para la gestión de Órdenes de Compra y Seguimiento (Tracking).
Permite convertir el carrito en una orden procesada mediante transacciones atómicas,
consultar el historial de compras y actualizar estados de entrega (administradores).
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Order, OrderItem, OrderTracking
from cart.models import Cart, CartItem
from store.models import Furniture
from .serializers import OrderSerializer, OrderTrackingSerializer

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def create_order(request):
    """
    Crea una nueva orden de compra a partir de los ítems del carrito.
    Verifica stock, descuenta inventario y registra el seguimiento inicial dentro de una transacción atómica.
    """
    user = request.user
    
    try:
        cart = Cart.objects.get(user=user)
    except Cart.DoesNotExist:
        return Response(
            {'error': 'Carrito no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    cart_items = cart.items.all()
    
    if not cart_items.exists():
        return Response(
            {'error': 'El carrito está vacío'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar stock para todos los items
    for item in cart_items:
        if item.product.stock < item.quantity:
            return Response(
                {'error': f'Stock insuficiente para {item.product.name}. Disponible: {item.product.stock}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Crear orden
    order = Order.objects.create(user=user)
    
    # Crear items de orden y reducir stock
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            furniture=item.product,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        )
        # Reducir stock
        item.product.stock -= item.quantity
        item.product.save()
    
    # Limpiar carrito
    cart_items.delete()
    
    # Agregar tracking inicial
    OrderTracking.objects.create(
        order=order,
        message='Pedido creado y pagado'
    )
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def order_list(request):
    """Listar todas las ordenes del usuario"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def order_detail(request, order_id):
    """Obtener detalle de una orden específica"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    serializer = OrderSerializer(order)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def update_order_status(request, order_id):
    """Actualizar estado de orden (solo admin)"""
    order = get_object_or_404(Order, id=order_id)
    
    new_status = request.data.get('status')
    message = request.data.get('message')
    
    if not new_status:
        return Response(
            {'error': 'Se requiere nuevo estado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validar estado
    valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response(
            {'error': f'Estado inválido. Opciones: {valid_statuses}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Actualizar estado
    order.status = new_status
    order.save()
    
    # Agregar tracking si se proporciona mensaje
    if message:
        OrderTracking.objects.create(
            order=order,
            message=message
        )
    
    serializer = OrderSerializer(order)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def order_tracking(request, order_id):
    """Obtener historial de tracking de una orden"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    tracking = order.tracking.all().order_by('-timestamp')
    serializer = OrderTrackingSerializer(tracking, many=True)
    return Response(serializer.data)
