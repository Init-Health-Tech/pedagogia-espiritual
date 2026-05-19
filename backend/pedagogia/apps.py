from django.apps import AppConfig


class PedagogiaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pedagogia'
    verbose_name = 'Ficha Pedagógica'

    def ready(self):
        import pedagogia.signals  # noqa: F401
