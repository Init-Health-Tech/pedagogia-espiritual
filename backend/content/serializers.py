from rest_framework import serializers

from .models import CategoriaContenido, Contenido


class CategoriaContenidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaContenido
        fields = '__all__'


class ContenidoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    creado_por_nombre = serializers.CharField(source='creado_por.get_full_name', read_only=True)

    class Meta:
        model = Contenido
        fields = '__all__'
        read_only_fields = ('creado_por', 'created_at', 'updated_at')
