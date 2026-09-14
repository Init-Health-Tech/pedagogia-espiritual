from django.conf import settings
from django.db import models
from django.utils import timezone


class Notificacion(models.Model):
    class Tipo(models.TextChoices):
        PAGO = 'pago', 'Pago'
        EVENTO = 'evento', 'Evento'
        SISTEMA = 'sistema', 'Sistema'

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notificaciones',
    )
    tipo = models.CharField(max_length=20, choices=Tipo.choices, default=Tipo.SISTEMA)
    titulo = models.CharField(max_length=255)
    cuerpo = models.TextField()
    leida = models.BooleanField(default=False)
    leida_en = models.DateTimeField(null=True, blank=True)
    activa = models.BooleanField(
        default=True,
        help_text='False cuando se cancela (p. ej. pago ya registrado).',
    )
    clave = models.CharField(
        max_length=120,
        help_text='Clave de deduplicación, ej. pago:12:7 o evento:3:0',
    )
    referencia_tipo = models.CharField(max_length=40, blank=True)
    referencia_id = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        constraints = [
            models.UniqueConstraint(
                fields=['usuario', 'clave'],
                name='unique_notificacion_usuario_clave',
            ),
        ]
        indexes = [
            models.Index(fields=['usuario', 'activa', 'leida']),
        ]

    def __str__(self):
        return f'{self.usuario}: {self.titulo}'

    def marcar_leida(self):
        if self.leida:
            return
        self.leida = True
        self.leida_en = timezone.now()
        self.save(update_fields=['leida', 'leida_en'])
