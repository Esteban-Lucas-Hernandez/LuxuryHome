"""
Vistas de API para la gestión del Carrito de Compras en Django Rest Framework.
Permite visualizar el carrito del usuario, agregar ítems con control de stock,
eliminar ítems y actualizar cantidades en tiempo real.
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from store.models import Furniture
from .serializers import CartSerializer, CartItemSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def cart_detail(request):
    """
    Obtiene el carrito activo del usuario autenticado.
    Si el carrito no existe, lo crea automáticamente.
    """
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    """Agregar item al carrito"""
    user = request.user
    cart, created = Cart.objects.get_or_create(user=user)
    
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    if not product_id:
        return Response(
            {'error': 'Se requiere product_id'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        product = Furniture.objects.get(id=product_id)
    except Furniture.DoesNotExist:
        return Response(
            {'error': 'Producto no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar stock
    if product.stock < quantity:
        return Response(
            {'error': f'Stock insuficiente. Disponible: {product.stock}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si ya existe el item en el carrito
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        # Si ya existe, sumar la cantidad
        cart_item.quantity += quantity
        if cart_item.quantity > product.stock:
            return Response(
                {'error': f'Stock insuficiente. Disponible: {product.stock}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        cart_item.save()
    
    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_cart(request, item_id):
    """Remover item del carrito"""
    user = request.user
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=user)
    cart_item.delete()
    
    # Retornar carrito actualizado
    cart = Cart.objects.get(user=user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_cart_item(request, item_id):
    """Actualizar cantidad de item en carrito"""
    user = request.user
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=user)
    
    quantity = request.data.get('quantity')
    
    if quantity is None:
        return Response(
            {'error': 'Se requiere cantidad'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if quantity <= 0:
        return Response(
            {'error': 'La cantidad debe ser mayor a 0'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar stock
    if cart_item.product.stock < quantity:
        return Response(
            {'error': f'Stock insuficiente. Disponible: {cart_item.product.stock}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    cart_item.quantity = quantity
    cart_item.save()
    
    # Retornar carrito actualizado
    cart = Cart.objects.get(user=user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)
