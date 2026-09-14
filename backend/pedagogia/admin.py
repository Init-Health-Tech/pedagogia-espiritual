from django.contrib import admin

from .models import (
    AvanceEspiritual,
    Etapa,
    FichaAreaEvaluacion,
    FichaEntradaSemanal,
    FichaPedagogica,
    FichaPerfil,
    FichaPraxisItem,
    FichaPraxisRegistro,
    Manual,
    Modulo,
    PreguntaChecklist,
    RespuestaChecklist,
    TareaBienvenida,
    TareaBienvenidaRegistro,
)


@admin.register(Etapa)
class EtapaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'orden', 'activo', 'color')
    list_filter = ('activo',)
    ordering = ('orden',)


@admin.register(Modulo)
class ModuloAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'etapa', 'orden', 'activo')
    list_filter = ('activo', 'etapa')
    ordering = ('etapa__orden', 'orden')


@admin.register(Manual)
class ManualAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'modulo', 'orden', 'activo')
    list_filter = ('activo', 'modulo__etapa')
    ordering = ('modulo__orden', 'orden')


@admin.register(PreguntaChecklist)
class PreguntaChecklistAdmin(admin.ModelAdmin):
    list_display = ('orden', 'texto', 'etapa', 'activa')
    list_filter = ('activa', 'etapa')
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
    list_display = ('usuario', 'etapa_actual', 'progreso_general', 'updated_at')
    list_filter = ('etapa_actual',)
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
    list_display = ('orden', 'nombre', 'grupo_grafica', 'icono', 'escala_min', 'escala_max', 'activa')
    list_filter = ('activa', 'grupo_grafica')
    ordering = ('orden',)


@admin.register(FichaPraxisItem)
class FichaPraxisItemAdmin(admin.ModelAdmin):
    list_display = ('orden', 'nombre', 'icono', 'activo')
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


@admin.register(TareaBienvenida)
class TareaBienvenidaAdmin(admin.ModelAdmin):
    list_display = ('orden', 'nombre', 'activa')
    list_filter = ('activa',)
    ordering = ('orden',)


@admin.register(TareaBienvenidaRegistro)
class TareaBienvenidaRegistroAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'tarea', 'completada', 'fecha_completado')
    list_filter = ('completada',)
    search_fields = ('usuario__username', 'tarea__nombre')
