from django.contrib import admin

from .models import Notificacion


@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'tipo', 'titulo', 'leida', 'activa', 'created_at')
    list_filter = ('tipo', 'leida', 'activa')
    search_fields = ('usuario__username', 'titulo', 'cuerpo', 'clave')
    readonly_fields = ('clave', 'created_at', 'leida_en')
