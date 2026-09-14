from django.core.management.base import BaseCommand

from notifications.services import generar_recordatorios_del_dia


class Command(BaseCommand):
    help = (
        'Genera recordatorios internos del día (pagos 15/7/1 días y eventos 3/0 días). '
        'Programar diariamente vía cron, p. ej.: 0 7 * * * cd /path/backend && '
        '. venv/bin/activate && python manage.py enviar_recordatorios'
    )

    def handle(self, *args, **options):
        result = generar_recordatorios_del_dia()
        self.stdout.write(self.style.SUCCESS(
            f"[{result['fecha']}] Pagos: {result['pagos_creados']} · "
            f"Eventos: {result['eventos_creados']}"
        ))
