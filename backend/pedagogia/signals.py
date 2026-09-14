from datetime import date

from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import User
from .models import Etapa, FichaPedagogica, FichaPerfil


def asegurar_ficha(usuario):
    ficha, _ = FichaPedagogica.objects.get_or_create(usuario=usuario)
    changed = []
    # Solo arranca el conteo de semanas cuando el camino formal ya está activo.
    if (
        not ficha.fecha_inicio_camino
        and getattr(usuario, 'estado_camino', None) == User.EstadoCamino.FORMAL
    ):
        joined = getattr(usuario, 'date_joined', None)
        ficha.fecha_inicio_camino = joined.date() if joined and hasattr(joined, 'date') else date.today()
        changed.append('fecha_inicio_camino')
    if not ficha.etapa_actual_id:
        primero = Etapa.objects.filter(activo=True).order_by('orden').first()
        if primero:
            ficha.etapa_actual = primero
            changed.append('etapa_actual')
    if changed:
        ficha.save(update_fields=[*changed, 'updated_at'])
    FichaPerfil.objects.get_or_create(ficha=ficha)
    return ficha


@receiver(post_save, sender=User)
def create_ficha_pedagogica(sender, instance, created, **kwargs):
    if created:
        asegurar_ficha(instance)
