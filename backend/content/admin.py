from django.contrib import admin

from .models import CategoriaContenido, Contenido, ContenidoVista, TutorialVideo


@admin.register(CategoriaContenido)
class CategoriaContenidoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'orden', 'icono')


@admin.register(Contenido)
class ContenidoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'modulo', 'categoria', 'es_publico', 'requiere_suscripcion', 'created_at')
    list_filter = ('tipo', 'modulo', 'categoria', 'es_publico', 'requiere_suscripcion')
    search_fields = ('titulo', 'descripcion')


@admin.register(ContenidoVista)
class ContenidoVistaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'contenido', 'visto_en')
    list_filter = ('contenido__tipo',)
    search_fields = ('usuario__username', 'contenido__titulo')


@admin.register(TutorialVideo)
class TutorialVideoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'seccion', 'orden', 'url_video', 'updated_at')
    list_editable = ('orden',)
    search_fields = ('titulo', 'descripcion')
    readonly_fields = ('seccion',)
