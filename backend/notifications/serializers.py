from django.utils import timezone
from rest_framework import serializers

from .models import Notificacion


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = (
            'id', 'tipo', 'titulo', 'cuerpo', 'leida', 'leida_en',
            'activa', 'clave', 'referencia_tipo', 'referencia_id', 'created_at',
        )
        read_only_fields = fields
