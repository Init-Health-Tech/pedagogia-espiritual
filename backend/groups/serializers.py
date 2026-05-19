from rest_framework import serializers

from accounts.serializers import UserSerializer
from content.serializers import ContenidoSerializer
from .models import EsquemaGrupo, GrupoPastoreo


class EsquemaGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EsquemaGrupo
        fields = '__all__'


class GrupoPastoreoSerializer(serializers.ModelSerializer):
    coordinador_detalle = UserSerializer(source='coordinador', read_only=True)
    miembros_detalle = UserSerializer(source='miembros', many=True, read_only=True)
    contenidos_detalle = ContenidoSerializer(source='contenidos', many=True, read_only=True)
    esquemas = EsquemaGrupoSerializer(many=True, read_only=True)
    total_miembros = serializers.SerializerMethodField()

    class Meta:
        model = GrupoPastoreo
        fields = '__all__'

    def get_total_miembros(self, obj):
        return obj.miembros.count()


class GrupoPastoreoListSerializer(serializers.ModelSerializer):
    total_miembros = serializers.SerializerMethodField()
    coordinador_nombre = serializers.CharField(source='coordinador.get_full_name', read_only=True)

    class Meta:
        model = GrupoPastoreo
        fields = (
            'id', 'nombre', 'descripcion', 'coordinador', 'coordinador_nombre',
            'horario_reunion', 'activo', 'total_miembros', 'created_at',
        )

    def get_total_miembros(self, obj):
        return obj.miembros.count()
