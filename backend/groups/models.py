from django.conf import settings
from django.db import models

from content.models import Contenido


class GrupoPastoreo(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    coordinador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='grupos_coordinados',
    )
    miembros = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='grupos_pastoreo',
        blank=True,
    )
    contenidos = models.ManyToManyField(
        Contenido,
        related_name='grupos',
        blank=True,
    )
    horario_reunion = models.CharField(max_length=200, blank=True)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Grupo de pastoreo'
        verbose_name_plural = 'Grupos de pastoreo'

    def __str__(self):
        return self.nombre


class EsquemaGrupo(models.Model):
    grupo = models.ForeignKey(
        GrupoPastoreo,
        on_delete=models.CASCADE,
        related_name='esquemas',
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    archivo = models.FileField(upload_to='esquemas/', blank=True, null=True)
    fecha_sesion = models.DateField(null=True, blank=True)
    orden = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden', '-fecha_sesion']
        verbose_name = 'Esquema de grupo'
        verbose_name_plural = 'Esquemas de grupo'

    def __str__(self):
        return f'{self.grupo.nombre} - {self.titulo}'
