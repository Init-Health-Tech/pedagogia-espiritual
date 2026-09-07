from django.contrib import admin

from .models import Evento, EventoRSVP


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'fecha', 'hora', 'ubicacion', 'es_global', 'creado_por')
    list_filter = ('es_global', 'fecha')
    search_fields = ('titulo', 'descripcion', 'ubicacion')
    filter_horizontal = ('grupos',)


@admin.register(EventoRSVP)
class EventoRSVPAdmin(admin.ModelAdmin):
    list_display = ('evento', 'usuario', 'respuesta', 'respondido_en')
    list_filter = ('respuesta',)
    search_fields = ('evento__titulo', 'usuario__username', 'usuario__first_name')
