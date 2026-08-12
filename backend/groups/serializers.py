from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import UserSerializer
from content.serializers import ContenidoSerializer
from .models import EsquemaGrupo, GrupoPastoreo

User = get_user_model()


class EsquemaGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EsquemaGrupo
        fields = '__all__'


class GrupoPastoreoSerializer(serializers.ModelSerializer):
    coordinadores_detalle = UserSerializer(source='coordinadores', many=True, read_only=True)
    miembros_detalle = UserSerializer(source='miembros', many=True, read_only=True)
    contenidos_detalle = ContenidoSerializer(source='contenidos', many=True, read_only=True)
    esquemas = EsquemaGrupoSerializer(many=True, read_only=True)
    total_miembros = serializers.SerializerMethodField()
    coordinadores = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.filter(role=User.Role.COORDINATOR, is_active=True),
        required=False,
    )
    miembros = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.filter(
            role=User.Role.MEMBER,
            is_active=True,
            is_active_member=True,
        ),
        required=False,
    )

    class Meta:
        model = GrupoPastoreo
        fields = '__all__'

    def get_total_miembros(self, obj):
        return obj.miembros.count()


class GrupoPastoreoListSerializer(serializers.ModelSerializer):
    total_miembros = serializers.SerializerMethodField()
    coordinadores_nombres = serializers.SerializerMethodField()
    miembros_nombres = serializers.SerializerMethodField()
    coordinadores = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    miembros = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = GrupoPastoreo
        fields = (
            'id', 'nombre', 'descripcion',
            'coordinadores', 'coordinadores_nombres',
            'miembros', 'miembros_nombres',
            'horario_reunion', 'activo', 'total_miembros', 'created_at',
        )

    def get_total_miembros(self, obj):
        return obj.miembros.count()

    def get_coordinadores_nombres(self, obj):
        return [_nombre_usuario(u) for u in obj.coordinadores.all()]

    def get_miembros_nombres(self, obj):
        return [_nombre_usuario(u) for u in obj.miembros.all()]


def _nombre_usuario(u):
    name = f'{u.first_name} {u.last_name}'.strip()
    return name or u.username
