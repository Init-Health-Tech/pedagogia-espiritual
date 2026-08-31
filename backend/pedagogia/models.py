from datetime import date, timedelta

from django.conf import settings
from django.db import models


class Modulo(models.Model):
    """Módulo formativo (manual) del camino pedagógico."""
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    orden = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=7, default='#6B8CAE')
    manual_archivo = models.FileField(upload_to='manuales/', blank=True, null=True)
    manual_url = models.URLField(blank=True, help_text='Enlace complementario opcional')
    contenido_manual = models.JSONField(
        default=list,
        blank=True,
        help_text='Secciones del manual digital interactivo',
    )
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
    ayuda = models.TextField(blank=True, help_text='Orientación para la reflexión semanal')
    semana = models.PositiveIntegerField(default=1, help_text='Semana del diario')

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
    listo_para_avanzar = models.BooleanField(
        default=False,
        help_text='True cuando completó Diario y Ficha de todas las semanas de su etapa actual.',
    )
    avance_pospuesto_para_modulo = models.ForeignKey(
        Modulo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='fichas_avance_pospuesto',
        help_text='Si el coordinador eligió «Aún no», oculta el banner para esta etapa.',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Ficha pedagógica'
        verbose_name_plural = 'Fichas pedagógicas'

    def __str__(self):
        return f'Ficha de {self.usuario}'

    def fecha_inicio(self):
        if self.fecha_inicio_camino:
            return self.fecha_inicio_camino
        joined = getattr(self.usuario, 'date_joined', None)
        if joined:
            return joined.date() if hasattr(joined, 'date') else joined
        return date.today()

    def disponibilidad_semana(self, semana_num):
        semana = max(1, int(semana_num or 1))
        desbloquea = self.fecha_inicio() + timedelta(days=(semana - 1) * 7)
        hoy = date.today()
        disponible = hoy >= desbloquea
        dias_restantes = 0 if disponible else (desbloquea - hoy).days
        return {
            'disponible': disponible,
            'desbloquea_en': desbloquea.isoformat(),
            'dias_restantes': dias_restantes,
        }

    def recalcular_progreso(self):
        preguntas = PreguntaChecklist.objects.filter(activa=True)
        total = preguntas.count()
        if total == 0:
            return 0
        respuestas = RespuestaChecklist.objects.filter(ficha=self, pregunta__in=preguntas)
        completadas = sum(
            1 for r in respuestas
            if r.completada or (r.nota and len(r.nota.strip()) >= 15)
        )
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
    nota = models.TextField(blank=True, help_text='Respuesta abierta del diario semanal')
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


# ─── Ficha cuantitativa (autoevaluación acumulativa) ─────────────────────────

class FichaPerfil(models.Model):
    """Perfil demográfico y notas de seguimiento pedagógico (1:1 con FichaPedagogica)."""
    ficha = models.OneToOneField(
        FichaPedagogica,
        on_delete=models.CASCADE,
        related_name='perfil',
    )
    edad = models.PositiveSmallIntegerField(null=True, blank=True)
    estado_civil = models.CharField(max_length=80, blank=True)
    proceso_de_fe = models.TextField(blank=True)

    nota_horario_vida = models.TextField(blank=True, help_text='Horario de vida')
    nota_proyecto_vida = models.TextField(blank=True, help_text='Proyecto de vida')
    nota_retiro_diagnostico = models.TextField(blank=True, help_text='Retiro de diagnóstico')
    nota_graficas_alma = models.TextField(
        blank=True, help_text='Gráficas sobre el estado del alma',
    )
    nota_graficas_espiritu = models.TextField(
        blank=True, help_text='Gráficas sobre estado del espíritu',
    )
    nota_terapia_semanal = models.TextField(blank=True, help_text='Terapia semanal')
    nota_trabajo_tema_mensual = models.TextField(
        blank=True, help_text='Trabajo por tema mensual',
    )
    nota_apertura_gracia = models.TextField(
        blank=True, help_text='Concientización sobre la apertura de la gracia',
    )
    nota_discernimiento_conversion = models.TextField(
        blank=True, help_text='Discernimiento sobre proceso de conversión',
    )
    nota_discernimiento_santificacion = models.TextField(
        blank=True, help_text='Discernimiento sobre el proceso de santificación',
    )
    nota_formacion_integral = models.TextField(blank=True, help_text='Formación integral')
    nota_formacion_pneumatologica = models.TextField(
        blank=True, help_text='Formación pneumatológica',
    )
    nota_formacion_pedagogica_espiritual = models.TextField(
        blank=True, help_text='Formación pedagógica-espiritual',
    )
    nota_formacion_teologico_mistico = models.TextField(
        blank=True, help_text='Formación teológico místico',
    )
    perfil_completado = models.BooleanField(
        default=False,
        help_text='True cuando el miembro guardó al menos una vez la configuración inicial.',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Perfil de ficha'
        verbose_name_plural = 'Perfiles de ficha'

    def __str__(self):
        return f'Perfil de {self.ficha.usuario}'


class FichaAreaEvaluacion(models.Model):
    """Área cuantitativa configurable (catálogo para gráficas futuras)."""
    nombre = models.CharField(max_length=120)
    grupo_grafica = models.CharField(
        max_length=150,
        help_text='Agrupa áreas para graficar juntas (ej. Antropología Triádica Relacional)',
    )
    escala_min = models.PositiveSmallIntegerField(default=0)
    escala_max = models.PositiveSmallIntegerField(default=10)
    orden = models.PositiveIntegerField(default=0)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ['orden', 'id']
        verbose_name = 'Área de evaluación'
        verbose_name_plural = 'Áreas de evaluación'

    def __str__(self):
        return f'{self.nombre} ({self.grupo_grafica})'


class FichaEntradaSemanal(models.Model):
    """Puntaje semanal acumulativo por área (semana_global no reinicia por etapa)."""
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ficha_entradas_semanales',
    )
    semana_global = models.PositiveIntegerField(
        help_text='Número de semana acumulativo del camino formativo',
    )
    area = models.ForeignKey(
        FichaAreaEvaluacion,
        on_delete=models.PROTECT,
        related_name='entradas',
    )
    puntaje = models.DecimalField(max_digits=5, decimal_places=2)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-semana_global', 'area__orden']
        unique_together = ('usuario', 'semana_global', 'area')
        verbose_name = 'Entrada semanal de ficha'
        verbose_name_plural = 'Entradas semanales de ficha'

    def __str__(self):
        return f'{self.usuario} · S{self.semana_global} · {self.area.nombre}: {self.puntaje}'


class FichaPraxisItem(models.Model):
    """Ítem de praxis espiritual configurable (checklist semanal)."""
    nombre = models.CharField(max_length=200)
    orden = models.PositiveIntegerField(default=0)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['orden', 'id']
        verbose_name = 'Ítem de praxis'
        verbose_name_plural = 'Ítems de praxis'

    def __str__(self):
        return self.nombre


class FichaPraxisRegistro(models.Model):
    """Cumplimiento semanal acumulativo de un ítem de praxis."""
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ficha_praxis_registros',
    )
    semana_global = models.PositiveIntegerField(
        help_text='Número de semana acumulativo del camino formativo',
    )
    item = models.ForeignKey(
        FichaPraxisItem,
        on_delete=models.PROTECT,
        related_name='registros',
    )
    cumplido = models.BooleanField(default=False)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-semana_global', 'item__orden']
        unique_together = ('usuario', 'semana_global', 'item')
        verbose_name = 'Registro de praxis'
        verbose_name_plural = 'Registros de praxis'

    def __str__(self):
        estado = 'sí' if self.cumplido else 'no'
        return f'{self.usuario} · S{self.semana_global} · {self.item.nombre}: {estado}'
