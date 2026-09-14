"""Lógica de sugerencia de avance de etapa (completitud, no puntajes)."""

from .models import (
    Etapa,
    FichaEntradaSemanal,
    FichaPedagogica,
    FichaPraxisRegistro,
    PreguntaChecklist,
    RespuestaChecklist,
)


def semanas_de_etapa(etapa_id):
    if not etapa_id:
        return set()
    semanas = set()
    for p in PreguntaChecklist.objects.filter(activa=True, etapa_id=etapa_id):
        semanas.add(p.semana or p.orden)
    return semanas


def siguiente_etapa(etapa_actual):
    if not etapa_actual:
        return None
    return (
        Etapa.objects.filter(activo=True, orden__gt=etapa_actual.orden)
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
    if ficha.etapa_actual_id:
        semanas = semanas_de_etapa(ficha.etapa_actual_id)
        if semanas and siguiente_etapa(ficha.etapa_actual):
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
    if not ficha or not ficha.listo_para_avanzar or not ficha.etapa_actual_id:
        return False
    if ficha.avance_pospuesto_para_etapa_id == ficha.etapa_actual_id:
        return False
    return siguiente_etapa(ficha.etapa_actual) is not None


def payload_sugerencia_avance(ficha):
    if not ficha or not ficha.etapa_actual:
        return None
    siguiente = siguiente_etapa(ficha.etapa_actual)
    return {
        'listo_para_avanzar': ficha.listo_para_avanzar,
        'mostrar_banner_coordinador': sugerencia_avance_para_coordinador(ficha),
        'mostrar_aviso_miembro': bool(ficha.listo_para_avanzar and siguiente),
        'etapa_actual': {
            'id': ficha.etapa_actual_id,
            'nombre': ficha.etapa_actual.nombre,
        },
        'siguiente_etapa': (
            {'id': siguiente.id, 'nombre': siguiente.nombre}
            if siguiente else None
        ),
    }


def confirmar_avance(ficha):
    siguiente = siguiente_etapa(ficha.etapa_actual)
    if not siguiente:
        return ficha, False
    ficha.etapa_actual = siguiente
    ficha.listo_para_avanzar = False
    ficha.avance_pospuesto_para_etapa = None
    ficha.save(update_fields=[
        'etapa_actual', 'listo_para_avanzar', 'avance_pospuesto_para_etapa', 'updated_at',
    ])
    recalcular_listo_para_avanzar(ficha)
    return ficha, True


def posponer_avance(ficha):
    if not ficha.etapa_actual_id:
        return ficha
    ficha.avance_pospuesto_para_etapa = ficha.etapa_actual
    ficha.save(update_fields=['avance_pospuesto_para_etapa', 'updated_at'])
    return ficha
