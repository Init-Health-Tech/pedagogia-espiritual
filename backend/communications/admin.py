from django.contrib import admin

from .models import Anuncio, Mensaje


@admin.register(Anuncio)
class AnuncioAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'es_global', 'importante', 'created_at')
    list_filter = ('es_global', 'importante')


@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ('asunto', 'remitente', 'destinatario', 'leido', 'created_at')
    list_filter = ('leido',)
