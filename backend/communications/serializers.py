from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import Anuncio, Mensaje


class AnuncioSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.CharField(source='autor.get_full_name', read_only=True)
    grupo_nombre = serializers.CharField(source='grupo.nombre', read_only=True)

    class Meta:
        model = Anuncio
        fields = '__all__'
        read_only_fields = ('autor', 'created_at')


class MensajeSerializer(serializers.ModelSerializer):
    remitente_detalle = UserSerializer(source='remitente', read_only=True)
    destinatario_detalle = UserSerializer(source='destinatario', read_only=True)

    class Meta:
        model = Mensaje
        fields = '__all__'
        read_only_fields = ('remitente', 'created_at')
