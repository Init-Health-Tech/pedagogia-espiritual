from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import AvanceEspiritual, EtapaEspiritual, FichaPedagogica


class EtapaEspiritualSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtapaEspiritual
        fields = '__all__'


class AvanceEspiritualSerializer(serializers.ModelSerializer):
    registrado_por_nombre = serializers.CharField(
        source='registrado_por.get_full_name',
        read_only=True,
    )

    class Meta:
        model = AvanceEspiritual
        fields = '__all__'
        read_only_fields = ('registrado_por',)


class FichaPedagogicaSerializer(serializers.ModelSerializer):
    usuario_detalle = UserSerializer(source='usuario', read_only=True)
    etapa_actual_detalle = EtapaEspiritualSerializer(source='etapa_actual', read_only=True)
    avances = AvanceEspiritualSerializer(many=True, read_only=True)

    class Meta:
        model = FichaPedagogica
        fields = '__all__'


class FichaPedagogicaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaPedagogica
        fields = (
            'etapa_actual', 'progreso_general', 'sacramentos_recibidos',
            'compromisos_espirituales', 'notas_formador', 'fecha_inicio_camino',
        )
