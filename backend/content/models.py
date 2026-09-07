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
    modulo = models.ForeignKey(
        'pedagogia.Modulo',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contenidos',
        help_text='Etapa / módulo pedagógico al que pertenece este contenido (opcional)',
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


class ContenidoVista(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='contenidos_vistos',
    )
    contenido = models.ForeignKey(
        Contenido,
        on_delete=models.CASCADE,
        related_name='vistas',
    )
    visto_en = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['usuario', 'contenido'], name='unique_contenido_vista'),
        ]
        verbose_name = 'Vista de contenido'
        verbose_name_plural = 'Vistas de contenido'

    def __str__(self):
        return f'{self.usuario} · {self.contenido}'


class TutorialVideo(models.Model):
    """Tutoriales fijos del portal de miembro (una entrada por sección de navegación)."""

    class Seccion(models.TextChoices):
        INICIO = 'inicio', 'Inicio'
        CAMINO = 'camino', 'Camino'
        CONTENIDOS = 'contenidos', 'Contenidos'
        GRUPOS = 'grupos', 'Grupos'
        MENSAJES = 'mensajes', 'Mensajes'

    seccion = models.CharField(max_length=20, choices=Seccion.choices, unique=True)
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    url_video = models.URLField(blank=True, help_text='Enlace externo del video (YouTube, Vimeo, etc.)')
    orden = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['orden', 'seccion']
        verbose_name = 'Tutorial en video'
        verbose_name_plural = 'Tutoriales en video'

    def __str__(self):
        return self.titulo
