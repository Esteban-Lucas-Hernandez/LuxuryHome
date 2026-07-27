"""
Vistas de API para la gestión de usuarios y autenticación.
Ofrece endpoints para el registro de nuevos usuarios y generación de tokens JWT.
"""
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(generics.CreateAPIView):
    """
    Vista genérica para el registro público de nuevos usuarios (AllowAny).
    Recibe credenciales (username, email, password) y retorna el usuario creado.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
