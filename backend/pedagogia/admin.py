from django.contrib import admin

from .models import (
    AvanceEspiritual,
    FichaAreaEvaluacion,
    FichaEntradaSemanal,
    FichaPedagogica,
    FichaPerfil,
    FichaPraxisItem,
    FichaPraxisRegistro,
    Modulo,
    PreguntaChecklist,
    RespuestaChecklist,
)


@admin.register(Modulo)
class ModuloAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'orden', 'activo', 'color')
    list_filter = ('activo',)
    ordering = ('orden',)


@admin.register(PreguntaChecklist)
class PreguntaChecklistAdmin(admin.ModelAdmin):
    list_display = ('orden', 'texto', 'modulo', 'activa')
    list_filter = ('activa', 'modulo')
    ordering = ('orden',)


class RespuestaChecklistInline(admin.TabularInline):
    model = RespuestaChecklist
    extra = 0


class AvanceEspiritualInline(admin.TabularInline):
    model = AvanceEspiritual
    extra = 0


class FichaPerfilInline(admin.StackedInline):
    model = FichaPerfil
    extra = 0
    max_num = 1


@admin.register(FichaPedagogica)
class FichaPedagogicaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'modulo_actual', 'progreso_general', 'updated_at')
    list_filter = ('modulo_actual',)
    inlines = [FichaPerfilInline, RespuestaChecklistInline, AvanceEspiritualInline]


@admin.register(RespuestaChecklist)
class RespuestaChecklistAdmin(admin.ModelAdmin):
    list_display = ('ficha', 'pregunta', 'completada', 'updated_at')


@admin.register(FichaPerfil)
class FichaPerfilAdmin(admin.ModelAdmin):
    list_display = ('ficha', 'edad', 'estado_civil', 'updated_at')
    search_fields = ('ficha__usuario__username', 'ficha__usuario__first_name', 'ficha__usuario__last_name')


@admin.register(FichaAreaEvaluacion)
class FichaAreaEvaluacionAdmin(admin.ModelAdmin):
    list_display = ('orden', 'nombre', 'grupo_grafica', 'escala_min', 'escala_max', 'activa')
    list_filter = ('activa', 'grupo_grafica')
    ordering = ('orden',)


@admin.register(FichaPraxisItem)
class FichaPraxisItemAdmin(admin.ModelAdmin):
    list_display = ('orden', 'nombre', 'activo')
    list_filter = ('activo',)
    ordering = ('orden',)


@admin.register(FichaEntradaSemanal)
class FichaEntradaSemanalAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'semana_global', 'area', 'puntaje', 'fecha_registro')
    list_filter = ('area',)
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name')


@admin.register(FichaPraxisRegistro)
class FichaPraxisRegistroAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'semana_global', 'item', 'cumplido', 'fecha_registro')
    list_filter = ('cumplido', 'item')
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name')
