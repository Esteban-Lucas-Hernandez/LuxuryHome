from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializador para datos de perfil del usuario autenticado"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff', 'date_joined')
        read_only_fields = ('id', 'is_staff', 'date_joined')


class RegisterSerializer(serializers.ModelSerializer):
    # Serializador para registro de usuarios
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        # Crea usuario con contraseña hasheada
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

