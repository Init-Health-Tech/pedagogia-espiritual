from django.conf import settings
from django.db import models


class EtapaEspiritual(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    orden = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=7, default='#8B7355')

    class Meta:
        ordering = ['orden']
        verbose_name = 'Etapa espiritual'
        verbose_name_plural = 'Etapas espirituales'

    def __str__(self):
        return self.nombre


class FichaPedagogica(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ficha_pedagogica',
    )
    etapa_actual = models.ForeignKey(
        EtapaEspiritual,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='fichas',
    )
    progreso_general = models.PositiveIntegerField(default=0, help_text='Porcentaje 0-100')
    sacramentos_recibidos = models.TextField(blank=True)
    compromisos_espirituales = models.TextField(blank=True)
    notas_formador = models.TextField(blank=True)
    fecha_inicio_camino = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Ficha pedagógica'
        verbose_name_plural = 'Fichas pedagógicas'

    def __str__(self):
        return f'Ficha de {self.usuario}'


class AvanceEspiritual(models.Model):
    ficha = models.ForeignKey(
        FichaPedagogica,
        on_delete=models.CASCADE,
        related_name='avances',
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    porcentaje = models.PositiveIntegerField(default=0)
    fecha = models.DateField(auto_now_add=True)
    registrado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ['-fecha']
        verbose_name = 'Avance espiritual'
        verbose_name_plural = 'Avances espirituales'

    def __str__(self):
        return self.titulo
