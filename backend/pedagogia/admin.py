from django.contrib import admin

from .models import AvanceEspiritual, EtapaEspiritual, FichaPedagogica


@admin.register(EtapaEspiritual)
class EtapaEspiritualAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'orden', 'color')
    ordering = ('orden',)


class AvanceEspiritualInline(admin.TabularInline):
    model = AvanceEspiritual
    extra = 0


@admin.register(FichaPedagogica)
class FichaPedagogicaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'etapa_actual', 'progreso_general', 'updated_at')
    list_filter = ('etapa_actual',)
    inlines = [AvanceEspiritualInline]
