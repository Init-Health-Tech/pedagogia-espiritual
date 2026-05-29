from django.conf import settings
from django.db import models


class Modulo(models.Model):
    """Módulo formativo (manual) del camino pedagógico."""
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    orden = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=7, default='#6B8CAE')
    manual_archivo = models.FileField(upload_to='manuales/', blank=True, null=True)
    manual_url = models.URLField(blank=True, help_text='Enlace al manual en PDF o recurso externo')
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden']
        verbose_name = 'Módulo'
        verbose_name_plural = 'Módulos'

    def __str__(self):
        return self.nombre


class PreguntaChecklist(models.Model):
    texto = models.CharField(max_length=500)
    orden = models.PositiveIntegerField(default=1)
    modulo = models.ForeignKey(
        Modulo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='preguntas',
        help_text='Módulo al que pertenece esta pregunta (opcional)',
    )
    activa = models.BooleanField(default=True)
    ayuda = models.TextField(blank=True, help_text='Texto orientador para responder')

    class Meta:
        ordering = ['orden']
        verbose_name = 'Pregunta del checklist'
        verbose_name_plural = 'Preguntas del checklist'

    def __str__(self):
        return f'{self.orden}. {self.texto[:60]}'


class FichaPedagogica(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ficha_pedagogica',
    )
    modulo_actual = models.ForeignKey(
        Modulo,
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

    def recalcular_progreso(self):
        preguntas = PreguntaChecklist.objects.filter(activa=True)
        total = preguntas.count()
        if total == 0:
            return 0
        completadas = RespuestaChecklist.objects.filter(
            ficha=self,
            pregunta__in=preguntas,
            completada=True,
        ).count()
        progreso = int((completadas / total) * 100)
        self.progreso_general = progreso
        self.save(update_fields=['progreso_general', 'updated_at'])
        return progreso


class RespuestaChecklist(models.Model):
    ficha = models.ForeignKey(
        FichaPedagogica,
        on_delete=models.CASCADE,
        related_name='respuestas_checklist',
    )
    pregunta = models.ForeignKey(
        PreguntaChecklist,
        on_delete=models.CASCADE,
        related_name='respuestas',
    )
    completada = models.BooleanField(default=False)
    nota = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('ficha', 'pregunta')
        verbose_name = 'Respuesta checklist'
        verbose_name_plural = 'Respuestas checklist'

    def __str__(self):
        return f'{self.ficha} — P{self.pregunta.orden}'


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
