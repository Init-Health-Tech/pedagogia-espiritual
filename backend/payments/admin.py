from django.contrib import admin

from .models import Pago, PlanSuscripcion, Suscripcion


@admin.register(PlanSuscripcion)
class PlanSuscripcionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'duracion_meses', 'activo')


@admin.register(Suscripcion)
class SuscripcionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'plan', 'estado', 'fecha_inicio', 'fecha_fin')
    list_filter = ('estado', 'plan')


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'monto', 'metodo', 'estado', 'fecha_pago', 'created_at')
    list_filter = ('estado', 'metodo')
