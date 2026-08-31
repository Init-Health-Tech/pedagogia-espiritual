"""Lógica de sugerencia de avance de etapa (completitud, no puntajes)."""

from .models import (
    FichaEntradaSemanal,
    FichaPedagogica,
    FichaPraxisRegistro,
    Modulo,
    PreguntaChecklist,
    RespuestaChecklist,
)


def semanas_de_etapa(modulo_id):
    if not modulo_id:
        return set()
    semanas = set()
    for p in PreguntaChecklist.objects.filter(activa=True, modulo_id=modulo_id):
        semanas.add(p.semana or p.orden)
    return semanas


def siguiente_modulo(modulo_actual):
    if not modulo_actual:
        return None
    return (
        Modulo.objects.filter(activo=True, orden__gt=modulo_actual.orden)
        .order_by('orden')
        .first()
    )


def diario_completo(ficha, semana):
    preguntas = [
        p for p in PreguntaChecklist.objects.filter(activa=True)
        if (p.semana or p.orden) == semana
    ]
    if not preguntas:
        return False
    respuestas = {
        r.pregunta_id: r
        for r in RespuestaChecklist.objects.filter(ficha=ficha, pregunta__in=preguntas)
    }
    for p in preguntas:
        r = respuestas.get(p.id)
        if not r:
            return False
        if r.completada or (r.nota and r.nota.strip()):
            continue
        return False
    return True


def ficha_completa(usuario, semana):
    hay_praxis = FichaPraxisRegistro.objects.filter(
        usuario=usuario, semana_global=semana,
    ).exists()
    hay_puntajes = FichaEntradaSemanal.objects.filter(
        usuario=usuario, semana_global=semana,
    ).exists()
    return hay_praxis or hay_puntajes


def recalcular_listo_para_avanzar(ficha):
    """Marca listo_para_avanzar según completitud de Diario+Ficha en semanas de la etapa."""
    if not isinstance(ficha, FichaPedagogica):
        return False

    listo = False
    if ficha.modulo_actual_id:
        semanas = semanas_de_etapa(ficha.modulo_actual_id)
        if semanas and siguiente_modulo(ficha.modulo_actual):
            listo = True
            for s in semanas:
                if not diario_completo(ficha, s) or not ficha_completa(ficha.usuario, s):
                    listo = False
                    break

    if ficha.listo_para_avanzar != listo:
        ficha.listo_para_avanzar = listo
        ficha.save(update_fields=['listo_para_avanzar', 'updated_at'])
    return listo


def sugerencia_avance_para_coordinador(ficha):
    """True si el banner del coordinador debe mostrarse."""
    if not ficha or not ficha.listo_para_avanzar or not ficha.modulo_actual_id:
        return False
    if ficha.avance_pospuesto_para_modulo_id == ficha.modulo_actual_id:
        return False
    return siguiente_modulo(ficha.modulo_actual) is not None


def payload_sugerencia_avance(ficha):
    if not ficha or not ficha.modulo_actual:
        return None
    siguiente = siguiente_modulo(ficha.modulo_actual)
    return {
        'listo_para_avanzar': ficha.listo_para_avanzar,
        'mostrar_banner_coordinador': sugerencia_avance_para_coordinador(ficha),
        'mostrar_aviso_miembro': bool(ficha.listo_para_avanzar and siguiente),
        'etapa_actual': {
            'id': ficha.modulo_actual_id,
            'nombre': ficha.modulo_actual.nombre,
        },
        'siguiente_etapa': (
            {'id': siguiente.id, 'nombre': siguiente.nombre}
            if siguiente else None
        ),
    }


def confirmar_avance(ficha):
    siguiente = siguiente_modulo(ficha.modulo_actual)
    if not siguiente:
        return ficha, False
    ficha.modulo_actual = siguiente
    ficha.listo_para_avanzar = False
    ficha.avance_pospuesto_para_modulo = None
    ficha.save(update_fields=[
        'modulo_actual', 'listo_para_avanzar', 'avance_pospuesto_para_modulo', 'updated_at',
    ])
    recalcular_listo_para_avanzar(ficha)
    return ficha, True


def posponer_avance(ficha):
    if not ficha.modulo_actual_id:
        return ficha
    ficha.avance_pospuesto_para_modulo = ficha.modulo_actual
    ficha.save(update_fields=['avance_pospuesto_para_modulo', 'updated_at'])
    return ficha
