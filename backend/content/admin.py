from django.contrib import admin

from .models import CategoriaContenido, Contenido


@admin.register(CategoriaContenido)
class CategoriaContenidoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'orden', 'icono')


@admin.register(Contenido)
class ContenidoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'categoria', 'es_publico', 'requiere_suscripcion', 'created_at')
    list_filter = ('tipo', 'categoria', 'es_publico', 'requiere_suscripcion')
    search_fields = ('titulo', 'descripcion')
