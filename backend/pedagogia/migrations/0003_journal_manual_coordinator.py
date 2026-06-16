# Generated manually for journal + interactive manuals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pedagogia', '0002_modulos_checklist'),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='modulo',
            name='contenido_manual',
            field=models.JSONField(blank=True, default=list, help_text='Secciones del manual digital interactivo'),
        ),
        migrations.AddField(
            model_name='preguntachecklist',
            name='semana',
            field=models.PositiveIntegerField(default=1, help_text='Semana del diario de reflexión'),
        ),
        migrations.AlterField(
            model_name='respuestachecklist',
            name='nota',
            field=models.TextField(blank=True, help_text='Respuesta abierta del diario semanal'),
        ),
    ]
