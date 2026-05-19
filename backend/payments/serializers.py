from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import Pago, PlanSuscripcion, Suscripcion


class PlanSuscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanSuscripcion
        fields = '__all__'


class SuscripcionSerializer(serializers.ModelSerializer):
    plan_detalle = PlanSuscripcionSerializer(source='plan', read_only=True)
    usuario_detalle = UserSerializer(source='usuario', read_only=True)
    esta_vigente = serializers.BooleanField(read_only=True)

    class Meta:
        model = Suscripcion
        fields = '__all__'


class PagoSerializer(serializers.ModelSerializer):
    usuario_detalle = UserSerializer(source='usuario', read_only=True)

    class Meta:
        model = Pago
        fields = '__all__'
        read_only_fields = ('registrado_por', 'created_at')
