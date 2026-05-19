from django.conf import settings
from django.db import models
from django.utils import timezone


class PlanSuscripcion(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    duracion_meses = models.PositiveIntegerField(default=12)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Plan de suscripción'
        verbose_name_plural = 'Planes de suscripción'

    def __str__(self):
        return f'{self.nombre} - ${self.precio}'


class Suscripcion(models.Model):
    class Estado(models.TextChoices):
        ACTIVA = 'activa', 'Activa'
        PENDIENTE = 'pendiente', 'Pendiente'
        VENCIDA = 'vencida', 'Vencida'
        CANCELADA = 'cancelada', 'Cancelada'

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='suscripciones',
    )
    plan = models.ForeignKey(PlanSuscripcion, on_delete=models.PROTECT, related_name='suscripciones')
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Suscripción'
        verbose_name_plural = 'Suscripciones'

    def __str__(self):
        return f'{self.usuario} - {self.plan} ({self.estado})'

    @property
    def esta_vigente(self):
        if self.estado != self.Estado.ACTIVA:
            return False
        if self.fecha_fin and self.fecha_fin < timezone.now().date():
            return False
        return True


class Pago(models.Model):
    class Metodo(models.TextChoices):
        TRANSFERENCIA = 'transferencia', 'Transferencia'
        EFECTIVO = 'efectivo', 'Efectivo'
        TARJETA = 'tarjeta', 'Tarjeta'
        OTRO = 'otro', 'Otro'

    class Estado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        COMPLETADO = 'completado', 'Completado'
        RECHAZADO = 'rechazado', 'Rechazado'

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pagos',
    )
    suscripcion = models.ForeignKey(
        Suscripcion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pagos',
    )
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo = models.CharField(max_length=20, choices=Metodo.choices, default=Metodo.TRANSFERENCIA)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    referencia = models.CharField(max_length=100, blank=True)
    notas = models.TextField(blank=True)
    fecha_pago = models.DateTimeField(null=True, blank=True)
    registrado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pagos_registrados',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Pago'
        verbose_name_plural = 'Pagos'

    def __str__(self):
        return f'Pago {self.id} - {self.usuario} - ${self.monto}'
