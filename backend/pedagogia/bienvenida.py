"""Lógica del periodo de bienvenida y sugerencia de inicio del camino formal."""

from datetime import date

from django.utils import timezone

from accounts.models import User
from .models import Modulo, TareaBienvenida, TareaBienvenidaRegistro


def tareas_activas():
    return TareaBienvenida.objects.filter(activa=True)


def conteo_progreso(usuario):
    activas = list(tareas_activas())
    total = len(activas)
    if total == 0:
        return {'completadas': 0, 'total': 0, 'completa': False}
    ids = [t.id for t in activas]
    hechas = TareaBienvenidaRegistro.objects.filter(
        usuario=usuario,
        tarea_id__in=ids,
        completada=True,
    ).count()
    return {
        'completadas': hechas,
        'total': total,
        'completa': hechas >= total,
    }


def bienvenida_completa(usuario):
    return conteo_progreso(usuario)['completa']


def payload_sugerencia_inicio_formal(usuario):
    """Payload análogo a payload_sugerencia_avance (Fase D)."""
    if not usuario or getattr(usuario, 'role', None) != User.Role.MEMBER:
        return None
    if usuario.estado_camino != User.EstadoCamino.BIENVENIDA:
        return None

    completa = bienvenida_completa(usuario)
    primer_modulo = Modulo.objects.filter(activo=True).order_by('orden').first()
    return {
        'bienvenida_completa': completa,
        'mostrar_aviso_miembro': completa,
        'mostrar_banner_coordinador': bool(
            completa and not usuario.bienvenida_inicio_pospuesto and primer_modulo
        ),
        'etapa_inicio': (
            {'id': primer_modulo.id, 'nombre': primer_modulo.nombre}
            if primer_modulo else None
        ),
        **conteo_progreso(usuario),
    }


def sugerencia_inicio_para_coordinador(usuario):
    payload = payload_sugerencia_inicio_formal(usuario)
    return bool(payload and payload.get('mostrar_banner_coordinador'))


def marcar_tarea(usuario, tarea_id, completada):
    tarea = TareaBienvenida.objects.filter(pk=tarea_id, activa=True).first()
    if not tarea:
        return None, False
    defaults = {
        'completada': bool(completada),
        'fecha_completado': timezone.now() if completada else None,
    }
    registro, _ = TareaBienvenidaRegistro.objects.update_or_create(
        usuario=usuario,
        tarea=tarea,
        defaults=defaults,
    )
    if usuario.bienvenida_inicio_pospuesto and not bienvenida_completa(usuario):
        usuario.bienvenida_inicio_pospuesto = False
        usuario.save(update_fields=['bienvenida_inicio_pospuesto', 'updated_at'])
    return registro, True


def confirmar_inicio_formal(usuario):
    """Pasa a camino formal y reinicia el conteo de semanas en Semana 1."""
    if usuario.estado_camino == User.EstadoCamino.FORMAL:
        return usuario, False

    usuario.estado_camino = User.EstadoCamino.FORMAL
    usuario.bienvenida_inicio_pospuesto = False
    usuario.save(update_fields=['estado_camino', 'bienvenida_inicio_pospuesto', 'updated_at'])

    from .signals import asegurar_ficha
    ficha = asegurar_ficha(usuario)
    ficha.fecha_inicio_camino = date.today()
    if not ficha.modulo_actual_id:
        primero = Modulo.objects.filter(activo=True).order_by('orden').first()
        if primero:
            ficha.modulo_actual = primero
    ficha.save(update_fields=['fecha_inicio_camino', 'modulo_actual', 'updated_at'])
    return usuario, True


def posponer_inicio_formal(usuario):
    if usuario.estado_camino != User.EstadoCamino.BIENVENIDA:
        return usuario
    usuario.bienvenida_inicio_pospuesto = True
    usuario.save(update_fields=['bienvenida_inicio_pospuesto', 'updated_at'])
    return usuario


def lista_tareas_miembro(usuario):
    activas = list(tareas_activas())
    registros = {
        r.tarea_id: r
        for r in TareaBienvenidaRegistro.objects.filter(
            usuario=usuario,
            tarea_id__in=[t.id for t in activas],
        )
    }
    items = []
    for t in activas:
        r = registros.get(t.id)
        items.append({
            'id': t.id,
            'nombre': t.nombre,
            'descripcion': t.descripcion,
            'orden': t.orden,
            'completada': bool(r and r.completada),
            'fecha_completado': (
                r.fecha_completado.isoformat() if r and r.fecha_completado else None
            ),
        })
    progreso = conteo_progreso(usuario)
    return {
        'tareas': items,
        'progreso': progreso,
        'sugerencia_inicio_formal': payload_sugerencia_inicio_formal(usuario),
        'semanas_en_bienvenida': semanas_desde_registro(usuario),
    }


def semanas_desde_registro(usuario):
    """Semanas informativas desde el alta (referencia ~12 semanas)."""
    joined = getattr(usuario, 'date_joined', None)
    if not joined:
        return 0
    inicio = joined.date() if hasattr(joined, 'date') else joined
    dias = (date.today() - inicio).days
    return max(0, dias // 7)
