"""
Vistas de API para la gestión de usuarios y autenticación.
Ofrece endpoints para el registro de nuevos usuarios y generación de tokens JWT.
"""
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(generics.CreateAPIView):
    """
    Vista genérica para el registro público de nuevos usuarios (AllowAny).
    Recibe credenciales (username, email, password) y retorna el usuario creado.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class CurrentUserView(APIView):
    """
    Vista para obtener los datos del usuario autenticado (IsAuthenticated).
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class AdminUserListView(APIView):
    """
    Vista administrativa para listar usuarios registrados con métricas de compras.
    """
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        data = []
        for u in users:
            orders_qs = u.order_set.all()
            total_orders = orders_qs.count()
            total_spent = sum(
                sum(item.price_at_purchase * item.quantity for item in o.items.all())
                for o in orders_qs
            )
            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'is_staff': u.is_staff,
                'date_joined': u.date_joined,
                'total_orders': total_orders,
                'total_spent': float(total_spent)
            })
        return Response(data)



