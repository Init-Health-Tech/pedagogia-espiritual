from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import UserSerializer
from content.serializers import ContenidoSerializer
from .models import EsquemaGrupo, GrupoPastoreo, _format_hora_12

User = get_user_model()


def _nombre_usuario(u):
    name = f'{u.first_name} {u.last_name}'.strip()
    return name or u.username


def _iniciales(u):
    first = (u.first_name or '').strip()
    last = (u.last_name or '').strip()
    if first and last:
        return f'{first[0]}{last[0]}'.upper()
    name = _nombre_usuario(u)
    parts = name.split()
    if len(parts) >= 2:
        return f'{parts[0][0]}{parts[1][0]}'.upper()
    return (name[:2] or '?').upper()


def _persona_resumen(u, request=None):
    avatar = None
    if u.avatar:
        avatar = u.avatar.url
        if request:
            avatar = request.build_absolute_uri(avatar)
    return {
        'id': u.id,
        'full_name': _nombre_usuario(u),
        'first_name': u.first_name,
        'last_name': u.last_name,
        'avatar': avatar,
        'iniciales': _iniciales(u),
    }


def _proxima_reunion(obj):
    hora_display = _format_hora_12(obj.hora_reunion) if obj.hora_reunion else ''
    horario_display = obj.horario_display()

    fecha = obj.proxima_fecha_reunion()
    titulo = None

    if fecha is None:
        hoy = date.today()
        futuros = sorted(
            [e for e in obj.esquemas.all() if e.fecha_sesion and e.fecha_sesion >= hoy],
            key=lambda e: e.fecha_sesion,
        )
        prox = futuros[0] if futuros else None
        if prox:
            fecha = prox.fecha_sesion
            titulo = prox.titulo

    etiqueta = None
    if fecha:
        # Fecha en español se formatea en el frontend; aquí mandamos ISO + hora
        etiqueta = fecha.isoformat()
        if hora_display:
            etiqueta = f'{etiqueta}|{hora_display}'

    return {
        'titulo': titulo,
        'fecha': fecha.isoformat() if fecha else None,
        'hora': obj.hora_reunion.strftime('%H:%M') if obj.hora_reunion else None,
        'hora_display': hora_display,
        'dia': obj.dia_reunion or None,
        'dia_display': obj.get_dia_reunion_display() if obj.dia_reunion else None,
        'horario': horario_display,
        'requiere_revision': obj.horario_requiere_revision,
    }


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
    miembros_preview = serializers.SerializerMethodField()
    coordinadores_preview = serializers.SerializerMethodField()
    proxima_reunion = serializers.SerializerMethodField()
    horario_display = serializers.SerializerMethodField()
    horario_requiere_revision = serializers.BooleanField(read_only=True)
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

    def get_horario_display(self, obj):
        return obj.horario_display()

    def get_total_miembros(self, obj):
        return obj.miembros.count()

    def get_miembros_preview(self, obj):
        request = self.context.get('request')
        return [_persona_resumen(u, request) for u in obj.miembros.all()]

    def get_coordinadores_preview(self, obj):
        request = self.context.get('request')
        return [_persona_resumen(u, request) for u in obj.coordinadores.all()]

    def get_proxima_reunion(self, obj):
        return _proxima_reunion(obj)


class GrupoPastoreoListSerializer(serializers.ModelSerializer):
    total_miembros = serializers.SerializerMethodField()
    coordinadores_nombres = serializers.SerializerMethodField()
    miembros_nombres = serializers.SerializerMethodField()
    miembros_preview = serializers.SerializerMethodField()
    coordinadores_preview = serializers.SerializerMethodField()
    proxima_reunion = serializers.SerializerMethodField()
    horario_display = serializers.SerializerMethodField()
    horario_requiere_revision = serializers.BooleanField(read_only=True)
    coordinadores = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    miembros = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = GrupoPastoreo
        fields = (
            'id', 'nombre', 'descripcion',
            'coordinadores', 'coordinadores_nombres', 'coordinadores_preview',
            'miembros', 'miembros_nombres', 'miembros_preview',
            'dia_reunion', 'hora_reunion', 'horario_reunion', 'horario_display',
            'horario_requiere_revision', 'proxima_reunion',
            'activo', 'total_miembros', 'created_at',
        )

    def get_horario_display(self, obj):
        return obj.horario_display()

    def get_total_miembros(self, obj):
        return obj.miembros.count()

    def get_coordinadores_nombres(self, obj):
        return [_nombre_usuario(u) for u in obj.coordinadores.all()]

    def get_miembros_nombres(self, obj):
        return [_nombre_usuario(u) for u in obj.miembros.all()]

    def get_miembros_preview(self, obj):
        request = self.context.get('request')
        return [_persona_resumen(u, request) for u in obj.miembros.all()]

    def get_coordinadores_preview(self, obj):
        request = self.context.get('request')
        return [_persona_resumen(u, request) for u in obj.coordinadores.all()]

    def get_proxima_reunion(self, obj):
        return _proxima_reunion(obj)
