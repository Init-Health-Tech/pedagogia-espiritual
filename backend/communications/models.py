from django.conf import settings
from django.db import models

from groups.models import GrupoPastoreo


class Anuncio(models.Model):
    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='anuncios',
    )
    es_global = models.BooleanField(default=True)
    grupo = models.ForeignKey(
        GrupoPastoreo,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='anuncios',
    )
    importante = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Anuncio'
        verbose_name_plural = 'Anuncios'

    def __str__(self):
        return self.titulo


class Mensaje(models.Model):
    remitente = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mensajes_enviados',
    )
    destinatario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mensajes_recibidos',
    )
    asunto = models.CharField(max_length=255)
    cuerpo = models.TextField()
    leido = models.BooleanField(default=False)
    grupo = models.ForeignKey(
        GrupoPastoreo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='mensajes',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Mensaje'
        verbose_name_plural = 'Mensajes'

    def __str__(self):
        return f'{self.asunto} ({self.remitente} → {self.destinatario})'
