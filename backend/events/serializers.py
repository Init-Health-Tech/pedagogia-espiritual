from rest_framework import serializers

from groups.models import GrupoPastoreo
from .models import Evento, EventoRSVP


class EventoRSVPSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = EventoRSVP
        fields = [
            'id', 'evento', 'usuario', 'usuario_nombre', 'usuario_username',
            'respuesta', 'respondido_en',
        ]
        read_only_fields = ('usuario', 'respondido_en')

    def get_usuario_nombre(self, obj):
        u = obj.usuario
        full = (u.get_full_name() or '').strip()
        return full or u.username


class EventoSerializer(serializers.ModelSerializer):
    grupos = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=GrupoPastoreo.objects.filter(activo=True),
        required=False,
    )
    grupos_nombres = serializers.SerializerMethodField()
    creado_por_nombre = serializers.SerializerMethodField()
    conteo_voy = serializers.SerializerMethodField()
    conteo_no = serializers.SerializerMethodField()
    mi_respuesta = serializers.SerializerMethodField()

    class Meta:
        model = Evento
        fields = [
            'id', 'titulo', 'descripcion', 'fecha', 'hora', 'ubicacion',
            'es_global', 'grupos', 'grupos_nombres',
            'creado_por', 'creado_por_nombre',
            'conteo_voy', 'conteo_no', 'mi_respuesta',
            'created_at', 'updated_at',
        ]
        read_only_fields = ('creado_por', 'created_at', 'updated_at')

    def get_grupos_nombres(self, obj):
        return list(obj.grupos.values_list('nombre', flat=True))

    def get_creado_por_nombre(self, obj):
        if not obj.creado_por:
            return None
        full = (obj.creado_por.get_full_name() or '').strip()
        return full or obj.creado_por.username

    def get_conteo_voy(self, obj):
        prefetched = getattr(obj, '_conteo_voy', None)
        if prefetched is not None:
            return prefetched
        return obj.rsvps.filter(respuesta=EventoRSVP.Respuesta.VOY).count()

    def get_conteo_no(self, obj):
        prefetched = getattr(obj, '_conteo_no', None)
        if prefetched is not None:
            return prefetched
        return obj.rsvps.filter(respuesta=EventoRSVP.Respuesta.NO).count()

    def get_mi_respuesta(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        mapa = self.context.get('mi_rsvp_map')
        if mapa is not None:
            return mapa.get(obj.id)
        rsvp = obj.rsvps.filter(usuario=request.user).first()
        return rsvp.respuesta if rsvp else None

    def validate(self, attrs):
        es_global = attrs.get(
            'es_global',
            getattr(self.instance, 'es_global', True) if self.instance else True,
        )
        grupos = attrs.get('grupos', None)
        if self.instance and grupos is None:
            grupos = list(self.instance.grupos.all())
        if not es_global and not grupos:
            raise serializers.ValidationError({
                'grupos': 'Selecciona al menos un grupo o marca el evento para todos.',
            })
        return attrs


class EventoRSVPWriteSerializer(serializers.Serializer):
    respuesta = serializers.ChoiceField(choices=EventoRSVP.Respuesta.choices)
