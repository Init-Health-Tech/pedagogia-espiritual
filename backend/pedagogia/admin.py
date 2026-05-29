from django.contrib import admin

from .models import AvanceEspiritual, FichaPedagogica, Modulo, PreguntaChecklist, RespuestaChecklist


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


@admin.register(FichaPedagogica)
class FichaPedagogicaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'modulo_actual', 'progreso_general', 'updated_at')
    list_filter = ('modulo_actual',)
    inlines = [RespuestaChecklistInline, AvanceEspiritualInline]


@admin.register(RespuestaChecklist)
class RespuestaChecklistAdmin(admin.ModelAdmin):
    list_display = ('ficha', 'pregunta', 'completada', 'updated_at')
