from datetime import date, datetime, time, timedelta
import re
import unicodedata

from django.conf import settings
from django.db import models

from content.models import Contenido


class GrupoPastoreo(models.Model):
    class DiaSemana(models.TextChoices):
        LUNES = 'lunes', 'Lunes'
        MARTES = 'martes', 'Martes'
        MIERCOLES = 'miercoles', 'Miércoles'
        JUEVES = 'jueves', 'Jueves'
        VIERNES = 'viernes', 'Viernes'
        SABADO = 'sabado', 'Sábado'
        DOMINGO = 'domingo', 'Domingo'

    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    coordinadores = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='grupos_coordinados',
        blank=True,
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
    dia_reunion = models.CharField(
        max_length=12,
        choices=DiaSemana.choices,
        blank=True,
        default='',
    )
    hora_reunion = models.TimeField(null=True, blank=True)
    horario_reunion = models.CharField(
        max_length=200,
        blank=True,
        help_text='Texto libre legado. Usar solo si no hay día/hora estructurados.',
    )
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Grupo de pastoreo'
        verbose_name_plural = 'Grupos de pastoreo'

    def __str__(self):
        return self.nombre

    @property
    def horario_requiere_revision(self):
        return bool(self.horario_reunion and not self.dia_reunion)

    def horario_display(self):
        partes = []
        if self.dia_reunion:
            partes.append(self.get_dia_reunion_display())
        if self.hora_reunion:
            partes.append(_format_hora_12(self.hora_reunion))
        if partes:
            return ' · '.join(partes)
        return self.horario_reunion or ''

    def proxima_fecha_reunion(self, desde=None):
        if not self.dia_reunion:
            return None
        desde = desde or date.today()
        target = _DIA_A_WEEKDAY[self.dia_reunion]
        delta = (target - desde.weekday()) % 7
        return desde + timedelta(days=delta)


_DIA_A_WEEKDAY = {
    'lunes': 0,
    'martes': 1,
    'miercoles': 2,
    'jueves': 3,
    'viernes': 4,
    'sabado': 5,
    'domingo': 6,
}


def _format_hora_12(value):
    if not value:
        return ''
    if isinstance(value, str):
        try:
            value = datetime.strptime(value[:5], '%H:%M').time()
        except ValueError:
            return value
    hora = value.hour % 12 or 12
    minuto = value.minute
    sufijo = 'AM' if value.hour < 12 else 'PM'
    return f'{hora}:{minuto:02d} {sufijo}'


def _strip_accents(text):
    return ''.join(
        c for c in unicodedata.normalize('NFD', text)
        if unicodedata.category(c) != 'Mn'
    )


def parse_horario_libre(texto):
    """Intenta extraer (dia, hora) de un texto libre. Devuelve (None, None) si falla."""
    if not texto or not str(texto).strip():
        return None, None

    raw = str(texto).strip()
    normalized = _strip_accents(raw).lower()

    dia = None
    dia_patterns = [
        ('lunes', 'lunes'),
        ('martes', 'martes'),
        ('miercoles', 'miercoles'),
        ('jueves', 'jueves'),
        ('viernes', 'viernes'),
        ('sabados', 'sabado'),
        ('sabado', 'sabado'),
        ('domingos', 'domingo'),
        ('domingo', 'domingo'),
    ]
    for needle, value in dia_patterns:
        if needle in normalized:
            dia = value
            break

    hora = None
    match = re.search(
        r'(\d{1,2})(?::(\d{2}))?\s*(a\.?\s*m\.?|p\.?\s*m\.?|am|pm)?',
        normalized,
        flags=re.IGNORECASE,
    )
    if match:
        h = int(match.group(1))
        m = int(match.group(2) or 0)
        ampm = (match.group(3) or '').replace('.', '').replace(' ', '').lower()
        if ampm in ('pm', 'p m') and h < 12:
            h += 12
        elif ampm in ('am', 'a m') and h == 12:
            h = 0
        if 0 <= h <= 23 and 0 <= m <= 59:
            hora = time(h, m)

    if dia and hora:
        return dia, hora
    return None, None


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
