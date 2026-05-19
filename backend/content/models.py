from django.conf import settings
from django.db import models


class CategoriaContenido(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    icono = models.CharField(max_length=50, blank=True, default='book')
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['orden', 'nombre']
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.nombre


class Contenido(models.Model):
    class Tipo(models.TextChoices):
        VIDEO = 'video', 'Video'
        DOCUMENTO = 'documento', 'Documento'
        PRESENTACION = 'presentacion', 'Presentación'
        ESQUEMA = 'esquema', 'Esquema'
        AUDIO = 'audio', 'Audio'

    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    tipo = models.CharField(max_length=20, choices=Tipo.choices)
    categoria = models.ForeignKey(
        CategoriaContenido,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contenidos',
    )
    archivo = models.FileField(upload_to='contenidos/', blank=True, null=True)
    url_externa = models.URLField(blank=True, help_text='URL de video (YouTube, Vimeo, etc.)')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    duracion_minutos = models.PositiveIntegerField(null=True, blank=True)
    es_publico = models.BooleanField(default=False)
    requiere_suscripcion = models.BooleanField(default=True)
    orden = models.PositiveIntegerField(default=0)
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='contenidos_creados',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['orden', '-created_at']
        verbose_name = 'Contenido'
        verbose_name_plural = 'Contenidos'

    def __str__(self):
        return self.titulo
