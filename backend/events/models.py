from django.conf import settings
from django.db import models

from groups.models import GrupoPastoreo


class Evento(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    fecha = models.DateField()
    hora = models.TimeField()
    ubicacion = models.CharField(max_length=255)
    es_global = models.BooleanField(
        default=True,
        help_text='Si es verdadero, el evento es visible para todos los miembros.',
    )
    grupos = models.ManyToManyField(
        GrupoPastoreo,
        related_name='eventos',
        blank=True,
        help_text='Grupos destinatarios cuando no es global.',
    )
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='eventos_creados',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['fecha', 'hora']
        verbose_name = 'Evento'
        verbose_name_plural = 'Eventos'

    def __str__(self):
        return f'{self.titulo} ({self.fecha})'


class EventoRSVP(models.Model):
    class Respuesta(models.TextChoices):
        VOY = 'voy', 'Voy'
        NO = 'no', 'No puedo asistir'

    evento = models.ForeignKey(
        Evento,
        on_delete=models.CASCADE,
        related_name='rsvps',
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='eventos_rsvp',
    )
    respuesta = models.CharField(max_length=10, choices=Respuesta.choices)
    respondido_en = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['evento', 'usuario'],
                name='unique_evento_usuario_rsvp',
            ),
        ]
        verbose_name = 'Respuesta a evento'
        verbose_name_plural = 'Respuestas a eventos'
        ordering = ['respuesta', 'usuario__first_name', 'usuario__last_name']

    def __str__(self):
        return f'{self.usuario} → {self.evento}: {self.respuesta}'
