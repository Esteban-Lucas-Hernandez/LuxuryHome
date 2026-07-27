from django.db import models
from django.contrib.auth.models import User
from store.models import Furniture

class Order(models.Model):
    STATUS_CHOICES = [
        ('PAID', 'Pagado'),
        ('PREPARING', 'En preparación'),
        ('SHIPPED', 'Enviado'),
        ('DELIVERED', 'Entregado'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PAID')
    created_at = models.DateTimeField(auto_now_add=True)

class OrderTracking(models.Model):
    order = models.ForeignKey(Order, related_name='tracking', on_delete=models.CASCADE)
    message = models.CharField(max_length=255) # Ej: "El pedido salió del depósito"
    timestamp = models.DateTimeField(auto_now_add=True)
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    furniture = models.ForeignKey(Furniture, on_delete=models.PROTECT) # PROTECT evita borrar muebles vendidos
    quantity = models.PositiveIntegerField(default=1)
    
    # SNAPSHOT: Guardamos el precio del momento de la compra
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.furniture.name} (Orden #{self.order.id})"