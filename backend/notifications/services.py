"""Creación y cancelación de notificaciones internas (pagos / eventos)."""

from django.utils import timezone

from .models import Notificacion


def crear_si_no_existe(*, usuario, tipo, titulo, cuerpo, clave, referencia_tipo='', referencia_id=None):
    """Idempotente: no duplica la misma clave para el mismo usuario."""
    obj, created = Notificacion.objects.get_or_create(
        usuario=usuario,
        clave=clave,
        defaults={
            'tipo': tipo,
            'titulo': titulo,
            'cuerpo': cuerpo,
            'referencia_tipo': referencia_tipo,
            'referencia_id': referencia_id,
            'activa': True,
        },
    )
    return obj, created


def cancelar_recordatorios_pago(usuario):
    """Cancela recordatorios de pago pendientes (p. ej. tras registrar un nuevo pago)."""
    return Notificacion.objects.filter(
        usuario=usuario,
        tipo=Notificacion.Tipo.PAGO,
        activa=True,
    ).update(activa=False)


def mensaje_pago(dias):
    if dias == 15:
        return (
            'Tu membresía se renueva en 15 días',
            'Tu membresía se renueva en 15 días. Si tienes dudas sobre tu pago, contáctanos.',
        )
    if dias == 7:
        return (
            'Tu membresía se renueva en 7 días',
            'Tu membresía se renueva en 7 días. Si tienes dudas sobre tu pago, contáctanos.',
        )
    if dias == 1:
        return (
            'Tu membresía se renueva mañana',
            'Tu membresía se renueva mañana. Si tienes dudas sobre tu pago, contáctanos.',
        )
    return (
        f'Tu membresía se renueva en {dias} días',
        f'Tu membresía se renueva en {dias} días. Si tienes dudas sobre tu pago, contáctanos.',
    )


def mensaje_evento(evento, dias):
    fecha_txt = evento.fecha.strftime('%d/%m/%Y')
    hora_txt = evento.hora.strftime('%H:%M') if evento.hora else ''
    cuando = f'{fecha_txt}' + (f' · {hora_txt}' if hora_txt else '')
    ubicacion = evento.ubicacion or 'ubicación por confirmar'
    if dias == 0:
        titulo = f'Hoy: {evento.titulo}'
        cuerpo = (
            f'Tu evento «{evento.titulo}» es hoy — {cuando}, {ubicacion}.'
        )
    elif dias == 3:
        titulo = f'En 3 días: {evento.titulo}'
        cuerpo = (
            f'Tu evento «{evento.titulo}» es en 3 días — {cuando}, {ubicacion}.'
        )
    else:
        titulo = f'{evento.titulo}'
        cuerpo = (
            f'Tu evento «{evento.titulo}» es en {dias} días — {cuando}, {ubicacion}.'
        )
    return titulo, cuerpo


def generar_recordatorios_del_dia(hoy=None):
    """Genera recordatorios que corresponden a la fecha `hoy`. Devuelve conteos."""
    from events.models import EventoRSVP
    from payments.models import Suscripcion

    hoy = hoy or timezone.localdate()
    creados_pago = 0
    creados_evento = 0

    for sub in Suscripcion.objects.filter(
        estado=Suscripcion.Estado.ACTIVA,
        fecha_fin__isnull=False,
    ).select_related('usuario'):
        dias = (sub.fecha_fin - hoy).days
        if dias not in (15, 7, 1):
            continue
        titulo, cuerpo = mensaje_pago(dias)
        _, created = crear_si_no_existe(
            usuario=sub.usuario,
            tipo=Notificacion.Tipo.PAGO,
            titulo=titulo,
            cuerpo=cuerpo,
            clave=f'pago:{sub.id}:{dias}',
            referencia_tipo='suscripcion',
            referencia_id=sub.id,
        )
        if created:
            creados_pago += 1

    rsvps = (
        EventoRSVP.objects.filter(
            respuesta=EventoRSVP.Respuesta.VOY,
            evento__fecha__gte=hoy,
        )
        .select_related('evento', 'usuario')
    )
    for rsvp in rsvps:
        evento = rsvp.evento
        dias = (evento.fecha - hoy).days
        if dias not in (3, 0):
            continue
        titulo, cuerpo = mensaje_evento(evento, dias)
        _, created = crear_si_no_existe(
            usuario=rsvp.usuario,
            tipo=Notificacion.Tipo.EVENTO,
            titulo=titulo,
            cuerpo=cuerpo,
            clave=f'evento:{evento.id}:{dias}',
            referencia_tipo='evento',
            referencia_id=evento.id,
        )
        if created:
            creados_evento += 1

    return {
        'fecha': hoy.isoformat(),
        'pagos_creados': creados_pago,
        'eventos_creados': creados_evento,
    }
