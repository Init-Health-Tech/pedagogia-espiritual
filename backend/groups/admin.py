from django.contrib import admin

from .models import EsquemaGrupo, GrupoPastoreo


class EsquemaGrupoInline(admin.TabularInline):
    model = EsquemaGrupo
    extra = 0


@admin.register(GrupoPastoreo)
class GrupoPastoreoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'coordinador', 'activo', 'created_at')
    list_filter = ('activo',)
    filter_horizontal = ('miembros', 'contenidos')
    inlines = [EsquemaGrupoInline]


@admin.register(EsquemaGrupo)
class EsquemaGrupoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'grupo', 'fecha_sesion', 'orden')
