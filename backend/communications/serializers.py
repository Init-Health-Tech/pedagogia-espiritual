from rest_framework import serializers

from accounts.serializers import UserSerializer
from groups.models import GrupoPastoreo
from .contacts import puede_enviar_mensaje
from .models import Anuncio, Mensaje


class AnuncioSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.SerializerMethodField()
    autor_rol = serializers.CharField(source='autor.role', read_only=True)
    grupos = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=GrupoPastoreo.objects.filter(activo=True),
        required=False,
    )
    grupos_nombres = serializers.SerializerMethodField()

    class Meta:
        model = Anuncio
        fields = (
            'id', 'titulo', 'contenido', 'autor', 'autor_nombre', 'autor_rol',
            'es_global', 'grupos', 'grupos_nombres', 'importante', 'created_at',
        )
        read_only_fields = ('autor', 'created_at')

    def get_autor_nombre(self, obj):
        if not obj.autor:
            return 'Sin autor'
        name = f'{obj.autor.first_name} {obj.autor.last_name}'.strip()
        return name or obj.autor.username

    def get_grupos_nombres(self, obj):
        return list(obj.grupos.values_list('nombre', flat=True))

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
                'grupos': 'Selecciona al menos un grupo o marca el aviso para todos los grupos.',
            })
        return attrs


class MensajeSerializer(serializers.ModelSerializer):
    remitente_detalle = UserSerializer(source='remitente', read_only=True)
    destinatario_detalle = UserSerializer(source='destinatario', read_only=True)

    class Meta:
        model = Mensaje
        fields = '__all__'
        read_only_fields = ('remitente', 'created_at')

    def validate_destinatario(self, destinatario):
        request = self.context.get('request')
        remitente = getattr(request, 'user', None)
        if remitente and remitente.is_authenticated:
            if not puede_enviar_mensaje(remitente, destinatario):
                raise serializers.ValidationError(
                    'Solo puedes escribir a coordinadores y compañeros de tus grupos de pastoreo.',
                )
        return destinatario
