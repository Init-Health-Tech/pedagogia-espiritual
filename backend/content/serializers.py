from rest_framework import serializers

from .models import CategoriaContenido, Contenido, ContenidoVista


class CategoriaContenidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaContenido
        fields = '__all__'


class ContenidoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    creado_por_nombre = serializers.CharField(source='creado_por.get_full_name', read_only=True)
    visto = serializers.SerializerMethodField()

    class Meta:
        model = Contenido
        fields = [
            'id', 'titulo', 'descripcion', 'tipo', 'categoria', 'categoria_nombre',
            'archivo', 'url_externa', 'thumbnail', 'duracion_minutos',
            'es_publico', 'requiere_suscripcion', 'orden', 'creado_por',
            'creado_por_nombre', 'created_at', 'updated_at', 'visto',
        ]
        read_only_fields = ('creado_por', 'created_at', 'updated_at', 'visto')

    def get_visto(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        viewed_ids = self.context.get('viewed_ids')
        if viewed_ids is not None:
            return obj.id in viewed_ids
        return ContenidoVista.objects.filter(usuario=request.user, contenido=obj).exists()
