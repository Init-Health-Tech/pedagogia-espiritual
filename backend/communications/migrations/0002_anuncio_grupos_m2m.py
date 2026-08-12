from django.db import migrations, models
import django.db.models.deletion


def copiar_grupo_a_m2m(apps, schema_editor):
    Anuncio = apps.get_model('communications', 'Anuncio')
    for anuncio in Anuncio.objects.all():
        if anuncio.grupo_id:
            anuncio.grupos.add(anuncio.grupo_id)
            anuncio.es_global = False
            anuncio.save(update_fields=['es_global'])


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0002_coordinadores_m2m'),
        ('communications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='anuncio',
            name='grupo',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='anuncios_fk',
                to='groups.grupopastoreo',
            ),
        ),
        migrations.AddField(
            model_name='anuncio',
            name='grupos',
            field=models.ManyToManyField(
                blank=True,
                help_text='Grupos destinatarios cuando no es global.',
                related_name='anuncios',
                to='groups.grupopastoreo',
            ),
        ),
        migrations.RunPython(copiar_grupo_a_m2m, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='anuncio',
            name='grupo',
        ),
        migrations.AlterField(
            model_name='anuncio',
            name='es_global',
            field=models.BooleanField(
                default=True,
                help_text='Si es verdadero, el aviso llega a todos los grupos.',
            ),
        ),
    ]
