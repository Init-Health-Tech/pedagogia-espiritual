from django.contrib.auth import get_user_model
from django.db.models import Q

from groups.models import GrupoPastoreo
from groups.serializers import _persona_resumen

User = get_user_model()


def grupos_activos_del_usuario(user):
    return (
        GrupoPastoreo.objects.filter(activo=True)
        .filter(Q(miembros=user) | Q(coordinadores=user))
        .prefetch_related('miembros', 'coordinadores')
        .distinct()
        .order_by('nombre')
    )


def puede_enviar_mensaje(remitente, destinatario):
    if destinatario is None or not destinatario.is_active:
        return False
    if remitente.pk == destinatario.pk:
        return False
    if remitente.is_admin_user:
        return True
    return grupos_activos_del_usuario(remitente).filter(
        Q(miembros=destinatario) | Q(coordinadores=destinatario),
    ).exists()


def destinatarios_agrupados(user, request=None):
    if user.is_admin_user:
        personas = (
            User.objects.filter(is_active=True)
            .exclude(pk=user.pk)
            .order_by('first_name', 'last_name', 'username')
        )
        return {
            'secciones': [{
                'titulo': 'Todos los usuarios',
                'personas': [_persona_resumen(u, request) for u in personas],
            }],
        }

    grupos = list(grupos_activos_del_usuario(user))
    secciones = []
    ids_coordinadores = set()
    coordinadores = []
    for grupo in grupos:
        for persona in grupo.coordinadores.all():
            if persona.pk == user.pk or not persona.is_active or persona.pk in ids_coordinadores:
                continue
            ids_coordinadores.add(persona.pk)
            coordinadores.append(_persona_resumen(persona, request))
    if coordinadores:
        titulo = 'Tu coordinador' if len(coordinadores) == 1 else 'Tus coordinadores'
        secciones.append({'titulo': titulo, 'personas': coordinadores})

    for grupo in grupos:
        companeros = []
        for persona in grupo.miembros.all():
            if persona.pk == user.pk or not persona.is_active:
                continue
            if persona.pk in ids_coordinadores:
                continue
            companeros.append(_persona_resumen(persona, request))
        if companeros:
            secciones.append({'titulo': grupo.nombre, 'personas': companeros})

    return {'secciones': secciones}
