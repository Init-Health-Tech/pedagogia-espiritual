from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import User
from .models import FichaPedagogica


@receiver(post_save, sender=User)
def create_ficha_pedagogica(sender, instance, created, **kwargs):
    if created:
        FichaPedagogica.objects.get_or_create(usuario=instance)
