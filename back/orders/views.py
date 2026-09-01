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
    order = get_object_or_404(Order, id=order_id)
    # Si no es admin y no es el dueño, denegar
    if not request.user.is_staff and order.user != request.user:
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    tracking = order.tracking.all().order_by('-timestamp')
    serializer = OrderTrackingSerializer(tracking, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_orders_list(request):
    """Listar todas las órdenes de la tienda para gestión administrativa"""
    orders = Order.objects.all().order_by('-created_at')
    status_filter = request.query_params.get('status')
    if status_filter:
        orders = orders.filter(status=status_filter)
    search = request.query_params.get('search')
    if search:
        orders = orders.filter(user__username__icontains=search) | orders.filter(id__icontains=search)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def dashboard_stats(request):
    """
    Endpoint para métricas consolidadas del Dashboard de Administración:
    KPIs financieros, evolución de ventas, estados de pedidos, top muebles e inventario.
    """
    from django.utils import timezone
    from datetime import timedelta
    from django.db.models import Sum, Count, F
    from django.contrib.auth.models import User
    from store.models import Furniture, Category

    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # 1. KPIs
    all_orders = Order.objects.all()
    all_items = OrderItem.objects.all()
    
    total_orders = all_orders.count()
    active_orders = all_orders.filter(status__in=['PAID', 'PREPARING', 'SHIPPED']).count()
    delivered_orders = all_orders.filter(status='DELIVERED').count()
    
    # Total revenue from all order items
    total_revenue_val = all_items.aggregate(
        total=Sum(F('price_at_purchase') * F('quantity'))
    )['total'] or 0.0
    total_revenue = float(total_revenue_val)
    
    # Monthly revenue
    month_items = all_items.filter(order__created_at__gte=month_start)
    monthly_revenue_val = month_items.aggregate(
        total=Sum(F('price_at_purchase') * F('quantity'))
    )['total'] or 0.0
    monthly_revenue = float(monthly_revenue_val)
    
    total_users = User.objects.count()
    total_furniture = Furniture.objects.count()
    
    # Low stock items (< 3)
    low_stock_qs = Furniture.objects.filter(stock__lte=3).order_by('stock')
    low_stock_count = low_stock_qs.count()
    
    inventory_alerts = [
        {
            'id': f.id,
            'name': f.name,
            'stock': f.stock,
            'price': float(f.price),
            'image_url': f.image_url,
            'category_name': f.category.name if f.category else 'General'
        }
        for f in low_stock_qs[:10]
    ]
    
    # 2. Status distribution
    status_counts = all_orders.values('status').annotate(count=Count('id'))
    status_dict = {s['status']: s['count'] for s in status_counts}
    orders_by_status = [
        {'status': 'PAID', 'label': 'Pagado', 'count': status_dict.get('PAID', 0)},
        {'status': 'PREPARING', 'label': 'En Preparación', 'count': status_dict.get('PREPARING', 0)},
        {'status': 'SHIPPED', 'label': 'En Camino', 'count': status_dict.get('SHIPPED', 0)},
        {'status': 'DELIVERED', 'label': 'Entregado', 'count': status_dict.get('DELIVERED', 0)},
    ]
    
    # 3. Sales Timeline (Últimos 14 días)
    days_back = 14
    start_date = now - timedelta(days=days_back)
    timeline_orders = all_orders.filter(created_at__gte=start_date)
    
    daily_stats = {}
    for i in range(days_back + 1):
        day = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
        daily_stats[day] = {'date': day, 'revenue': 0.0, 'orders': 0}
        
    for item in all_items.filter(order__created_at__gte=start_date):
        day_str = item.order.created_at.strftime('%Y-%m-%d')
        if day_str in daily_stats:
            daily_stats[day_str]['revenue'] += float(item.price_at_purchase * item.quantity)
            
    for o in timeline_orders:
        day_str = o.created_at.strftime('%Y-%m-%d')
        if day_str in daily_stats:
            daily_stats[day_str]['orders'] += 1
            
    sales_timeline = list(daily_stats.values())
    sales_timeline.sort(key=lambda x: x['date'])
    
    # 4. Top Selling Products
    top_products_qs = (
        all_items.values('furniture__id', 'furniture__name', 'furniture__image_path', 'furniture__category__name')
        .annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum(F('price_at_purchase') * F('quantity'))
        )
        .order_by('-total_sold')[:5]
    )
    
    top_selling = []
    for tp in top_products_qs:
        img_path = tp.get('furniture__image_path')
        img_url = f"/static/furniture_images/{img_path}" if img_path else None
        top_selling.append({
            'id': tp['furniture__id'],
            'name': tp['furniture__name'] or 'Mueble',
            'category': tp['furniture__category__name'] or 'General',
            'total_sold': tp['total_sold'] or 0,
            'total_revenue': float(tp['total_revenue'] or 0),
            'image_url': img_url
        })
        
    # 5. Recent orders (Last 10)
    recent_orders_qs = all_orders.order_by('-created_at')[:10]
    recent_orders = OrderSerializer(recent_orders_qs, many=True).data
    
    # 6. Category Sales Distribution
    cat_sales_qs = (
        all_items.values('furniture__category__name')
        .annotate(
            total_revenue=Sum(F('price_at_purchase') * F('quantity')),
            items_sold=Sum('quantity')
        )
        .order_by('-total_revenue')[:6]
    )
    category_sales = [
        {
            'category': cs['furniture__category__name'] or 'Otras',
            'revenue': float(cs['total_revenue'] or 0),
            'items_sold': cs['items_sold'] or 0
        }
        for cs in cat_sales_qs
    ]
    
    return Response({
        'kpis': {
            'total_revenue': total_revenue,
            'monthly_revenue': monthly_revenue,
            'total_orders': total_orders,
            'active_orders': active_orders,
            'delivered_orders': delivered_orders,
            'total_users': total_users,
            'total_furniture': total_furniture,
            'low_stock_count': low_stock_count,
        },
        'orders_by_status': orders_by_status,
        'sales_timeline': sales_timeline,
        'top_selling': top_selling,
        'recent_orders': recent_orders,
        'inventory_alerts': inventory_alerts,
        'category_sales': category_sales
    })

