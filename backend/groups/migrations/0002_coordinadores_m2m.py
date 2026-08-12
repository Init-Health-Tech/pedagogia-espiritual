from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def copiar_coordinador_a_m2m(apps, schema_editor):
    GrupoPastoreo = apps.get_model('groups', 'GrupoPastoreo')
    for grupo in GrupoPastoreo.objects.all():
        if grupo.coordinador_id:
            grupo.coordinadores.add(grupo.coordinador_id)


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('groups', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grupopastoreo',
            name='coordinador',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='grupos_coordinados_fk',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name='grupopastoreo',
            name='coordinadores',
            field=models.ManyToManyField(
                blank=True,
                related_name='grupos_coordinados',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.RunPython(copiar_coordinador_a_m2m, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='grupopastoreo',
            name='coordinador',
        ),
    ]
